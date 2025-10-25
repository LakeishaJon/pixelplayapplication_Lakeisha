"""
PixelPlay Fitness App - Main Application File
This file starts the Flask server and sets up all the features
"""

import os
from datetime import timedelta
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Import database
from api.models import db

# Import custom modules
from api.utils import APIException, generate_sitemap
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.auth import auth, init_oauth

# Import all blueprints
from api.game_routes import game_bp
from api.achievement_routes import achievement_bp
from api.inventory_routes import inventory_bp
from api.avatar_routes import avatar_bp, items_bp, progress_bp, presets_bp


# ===============================
# CONFIGURATION
# ===============================

# Check if we're in development or production mode
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

# Where our frontend files are stored
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')


# ===============================
# APPLICATION FACTORY
# ===============================

def create_app():
    """
    Creates and configures the Flask application.
    This is called the 'Application Factory Pattern' - like a factory that builds apps!
    """

    # ===============================
    # CREATE FLASK APP
    # ===============================

    app = Flask(__name__)
    app.url_map.strict_slashes = False

    # Secret key for session security (IMPORTANT!)
    app.config['SECRET_KEY'] = os.getenv(
        'SECRET_KEY', 'change-this-in-production')

    # ===============================
    # CORS SETUP (Let frontend talk to backend)
    # ===============================

    # Get the Codespaces URL dynamically
    CODESPACE_NAME = os.getenv('CODESPACE_NAME', '')
    GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN = os.getenv(
        'GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN', 'app.github.dev')

    # Build allowed origins list
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ]

    # Add Codespaces URLs if running in Codespaces
    if CODESPACE_NAME:
        # GitHub Codespaces URL format: https://CODESPACE_NAME-PORT.DOMAIN
        codespace_origins = [
            # Frontend (port 3000)
            f"https://{CODESPACE_NAME}-3000.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}",
            # Backend (port 3001)
            f"https://{CODESPACE_NAME}-3001.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}",
            # Vite dev server (port 5173)
            f"https://{CODESPACE_NAME}-5173.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}",
            # With port numbers at the end (alternative format)
            f"https://{CODESPACE_NAME}.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}:3000",
            f"https://{CODESPACE_NAME}.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}:3001",
            f"https://{CODESPACE_NAME}.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}:5173",
            # Base domain (no port)
            f"https://{CODESPACE_NAME}.{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}",
        ]
        allowed_origins.extend(codespace_origins)
        
        print("\n" + "=" * 60)
        print("🌐 GitHub Codespaces Detected!")
        print("=" * 60)
        print("✅ Codespaces origins added:")
        for origin in codespace_origins:
            print(f"   • {origin}")
        print("=" * 60 + "\n")

    # FORCE ADD: Your specific frontend URL (in case Codespaces detection fails)
    specific_frontend = "https://stunning-palm-tree-g4p7v5x9wwqj2wqvr.app.github.dev:3000"
    if specific_frontend not in allowed_origins:
        allowed_origins.append(specific_frontend)
        print(f"🔧 Force-added specific frontend URL: {specific_frontend}\n")

    # ===============================
    # DEBUG: Print all allowed origins
    # ===============================
    print("\n" + "=" * 60)
    print("🔍 CORS DEBUG INFORMATION")
    print("=" * 60)
    print(f"CODESPACE_NAME: '{CODESPACE_NAME}'")
    print(f"GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN: '{GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}'")
    print(f"\n📋 ALL ALLOWED ORIGINS ({len(allowed_origins)} total):")
    for i, origin in enumerate(allowed_origins, 1):
        print(f"   {i}. {origin}")
    print("=" * 60 + "\n")

    # ===============================
    # Configure CORS - More permissive for debugging
    # ===============================
    CORS(app,
         resources={
             r"/*": {  # Apply to ALL routes (not just /api/*)
                 "origins": allowed_origins,
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
                 "allow_headers": [
                     "Content-Type", 
                     "Authorization", 
                     "Accept", 
                     "X-Requested-With",
                     "X-CSRF-Token"
                 ],
                 "supports_credentials": True,
                 "expose_headers": ["Content-Type", "Authorization"],
                 "max_age": 3600,
                 "send_wildcard": False,
                 "always_send": True
             }
         },
         supports_credentials=True)

    print("🔒 CORS Configuration Applied:")
    print(f"   • Mode: {ENV}")
    print(f"   • Pattern: ALL routes (/*)")
    print(f"   • Allowed origins: {len(allowed_origins)} URLs")
    print(f"   • Credentials: Enabled")
    print(f"   • Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH")
    print("")

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

    app.config['JWT_SECRET_KEY'] = os.getenv(
        'JWT_SECRET_KEY', app.config['SECRET_KEY'])
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

    # ===============================
    # INITIALIZE EXTENSIONS
    # ===============================

    # Initialize database
    db.init_app(app)

    # Initialize database migrations
    migrate = Migrate(app, db, compare_type=True)

    # Initialize JWT
    jwt = JWTManager(app)

    # Initialize Google OAuth
    with app.app_context():
        init_oauth(app)
        # Create database tables if they don't exist
        db.create_all()
        print("✅ Database tables created/verified")

    # Setup admin panel and custom commands
    setup_admin(app)
    setup_commands(app)

    # ===============================
    # REGISTER BLUEPRINTS (Routes)
    # ===============================

    # Register authentication routes
    app.register_blueprint(auth, url_prefix='/api/auth')

    # Register main API routes
    app.register_blueprint(api, url_prefix='/api')

    # Register game-related routes
    app.register_blueprint(game_bp, url_prefix='/api')
    print("✅ Game routes registered")

    # Register achievement routes
    app.register_blueprint(achievement_bp, url_prefix='/api')
    print("✅ Achievement routes registered")

    # Register inventory routes
    app.register_blueprint(inventory_bp, url_prefix='/api')
    print("✅ Inventory routes registered")

    # Register avatar-related routes
    app.register_blueprint(avatar_bp)
    app.register_blueprint(items_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(presets_bp)
    print("✅ Avatar routes registered")

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
    def index():
        """
        Home page:
        - In development: Show all available routes
        - In production: Show welcome message or serve React app
        """
        if ENV == "development":
            return generate_sitemap(app)

        # Try to serve the React app
        if os.path.isfile(os.path.join(static_file_dir, 'index.html')):
            return send_from_directory(static_file_dir, 'index.html')
        else:
            return jsonify({
                'message': 'Welcome to PixelPlay Fitness API!',
                'version': '1.0.0',
                'status': 'healthy',
                'endpoints': {
                    'auth': '/api/auth',
                    'games': '/api/gamehub/games',
                    'stats': '/api/users/<id>/stats',
                    'achievements': '/api/achievements',
                    'inventory': '/api/inventory',
                    'avatar': '/api/avatar',
                    'items': '/api/items',
                    'progress': '/api/progress',
                    'presets': '/api/presets',
                    'health': '/api/health'
                }
            })

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint - tells you if the API is working"""
        return jsonify({
            'status': 'healthy',
            'message': 'PixelPlay API is running!',
            'environment': ENV,
            'database': 'connected',
            'features': {
                'games': True,
                'achievements': True,
                'inventory': True,
                'avatar': True
            }
        }), 200

    @app.route('/<path:path>', methods=['GET'])
    def serve_any_other_file(path):
        """
        Serve frontend files (React app)
        This lets React Router handle the URLs
        """
        # Exclude all /api/* routes from catch-all
        if path.startswith('api/'):
            return jsonify({
                'success': False,
                'message': 'API endpoint not found',
                'error': 'not_found'
            }), 404

        # Serve static files or React app
        if not os.path.isfile(os.path.join(static_file_dir, path)):
            path = 'index.html'

        if os.path.isfile(os.path.join(static_file_dir, path)):
            response = send_from_directory(static_file_dir, path)
            response.cache_control.max_age = 0
            return response
        else:
            return jsonify({
                'success': False,
                'message': 'File not found',
                'error': 'not_found'
            }), 404

    return app


# ===============================
# CREATE APP INSTANCE FOR FLASK CLI
# ===============================

app = create_app()


# ===============================
# RUN THE APP
# ===============================

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))

    print("\n" + "=" * 60)
    print("🎮 PixelPlay Fitness App Starting!")
    print("=" * 60)
    print(f"📍 Running on: http://localhost:{PORT}")
    print(f"🔧 Environment: {ENV}")
    print(f"🗄️  Database: {app.config['SQLALCHEMY_DATABASE_URI'][:50]}...")
    print(
        f"🔐 Google OAuth: {'✅ Configured' if os.getenv('GOOGLE_CLIENT_ID') else '❌ Not configured'}")
    print("=" * 60)
    print("\n📦 Registered Features:")
    print("   ✅ Authentication")
    print("   ✅ Games & GameHub")
    print("   ✅ Achievements")
    print("   ✅ Inventory")
    print("   ✅ Avatar System")
    print("=" * 60 + "\n")

    # Start the server
    app.run(host='0.0.0.0', port=PORT, debug=(ENV == "development"))