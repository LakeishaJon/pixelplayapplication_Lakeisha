"""
Database models for PixelPlay application.
This module contains all database table definitions using SQLAlchemy ORM.
"""

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Initialize SQLAlchemy instance
db = SQLAlchemy()


class User(db.Model):
    """
    User model for authentication and profile management.
    Includes avatar customization system for gamification.
    """
    __tablename__ = 'users'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Authentication fields
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)

    # Avatar System Fields for gamification
    level = db.Column(db.Integer(), default=1, nullable=False)
    avatar_style = db.Column(
        db.String(50), default="pixel-art", nullable=False)
    avatar_seed = db.Column(db.String(100), nullable=True)
    avatar_background_color = db.Column(
        db.String(20), default="blue", nullable=False)
    avatar_theme = db.Column(
        db.String(50), default="superhero", nullable=False)
    avatar_mood = db.Column(db.String(20), default="happy", nullable=False)

    # Timestamps
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    # Relationships
    tasks = db.relationship('Task', backref='user',
                            lazy=True, cascade='all, delete-orphan')
    games = db.relationship('Game', backref='user',
                            lazy=True, cascade='all, delete-orphan')

    def __init__(self, email, password):
        self.email = email
        self.set_password(password)
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def set_password(self, password):
        """Hash and store password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check if provided password matches hash."""
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        """Convert user to dictionary for JSON responses (excluding sensitive data)"""
        return {
            'id': self.id,
            'email': self.email,
            'level': self.level,
            'avatar_style': self.avatar_style,
            'avatar_seed': self.avatar_seed,
            'avatar_background_color': self.avatar_background_color,
            'avatar_theme': self.avatar_theme,
            'avatar_mood': self.avatar_mood,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<User {self.email}>'


class Task(db.Model):
    """
    Task model for managing user tasks/todos in PixelPlay app.
    Links to User model for task ownership.
    """
    __tablename__ = 'tasks'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Task details
    task_name = db.Column(db.String(200), nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Foreign key to User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, task_name, user_id, is_completed=False):
        self.task_name = task_name
        self.user_id = user_id
        self.is_completed = is_completed
        self.date = datetime.utcnow()

    def serialize(self):
        """Convert task to dictionary for JSON responses"""
        return {
            'id': self.id,
            'taskName': self.task_name,
            'isCompleted': self.is_completed,
            'date': self.date.isoformat() if self.date else None,
            'userId': self.user_id
        }

    def toggle_completion(self):
        """Toggle the completion status of the task"""
        self.is_completed = not self.is_completed
        return self.is_completed

    def __repr__(self):
        return f'<Task {self.id}: {self.task_name[:30]}{"..." if len(self.task_name) > 30 else ""}>'


class Game(db.Model):
    """
    Game model for tracking user progress in different fitness games.
    Links to User model for game ownership and progress tracking.
    """
    __tablename__ = 'games'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Game details
    name = db.Column(db.String(100), nullable=False)
    # Progress percentage (0-100)
    progress = db.Column(db.Integer, default=0, nullable=False)

    # Foreign key to User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Timestamps
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    def __init__(self, name, user_id, progress=0):
        self.name = name
        self.user_id = user_id
        self.progress = progress
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def serialize(self):
        """Convert game to dictionary for JSON responses"""
        return {
            'id': self.id,
            'name': self.name,
            'progress': self.progress,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def update_progress(self, new_progress):
        """Update game progress (0-100)"""
        if 0 <= new_progress <= 100:
            self.progress = new_progress
            self.updated_at = datetime.utcnow()
            return True
        return False

    def is_completed(self):
        """Check if game is completed (100% progress)"""
        return self.progress >= 100

    def add_progress(self, points):
        """Add progress points (useful for incremental progress)"""
        new_progress = min(self.progress + points, 100)
        self.progress = new_progress
        self.updated_at = datetime.utcnow()
        return new_progress

    def __repr__(self):
        return f'<Game {self.id}: {self.name} - {self.progress}%>'
