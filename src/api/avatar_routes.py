# 🎮 PixelPlay Avatar API Routes (Flask)
# Backend endpoints for managing avatars and items

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import json
from api.models import db, UserAvatar, UnlockedItem, UserProgress, ItemCatalog, SavedAvatarPreset

# Create Blueprint
avatar_bp = Blueprint('avatar', __name__, url_prefix='/api/avatar')
items_bp = Blueprint('items', __name__, url_prefix='/api/items')
progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')
presets_bp = Blueprint('presets', __name__, url_prefix='/api/presets')

# ===================================
# 🎨 AVATAR ENDPOINTS
# ===================================


@avatar_bp.route('/current', methods=['GET'])
@jwt_required()
def get_current_avatar():
    """Get user's current avatar configuration"""
    try:
        user_id = get_jwt_identity()

        avatar = UserAvatar.query.filter_by(
            user_id=user_id,
            is_current=True
        ).first()

        if not avatar:
            return jsonify({
                'success': False,
                'message': 'No avatar found'
            }), 404

        return jsonify({
            'success': True,
            'avatar': {
                'style': avatar.avatar_style,
                'seed': avatar.avatar_seed,
                'options': json.loads(avatar.avatar_options)
            }
        }), 200

    except Exception as e:
        print(f"Error fetching avatar: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching avatar'
        }), 500


@avatar_bp.route('/save', methods=['POST'])
@jwt_required()
def save_avatar():
    """Save/update user's avatar"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        style = data.get('style')
        seed = data.get('seed')
        options = data.get('options')

        # Validate input
        if not style or not seed or not options:
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400

        # Mark all other avatars as not current
        UserAvatar.query.filter_by(
            user_id=user_id).update({'is_current': False})

        # Create new avatar
        new_avatar = UserAvatar(
            user_id=user_id,
            avatar_style=style,
            avatar_seed=seed,
            avatar_options=json.dumps(options),
            is_current=True
        )

        db.session.add(new_avatar)

        # Update progress
        progress = UserProgress.query.filter_by(user_id=user_id).first()
        if progress:
            progress.avatars_created += 1
        else:
            # Create progress if doesn't exist
            progress = UserProgress(user_id=user_id, avatars_created=1)
            db.session.add(progress)

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Avatar saved successfully',
            'avatar_id': new_avatar.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error saving avatar: {e}")
        return jsonify({
            'success': False,
            'message': 'Error saving avatar'
        }), 500


@avatar_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_avatar():
    """Update current avatar options"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        options = data.get('options')

        if not options:
            return jsonify({
                'success': False,
                'message': 'Missing options'
            }), 400

        avatar = UserAvatar.query.filter_by(
            user_id=user_id,
            is_current=True
        ).first()

        if not avatar:
            return jsonify({
                'success': False,
                'message': 'No current avatar found'
            }), 404

        avatar.avatar_options = json.dumps(options)
        avatar.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Avatar updated successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating avatar: {e}")
        return jsonify({
            'success': False,
            'message': 'Error updating avatar'
        }), 500


# ===================================
# 📦 ITEMS ENDPOINTS
# ===================================

@items_bp.route('/unlocked', methods=['GET'])
@jwt_required()
def get_unlocked_items():
    """Get all items user has unlocked"""
    try:
        user_id = get_jwt_identity()
        style = request.args.get('style')

        query = UnlockedItem.query.filter_by(user_id=user_id)

        if style:
            query = query.filter_by(avatar_style=style)

        items = query.all()

        # Organize items by category
        organized = {}
        for item in items:
            if item.item_category not in organized:
                organized[item.item_category] = []

            # Get item details from catalog
            catalog_item = ItemCatalog.query.filter_by(
                avatar_style=item.avatar_style,
                item_category=item.item_category,
                item_value=item.item_value
            ).first()

            organized[item.item_category].append({
                'value': item.item_value,
                'name': catalog_item.item_name if catalog_item else item.item_value,
                'rarity': catalog_item.rarity if catalog_item else 'common',
                'unlocked_at': item.unlocked_at.isoformat()
            })

        return jsonify({
            'success': True,
            'items': organized,
            'total_items': len(items)
        }), 200

    except Exception as e:
        print(f"Error fetching unlocked items: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching items'
        }), 500


@items_bp.route('/unlock', methods=['POST'])
@jwt_required()
def unlock_item():
    """Unlock a new item for user"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        style = data.get('style')
        category = data.get('category')
        value = data.get('value')
        unlock_method = data.get('unlockMethod', 'purchase')

        # Validate input
        if not all([style, category, value]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400

        # Check if item exists in catalog
        catalog_item = ItemCatalog.query.filter_by(
            avatar_style=style,
            item_category=category,
            item_value=value
        ).first()

        if not catalog_item:
            return jsonify({
                'success': False,
                'message': 'Item not found in catalog'
            }), 404

        # Check if user meets requirements
        progress = UserProgress.query.filter_by(user_id=user_id).first()

        if not progress:
            return jsonify({
                'success': False,
                'message': 'User progress not found'
            }), 404

        if progress.level < catalog_item.unlock_level:
            return jsonify({
                'success': False,
                'message': f'Level {catalog_item.unlock_level} required'
            }), 403

        if progress.total_points < catalog_item.unlock_cost:
            return jsonify({
                'success': False,
                'message': f'{catalog_item.unlock_cost} points required'
            }), 403

        # Check if already unlocked
        existing = UnlockedItem.query.filter_by(
            user_id=user_id,
            avatar_style=style,
            item_category=category,
            item_value=value
        ).first()

        if existing:
            return jsonify({
                'success': False,
                'message': 'Item already unlocked'
            }), 400

        # Unlock the item
        new_item = UnlockedItem(
            user_id=user_id,
            avatar_style=style,
            item_category=category,
            item_value=value,
            unlocked_by=unlock_method
        )
        db.session.add(new_item)

        # Deduct points if purchased
        if catalog_item.unlock_cost > 0:
            progress.total_points -= catalog_item.unlock_cost

        # Update items unlocked count
        progress.items_unlocked = UnlockedItem.query.filter_by(
            user_id=user_id).count() + 1

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Item unlocked successfully',
            'item': {
                'name': catalog_item.item_name,
                'rarity': catalog_item.rarity
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error unlocking item: {e}")
        return jsonify({
            'success': False,
            'message': 'Error unlocking item'
        }), 500


@items_bp.route('/catalog', methods=['GET'])
@jwt_required()
def get_catalog():
    """Get available items from catalog (for shop)"""
    try:
        user_id = get_jwt_identity()
        style = request.args.get('style')

        # Get user's current level
        progress = UserProgress.query.filter_by(user_id=user_id).first()
        user_level = progress.level if progress else 1

        # Build query
        query = ItemCatalog.query.filter(
            ItemCatalog.unlock_level <= user_level
        )

        if style:
            query = query.filter_by(avatar_style=style)

        catalog_items = query.order_by(
            ItemCatalog.unlock_level,
            ItemCatalog.rarity,
            ItemCatalog.item_name
        ).all()

        # Get unlocked items
        unlocked = UnlockedItem.query.filter_by(user_id=user_id).all()
        unlocked_set = {
            (item.avatar_style, item.item_category, item.item_value)
            for item in unlocked
        }

        # Format response
        items = [{
            'id': item.id,
            'style': item.avatar_style,
            'category': item.item_category,
            'value': item.item_value,
            'name': item.item_name,
            'unlock_level': item.unlock_level,
            'unlock_cost': item.unlock_cost,
            'rarity': item.rarity,
            'is_default': bool(item.is_default),
            'is_unlocked': (item.avatar_style, item.item_category, item.item_value) in unlocked_set
        } for item in catalog_items]

        return jsonify({
            'success': True,
            'items': items
        }), 200

    except Exception as e:
        print(f"Error fetching catalog: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching catalog'
        }), 500


# ===================================
# 📊 PROGRESS ENDPOINTS
# ===================================

@progress_bp.route('/', methods=['GET'])
@jwt_required()
def get_progress():
    """Get user's progress and stats"""
    try:
        user_id = get_jwt_identity()

        progress = UserProgress.query.filter_by(user_id=user_id).first()

        if not progress:
            # Initialize progress if doesn't exist
            progress = UserProgress(user_id=user_id)
            db.session.add(progress)
            db.session.commit()

        return jsonify({
            'success': True,
            'progress': {
                'total_points': progress.total_points,
                'level': progress.level,
                'experience_points': progress.experience_points,
                'avatars_created': progress.avatars_created,
                'items_unlocked': progress.items_unlocked,
                'streak_days': progress.streak_days
            }
        }), 200

    except Exception as e:
        print(f"Error fetching progress: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching progress'
        }), 500


@progress_bp.route('/points', methods=['POST'])
@jwt_required()
def add_points():
    """Add points to user's progress"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        points = data.get('points')
        reason = data.get('reason', 'game_reward')

        if not points or points <= 0:
            return jsonify({
                'success': False,
                'message': 'Invalid points value'
            }), 400

        progress = UserProgress.query.filter_by(user_id=user_id).first()

        if not progress:
            progress = UserProgress(user_id=user_id)
            db.session.add(progress)

        # Add points and experience
        progress.total_points += points
        progress.experience_points += points

        # Check for level up (100 XP per level)
        current_level = progress.level
        xp_needed = current_level * 100
        leveled_up = False
        new_level = current_level

        if progress.experience_points >= xp_needed:
            new_level = (progress.experience_points // 100) + 1
            progress.level = new_level
            leveled_up = True

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Points added successfully',
            'points_added': points,
            'total_points': progress.total_points,
            'leveled_up': leveled_up,
            'new_level': new_level
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error adding points: {e}")
        return jsonify({
            'success': False,
            'message': 'Error adding points'
        }), 500


# ===================================
# 💾 PRESETS ENDPOINTS
# ===================================

@presets_bp.route('/', methods=['GET'])
@jwt_required()
def get_presets():
    """Get user's saved avatar presets"""
    try:
        user_id = get_jwt_identity()

        presets = SavedAvatarPreset.query.filter_by(
            user_id=user_id
        ).order_by(SavedAvatarPreset.created_at.desc()).all()

        formatted = [{
            'id': preset.id,
            'name': preset.preset_name,
            'style': preset.avatar_style,
            'seed': preset.avatar_seed,
            'options': json.loads(preset.avatar_options),
            'created_at': preset.created_at.isoformat()
        } for preset in presets]

        return jsonify({
            'success': True,
            'presets': formatted
        }), 200

    except Exception as e:
        print(f"Error fetching presets: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching presets'
        }), 500


@presets_bp.route('/save', methods=['POST'])
@jwt_required()
def save_preset():
    """Save a new avatar preset"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        name = data.get('name')
        style = data.get('style')
        seed = data.get('seed')
        options = data.get('options')

        if not all([name, style, seed, options]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400

        preset = SavedAvatarPreset(
            user_id=user_id,
            preset_name=name,
            avatar_style=style,
            avatar_seed=seed,
            avatar_options=json.dumps(options)
        )

        db.session.add(preset)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Preset saved successfully',
            'preset_id': preset.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error saving preset: {e}")
        return jsonify({
            'success': False,
            'message': 'Error saving preset'
        }), 500


@presets_bp.route('/<int:preset_id>', methods=['DELETE'])
@jwt_required()
def delete_preset(preset_id):
    """Delete a saved preset"""
    try:
        user_id = get_jwt_identity()

        preset = SavedAvatarPreset.query.filter_by(
            id=preset_id,
            user_id=user_id
        ).first()

        if not preset:
            return jsonify({
                'success': False,
                'message': 'Preset not found'
            }), 404

        db.session.delete(preset)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Preset deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting preset: {e}")
        return jsonify({
            'success': False,
            'message': 'Error deleting preset'
        }), 500
