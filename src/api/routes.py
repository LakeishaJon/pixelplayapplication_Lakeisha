from flask import Flask, request, jsonify, url_for, Blueprint
import json
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from api.utils import generate_sitemap, APIException
from api.models import db, User, Task, Game, InventoryItem, UserInventory, Achievement, UserAchievement


@api.route('/games', methods=['POST'])
@jwt_required()
def create_game():
    """Create a new game"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate required fields
        if not data or not data.get('name'):
            return jsonify({
                'success': False,
                'message': 'Game name is required'
            }), 400

        # Check if game already exists for this user
        existing_game = Game.query.filter_by(
            name=data['name'], user_id=user_id).first()
        if existing_game:
            return jsonify({
                'success': False,
                'message': 'Game already exists for this user'
            }), 409

        # Create new game
        game = Game(
            name=data['name'],
            user_id=user_id,
            progress=data.get('progress', 0)
        )

        db.session.add(game)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Game created successfully',
            'game': game.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error creating game: {str(e)}'
        }), 500


@api.route('/games/<int:game_id>/progress', methods=['PATCH'])
@jwt_required()
def update_game_progress(game_id):
    """Update game progress"""
    try:
        user_id = get_jwt_identity()
        game = Game.query.filter_by(id=game_id, user_id=user_id).first()

        if not game:
            return jsonify({
                'success': False,
                'message': 'Game not found'
            }), 404

        data = request.get_json()

        if 'progress' in data:
            # Set specific progress
            if not game.update_progress(data['progress']):
                return jsonify({
                    'success': False,
                    'message': 'Progress must be between 0 and 100'
                }), 400
        elif 'add_progress' in data:
            # Add to existing progress
            game.add_progress(data['add_progress'])
        else:
            return jsonify({
                'success': False,
                'message': 'Either "progress" or "add_progress" is required'
            }), 400

        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Game progress updated to {game.progress}%',
            'game': game.serialize(),
            'completed': game.is_completed()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating progress: {str(e)}'
        }), 500


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
        user_games = {game.name.lower().replace(
            ' ', ''): game for game in Game.query.filter_by(user_id=user_id).all()}

        # Define all available games in GameHub
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
                'features': ['Music rhythm', 'Dance moves', 'Fun choreography'],
                'player_count': '1-4 players',
                'instructions': 'Follow the dancing character on screen and copy their moves!'
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
                'features': ['Reaction training', 'Combat moves', 'Stealth exercises'],
                'player_count': '1-2 players',
                'instructions': 'Do ninja moves when you see the symbols: Jump for ⬆️, Duck for ⬇️, Punch for 👊'
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
                'features': ['Animal poses', 'Breathing exercises', 'Mindfulness'],
                'player_count': '1+ players',
                'instructions': 'Copy the animal poses: Cat stretch, Dog pose, Frog jumps!'
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
                'features': ['Story mode', 'Multiple levels', 'Treasure rewards'],
                'player_count': '1-6 players',
                'instructions': 'Complete physical challenges to progress through the adventure map!'
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
                'features': ['Multiple sports', 'Team play', 'Tournaments'],
                'player_count': '2-8 players',
                'instructions': 'Use your whole body to play different sports games!'
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
                'features': ['Hero workouts', 'Power challenges', 'Cape physics'],
                'player_count': '1-4 players',
                'instructions': 'Complete superhero training exercises to unlock your powers!'
            },
            {
                'id': 'space',
                'name': 'Space Explorer',
                'emoji': '🚀',
                'description': 'Exercise like an astronaut in space! Zero gravity workouts await.',
                'category': 'cardio',
                'difficulty': 'Medium',
                'duration': '10-15 min',
                'xp_reward': 90,
                'energy_required': 30,
                'unlock_level': 8,
                'features': ['Zero gravity sim', 'Space missions', 'Planet exploration'],
                'player_count': '1-6 players',
                'instructions': 'Move like you\'re floating in space while doing astronaut exercises!'
            },
            {
                'id': 'pirate',
                'name': 'Pirate Adventure',
                'emoji': '🏴‍☠️',
                'description': 'Sail the seven seas and find treasure through swashbuckling workouts!',
                'category': 'adventure',
                'difficulty': 'Hard',
                'duration': '15-25 min',
                'xp_reward': 150,
                'energy_required': 45,
                'unlock_level': 10,
                'features': ['Ship battles', 'Treasure hunting', 'Sword fighting'],
                'player_count': '2-8 players',
                'instructions': 'Complete pirate challenges to find buried treasure!'
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
                'features': ['Spell casting', 'Potion brewing', 'Magic duels'],
                'player_count': '1-4 players',
                'instructions': 'Use gestures and movements to cast magical fitness spells!'
            },
            {
                'id': 'racing',
                'name': 'Turbo Racing',
                'emoji': '🏎️',
                'description': 'Race through obstacle courses! Speed and agility training disguised as fun.',
                'category': 'cardio',
                'difficulty': 'Hard',
                'duration': '6-10 min',
                'xp_reward': 85,
                'energy_required': 40,
                'unlock_level': 7,
                'features': ['Racing circuits', 'Time trials', 'Speed boosts'],
                'player_count': '2-8 players',
                'instructions': 'Run, jump, and dodge obstacles to win the race!'
            },
            {
                'id': 'detective',
                'name': 'Fitness Detective',
                'emoji': '🕵️',
                'description': 'Solve mysteries through physical clues! Exercise your body and brain.',
                'category': 'mixed',
                'difficulty': 'Medium',
                'duration': '12-20 min',
                'xp_reward': 95,
                'energy_required': 35,
                'unlock_level': 9,
                'features': ['Mystery solving', 'Physical puzzles', 'Detective tools'],
                'player_count': '1-6 players',
                'instructions': 'Solve physical puzzles and follow exercise clues to crack the case!'
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
                'features': ['Beat creation', 'Musical timing', 'Rhythm challenges'],
                'player_count': '1-8 players',
                'instructions': 'Use your body to create rhythm and beats in time with the music!'
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

        # Game unlock levels
        game_unlock_levels = {
            'dance': 1, 'yoga': 1, 'sports': 2, 'ninja': 3, 'adventure': 4,
            'magic': 5, 'superhero': 6, 'racing': 7, 'space': 8,
            'detective': 9, 'pirate': 10, 'rhythm': 4
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
        game.updated_at = datetime.utcnow()
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

        required_fields = ['game_id', 'session_id',
                           'score', 'duration_seconds']
        if not data or not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields: game_id, session_id, score, duration_seconds'
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

        # Calculate XP reward based on game and performance
        base_xp_rewards = {
            'dance': 50, 'ninja': 75, 'yoga': 60, 'adventure': 100,
            'sports': 80, 'superhero': 120, 'space': 90, 'pirate': 150,
            'magic': 70, 'racing': 85, 'detective': 95, 'rhythm': 75
        }

        base_xp = base_xp_rewards.get(game_id, 50)

        # Bonus XP for good performance (assuming score is 0-100)
        performance_bonus = int(base_xp * (score / 100) * 0.5)

        # Duration bonus (encourage longer play)
        # 5 XP per minute, max 25
        duration_bonus = min(int(duration / 60) * 5, 25)

        total_xp = base_xp + performance_bonus + duration_bonus

        # Award XP and check for level up
        level_up = user.add_xp(total_xp)

        # Update game progress (assuming score represents progress)
        if score > game.progress:
            game.progress = min(score, 100)

        # Record play session
        game.record_play_session(duration_minutes, score)

        # Award coins for completion
        # Base 10 coins + bonus based on score
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


@api.route('/gamehub/leaderboard/<game_id>', methods=['GET'])
@jwt_required()
def get_game_leaderboard(game_id):
    """Get leaderboard for a specific game"""
    try:
        # Get top players for this game
        top_games = db.session.query(
            Game, User.email
        ).join(User).filter(
            Game.name == game_id
        ).order_by(
            Game.personal_best.desc()
        ).limit(10).all()

        leaderboard = []
        for i, (game, user_email) in enumerate(top_games, 1):
            leaderboard.append({
                'rank': i,
                # Use part of email as display name
                'user_name': user_email.split('@')[0],
                'progress': game.progress,
                'personal_best': game.personal_best,
                'times_played': game.times_played
            })

        return jsonify({
            'success': True,
            'game_id': game_id,
            'leaderboard': leaderboard,
            'total_players': len(leaderboard)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching leaderboard: {str(e)}'
        }), 500


@api.route('/gamehub/stats', methods=['GET'])
@jwt_required()
def get_gamehub_stats():
    """Get overall gaming statistics for the user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        # Get user's game statistics
        total_games_played = Game.query.filter_by(user_id=user_id).count()
        completed_games = Game.query.filter_by(
            user_id=user_id).filter(Game.progress >= 100).count()

        # Calculate averages
        user_games = Game.query.filter_by(user_id=user_id).all()
        total_playtime = sum(game.total_time for game in user_games)
        avg_progress = sum(game.progress for game in user_games) / \
            len(user_games) if user_games else 0

        # Get favorite category (most played category)
        category_counts = {}
        game_categories = {
            'dance': 'cardio', 'ninja': 'strength', 'yoga': 'flexibility',
            'adventure': 'adventure', 'sports': 'sports', 'superhero': 'strength',
            'space': 'cardio', 'pirate': 'adventure', 'magic': 'flexibility',
            'racing': 'cardio', 'detective': 'mixed', 'rhythm': 'cardio'
        }

        for game in user_games:
            category = game_categories.get(game.name, 'mixed')
            category_counts[category] = category_counts.get(
                category, 0) + game.times_played

        favorite_category = max(category_counts.items(), key=lambda x: x[1])[
            0] if category_counts else 'cardio'

        return jsonify({
            'success': True,
            'stats': {
                'total_games_played': total_games_played,
                'completed_games': completed_games,
                'completion_rate': round((completed_games / total_games_played * 100), 2) if total_games_played > 0 else 0,
                'average_progress': round(avg_progress, 1),
                'total_playtime_minutes': total_playtime,
                'favorite_category': favorite_category,
                'category_breakdown': category_counts,
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
        favorites_only = request.args.get('favorites', type=bool)

        # Build query
        query = UserInventory.query.filter_by(
            user_id=user_id).join(InventoryItem)

        if category:
            query = query.filter(InventoryItem.category == category)
        if equipped_only:
            query = query.filter(UserInventory.is_equipped == True)
        if favorites_only:
            query = query.filter(UserInventory.is_favorite == True)

        query = query.order_by(UserInventory.acquired_at.desc())

        inventory_items = query.all()

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
        result = {
            'owned': [],
            'affordable': [],
            'locked': []
        }

        for item in available_items:
            item_data = item.serialize()

            # Check affordability
            can_afford_xp = user.xp >= item.xp_cost if item.xp_cost > 0 else True
            can_afford_coins = user.coins >= item.coin_cost if item.coin_cost > 0 else True
            can_afford_level = user.level >= item.level_required

            item_data['can_afford'] = can_afford_xp and can_afford_coins and can_afford_level
            item_data['user_level'] = user.level
            item_data['user_xp'] = user.xp
            item_data['user_coins'] = user.coins

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
        existing = UserInventory.query.filter_by(
            user_id=user_id, item_id=item_id).first()
        if existing:
            return jsonify({
                'success': False,
                'message': 'Item already owned'
            }), 409

        # Check level requirement
        if user.level < item.level_required:
            return jsonify({
                'success': False,
                'message': f'Level {item.level_required} required'
            }), 403

        # Check XP cost
        if item.xp_cost > 0 and user.xp < item.xp_cost:
            return jsonify({
                'success': False,
                'message': 'Insufficient XP'
            }), 403

        # Check coin cost
        if item.coin_cost > 0 and not user.can_afford(item.coin_cost):
            return jsonify({
                'success': False,
                'message': 'Insufficient coins'
            }), 403

        # Deduct costs
        if item.xp_cost > 0:
            user.xp -= item.xp_cost
        if item.coin_cost > 0:
            user.spend_coins(item.coin_cost)

        # Add to user inventory
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


@api.route('/inventory/<int:inventory_id>/equip', methods=['PATCH'])
@jwt_required()
def equip_item(inventory_id):
    """Equip or unequip an inventory item"""
    try:
        user_id = get_jwt_identity()
        inventory_item = UserInventory.query.filter_by(
            id=inventory_id,
            user_id=user_id
        ).first()

        if not inventory_item:
            return jsonify({
                'success': False,
                'message': 'Inventory item not found'
            }), 404

        # Toggle equipped status
        inventory_item.is_equipped = not inventory_item.is_equipped

        # If equipping, unequip other items in same category/subcategory
        if inventory_item.is_equipped and inventory_item.item.subcategory:
            UserInventory.query.filter_by(user_id=user_id).join(InventoryItem).filter(
                InventoryItem.subcategory == inventory_item.item.subcategory,
                UserInventory.id != inventory_id
            ).update({'is_equipped': False})

        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Item {"equipped" if inventory_item.is_equipped else "unequipped"}',
            'item': inventory_item.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating item: {str(e)}'
        }), 500


@api.route('/inventory/<int:inventory_id>/favorite', methods=['PATCH'])
@jwt_required()
def toggle_favorite(inventory_id):
    """Toggle favorite status of an inventory item"""
    try:
        user_id = get_jwt_identity()
        inventory_item = UserInventory.query.filter_by(
            id=inventory_id,
            user_id=user_id
        ).first()

        if not inventory_item:
            return jsonify({
                'success': False,
                'message': 'Inventory item not found'
            }), 404

        inventory_item.is_favorite = not inventory_item.is_favorite
        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Item {"added to" if inventory_item.is_favorite else "removed from"} favorites',
            'item': inventory_item.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating favorite: {str(e)}'
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
            ua.achievement_id: ua for ua in
            UserAchievement.query.filter_by(user_id=user_id).all()
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


@api.route('/achievements/check', methods=['POST'])
@jwt_required()
def check_achievements():
    """Check and award new achievements for user based on current progress"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Get user's current achievements
        user_achievements = {
            ua.achievement_id: ua for ua in
            UserAchievement.query.filter_by(user_id=user_id).all()
        }

        # Get user's game and task stats
        total_tasks = Task.query.filter_by(
            user_id=user_id, is_completed=True).count()
        total_games = Game.query.filter_by(user_id=user_id).count()
        completed_games = Game.query.filter_by(
            user_id=user_id).filter(Game.progress >= 100).count()
        total_playtime = sum(
            game.total_time for game in Game.query.filter_by(user_id=user_id).all())

        newly_earned = []

        # Check each available achievement
        for achievement in Achievement.query.filter_by(is_active=True):
            if achievement.id in user_achievements:
                continue  # Already have this achievement

            # Check if user meets requirements
            current_value = 0

            if achievement.requirement_type == 'level':
                current_value = user.level
            elif achievement.requirement_type == 'xp':
                current_value = user.xp
            elif achievement.requirement_type == 'tasks':
                current_value = total_tasks
            elif achievement.requirement_type == 'games':
                current_value = completed_games
            elif achievement.requirement_type == 'time_minutes':
                current_value = total_playtime
            elif achievement.requirement_type == 'streak_days':
                current_value = user.streak_days

            # Award achievement if requirement is met
            if current_value >= achievement.requirement_value:
                user_achievement = UserAchievement(
                    user_id=user_id,
                    achievement_id=achievement.id,
                    progress=achievement.requirement_value,
                    is_completed=True,
                    earned_at=datetime.utcnow()
                )
                db.session.add(user_achievement)

                # Award XP and coins
                if achievement.xp_reward > 0:
                    user.add_xp(achievement.xp_reward)
                if achievement.coin_reward > 0:
                    user.coins += achievement.coin_reward

                # Award item if specified
                if achievement.item_reward_id:
                    existing_item = UserInventory.query.filter_by(
                        user_id=user_id,
                        item_id=achievement.item_reward_id
                    ).first()

                    if not existing_item:
                        reward_item = UserInventory(
                            user_id=user_id,
                            item_id=achievement.item_reward_id
                        )
                        db.session.add(reward_item)

                newly_earned.append(achievement.serialize())

        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Checked achievements, {len(newly_earned)} newly earned',
            'newly_earned': newly_earned,
            'user_level': user.level,
            'user_xp': user.xp,
            'user_coins': user.coins
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error checking achievements: {str(e)}'
        }), 500


@api.route('/inventory/stats', methods=['GET'])
@jwt_required()
def get_inventory_stats():
    """Get inventory and achievement statistics"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        # Inventory stats
        total_items = UserInventory.query.filter_by(user_id=user_id).count()
        equipped_items = UserInventory.query.filter_by(
            user_id=user_id, is_equipped=True).count()
        favorite_items = UserInventory.query.filter_by(
            user_id=user_id, is_favorite=True).count()

        # Category breakdown
        category_stats = db.session.query(
            InventoryItem.category,
            db.func.count(UserInventory.id).label('count')
        ).join(UserInventory).filter(
            UserInventory.user_id == user_id
        ).group_by(InventoryItem.category).all()

        # Achievement stats
        total_achievements = Achievement.query.filter_by(
            is_active=True).count()
        completed_achievements = UserAchievement.query.filter_by(
            user_id=user_id,
            is_completed=True
        ).count()

        # User overview
        user_stats = {
            'level': user.level,
            'xp': user.xp,
            'coins': user.coins,
            'total_playtime': user.total_playtime,
            'streak_days': user.streak_days
        }

        return jsonify({
            'success': True,
            'stats': {
                'user': user_stats,
                'inventory': {
                    'total_items': total_items,
                    'equipped_items': equipped_items,
                    'favorite_items': favorite_items,
                    'categories': {cat: count for cat, count in category_stats}
                },
                'achievements': {
                    'total_achievements': total_achievements,
                    'completed_achievements': completed_achievements,
                    'completion_rate': round((completed_achievements / total_achievements * 100), 2) if total_achievements > 0 else 0
                }
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching stats: {str(e)}'
        }), 500


# ===============================
# USER PROFILE ENDPOINTS
# ===============================

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """Get complete user profile with stats"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Get user statistics
        total_tasks = Task.query.filter_by(user_id=user_id).count()
        completed_tasks = Task.query.filter_by(
            user_id=user_id, is_completed=True).count()
        total_games = Game.query.filter_by(user_id=user_id).count()
        completed_games = Game.query.filter_by(
            user_id=user_id).filter(Game.progress >= 100).count()
        total_items = UserInventory.query.filter_by(user_id=user_id).count()
        total_achievements = UserAchievement.query.filter_by(
            user_id=user_id, is_completed=True).count()

        profile_data = user.serialize()
        profile_data['stats'] = {
            'tasks': {
                'total': total_tasks,
                'completed': completed_tasks,
                'completion_rate': round((completed_tasks / total_tasks * 100), 2) if total_tasks > 0 else 0
            },
            'games': {
                'total': total_games,
                'completed': completed_games,
                'completion_rate': round((completed_games / total_games * 100), 2) if total_games > 0 else 0
            },
            'inventory': {
                'total_items': total_items
            },
            'achievements': {
                'total': total_achievements
            }
        }

        return jsonify({
            'success': True,
            'profile': profile_data
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching profile: {str(e)}'
        }), 500


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    """Update user profile information"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Update avatar fields if provided
        avatar_fields = [
            'avatar_style', 'avatar_seed', 'avatar_background_color',
            'avatar_theme', 'avatar_mood'
        ]

        for field in avatar_fields:
            if field in data:
                setattr(user, field, data[field])

        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'profile': user.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating profile: {str(e)}'
        }), 500"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
Includes Task Management, Game Hub, Inventory System, and Achievement tracking
"""


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    """Test endpoint to verify API is working"""
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


# ===============================
# TASK MANAGEMENT ENDPOINTS
# ===============================

@api.route('/tasks', methods=['GET'])
@jwt_required()
def get_user_tasks():
    """Get all tasks for the authenticated user"""
    try:
        user_id = get_jwt_identity()

        # Optional query parameters
        completed = request.args.get('completed', type=bool)
        limit = request.args.get('limit', type=int)

        # Build query
        query = Task.query.filter_by(user_id=user_id)

        if completed is not None:
            query = query.filter_by(is_completed=completed)

        query = query.order_by(Task.date.desc())

        if limit:
            query = query.limit(limit)

        tasks = query.all()

        return jsonify({
            'success': True,
            'tasks': [task.serialize() for task in tasks],
            'count': len(tasks)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching tasks: {str(e)}'
        }), 500


@api.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    """Create a new task"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate required fields
        if not data or not data.get('taskName'):
            return jsonify({
                'success': False,
                'message': 'Task name is required'
            }), 400

        # Create new task
        task = Task(
            task_name=data['taskName'],
            user_id=user_id,
            is_completed=data.get('isCompleted', False)
        )

        db.session.add(task)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Task created successfully',
            'task': task.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error creating task: {str(e)}'
        }), 500


@api.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get a specific task by ID"""
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()

        if not task:
            return jsonify({
                'success': False,
                'message': 'Task not found'
            }), 404

        return jsonify({
            'success': True,
            'task': task.serialize()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching task: {str(e)}'
        }), 500


@api.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Update a task"""
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()

        if not task:
            return jsonify({
                'success': False,
                'message': 'Task not found'
            }), 404

        data = request.get_json()

        # Update fields if provided
        if 'taskName' in data:
            task.task_name = data['taskName']
        if 'isCompleted' in data:
            task.is_completed = data['isCompleted']

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Task updated successfully',
            'task': task.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating task: {str(e)}'
        }), 500


@api.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Delete a task"""
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()

        if not task:
            return jsonify({
                'success': False,
                'message': 'Task not found'
            }), 404

        db.session.delete(task)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Task deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error deleting task: {str(e)}'
        }), 500


@api.route('/tasks/<int:task_id>/toggle', methods=['PATCH'])
@jwt_required()
def toggle_task_completion(task_id):
    """Toggle task completion status"""
    try:
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()

        if not task:
            return jsonify({
                'success': False,
                'message': 'Task not found'
            }), 404

        new_status = task.toggle_completion()

        # Award XP for completing task
        if new_status:  # Task was completed
            user = User.query.get(user_id)
            if user:
                level_up = user.add_xp(25)  # Award 25 XP for task completion

        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Task marked as {"completed" if new_status else "incomplete"}',
            'task': task.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error toggling task: {str(e)}'
        }), 500


@api.route('/tasks/stats', methods=['GET'])
@jwt_required()
def get_task_stats():
    """Get task statistics for the user"""
    try:
        user_id = get_jwt_identity()

        total_tasks = Task.query.filter_by(user_id=user_id).count()
        completed_tasks = Task.query.filter_by(
            user_id=user_id, is_completed=True).count()
        pending_tasks = total_tasks - completed_tasks

        completion_rate = (completed_tasks / total_tasks *
                           100) if total_tasks > 0 else 0

        return jsonify({
            'success': True,
            'stats': {
                'totalTasks': total_tasks,
                'completedTasks': completed_tasks,
                'pendingTasks': pending_tasks,
                'completionRate': round(completion_rate, 2)
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching stats: {str(e)}'
        }), 500


# ===============================
# BASIC GAME ENDPOINTS (Original)
# ===============================

@api.route('/games', methods=['GET'])
@jwt_required()
def get_user_games():
    """Get all games for the authenticated user"""
    try:
        user_id = get_jwt_identity()

        # Optional query parameters
        completed = request.args.get('completed', type=bool)
        limit = request.args.get('limit', type=int)

        # Build query
        query = Game.query.filter_by(user_id=user_id)

        if completed is not None:
            if completed:
                query = query.filter(Game.progress >= 100)
            else:
                query = query.filter(Game.progress < 100)

        query = query.order_by(Game.updated_at.desc())

        if limit:
            query = query.limit(limit)

        games = query.all()

        return jsonify({
            'success': True,
            'games': [game.serialize() for game in games],
            'count': len(games)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching games: {str(e)}'
        }), 500


@api.route('/games', methods=['POST'])
@jwt_required()
def create_game():
