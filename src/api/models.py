"""
Database models for PixelPlay application.
This module contains all database table definitions using SQLAlchemy ORM.
Includes User, Task, Game, Inventory, and Achievement systems.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

# Initialize SQLAlchemy instance
db = SQLAlchemy()


# ===================================
# USER MODEL
# ===================================
class User(db.Model):
    """
    User model for authentication and profile management.
    Includes avatar customization system and gamification features.
    """
    __tablename__ = 'users'

    # Primary key
    id = db.Column(db.Integer, primary_key=True)

    # Authentication fields
    username = db.Column(db.String(100), unique=True, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)

    # Gamification fields
    level = db.Column(db.Integer(), default=1, nullable=False)
    xp = db.Column(db.Integer, default=0, nullable=False)
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
    habit_completed_tasks = db.Column(JSON, default=list)
    habit_last_reset = db.Column(db.String(10))
    habit_streak_days = db.Column(db.Integer, default=0)
    habit_game_states = db.Column(JSON, default=dict)

    # Gaming stats
    total_playtime = db.Column(db.Integer, default=0, nullable=False)
    favorite_games = db.Column(db.Text, nullable=True)
    streak_days = db.Column(db.Integer, default=0, nullable=False)
    last_activity = db.Column(db.DateTime, nullable=True)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)

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
    avatars = db.relationship(
        'UserAvatar', backref='user', lazy=True, cascade='all, delete-orphan')
    unlocked_items = db.relationship(
        'UnlockedItem', backref='user', lazy=True, cascade='all, delete-orphan')
    progress = db.relationship(
        'UserProgress', backref='user', uselist=False, cascade='all, delete-orphan')
    presets = db.relationship(
        'SavedAvatarPreset', backref='user', lazy=True, cascade='all, delete-orphan')
    game_sessions_data = db.relationship(
        'GameSession', backref='user', lazy=True)

    def __init__(self, email, password, username=None):
        self.email = email
        self.username = username or email.split('@')[0]
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
        new_level = (self.xp // 100) + 1

        if new_level > old_level:
            self.level = new_level
            self.coins += (new_level - old_level) * 50
            return True
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
        """Convert user to dictionary for JSON responses"""
        return {
            'id': self.id,
            'username': self.username,
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


# ===================================
# TASK MODEL
# ===================================
class Task(db.Model):
    """Task model for managing user tasks/todos."""
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(200), nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, task_name, user_id, is_completed=False):
        self.task_name = task_name
        self.user_id = user_id
        self.is_completed = is_completed
        self.date = datetime.utcnow()

    def serialize(self):
        return {
            'id': self.id,
            'taskName': self.task_name,
            'isCompleted': self.is_completed,
            'date': self.date.isoformat() if self.date else None,
            'userId': self.user_id
        }

    def toggle_completion(self):
        self.is_completed = not self.is_completed
        return self.is_completed

    def __repr__(self):
        return f'<Task {self.id}: {self.task_name[:30]}>'


# ===================================
# GAME MODEL
# ===================================
class Game(db.Model):
    """Game model for tracking user progress in games."""
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    progress = db.Column(db.Integer, default=0, nullable=False)
    personal_best = db.Column(db.Integer, default=0, nullable=False)
    times_played = db.Column(db.Integer, default=0, nullable=False)
    total_time = db.Column(db.Integer, default=0, nullable=False)
    is_favorite = db.Column(db.Boolean, default=False, nullable=False)
    last_played = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
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

    def update_best_score(self, score):
        if score > self.personal_best:
            self.personal_best = score
            return True
        return False

    def record_play_session(self, duration_minutes, score=None):
        self.times_played += 1
        self.total_time += duration_minutes
        self.last_played = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        if score is not None:
            self.update_best_score(score)

    def toggle_favorite(self):
        self.is_favorite = not self.is_favorite
        return self.is_favorite

    def __repr__(self):
        return f'<Game {self.id}: {self.name} - {self.progress}%>'


# ===================================
# INVENTORY ITEM MODEL
# ===================================
class InventoryItem(db.Model):
    """Template items that users can unlock."""
    __tablename__ = 'inventory_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(50), nullable=False)
    subcategory = db.Column(db.String(50), nullable=True)
    rarity = db.Column(db.String(20), default='common', nullable=False)
    xp_cost = db.Column(db.Integer, default=0, nullable=False)
    coin_cost = db.Column(db.Integer, default=0, nullable=False)
    level_required = db.Column(db.Integer, default=1, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    color = db.Column(db.String(20), default='#3B82F6', nullable=False)
    icon = db.Column(db.String(50), nullable=True)
    is_unlockable = db.Column(db.Boolean, default=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)

    def serialize(self):
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
        return f'<InventoryItem {self.id}: {self.name}>'


# ===================================
# USER INVENTORY MODEL
# ===================================
class UserInventory(db.Model):
    """Tracks which items a user owns."""
    __tablename__ = 'user_inventory'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey(
        'inventory_items.id'), nullable=False)
    is_equipped = db.Column(db.Boolean, default=False, nullable=False)
    is_favorite = db.Column(db.Boolean, default=False, nullable=False)
    acquired_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)

    item = db.relationship('InventoryItem', backref='owned_by')
    __table_args__ = (db.UniqueConstraint(
        'user_id', 'item_id', name='unique_user_item'),)

    def serialize(self):
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


# ===================================
# ACHIEVEMENT MODEL
# ===================================
class Achievement(db.Model):
    """Achievement badges and accomplishments."""
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    requirement_type = db.Column(db.String(50), nullable=False)
    requirement_value = db.Column(db.Integer, nullable=False)
    xp_reward = db.Column(db.Integer, default=0, nullable=False)
    coin_reward = db.Column(db.Integer, default=0, nullable=False)
    item_reward_id = db.Column(db.Integer, db.ForeignKey(
        'inventory_items.id'), nullable=True)
    icon = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(20), default='#FFD700', nullable=False)
    rarity = db.Column(db.String(20), default='common', nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)

    item_reward = db.relationship(
        'InventoryItem', backref='achievement_rewards')

    def serialize(self):
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


# ===================================
# USER ACHIEVEMENT MODEL
# ===================================
class UserAchievement(db.Model):
    """Tracks which achievements a user has earned."""
    __tablename__ = 'user_achievements'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey(
        'achievements.id'), nullable=False)
    progress = db.Column(db.Integer, default=0, nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    earned_at = db.Column(db.DateTime, nullable=True)

    achievement = db.relationship('Achievement', backref='earned_by')
    __table_args__ = (db.UniqueConstraint(
        'user_id', 'achievement_id', name='unique_user_achievement'),)

    def serialize(self):
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


# ===================================
# USER GAME STATS MODEL
# ===================================
class UserGameStats(db.Model):
    """Tracks detailed game statistics for users."""
    __tablename__ = 'user_game_stats'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    level = db.Column(db.Integer, default=1, nullable=False)
    xp = db.Column(db.Integer, default=0, nullable=False)
    total_games_played = db.Column(db.Integer, default=0, nullable=False)
    weekly_streak = db.Column(db.Integer, default=0, nullable=False)
    unlocked_games = db.Column(
        JSON, default=['dance', 'yoga', 'memory-match'], nullable=False)
    completed_games = db.Column(JSON, default=[], nullable=False)
    favorite_games = db.Column(JSON, default=[], nullable=False)
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'level': self.level,
            'xp': self.xp,
            'total_games_played': self.total_games_played,
            'weekly_streak': self.weekly_streak,
            'unlocked_games': self.unlocked_games or [],
            'completed_games': self.completed_games or [],
            'favorite_games': self.favorite_games or [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<UserGameStats user_id={self.user_id} level={self.level}>'


# ===================================
# GAME SESSION MODEL
# ===================================
class GameSession(db.Model):
    """Tracks individual game play sessions."""
    __tablename__ = 'game_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    game_id = db.Column(db.String(50), nullable=False)
    xp_earned = db.Column(db.Integer, default=0, nullable=False)
    score = db.Column(db.Integer, default=0, nullable=False)
    duration_minutes = db.Column(db.Integer, default=0, nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    played_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def serialize(self):
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


# ===================================
# USER AVATAR MODEL
# ===================================
class UserAvatar(db.Model):
    """Stores user avatar configurations."""
    __tablename__ = 'user_avatars'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    avatar_style = db.Column(db.String(50), nullable=False)
    avatar_seed = db.Column(db.String(255), nullable=False)
    avatar_options = db.Column(db.Text, nullable=False)
    is_current = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'style': self.avatar_style,
            'seed': self.avatar_seed,
            'options': json.loads(self.avatar_options),
            'is_current': self.is_current,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def __repr__(self):
        return f'<UserAvatar {self.avatar_style} for {self.user_id}>'


# ===================================
# UNLOCKED ITEM MODEL
# ===================================
class UnlockedItem(db.Model):
    """Tracks unlocked customization items."""
    __tablename__ = 'unlocked_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_category = db.Column(db.String(50), nullable=False)
    item_value = db.Column(db.String(100), nullable=False)
    avatar_style = db.Column(db.String(50), nullable=False)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)
    unlocked_by = db.Column(db.String(50))

    __table_args__ = (
        db.UniqueConstraint('user_id', 'item_category', 'item_value', 'avatar_style',
                            name='unique_user_unlocked_item'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.item_category,
            'value': self.item_value,
            'style': self.avatar_style,
            'unlocked_at': self.unlocked_at.isoformat(),
            'unlocked_by': self.unlocked_by
        }

    def __repr__(self):
        return f'<UnlockedItem {self.item_category}:{self.item_value} for {self.user_id}>'


# ===================================
# USER PROGRESS MODEL
# ===================================
class UserProgress(db.Model):
    """Tracks user progression and rewards."""
    __tablename__ = 'user_progress'

    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), primary_key=True)
    total_points = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    experience_points = db.Column(db.Integer, default=0)
    avatars_created = db.Column(db.Integer, default=0)
    items_unlocked = db.Column(db.Integer, default=0)
    last_daily_reward = db.Column(db.Date)
    streak_days = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'total_points': self.total_points,
            'level': self.level,
            'experience_points': self.experience_points,
            'avatars_created': self.avatars_created,
            'items_unlocked': self.items_unlocked,
            'streak_days': self.streak_days,
            'last_daily_reward': self.last_daily_reward.isoformat() if self.last_daily_reward else None
        }

    def add_points(self, points):
        self.total_points += points
        self.experience_points += points
        new_level = (self.experience_points // 100) + 1
        leveled_up = new_level > self.level
        if leveled_up:
            self.level = new_level
        return leveled_up, new_level

    def __repr__(self):
        return f'<UserProgress {self.user_id} - Level {self.level}>'


# ===================================
# ITEM CATALOG MODEL
# ===================================
class ItemCatalog(db.Model):
    """Master catalog of all available items."""
    __tablename__ = 'item_catalog'

    id = db.Column(db.Integer, primary_key=True)
    avatar_style = db.Column(db.String(50), nullable=False)
    item_category = db.Column(db.String(50), nullable=False)
    item_value = db.Column(db.String(100), nullable=False)
    item_name = db.Column(db.String(100), nullable=False)
    unlock_level = db.Column(db.Integer, default=1)
    unlock_cost = db.Column(db.Integer, default=0)
    is_default = db.Column(db.Boolean, default=False)
    rarity = db.Column(db.String(20), default='common')

    __table_args__ = (
        db.UniqueConstraint('avatar_style', 'item_category', 'item_value',
                            name='unique_catalog_item'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'style': self.avatar_style,
            'category': self.item_category,
            'value': self.item_value,
            'name': self.item_name,
            'unlock_level': self.unlock_level,
            'unlock_cost': self.unlock_cost,
            'is_default': self.is_default,
            'rarity': self.rarity
        }

    def __repr__(self):
        return f'<ItemCatalog {self.item_name}>'


# ===================================
# SAVED AVATAR PRESET MODEL
# ===================================
class SavedAvatarPreset(db.Model):
    """Saved avatar configurations."""
    __tablename__ = 'saved_avatar_presets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    preset_name = db.Column(db.String(100), nullable=False)
    avatar_style = db.Column(db.String(50), nullable=False)
    avatar_seed = db.Column(db.String(255), nullable=False)
    avatar_options = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.preset_name,
            'style': self.avatar_style,
            'seed': self.avatar_seed,
            'options': json.loads(self.avatar_options),
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<SavedAvatarPreset {self.preset_name} for {self.user_id}>'


# ===================================
# HELPER FUNCTIONS
# ===================================

def init_default_items_for_user(user_id):
    """Initialize default unlocked items for a new user"""
    default_items = ItemCatalog.query.filter_by(is_default=True).all()
    for item in default_items:
        unlocked = UnlockedItem(
            user_id=user_id,
            item_category=item.item_category,
            item_value=item.item_value,
            avatar_style=item.avatar_style,
            unlocked_by='default'
        )
        db.session.add(unlocked)
    db.session.commit()
    return len(default_items)


def init_user_progress(user_id):
    """Initialize progress for a new user"""
    progress = UserProgress(user_id=user_id)
    db.session.add(progress)
    db.session.commit()
    return progress


def create_default_avatar_for_user(user_id, style='avataaars'):
    """Create a default avatar for a new user"""
    default_options = {
        'topType': 'ShortHairShortFlat',
        'hairColor': 'Brown',
        'skinColor': 'Light',
        'clothesType': 'Hoodie',
        'eyeType': 'Default',
        'mouthType': 'Smile'
    }
    avatar = UserAvatar(
        user_id=user_id,
        avatar_style=style,
        avatar_seed=f'{user_id}-default-{int(datetime.utcnow().timestamp())}',
        avatar_options=json.dumps(default_options),
        is_current=True
    )
    db.session.add(avatar)
    db.session.commit()
    return avatar
