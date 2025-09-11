"""
PixelPlay Fitness App - Google OAuth & JWT Routes
Complete authentication system with Google OAuth and JWT tokens
"""

from flask import Flask, request, jsonify, redirect, url_for, session, make_response
from flask_login import login_user, logout_user, login_required, current_user
from authlib.integrations.flask_client import OAuth
import jwt
import secrets
import logging
from datetime import datetime, timedelta
from functools import wraps
from models import db, User
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_oauth_routes(app):
    """Initialize OAuth and JWT routes for the PixelPlay app"""

    # OAuth setup
    oauth = OAuth(app)
    google = oauth.register(
        name='google',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-jwt-key')
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = 24

    # ===========================================
    # HELPER FUNCTIONS
    # ===========================================

    def generate_jwt_token(user):
        """Generate a JWT token for the user"""
        try:
            # Create user's personal JWT secret if they don't have one
            if not user.jwt_secret:
                user.jwt_secret = secrets.token_urlsafe(32)
                db.session.commit()
                logger.info(f"Generated new JWT secret for user {user.email}")

            # Create JWT payload
            payload = {
                'user_id': user.id,
                'email': user.email,
                'name': user.name,
                'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
                'iat': datetime.utcnow(),
                'iss': 'pixelplay-auth',  # Issuer
                'aud': 'pixelplay-app'    # Audience
            }

            # Sign with combined secret (app secret + user secret)
            signing_key = f"{JWT_SECRET_KEY}_{user.jwt_secret}"
            token = jwt.encode(payload, signing_key, algorithm=JWT_ALGORITHM)

            logger.info(f"Generated JWT token for user {user.email}")
            return token

        except Exception as e:
            logger.error(f"Error generating JWT token: {str(e)}")
            return None

    def verify_jwt_token(token):
        """Verify and decode a JWT token"""
        try:
            # First decode without verification to get user_id
            unverified = jwt.decode(token, options={"verify_signature": False})
            user_id = unverified.get('user_id')

            if not user_id:
                logger.warning("JWT token missing user_id")
                return None

            # Get user to obtain their secret
            user = User.query.get(user_id)
            if not user or not user.jwt_secret:
                logger.warning(
                    f"User {user_id} not found or missing JWT secret")
                return None

            # Verify token with combined secret
            signing_key = f"{JWT_SECRET_KEY}_{user.jwt_secret}"
            payload = jwt.decode(
                token,
                signing_key,
                algorithms=[JWT_ALGORITHM],
                audience='pixelplay-app',
                issuer='pixelplay-auth'
            )

            logger.info(f"JWT token verified for user {user.email}")
            return payload

        except jwt.ExpiredSignatureError:
            logger.warning("JWT token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error verifying JWT token: {str(e)}")
            return None

    def get_jwt_user():
        """Get current user from JWT token"""
        # Try to get token from Authorization header
        auth_header = request.headers.get('Authorization')
        token = None

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        else:
            # Try to get token from request body
            data = request.get_json() or {}
            token = data.get('token')

        if not token:
            # Try to get token from cookie
            token = request.cookies.get('jwt_token')

        if not token:
            return None

        payload = verify_jwt_token(token)
        if not payload:
            return None

        user = User.query.get(payload['user_id'])
        return user

    # Decorators
    def jwt_required(f):
        """Decorator to require JWT authentication"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = get_jwt_user()
            if not user:
                return jsonify({'error': 'Valid JWT token required'}), 401
            return f(*args, **kwargs)
        return decorated_function

    def require_auth(f):
        """Decorator to require either session or JWT authentication"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check session authentication first
            if current_user.is_authenticated:
                return f(*args, **kwargs)

            # Check JWT authentication
            user = get_jwt_user()
            if user:
                return f(*args, **kwargs)

            return jsonify({'error': 'Authentication required'}), 401
        return decorated_function

    # ===========================================
    # GOOGLE OAUTH ROUTES
    # ===========================================

    @app.route('/auth/login')
    def login():
        """Initiate Google OAuth login"""
        redirect_uri = url_for('auth_callback', _external=True)
        return google.authorize_redirect(redirect_uri)

    @app.route('/auth/callback')
    def auth_callback():
        """Handle Google OAuth callback"""
        try:
            token = google.authorize_access_token()
            user_info = token['userinfo']

            # Check if user exists
            user = User.query.filter_by(google_id=user_info['sub']).first()

            if not user:
                # Create new user
                user = User(
                    google_id=user_info['sub'],
                    email=user_info['email'],
                    name=user_info['name'],
                    picture=user_info.get('picture', ''),
                    created_at=datetime.utcnow()
                )
                db.session.add(user)
                db.session.commit()
                logger.info(f"Created new user: {user.email}")
            else:
                # Update existing user info
                user.name = user_info['name']
                user.picture = user_info.get('picture', '')
                user.last_login = datetime.utcnow()
                db.session.commit()
                logger.info(f"Updated existing user: {user.email}")

            # Log in user for session-based authentication
            login_user(user)

            # Generate JWT token
            jwt_token = generate_jwt_token(user)

            # Create response and set JWT cookie
            response = make_response(redirect(url_for('dashboard')))
            if jwt_token:
                response.set_cookie(
                    'jwt_token',
                    jwt_token,
                    max_age=JWT_EXPIRATION_HOURS * 3600,
                    httponly=True,
                    secure=app.config.get('SESSION_COOKIE_SECURE', False),
                    samesite='Lax'
                )

            return response

        except Exception as e:
            logger.error(f"OAuth callback error: {str(e)}")
            return jsonify({'error': 'Authentication failed'}), 400

    @app.route('/auth/logout')
    def logout():
        """Logout user and clear tokens"""
        logout_user()
        response = make_response(redirect(url_for('index')))
        response.set_cookie('jwt_token', '', expires=0)
        return response

    # ===========================================
    # JWT TOKEN ROUTES
    # ===========================================

    @app.route('/auth/token/generate', methods=['POST'])
    @login_required
    def generate_token():
        """Generate a new JWT token for the current user"""
        token = generate_jwt_token(current_user)
        if token:
            return jsonify({
                'token': token,
                'expires_in': JWT_EXPIRATION_HOURS * 3600,
                'user': {
                    'id': current_user.id,
                    'name': current_user.name,
                    'email': current_user.email
                }
            })
        return jsonify({'error': 'Failed to generate token'}), 500

    @app.route('/auth/token/verify', methods=['POST'])
    def verify_token():
        """Verify a JWT token"""
        data = request.get_json()
        token = data.get('token') if data else None

        if not token:
            return jsonify({'valid': False, 'error': 'Token required'}), 400

        payload = verify_jwt_token(token)
        if payload:
            user = User.query.get(payload['user_id'])
            return jsonify({
                'valid': True,
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email
                },
                'expires': payload['exp']
            })
        else:
            return jsonify({'valid': False, 'error': 'Invalid token'}), 401

    @app.route('/auth/token/refresh', methods=['POST'])
    @jwt_required
    def refresh_token():
        """Refresh a JWT token"""
        user = get_jwt_user()
        if user:
            new_token = generate_jwt_token(user)
            if new_token:
                return jsonify({
                    'token': new_token,
                    'expires_in': JWT_EXPIRATION_HOURS * 3600
                })
        return jsonify({'error': 'Failed to refresh token'}), 500

    # ===========================================
    # API ROUTES (JWT AUTHENTICATION)
    # ===========================================

    @app.route('/api/profile')
    @jwt_required
    def api_profile():
        """Get user profile via JWT"""
        user = get_jwt_user()
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'picture': user.picture,
            'xp_points': user.xp_points,
            'level': user.level,
            'created_at': user.created_at.isoformat()
        })

    @app.route('/api/user/stats')
    @require_auth
    def api_user_stats():
        """Get user stats (accepts both session and JWT auth)"""
        # Get user from either session or JWT
        user = current_user if current_user.is_authenticated else get_jwt_user()

        return jsonify({
            'user_id': user.id,
            'name': user.name,
            'xp_points': user.xp_points,
            'level': user.level,
            'games_played': user.games_played,
            'total_exercise_time': user.total_exercise_time
        })

    @app.route('/api/games/start', methods=['POST'])
    @jwt_required
    def start_game():
        """Start a new fitness game session"""
        user = get_jwt_user()
        data = request.get_json()

        game_type = data.get('game_type')
        if not game_type:
            return jsonify({'error': 'Game type required'}), 400

        # Create game session logic here
        return jsonify({
            'message': f'Started {game_type} game for {user.name}',
            'session_id': f'session_{user.id}_{datetime.utcnow().timestamp()}',
            'user_id': user.id
        })

    @app.route('/api/stories/create', methods=['POST'])
    @jwt_required
    def create_story():
        """Create AI-powered fitness story"""
        user = get_jwt_user()
        data = request.get_json()

        theme = data.get('theme', 'adventure')
        character = data.get('character', 'brave kid')

        # AI story creation logic would go here
        # For now, return a simple response
        return jsonify({
            'message': f'Creating {theme} story for {user.name}',
            'story_id': f'story_{user.id}_{datetime.utcnow().timestamp()}',
            'theme': theme,
            'character': character
        })

    # ===========================================
    # WEB ROUTES (SESSION AUTHENTICATION)
    # ===========================================

    @app.route('/')
    def index():
        """Home page"""
        return "Welcome to PixelPlay Fitness App!"

    @app.route('/dashboard')
    @login_required
    def dashboard():
        """User dashboard (session-based)"""
        return f"Welcome {current_user.name}! Your XP: {current_user.xp_points}"

    @app.route('/profile')
    @login_required
    def profile():
        """User profile page (session-based)"""
        return f"Profile for {current_user.name} ({current_user.email})"

    # ===========================================
    # HEALTH CHECK ROUTES
    # ===========================================

    @app.route('/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'auth_methods': ['google_oauth', 'jwt']
        })

    @app.route('/auth/status')
    def auth_status():
        """Check authentication status"""
        session_auth = current_user.is_authenticated
        jwt_user = get_jwt_user()
        jwt_auth = jwt_user is not None

        return jsonify({
            'session_authenticated': session_auth,
            'jwt_authenticated': jwt_auth,
            'user': {
                'name': current_user.name if session_auth else (jwt_user.name if jwt_auth else None),
                'email': current_user.email if session_auth else (jwt_user.email if jwt_auth else None)
            } if (session_auth or jwt_auth) else None
        })

    logger.info("OAuth and JWT routes initialized successfully")
    return app
