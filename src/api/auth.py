"""
Authentication Blueprint - Handles Google OAuth2 and Traditional Login with JWT
"""
import os
from datetime import datetime
from flask import Blueprint, request, jsonify, redirect, url_for, current_app
from flask_jwt_extended import (
    jwt_required, create_access_token,
    get_jwt_identity, create_refresh_token, get_jwt
)
from authlib.integrations.flask_client import OAuth
from api.models import db, User

auth = Blueprint('auth', __name__)

# OAuth setup
oauth = OAuth()

# Token blacklist for logout functionality
blacklisted_tokens = set()


def init_oauth(app):
    """Initialize OAuth with app context"""
    oauth.init_app(app)

    # Verify environment variables
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET')

    if not client_id or not client_secret:
        print("WARNING: Google OAuth credentials not found in environment variables")
        return None

    print(f"Initializing Google OAuth with Client ID: {client_id[:20]}...")

    google = oauth.register(
        name='google',
        client_id=client_id,
        client_secret=client_secret,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )

    print("Google OAuth initialized successfully")
    return google


# ===============================
# TRADITIONAL AUTHENTICATION
# ===============================

@auth.route('/register', methods=['POST'])
def register():
    """Register a new user with email and password"""
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400

        email = data['email'].lower().strip()
        password = data['password']

        # Validate email format
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400

        # Validate password strength
        if len(password) < 8:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 8 characters'
            }), 400

        # Check if user exists
        if User.query.filter_by(email=email).first():
            return jsonify({
                'success': False,
                'message': 'Email already registered'
            }), 409

        # Create user
        new_user = User(email=email, password=password)
        new_user.level = 1
        new_user.xp = 0
        new_user.coins = 100
        new_user.is_active = True

        db.session.add(new_user)
        db.session.commit()

        # Create tokens
        access_token = create_access_token(identity=new_user.id)
        refresh_token = create_refresh_token(identity=new_user.id)

        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'name': new_user.email.split('@')[0],
                'level': new_user.level,
                'xp': new_user.xp,
                'coins': new_user.coins
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Registration error: {str(e)}'
        }), 500


@auth.route('/login', methods=['POST'])
def login():
    """Login with email and password"""
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400

        email = data['email'].lower().strip()
        password = data['password']

        # Find user
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401

        if not user.is_active:
            return jsonify({
                'success': False,
                'message': 'Account is disabled'
            }), 401

        # Update last activity
        user.last_activity = datetime.utcnow()
        db.session.commit()

        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.email.split('@')[0],
                'level': user.level,
                'xp': user.xp,
                'coins': user.coins
            }
        }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Login error: {str(e)}'
        }), 500


# ===============================
# GOOGLE OAUTH
# ===============================

@auth.route('/google-login')
def google_login():
    """Initiate Google OAuth login"""
    try:
        if not hasattr(oauth, 'google'):
            return jsonify({
                'success': False,
                'message': 'Google OAuth not configured.'
            }), 500
        # Generate redirect URI
        redirect_uri = url_for('auth.google_callback', _external=True)

         # Use Codespaces URL if available
        codespace_name = os.getenv('CODESPACE_NAME', '')
        if codespace_name:
            redirect_uri = f"https://{codespace_name}-3001.app.github.dev/api/auth/google-callback"
        else:
            redirect_uri = url_for('auth.google_callback', _external=True)

        # Debug: Print the redirect URI
        print(f"Google OAuth redirect URI: {redirect_uri}")
        print(f"Make sure this EXACT URI is in your Google Cloud Console authorized redirect URIs")

        return oauth.google.authorize_redirect(redirect_uri)

    except AttributeError as e:
        print(f"OAuth not initialized: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Google OAuth not initialized'
        }), 500
    except Exception as e:
        print(f"OAuth error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'OAuth initialization failed: {str(e)}'
        }), 500


@auth.route('/google-callback')
def google_callback():
    """Handle Google OAuth callback"""
    try:
        print("Google callback received")

        # Check if OAuth is configured
        if not hasattr(oauth, 'google'):
            raise Exception('Google OAuth not configured')

        # Get token from Google
        token = oauth.google.authorize_access_token()
        print(f"Token received: {bool(token)}")

        # Get user info
        user_info = token.get('userinfo')
        print(f"User info: {user_info}")

        if not user_info or not user_info.get('email'):
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
            return redirect(f"{frontend_url}/login?error=no_email")

        email = user_info.get('email')
        name = user_info.get('name', email.split('@')[0])

        print(f"Processing login for: {email}")

        # Check if user exists
        user = User.query.filter_by(email=email).first()

        if not user:
            # Create new user
            print(f"Creating new user: {email}")
            user = User(email=email, password=os.urandom(24).hex())
            user.level = 1
            user.xp = 0
            user.coins = 100
            user.is_active = True
            user.avatar_seed = name

            db.session.add(user)
            db.session.commit()
            print(f"User created successfully")

        # Update last activity
        user.last_activity = datetime.utcnow()
        db.session.commit()

        # Create JWT tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        print(f"Tokens created, redirecting to frontend")

        # Redirect to frontend with tokens
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        return redirect(f"{frontend_url}/auth/callback?access_token={access_token}&refresh_token={refresh_token}")

    except Exception as e:
        print(f"Google callback error: {str(e)}")
        import traceback
        traceback.print_exc()

        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        return redirect(f"{frontend_url}/login?error={str(e)}")


# ===============================
# TOKEN MANAGEMENT
# ===============================

@auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or not user.is_active:
            return jsonify({
                'success': False,
                'message': 'User not found or inactive'
            }), 404

        new_token = create_access_token(identity=user_id)

        return jsonify({
            'success': True,
            'access_token': new_token
        }), 200

    except Exception as e:
        print(f"Token refresh error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Token refresh error: {str(e)}'
        }), 500


@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user and blacklist token"""
    try:
        jti = get_jwt()['jti']
        blacklisted_tokens.add(jti)

        return jsonify({
            'success': True,
            'message': 'Logged out successfully'
        }), 200
    except Exception as e:
        print(f"Logout error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Logout error: {str(e)}'
        }), 500


@auth.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify if token is valid"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or not user.is_active:
            return jsonify({
                'success': False,
                'message': 'Invalid token or inactive user'
            }), 401

        return jsonify({
            'success': True,
            'valid': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.email.split('@')[0],
                'level': user.level,
                'xp': user.xp,
                'coins': user.coins
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'valid': False,
            'message': str(e)
        }), 401


# ===============================
# PROFILE MANAGEMENT
# ===============================

@auth.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        return jsonify({
            'success': True,
            'profile': user.serialize()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500


@auth.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400

        # Update avatar fields
        avatar_fields = ['avatar_style', 'avatar_seed', 'avatar_background_color',
                         'avatar_theme', 'avatar_mood']

        for field in avatar_fields:
            if field in data:
                setattr(user, field, data[field])

        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'profile': user.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500


@auth.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return jsonify({
                'success': False,
                'message': 'Current and new password required'
            }), 400

        if not user.check_password(current_password):
            return jsonify({
                'success': False,
                'message': 'Current password is incorrect'
            }), 401

        if len(new_password) < 8:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 8 characters'
            }), 400

        user.set_password(new_password)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Password changed successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500
