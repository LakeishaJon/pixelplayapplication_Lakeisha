from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize SQLAlchemy instance
db = SQLAlchemy()

class User(db.Model):
feature/Google-OAuth-JWT-with-Flask
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    # also known as the child model
  
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    display_name = db.Column(db.String(120), nullable=False)
    parent_email = db.Column(db.String(120), unique=True, nullable=False)  # COPPA compliance
    google_id = db.Column(db.String(120), nullable=False)

    points = db.Column(db.Integer, default=0, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    rewards = db.relationship("Reward", back_populates="user", lazy=True, cascade="all, delete-orphan")

    def __init__(self, display_name, parent_email, google_id):
        self.display_name = display_name
        self.parent_email = parent_email
        self.google_id = google_id
        self.points = 0
        self.is_active = True
        self.is_verified = False
        self.created_at = datetime.utcnow()

    def serialize(self):
        """Convert user to dictionary for JSON responses"""
        return {
            "id": self.id,
            "display_name": self.display_name,
            "parent_email": self.parent_email,
            "google_id": self.google_id,
            "points": self.points,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<User {self.display_name}>"


class Reward(db.Model):

    # rewards model, so kids can redeem or buy

    __tablename__ = "rewards"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    reward_name = db.Column(db.String(100), nullable=False)
    points = db.Column(db.Integer, nullable=False)  # cost in points
    description = db.Column(db.Text, nullable=True)
    is_available = db.Column(db.Boolean, default=True, nullable=False)

    user = db.relationship("User", back_populates="rewards")

    def __init__(self, reward_name, points, user_id, description=None, is_available=True):
        self.reward_name = reward_name
        self.points = points
        self.user_id = user_id
        self.description = description
        self.is_available = is_available

    def serialize(self):
        """Convert reward to dictionary for JSON responses"""
        return {
            "id": self.id,
            "reward_name": self.reward_name,
            "points": self.points,
            "description": self.description,
            "is_available": self.is_available,
            "user_id": self.user_id,
        }

    def __repr__(self):
        return f"<Reward {self.reward_name} - {self.points} pts>"


class UserReward(db.Model):

    # Whenever a user buys using rewards

    __tablename__ = "user_rewards"

    id = db.Column(db.Integer, primary_key=True)


    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    reward_id = db.Column(db.Integer, db.ForeignKey("rewards.id"), nullable=False)

    purchased_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __init__(self, user_id, reward_id):
        self.user_id = user_id
        self.reward_id = reward_id
        self.purchased_at = datetime.utcnow()

    def serialize(self):
        """Convert UserReward to dictionary for JSON responses"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "reward_id": self.reward_id,
            "purchased_at": self.purchased_at.isoformat() if self.purchased_at else None,
        }

    def __repr__(self):
        return f"<UserReward user={self.user_id} reward={self.reward_id}>"