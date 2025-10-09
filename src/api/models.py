"""
Database models for PixelPlay application.
This module contains all database table definitions using SQLAlchemy ORM.
Includes User, Task, Game, Inventory, and Achievement systems.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Initialize SQLAlchemy instance
db = SQLAlchemy()


class User(db.Model):
    """
    User model for authentication and profile management.
    Includes avatar customization system and gamification features.
    """
    __tablename__ = 'users'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Authentication fields
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)

    # Gamification fields
    level = db.Column(db.Integer(), default=1, nullable=False)
    xp = db.Column(db.Integer, default=0, nullable=False)
    # Virtual currency for purchases
    coins = db.Column(db.Integer, default=100, nullable=False)

    # Avatar System Fields
    avatar_style = db.Column(
        db.String(50), default="pixel-art", nullable=False)
    avatar_seed = db.Column(db.String(100), nullable=True)
    avatar_background_color = db.Column(
        db.String(20), default="blue", nullable=False)
    avatar_theme = db.Column(
        db.String(50), default="superhero", nullable=False)
    avatar_mood = db.Column(db.String(20), default="happy", nullable=False)

    # Habit Tracker fields
    habit_daily_points = db.Column(db.Integer, default=0)
    habit_completed_tasks = db.Column(
        JSON, default=list)  # List of routine IDs
    habit_last_reset = db.Column(db.String(10))  # Date string 'YYYY-MM-DD'
    habit_streak_days = db.Column(db.Integer, default=0)
    habit_game_states = db.Column(JSON, default=dict)  # Store game states

    # Gaming stats
    total_playtime = db.Column(
        db.Integer, default=0, nullable=False)  # in minutes
    # JSON string of favorite game IDs
    favorite_games = db.Column(db.Text, nullable=True)
    streak_days = db.Column(db.Integer, default=0, nullable=False)
    last_activity = db.Column(db.DateTime, nullable=True)

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
    inventory = db.relationship(
        'UserInventory', backref='user', lazy=True, cascade='all, delete-orphan')
    achievements = db.relationship(
        'UserAchievement', backref='user', lazy=True, cascade='all, delete-orphan')

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

    def add_xp(self, amount):
        """Add XP and check for level up."""
        self.xp += amount
        old_level = self.level
        new_level = (self.xp // 100) + 1  # Level up every 100 XP

        if new_level > old_level:
            self.level = new_level
            # Award coins for leveling up
            self.coins += (new_level - old_level) * 50
            return True  # Level up occurred
        return False

    def can_afford(self, cost):
        """Check if user can afford an item."""
        return self.coins >= cost

    def spend_coins(self, amount):
        """Spend coins if user has enough."""
        if self.can_afford(amount):
            self.coins -= amount
            return True
        return False

    def serialize(self):
        """Convert user to dictionary for JSON responses (excluding sensitive data)"""
        return {
            'id': self.id,
            'email': self.email,
            'level': self.level,
            'xp': self.xp,
            'coins': self.coins,
            'avatar_style': self.avatar_style,
            'avatar_seed': self.avatar_seed,
            'avatar_background_color': self.avatar_background_color,
            'avatar_theme': self.avatar_theme,
            'avatar_mood': self.avatar_mood,
            'total_playtime': self.total_playtime,
            'streak_days': self.streak_days,
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
    Enhanced with GameHub features including favorites, best scores, and play counts.
    """
    __tablename__ = 'games'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Game details
    name = db.Column(db.String(100), nullable=False)
    # Progress percentage (0-100)
    progress = db.Column(db.Integer, default=0, nullable=False)

    # Enhanced GameHub fields
    personal_best = db.Column(db.Integer, default=0,
                              nullable=False)  # Best score achieved
    # Number of times played
    times_played = db.Column(db.Integer, default=0, nullable=False)
    # Total playtime in minutes
    total_time = db.Column(db.Integer, default=0, nullable=False)
    is_favorite = db.Column(db.Boolean, default=False,
                            nullable=False)  # User's favorite game
    # Last time game was played
    last_played = db.Column(db.DateTime, nullable=True)

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
            'personal_best': self.personal_best,
            'times_played': self.times_played,
            'total_time': self.total_time,
            'is_favorite': self.is_favorite,
            'last_played': self.last_played.isoformat() if self.last_played else None,
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

    def update_best_score(self, score):
        """Update personal best score if new score is higher"""
        if score > self.personal_best:
            self.personal_best = score
            return True
        return False

    def record_play_session(self, duration_minutes, score=None):
        """Record a play session with duration and optional score"""
        self.times_played += 1
        self.total_time += duration_minutes
        self.last_played = datetime.utcnow()
        self.updated_at = datetime.utcnow()

        if score is not None:
            self.update_best_score(score)

    def toggle_favorite(self):
        """Toggle favorite status"""
        self.is_favorite = not self.is_favorite
        return self.is_favorite

    def __repr__(self):
        return f'<Game {self.id}: {self.name} - {self.progress}%>'


class InventoryItem(db.Model):
    """
    Inventory item model for tracking collectible items that users can earn.
    These are template items that can be unlocked and added to user inventories.
    """
    __tablename__ = 'inventory_items'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Item details
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    # clothing, accessory, badge, power-up
    category = db.Column(db.String(50), nullable=False)
    # hat, shirt, pants, shoes, etc.
    subcategory = db.Column(db.String(50), nullable=True)
    # common, rare, epic, legendary
    rarity = db.Column(db.String(20), default='common', nullable=False)

    # Costs and requirements
    xp_cost = db.Column(db.Integer, default=0, nullable=False)
    # Alternative currency cost
    coin_cost = db.Column(db.Integer, default=0, nullable=False)
    level_required = db.Column(db.Integer, default=1, nullable=False)

    # Visual properties
    image_url = db.Column(db.String(255), nullable=True)
    color = db.Column(db.String(20), default='#3B82F6', nullable=False)
    icon = db.Column(db.String(50), nullable=True)  # emoji or icon name

    # Item properties
    is_unlockable = db.Column(db.Boolean, default=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    # Timestamps
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)

    def __init__(self, name, category, xp_cost=0, coin_cost=0, level_required=1, rarity='common', **kwargs):
        self.name = name
        self.category = category
        self.xp_cost = xp_cost
        self.coin_cost = coin_cost
        self.level_required = level_required
        self.rarity = rarity

        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def serialize(self):
        """Convert item to dictionary for JSON responses"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'subcategory': self.subcategory,
            'rarity': self.rarity,
            'xp_cost': self.xp_cost,
            'coin_cost': self.coin_cost,
            'level_required': self.level_required,
            'image_url': self.image_url,
            'color': self.color,
            'icon': self.icon,
            'is_unlockable': self.is_unlockable,
            'is_active': self.is_active
        }

    def __repr__(self):
        return f'<InventoryItem {self.id}: {self.name} ({self.category})>'


class UserInventory(db.Model):
    """
    User inventory model for tracking which items a user owns.
    Links users to their owned inventory items.
    """
    __tablename__ = 'user_inventory'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey(
        'inventory_items.id'), nullable=False)

    # Item status
    is_equipped = db.Column(db.Boolean, default=False, nullable=False)
    is_favorite = db.Column(db.Boolean, default=False, nullable=False)

    # Timestamps
    acquired_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    item = db.relationship('InventoryItem', backref='owned_by')

    # Unique constraint - user can only own each item once
    __table_args__ = (db.UniqueConstraint(
        'user_id', 'item_id', name='unique_user_item'),)

    def __init__(self, user_id, item_id, is_equipped=False):
        self.user_id = user_id
        self.item_id = item_id
        self.is_equipped = is_equipped
        self.acquired_at = datetime.utcnow()

    def serialize(self):
        """Convert user inventory entry to dictionary for JSON responses"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'item_id': self.item_id,
            'is_equipped': self.is_equipped,
            'is_favorite': self.is_favorite,
            'acquired_at': self.acquired_at.isoformat() if self.acquired_at else None,
            'item': self.item.serialize() if self.item else None
        }

    def __repr__(self):
        return f'<UserInventory User:{self.user_id} Item:{self.item_id}>'


class Achievement(db.Model):
    """
    Achievement model for tracking user accomplishments and badges.
    """
    __tablename__ = 'achievements'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Achievement details
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    # fitness, social, creative, milestone
    category = db.Column(db.String(50), nullable=False)

    # Requirements
    # xp, level, tasks, games, time
    requirement_type = db.Column(db.String(50), nullable=False)
    requirement_value = db.Column(db.Integer, nullable=False)

    # Rewards
    xp_reward = db.Column(db.Integer, default=0, nullable=False)
    coin_reward = db.Column(db.Integer, default=0, nullable=False)
    item_reward_id = db.Column(db.Integer, db.ForeignKey(
        'inventory_items.id'), nullable=True)

    # Visual properties
    icon = db.Column(db.String(50), nullable=False)  # emoji or icon name
    color = db.Column(db.String(20), default='#FFD700', nullable=False)
    rarity = db.Column(db.String(20), default='common', nullable=False)

    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    # Timestamps
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    item_reward = db.relationship(
        'InventoryItem', backref='achievement_rewards')

    def serialize(self):
        """Convert achievement to dictionary for JSON responses"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'requirement_type': self.requirement_type,
            'requirement_value': self.requirement_value,
            'xp_reward': self.xp_reward,
            'coin_reward': self.coin_reward,
            'item_reward_id': self.item_reward_id,
            'icon': self.icon,
            'color': self.color,
            'rarity': self.rarity,
            'is_active': self.is_active,
            'item_reward': self.item_reward.serialize() if self.item_reward else None
        }

    def __repr__(self):
        return f'<Achievement {self.id}: {self.name}>'


class UserAchievement(db.Model):
    """
    User achievement model for tracking which achievements a user has earned.
    """
    __tablename__ = 'user_achievements'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey(
        'achievements.id'), nullable=False)

    # Achievement status
    progress = db.Column(db.Integer, default=0, nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)

    # Timestamps
    earned_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    achievement = db.relationship('Achievement', backref='earned_by')

    # Unique constraint
    __table_args__ = (db.UniqueConstraint(
        'user_id', 'achievement_id', name='unique_user_achievement'),)

    def serialize(self):
        """Convert user achievement to dictionary for JSON responses"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'achievement_id': self.achievement_id,
            'progress': self.progress,
            'is_completed': self.is_completed,
            'earned_at': self.earned_at.isoformat() if self.earned_at else None,
            'achievement': self.achievement.serialize() if self.achievement else None
        }

    def __repr__(self):
        return f'<UserAchievement User:{self.user_id} Achievement:{self.achievement_id}>'

# Add these TWO new models to your EXISTING src/models.py file
# Add them at the end, before the closing of the file


class UserGameStats(db.Model):
    """
    User game statistics model for tracking game progress and achievements.
    Linked to GameHub for personalized gaming experience.
    """
    __tablename__ = 'user_game_stats'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Foreign key to User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Game statistics
    level = db.Column(db.Integer, default=1, nullable=False)
    xp = db.Column(db.Integer, default=0, nullable=False)
    total_games_played = db.Column(db.Integer, default=0, nullable=False)
    weekly_streak = db.Column(db.Integer, default=0, nullable=False)

    # Game data stored as JSON
    unlocked_games = db.Column(
        db.JSON, default=['dance', 'yoga', 'memory-match'], nullable=False)
    completed_games = db.Column(db.JSON, default=[], nullable=False)
    favorite_games = db.Column(db.JSON, default=[], nullable=False)

    # Timestamps
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    # Relationship
    user = db.relationship('User', backref=db.backref(
        'game_stats_data', uselist=False))

    def __init__(self, user_id):
        self.user_id = user_id
        self.level = 1
        self.xp = 0
        self.total_games_played = 0
        self.weekly_streak = 0
        self.unlocked_games = ['dance', 'yoga', 'memory-match']
        self.completed_games = []
        self.favorite_games = []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def serialize(self):
        """Convert to dictionary for JSON responses"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'level': self.level,
            'xp': self.xp,
            'total_games_played': self.total_games_played,
            'weekly_streak': self.weekly_streak,
            'unlocked_games': self.unlocked_games or ['dance', 'yoga', 'memory-match'],
            'completed_games': self.completed_games or [],
            'favorite_games': self.favorite_games or [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def add_xp(self, amount):
        """Add XP and check for level up"""
        self.xp += amount
        old_level = self.level
        new_level = (self.xp // 100) + 1  # Level up every 100 XP

        if new_level > old_level:
            self.level = new_level
            return True  # Level up occurred
        return False

    def unlock_game(self, game_id):
        """Unlock a new game"""
        if game_id not in self.unlocked_games:
            unlocked = self.unlocked_games or []
            unlocked.append(game_id)
            self.unlocked_games = unlocked
            return True
        return False

    def complete_game(self, game_id):
        """Mark a game as completed"""
        if game_id not in self.completed_games:
            completed = self.completed_games or []
            completed.append(game_id)
            self.completed_games = completed
            return True
        return False

    def toggle_favorite(self, game_id):
        """Toggle favorite status for a game"""
        favorites = self.favorite_games or []
        if game_id in favorites:
            favorites.remove(game_id)
        else:
            favorites.append(game_id)
        self.favorite_games = favorites
        return game_id in favorites

    def __repr__(self):
        return f'<UserGameStats user_id={self.user_id} level={self.level}>'


class GameSession(db.Model):
    """
    Game session model for tracking individual game play sessions.
    Used for calculating streaks and analyzing play patterns.
    """
    __tablename__ = 'game_sessions'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Foreign key to User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Session details
    game_id = db.Column(db.String(50), nullable=False)
    xp_earned = db.Column(db.Integer, default=0, nullable=False)
    score = db.Column(db.Integer, default=0, nullable=False)
    duration_minutes = db.Column(db.Integer, default=0, nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)

    # Timestamp
    played_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship
    user = db.relationship('User', backref=db.backref(
        'game_sessions_data', lazy=True))

    def __init__(self, user_id, game_id, xp_earned=0, score=0, duration_minutes=0, completed=False):
        self.user_id = user_id
        self.game_id = game_id
        self.xp_earned = xp_earned
        self.score = score
        self.duration_minutes = duration_minutes
        self.completed = completed
        self.played_at = datetime.utcnow()

    def serialize(self):
        """Convert to dictionary for JSON responses"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'xp_earned': self.xp_earned,
            'score': self.score,
            'duration_minutes': self.duration_minutes,
            'completed': self.completed,
            'played_at': self.played_at.isoformat() if self.played_at else None
        }

    def __repr__(self):
        return f'<GameSession user_id={self.user_id} game_id={self.game_id}>'
