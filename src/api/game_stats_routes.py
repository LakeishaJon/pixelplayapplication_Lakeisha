# src/api/game_stats_routes.py
"""
Game statistics API routes for PixelPlay GameHub.
Handles fetching and updating user game statistics and sessions.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from api.models import db, User, UserGameStats, GameSession

game_stats_bp = Blueprint('game_stats', __name__)


@game_stats_bp.route('/api/users/<int:user_id>/stats', methods=['GET'])
@jwt_required()
def get_user_stats(user_id):
    """
    Get user's game statistics.
    
    Returns:
        - level: Current user level
        - xp: Total XP earned
        - total_games_played: Number of games played
        - weekly_streak: Consecutive days played
        - unlocked_games: List of unlocked game IDs
        - completed_games: List of completed game IDs
        - favorite_games: List of favorite game IDs
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Verify user can only access their own stats
        if str(current_user_id) != str(user_id):
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get user
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get or create user stats
        stats = UserGameStats.query.filter_by(user_id=user_id).first()
        
        if not stats:
            # Create default stats for new user
            stats = UserGameStats(user_id=user_id)
            db.session.add(stats)
            db.session.commit()
        
        # Calculate current weekly streak
        weekly_streak = calculate_weekly_streak(user_id)
        stats.weekly_streak = weekly_streak
        db.session.commit()
        
        return jsonify({
            'level': stats.level,
            'xp': stats.xp,
            'total_games_played': stats.total_games_played,
            'weekly_streak': stats.weekly_streak,
            'unlocked_games': stats.unlocked_games or ['dance', 'yoga', 'memory-match'],
            'completed_games': stats.completed_games or [],
            'favorite_games': stats.favorite_games or []
        }), 200
        
    except Exception as e:
        print(f"Error fetching user stats: {e}")
        return jsonify({'error': 'Failed to fetch stats', 'message': str(e)}), 500


@game_stats_bp.route('/api/users/<int:user_id>/stats', methods=['PUT'])
@jwt_required()
def update_user_stats(user_id):
    """
    Update user statistics after completing a game.
    
    Request Body:
        - game_id: ID of the game played
        - xp_earned: XP earned from the game
        - score: Score achieved (optional)
        - duration_minutes: Time played (optional)
        - completed: Whether game was completed
    
    Returns:
        Updated user statistics
    """
    try:
        current_user_id = get_jwt_identity()
        
        if str(current_user_id) != str(user_id):
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.json
        game_id = data.get('game_id')
        xp_earned = data.get('xp_earned', 0)
        score = data.get('score', 0)
        duration_minutes = data.get('duration_minutes', 0)
        completed = data.get('completed', False)
        
        # Get or create user stats
        stats = UserGameStats.query.filter_by(user_id=user_id).first()
        if not stats:
            stats = UserGameStats(user_id=user_id)
            db.session.add(stats)
        
        # Update stats
        leveled_up = stats.add_xp(xp_earned)
        stats.total_games_played += 1
        
        # Unlock new games if leveled up
        if leveled_up:
            unlock_games_for_level(stats, stats.level)
        
        # Mark game as completed
        if completed and game_id:
            stats.complete_game(game_id)
        
        # Record game session
        session = GameSession(
            user_id=user_id,
            game_id=game_id,
            xp_earned=xp_earned,
            score=score,
            duration_minutes=duration_minutes,
            completed=completed
        )
        db.session.add(session)
        
        # Update streak
        weekly_streak = calculate_weekly_streak(user_id)
        stats.weekly_streak = weekly_streak
        
        # Update user's main stats too
        user = User.query.get(user_id)
        if user:
            user.add_xp(xp_earned)
            user.last_activity = datetime.utcnow()
            user.total_playtime += duration_minutes
        
        db.session.commit()
        
        response = {
            'level': stats.level,
            'xp': stats.xp,
            'total_games_played': stats.total_games_played,
            'weekly_streak': stats.weekly_streak,
            'completed_games': stats.completed_games,
            'unlocked_games': stats.unlocked_games
        }
        
        if leveled_up:
            response['level_up'] = True
            response['new_level'] = stats.level
        
        return jsonify(response), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating user stats: {e}")
        return jsonify({'error': 'Failed to update stats', 'message': str(e)}), 500


@game_stats_bp.route('/api/users/<int:user_id>/stats/favorite', methods=['POST'])
@jwt_required()
def toggle_favorite_game(user_id):
    """
    Toggle favorite status for a game.
    
    Request Body:
        - game_id: ID of the game to toggle
    """
    try:
        current_user_id = get_jwt_identity()
        
        if str(current_user_id) != str(user_id):
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.json
        game_id = data.get('game_id')
        
        if not game_id:
            return jsonify({'error': 'game_id is required'}), 400
        
        stats = UserGameStats.query.filter_by(user_id=user_id).first()
        if not stats:
            stats = UserGameStats(user_id=user_id)
            db.session.add(stats)
        
        is_favorite = stats.toggle_favorite(game_id)
        db.session.commit()
        
        return jsonify({
            'game_id': game_id,
            'is_favorite': is_favorite,
            'favorite_games': stats.favorite_games
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error toggling favorite: {e}")
        return jsonify({'error': 'Failed to toggle favorite'}), 500


def calculate_weekly_streak(user_id):
    """
    Calculate how many consecutive days the user has played in the last 7 days.
    
    Args:
        user_id: ID of the user
        
    Returns:
        int: Number of consecutive days played (0-7)
    """
    try:
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        sessions = GameSession.query.filter(
            GameSession.user_id == user_id,
            GameSession.played_at >= seven_days_ago
        ).order_by(GameSession.played_at.desc()).all()
        
        if not sessions:
            return 0
        
        # Get unique days played
        unique_days = set()
        for session in sessions:
            day = session.played_at.date()
            unique_days.add(day)
        
        # Calculate consecutive streak from today backwards
        today = datetime.utcnow().date()
        streak = 0
        current_day = today
        
        for i in range(7):
            if current_day in unique_days:
                streak += 1
                current_day -= timedelta(days=1)
            else:
                break
        
        return streak
        
    except Exception as e:
        print(f"Error calculating streak: {e}")
        return 0


def unlock_games_for_level(stats, level):
    """
    Unlock games based on user level.
    
    Level unlocks:
        1: dance, yoga, memory-match (default)
        2: sports, sequence-memory
        3: ninja, lightning-ladders
        4: rhythm, shadow-punch, adventure
        5: magic
        6: superhero
    
    Args:
        stats: UserGameStats object
        level: Current user level
    """
    level_unlocks = {
        2: ['sports', 'sequence-memory'],
        3: ['ninja', 'lightning-ladders'],
        4: ['rhythm', 'shadow-punch', 'adventure'],
        5: ['magic'],
        6: ['superhero']
    }
    
    for unlock_level, games in level_unlocks.items():
        if level >= unlock_level:
            for game in games:
                stats.unlock_game(game)