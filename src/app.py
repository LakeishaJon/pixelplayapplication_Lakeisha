"""
PixelPlay Fitness App - Main Application File
This file starts the Flask server and sets up all the features
"""
import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

# Import our custom modules
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.auth import auth, init_oauth

# ===============================
# CONFIGURATION
# ===============================

# Check if we're in development or production mode
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

# Where our frontend files are stored
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')

# ===============================
# CREATE FLASK APP
# ===============================

app = Flask(__name__)
app.url_map.strict_slashes = False

# Secret key for session security (IMPORTANT!)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'change-this-in-production')

# ===============================
# CORS SETUP (Let frontend talk to backend)
# ===============================

# Get the Codespaces URL dynamically
CODESPACE_NAME = os.getenv('CODESPACE_NAME', '')
GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN = os.getenv('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN', 'app.github.dev')

# Build allowed origins list
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "http://localhost:3000")
]

# Add Codespaces URLs if running in Codespaces
if CODESPACE_NAME:
    codespace_origins = [
        f"https://{CODESPACE_NAME}.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}:3000",
        f"https://{CODESPACE_NAME}-3000.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}",
        f"https://{CODESPACE_NAME}.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}",
    ]
    allowed_origins.extend(codespace_origins)
    print(f"🌐 Codespaces detected! Allowing origins: {codespace_origins}")

CORS(app, 
     resources={
         r"/api/*": {
             "origins": allowed_origins,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "max_age": 3600
         }
     })

# ===============================
# DATABASE CONFIGURATION
# ===============================

# Get database URL from environment variable
db_url = os.getenv("DATABASE_URL")

if db_url:
    # Fix for Heroku/Railway postgres URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://")
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
else:
    # Use SQLite for local development
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///pixelplay.db"

# Don't track modifications (saves memory)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ===============================
# JWT CONFIGURATION (Login Tokens)
# ===============================

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', app.config['SECRET_KEY'])
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)      # Token lasts 24 hours
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)      # Refresh lasts 30 days

# ===============================
# INITIALIZE EXTENSIONS
# ===============================

# Initialize database
db.init_app(app)

# Initialize database migrations (for updating database structure)
migrate = Migrate(app, db, compare_type=True)

# Initialize JWT (for login tokens)
jwt = JWTManager(app)

# Initialize Google OAuth (for "Sign in with Google")
with app.app_context():
    init_oauth(app)

# Setup admin panel and custom commands
setup_admin(app)
setup_commands(app)

# ===============================
# REGISTER BLUEPRINTS (Routes)
# ===============================

# Register authentication routes (login, register, Google OAuth)
app.register_blueprint(auth, url_prefix='/api/auth')

# Register main API routes (games, stories, profile)
app.register_blueprint(api, url_prefix='/api')

# ===============================
# JWT ERROR HANDLERS
# ===============================

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    """What to do when the login token expires"""
    return jsonify({
        'success': False,
        'message': 'Your session has expired. Please login again.',
        'error': 'token_expired'
    }), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    """What to do when someone sends a bad token"""
    return jsonify({
        'success': False,
        'message': 'Invalid login token. Please login again.',
        'error': 'invalid_token'
    }), 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    """What to do when someone tries to access protected page without login"""
    return jsonify({
        'success': False,
        'message': 'You need to login first!',
        'error': 'authorization_required'
    }), 401


@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    """What to do when token has been canceled"""
    return jsonify({
        'success': False,
        'message': 'Your login session has been canceled. Please login again.',
        'error': 'token_revoked'
    }), 401


# ===============================
# ERROR HANDLERS
# ===============================

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    """Handle custom API errors"""
    return jsonify(error.to_dict()), error.status_code


@app.errorhandler(404)
def not_found(error):
    """Handle 404 - Page not found"""
    return jsonify({
        'success': False,
        'message': 'Oops! We could not find that page.',
        'error': 'not_found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 - Server error"""
    return jsonify({
        'success': False,
        'message': 'Something went wrong on our end. We are working on it!',
        'error': 'internal_server_error'
    }), 500


# ===============================
# MAIN ROUTES
# ===============================

@app.route('/')
def sitemap():
    """
    Home page:
    - In development: Show all available routes
    - In production: Serve the React app
    """
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    """
    Serve frontend files (React app)
    This lets React Router handle the URLs
    """
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Don't cache, always get fresh version
    return response


# ===============================
# RUN THE APP
# ===============================

if __name__ == '__main__':
    # Use port 5000 (IMPORTANT: Must match Google OAuth redirect URI!)
    PORT = int(os.environ.get('PORT', 5000))
    
    print("=" * 50)
    print("🎮 PixelPlay Fitness App Starting!")
    print("=" * 50)
    print(f"📍 Running on: http://localhost:{PORT}")
    print(f"🔧 Environment: {ENV}")
    print(f"🗄️  Database: {app.config['SQLALCHEMY_DATABASE_URI'][:50]}...")
    print(f"🔐 Google OAuth: {'✅ Configured' if os.getenv('GOOGLE_CLIENT_ID') else '❌ Not configured'}")
    print("=" * 50)
    
    # Start the server
    app.run(host='0.0.0.0', port=PORT, debug=(ENV == "development"))