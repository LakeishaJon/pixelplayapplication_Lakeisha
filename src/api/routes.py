"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Reward, UserReward
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# ------------------------
# User routes
# ------------------------

@api.route("/users", methods=["POST"])
def create_user():
    """Create a new user"""
    data = request.get_json()

    new_user = User(
        display_name=data["display_name"],
        parent_email=data["parent_email"],
        google_id=data["google_id"]
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201


@api.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """Get user by ID."""
    user = User.query.get_or_404(user_id)
    return jsonify(user.serialize())

# ------------------------
# Reward routes
# ------------------------

@api.route("/rewards", methods=["POST"])
def create_reward():
    """Create a new reward"""
    data = request.get_json()

    new_reward = Reward(
        reward_name=data["reward_name"],
        points=data["points"],
        user_id=data["user_id"],
        description=data.get("description"),
        is_available=data.get("is_available", True)
    )
    db.session.add(new_reward)
    db.session.commit()

    return jsonify(new_reward.serialize()), 201


@api.route("/rewards/<int:reward_id>", methods=["GET"])
def get_reward(reward_id):
    """Get reward by ID."""
    reward = Reward.query.get_or_404(reward_id)
    return jsonify(reward.serialize())


# ------------------------
# UserReward routes
# ------------------------

@api.route("/users/<int:user_id>/redeem/<int:reward_id>", methods=["POST"])
def redeem_reward(user_id, reward_id):

    user = User.query.get_or_404(user_id)
    reward = Reward.query.get_or_404(reward_id)

    # Check if user has enough points
    if user.points < reward.points:
        return jsonify({"error": "Not enough points to redeem this reward."}), 400

    # Deduct points
    user.points -= reward.points

    # Log redemption
    user_reward = UserReward(user_id=user.id, reward_id=reward.id)
    db.session.add(user_reward)
    db.session.commit()

    return jsonify({
        "message": f"{user.display_name} redeemed {reward.reward_name}!",
        "user": user.serialize(),
        "reward": reward.serialize(),
        "user_reward": user_reward.serialize()
    }), 200


@api.route("/users/<int:user_id>/rewards", methods=["GET"])
def get_user_rewards(user_id):
    """Get all rewards a user has redeemed."""
    redemptions = UserReward.query.filter_by(user_id=user_id).all()
    return jsonify([r.serialize() for r in redemptions])