"""
Authentication Blueprint - Updated for Flask 2.3.3 and Flask-JWT-Extended 4.6.0
Handles Google OAuth2 and Traditional Login with JWT
"""
import os
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, redirect, url_for, session
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, create_refresh_token, get_jwt
)
from authlib.integrations.flask_client import OAuth
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from api.models import db, User
from api.utils import APIException

auth = Blueprint('auth', __name__)

# JWT and OAuth setup
jwt = JWTManager()
oauth = OAuth()

# Token blacklist for logout functionality
blacklisted_tokens = set()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    """Check if JWT token is in blacklist"""
    return jwt_payload['jti'] in blacklisted_tokens

# OAuth initialization


def init_oauth(app):
    """Initialize OAuth with app context"""
    oauth.init_app(app)

    google = oauth.register(
        name='google',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )
    return google

# Traditional Registration and Login


@auth.route('/register', methods=['POST'])
def register():
    """Register a new user with email and password"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get('email')
        password = data.get('password')
        username = data.get('username')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Basic email validation
        if '@' not in email or '.' not in email:
            return jsonify({"error": "Invalid email format"}), 400

        # Password strength check
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        # Check if user exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409

        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(
            email=email,
            password=hashed_password,
            is_active=True,
            level=1,
            avatar_style='pixel-art',
            avatar_seed=username or email.split('@')[0],
            avatar_background_color='blue',
            avatar_theme='superhero',
            avatar_mood='happy'
        )

        db.session.add(new_user)
        db.session.commit()

        # Create tokens
        access_token = create_access_token(identity=new_user.id)
        refresh_token = create_refresh_token(identity=new_user.id)

        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": new_user.serialize()
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth.route('/login', methods=['POST'])
def login():
    """Login with email and password"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Find user
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Check password
        if not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Check if user is active
        if not user.is_active:
            return jsonify({"error": "Account is disabled"}), 401

        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.serialize()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Google OAuth Routes


@auth.route('/google-login')
def google_login():
    """Initiate Google OAuth login"""
    try:
        google = oauth.google
        redirect_uri = url_for('auth.google_callback', _external=True)
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        return jsonify({"error": "OAuth initialization failed"}), 500


@auth.route('/google-callback')
def google_callback():
    """Handle Google OAuth callback"""
    try:
        google = oauth.google
        token = google.authorize_access_token()

        # Get user info from Google
        resp = google.parse_id_token(token)
        user_info = {
            'email': resp.get('email'),
            'name': resp.get('name'),
            'google_id': resp.get('sub'),
            'picture': resp.get('picture')
        }

        if not user_info['email']:
            return redirect("/?auth=error&message=Could not get email from Google")

        # Check if user exists
        user = User.query.filter_by(email=user_info['email']).first()

        if not user:
            # Create new user from Google data
            user = User(
                email=user_info['email'],
                password=generate_password_hash('google_oauth_user'),
                is_active=True,
                level=1,
                avatar_style='pixel-art',
                avatar_seed=user_info['name'] or user_info['email'].split(
                    '@')[0],
                avatar_background_color='blue',
                avatar_theme='superhero',
                avatar_mood='happy'
            )
            db.session.add(user)
            db.session.commit()

        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        # Redirect to frontend with success
        return redirect(f"/?auth=success&token={access_token}")

    except Exception as e:
        return redirect(f"/?auth=error&message={str(e)}")

# Token Management


@auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user or not user.is_active:
            return jsonify({"error": "User not found or inactive"}), 404

        new_token = create_access_token(identity=current_user_id)
        return jsonify({
            "access_token": new_token,
            "user": user.serialize()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user and blacklist token"""
    try:
        jti = get_jwt()['jti']
        blacklisted_tokens.add(jti)
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Protected Routes


@auth.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user.serialize()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Update allowed fields
        if 'avatar_style' in data:
            user.avatar_style = data['avatar_style']
        if 'avatar_background_color' in data:
            user.avatar_background_color = data['avatar_background_color']
        if 'avatar_theme' in data:
            user.avatar_theme = data['avatar_theme']
        if 'avatar_mood' in data:
            user.avatar_mood = data['avatar_mood']
        if 'avatar_seed' in data:
            user.avatar_seed = data['avatar_seed']

        db.session.commit()

        return jsonify({
            "message": "Profile updated successfully",
            "user": user.serialize()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return jsonify({"error": "Current password and new password are required"}), 400

        # Verify current password
        if not check_password_hash(user.password, current_password):
            return jsonify({"error": "Current password is incorrect"}), 401

        # Validate new password
        if len(new_password) < 6:
            return jsonify({"error": "New password must be at least 6 characters"}), 400

        # Update password
        user.password = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({"message": "Password changed successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@auth.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user's information"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        if not user.is_active:
            return jsonify({"error": "Account is disabled"}), 401

        return jsonify({
            "user": user.serialize()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


=
@auth.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify if token is valid and return user data"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user or not user.is_active:
            return jsonify({"error": "Invalid token or inactive user"}), 401

        return jsonify({
            "valid": True,
            "user": user.serialize()
        }), 200

    except Exception as e:
        return jsonify({"valid": False, "error": str(e)}), 401
