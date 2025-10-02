from flask import Flask, request, jsonify, url_for, Blueprint
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, Task, Game, InventoryItem, UserInventory, Achievement, UserAchievement

api = Blueprint('api', __name__)


# ===============================
# GAMEHUB ENDPOINTS
# ===============================

@api.route('/gamehub/games', methods=['GET'])
@jwt_required()
def get_gamehub_games():
    """Get all available games with user progress for GameHub"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Get user's game progress
        user_games = {
            game.name.lower().replace(' ', ''): game
            for game in Game.query.filter_by(user_id=user_id).all()
        }

        # Define all available games in GameHub (matches frontend)
        games_catalog = [
            {
                'id': 'dance',
                'name': 'Dance Party',
                'emoji': '💃',
                'description': 'Dance to fun music and copy the moves! Perfect for getting your groove on.',
                'category': 'cardio',
                'difficulty': 'Easy',
                'duration': '5-10 min',
                'xp_reward': 50,
                'energy_required': 20,
                'unlock_level': 1,
                'player_count': '1-4 players',
                'has_music': True
            },
            {
                'id': 'ninja',
                'name': 'Ninja Training',
                'emoji': '🥷',
                'description': 'Jump, duck, and punch like a ninja! Master the ancient arts of fitness.',
                'category': 'strength',
                'difficulty': 'Medium',
                'duration': '8-12 min',
                'xp_reward': 75,
                'energy_required': 30,
                'unlock_level': 3,
                'player_count': '1-2 players',
                'has_music': True
            },
            {
                'id': 'yoga',
                'name': 'Animal Yoga',
                'emoji': '🧘',
                'description': 'Stretch like different animals! Calm your mind and strengthen your body.',
                'category': 'flexibility',
                'difficulty': 'Easy',
                'duration': '10-15 min',
                'xp_reward': 60,
                'energy_required': 15,
                'unlock_level': 1,
                'player_count': '1+ players',
                'has_music': True
            },
            {
                'id': 'rhythm',
                'name': 'Rhythm Master',
                'emoji': '🥁',
                'description': 'Create beats with your body! Musical fitness that gets your heart pumping.',
                'category': 'cardio',
                'difficulty': 'Medium',
                'duration': '5-12 min',
                'xp_reward': 75,
                'energy_required': 30,
                'unlock_level': 4,
                'player_count': '1-8 players',
                'has_music': True
            },
            {
                'id': 'lightning-ladders',
                'name': 'Lightning Ladders',
                'emoji': '⚡',
                'description': 'Sprint in place to climb the lightning ladder and reach the sky!',
                'category': 'cardio',
                'difficulty': 'Medium',
                'duration': '6-8 min',
                'xp_reward': 75,
                'energy_required': 30,
                'unlock_level': 3,
                'player_count': '1-6 players',
                'has_music': True
            },
            {
                'id': 'shadow-punch',
                'name': 'Shadow Boxing',
                'emoji': '👊',
                'description': 'Punch targets in rhythm to defeat shadow opponents!',
                'category': 'strength',
                'difficulty': 'Medium',
                'duration': '7-10 min',
                'xp_reward': 60,
                'energy_required': 35,
                'unlock_level': 4,
                'player_count': '1-4 players',
                'has_music': True
            },
            {
                'id': 'adventure',
                'name': 'Quest Adventure',
                'emoji': '🗺️',
                'description': 'Go on epic fitness quests! Explore magical worlds through exercise.',
                'category': 'adventure',
                'difficulty': 'Medium',
                'duration': '15-20 min',
                'xp_reward': 100,
                'energy_required': 40,
                'unlock_level': 4,
                'player_count': '1-6 players',
                'has_music': True
            },
            {
                'id': 'superhero',
                'name': 'Superhero Training',
                'emoji': '🦸',
                'description': 'Train like your favorite superheroes! Develop super strength and speed.',
                'category': 'strength',
                'difficulty': 'Hard',
                'duration': '12-18 min',
                'xp_reward': 120,
                'energy_required': 50,
                'unlock_level': 6,
                'player_count': '1-4 players',
                'has_music': True
            },
            {
                'id': 'magic',
                'name': 'Magic Academy',
                'emoji': '🪄',
                'description': 'Learn magical spells through movement! Cast fitness spells and brew potions.',
                'category': 'flexibility',
                'difficulty': 'Easy',
                'duration': '8-12 min',
                'xp_reward': 70,
                'energy_required': 25,
                'unlock_level': 5,
                'player_count': '1-4 players',
                'has_music': True
            },
            {
                'id': 'sports',
                'name': 'Mini Sports',
                'emoji': '⚽',
                'description': 'Play soccer, basketball, and more! Compete in fun mini sporting events.',
                'category': 'sports',
                'difficulty': 'Medium',
                'duration': '8-15 min',
                'xp_reward': 80,
                'energy_required': 35,
                'unlock_level': 2,
                'player_count': '2-8 players',
                'has_music': True
            },
            {
                'id': 'memory-match',
                'name': 'Fitness Match Pairs',
                'emoji': '🎴',
                'description': 'Flip cards to find matching pairs of fitness items! Test your visual memory.',
                'category': 'cognitive',
                'difficulty': 'Easy',
                'duration': '5-10 min',
                'xp_reward': 60,
                'energy_required': 10,
                'unlock_level': 1,
                'player_count': '1-4 players',
                'game_type': 'memory-match',
                'has_music': True
            },
            {
                'id': 'sequence-memory',
                'name': 'Exercise Sequence',
                'emoji': '🧠',
                'description': 'Watch exercises light up, then repeat the pattern! Challenge your memory.',
                'category': 'cognitive',
                'difficulty': 'Medium',
                'duration': '8-15 min',
                'xp_reward': 85,
                'energy_required': 15,
                'unlock_level': 2,
                'player_count': '1-6 players',
                'game_type': 'sequence-memory',
                'has_music': True
            }
        ]

        # Add user progress to each game
        for game_data in games_catalog:
            game_key = game_data['id']
            user_game = user_games.get(game_key)

            # Add user-specific data
            game_data['is_unlocked'] = user.level >= game_data['unlock_level']
            game_data['progress'] = user_game.progress if user_game else 0
            game_data['is_completed'] = user_game.is_completed(
            ) if user_game else False
            game_data['personal_best'] = user_game.personal_best if user_game else 0
            game_data['times_played'] = user_game.times_played if user_game else 0
            game_data['is_favorite'] = user_game.is_favorite if user_game else False
            game_data['last_played'] = user_game.last_played.isoformat(
            ) if user_game and user_game.last_played else None

        return jsonify({
            'success': True,
            'games': games_catalog,
            'user_level': user.level,
            'user_xp': user.xp,
            'user_coins': user.coins,
            'total_games': len(games_catalog),
            'unlocked_games': len([g for g in games_catalog if g['is_unlocked']])
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching games: {str(e)}'
        }), 500


@api.route('/gamehub/start-game', methods=['POST'])
@jwt_required()
def start_game_session():
    """Start a new game session"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get('game_id'):
            return jsonify({
                'success': False,
                'message': 'Game ID is required'
            }), 400

        game_id = data['game_id']
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Game unlock levels (matches frontend)
        game_unlock_levels = {
            'dance': 1, 'yoga': 1, 'sports': 2, 'ninja': 3,
            'rhythm': 4, 'adventure': 4, 'lightning-ladders': 3,
            'shadow-punch': 4, 'magic': 5, 'superhero': 6,
            'memory-match': 1, 'sequence-memory': 2
        }

        required_level = game_unlock_levels.get(game_id, 1)
        if user.level < required_level:
            return jsonify({
                'success': False,
                'message': f'Level {required_level} required to play this game'
            }), 403

        # Create or get existing game record
        game = Game.query.filter_by(name=game_id, user_id=user_id).first()
        if not game:
            game = Game(name=game_id, user_id=user_id, progress=0)
            db.session.add(game)

        # Update last played timestamp
        game.last_played = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Game session started',
            'game_session': {
                'game_id': game_id,
                'session_id': f"{user_id}_{game_id}_{int(datetime.utcnow().timestamp())}",
                'start_time': datetime.utcnow().isoformat(),
                'user_level': user.level
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error starting game: {str(e)}'
        }), 500


@api.route('/gamehub/complete-game', methods=['POST'])
@jwt_required()
def complete_game_session():
    """Complete a game session and award XP"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        required_fields = ['game_id', 'score', 'duration_seconds']
        if not data or not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields: game_id, score, duration_seconds'
            }), 400

        game_id = data['game_id']
        score = data['score']
        duration = data['duration_seconds']
        duration_minutes = duration // 60

        user = User.query.get(user_id)
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Get or create game record
        game = Game.query.filter_by(name=game_id, user_id=user_id).first()
        if not game:
            game = Game(name=game_id, user_id=user_id, progress=0)
            db.session.add(game)

        # Calculate XP reward
        base_xp_rewards = {
            'dance': 50, 'ninja': 75, 'yoga': 60, 'rhythm': 75,
            'lightning-ladders': 75, 'shadow-punch': 60,
            'adventure': 100, 'superhero': 120, 'magic': 70,
            'sports': 80, 'memory-match': 60, 'sequence-memory': 85
        }

        base_xp = base_xp_rewards.get(game_id, 50)
        performance_bonus = int(base_xp * (score / 100) * 0.5)
        duration_bonus = min(int(duration / 60) * 5, 25)
        total_xp = base_xp + performance_bonus + duration_bonus

        # Award XP and check for level up
        level_up = user.add_xp(total_xp)

        # Update game progress
        if score > game.progress:
            game.progress = min(score, 100)

        # Record play session
        game.record_play_session(duration_minutes, score)

        # Award coins
        coins_earned = 10 + (score // 10)
        user.coins += coins_earned

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Game completed successfully!',
            'rewards': {
                'xp_earned': total_xp,
                'base_xp': base_xp,
                'performance_bonus': performance_bonus,
                'duration_bonus': duration_bonus,
                'coins_earned': coins_earned,
                'level_up': level_up,
                'new_level': user.level,
                'new_xp_total': user.xp,
                'new_coin_total': user.coins
            },
            'game_stats': {
                'progress': game.progress,
                'personal_best': game.personal_best,
                'times_played': game.times_played,
                'total_time': game.total_time
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error completing game: {str(e)}'
        }), 500


@api.route('/gamehub/favorites', methods=['POST'])
@jwt_required()
def toggle_favorite_game():
    """Add or remove a game from user's favorites"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get('game_id'):
            return jsonify({
                'success': False,
                'message': 'Game ID is required'
            }), 400

        game_id = data['game_id']

        # Get or create game record
        game = Game.query.filter_by(name=game_id, user_id=user_id).first()
        if not game:
            game = Game(name=game_id, user_id=user_id, progress=0)
            db.session.add(game)

        # Toggle favorite status
        is_favorite = game.toggle_favorite()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Game {"added to" if is_favorite else "removed from"} favorites',
            'game_id': game_id,
            'is_favorite': is_favorite
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating favorites: {str(e)}'
        }), 500


@api.route('/gamehub/stats', methods=['GET'])
@jwt_required()
def get_gamehub_stats():
    """Get overall gaming statistics for the user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Get user's game statistics
        user_games = Game.query.filter_by(user_id=user_id).all()
        total_games_played = len(user_games)
        completed_games = len([g for g in user_games if g.progress >= 100])
        total_playtime = sum(game.total_time for game in user_games)
        avg_progress = sum(game.progress for game in user_games) / \
            len(user_games) if user_games else 0

        return jsonify({
            'success': True,
            'stats': {
                'total_games_played': total_games_played,
                'completed_games': completed_games,
                'completion_rate': round((completed_games / total_games_played * 100), 2) if total_games_played > 0 else 0,
                'average_progress': round(avg_progress, 1),
                'total_playtime_minutes': total_playtime,
                'user_level': user.level,
                'total_xp': user.xp,
                'total_coins': user.coins
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching stats: {str(e)}'
        }), 500


# ===============================
# INVENTORY MANAGEMENT ENDPOINTS
# ===============================

@api.route('/inventory', methods=['GET'])
@jwt_required()
def get_user_inventory():
    """Get all inventory items owned by the authenticated user"""
    try:
        user_id = get_jwt_identity()

        # Optional query parameters
        category = request.args.get('category')
        equipped_only = request.args.get('equipped', type=bool)

        # Build query
        query = UserInventory.query.filter_by(
            user_id=user_id).join(InventoryItem)

        if category:
            query = query.filter(InventoryItem.category == category)
        if equipped_only:
            query = query.filter(UserInventory.is_equipped == True)

        inventory_items = query.order_by(
            UserInventory.acquired_at.desc()).all()

        return jsonify({
            'success': True,
            'inventory': [item.serialize() for item in inventory_items],
            'count': len(inventory_items)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching inventory: {str(e)}'
        }), 500


@api.route('/inventory/available', methods=['GET'])
@jwt_required()
def get_available_items():
    """Get all items available for purchase/unlock"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Get all available items
        available_items = InventoryItem.query.filter_by(
            is_active=True, is_unlockable=True).all()

        # Get user's owned items
        owned_item_ids = [
            inv.item_id for inv in UserInventory.query.filter_by(user_id=user_id).all()]

        # Categorize items
        result = {'owned': [], 'affordable': [], 'locked': []}

        for item in available_items:
            item_data = item.serialize()
            item_data['can_afford'] = (
                user.xp >= (item.xp_cost or 0) and
                user.coins >= (item.coin_cost or 0) and
                user.level >= item.level_required
            )

            if item.id in owned_item_ids:
                result['owned'].append(item_data)
            elif item_data['can_afford']:
                result['affordable'].append(item_data)
            else:
                result['locked'].append(item_data)

        return jsonify({
            'success': True,
            'user_level': user.level,
            'user_xp': user.xp,
            'user_coins': user.coins,
            'items': result
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching available items: {str(e)}'
        }), 500


@api.route('/inventory/purchase/<int:item_id>', methods=['POST'])
@jwt_required()
def purchase_item(item_id):
    """Purchase/unlock an inventory item"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        item = InventoryItem.query.get(item_id)

        if not user or not item:
            return jsonify({
                'success': False,
                'message': 'User or item not found'
            }), 404

        # Check if user already owns this item
        if UserInventory.query.filter_by(user_id=user_id, item_id=item_id).first():
            return jsonify({
                'success': False,
                'message': 'Item already owned'
            }), 409

        # Validate requirements
        if user.level < item.level_required:
            return jsonify({'success': False, 'message': f'Level {item.level_required} required'}), 403
        if item.xp_cost > 0 and user.xp < item.xp_cost:
            return jsonify({'success': False, 'message': 'Insufficient XP'}), 403
        if item.coin_cost > 0 and user.coins < item.coin_cost:
            return jsonify({'success': False, 'message': 'Insufficient coins'}), 403

        # Deduct costs
        if item.xp_cost > 0:
            user.xp -= item.xp_cost
        if item.coin_cost > 0:
            user.coins -= item.coin_cost

        # Add to inventory
        user_inventory = UserInventory(user_id=user_id, item_id=item_id)
        db.session.add(user_inventory)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Item purchased successfully',
            'item': user_inventory.serialize(),
            'user_xp': user.xp,
            'user_coins': user.coins
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error purchasing item: {str(e)}'
        }), 500


# ===============================
# ACHIEVEMENTS ENDPOINTS
# ===============================

@api.route('/achievements', methods=['GET'])
@jwt_required()
def get_user_achievements():
    """Get all achievements and user progress"""
    try:
        user_id = get_jwt_identity()

        # Get all achievements
        all_achievements = Achievement.query.filter_by(is_active=True).all()

        # Get user's achievement progress
        user_achievements = {
            ua.achievement_id: ua
            for ua in UserAchievement.query.filter_by(user_id=user_id).all()
        }

        result = []
        for achievement in all_achievements:
            user_progress = user_achievements.get(achievement.id)
            achievement_data = achievement.serialize()
            achievement_data['user_progress'] = user_progress.progress if user_progress else 0
            achievement_data['is_completed'] = user_progress.is_completed if user_progress else False
            achievement_data['earned_at'] = user_progress.earned_at.isoformat(
            ) if user_progress and user_progress.earned_at else None
            result.append(achievement_data)

        return jsonify({
            'success': True,
            'achievements': result,
            'total_achievements': len(all_achievements),
            'completed_achievements': len([a for a in result if a['is_completed']])
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching achievements: {str(e)}'
        }), 500
