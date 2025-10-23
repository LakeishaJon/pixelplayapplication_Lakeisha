"""
PixelPlay Inventory & Achievements API Routes (Flask)
Backend endpoints for managing inventory items and achievements
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_required
from datetime import datetime
import json
from api.models import db, User, UserProgress, UnlockedItem, ItemCatalog

# Create Blueprint
inventory_bp = Blueprint('inventory', __name__)

# ===================================
# 📦 INVENTORY DATA (Catalog)
# ===================================

# Default item catalog - can be stored in database too
DEFAULT_ITEMS = [
    {
        'id': 1,
        'name': 'Cool Sunglasses',
        'category': 'accessories',
        'icon': '🕶️',
        'price': 100,
        'levelRequired': 1,
        'rarity': 'common',
        'description': 'Look cool while working out'
    },
    {
        'id': 2,
        'name': 'Red Cap',
        'category': 'clothing',
        'icon': '🧢',
        'price': 50,
        'levelRequired': 1,
        'rarity': 'common',
        'description': 'A stylish red baseball cap'
    },
    {
        'id': 3,
        'name': 'Blue T-Shirt',
        'category': 'clothing',
        'icon': '👕',
        'price': 75,
        'levelRequired': 1,
        'rarity': 'common',
        'description': 'Comfortable workout shirt'
    },
    {
        'id': 4,
        'name': 'Sneakers',
        'category': 'clothing',
        'icon': '👟',
        'price': 150,
        'levelRequired': 3,
        'rarity': 'rare',
        'description': 'High-performance running shoes'
    },
    {
        'id': 5,
        'name': 'Backpack',
        'category': 'accessories',
        'icon': '🎒',
        'price': 200,
        'levelRequired': 5,
        'rarity': 'rare',
        'description': 'Carry all your gear'
    },
    {
        'id': 6,
        'name': 'Watch',
        'category': 'accessories',
        'icon': '⌚',
        'price': 300,
        'levelRequired': 7,
        'rarity': 'epic',
        'description': 'Track your workout stats'
    },
    {
        'id': 7,
        'name': 'Hoodie',
        'category': 'clothing',
        'icon': '🧥',
        'price': 125,
        'levelRequired': 4,
        'rarity': 'rare',
        'description': 'Warm and comfy'
    },
    {
        'id': 8,
        'name': 'Crown',
        'category': 'accessories',
        'icon': '👑',
        'price': 500,
        'levelRequired': 10,
        'rarity': 'legendary',
        'description': 'For fitness royalty only'
    },
    {
        'id': 9,
        'name': 'Headphones',
        'category': 'accessories',
        'icon': '🎧',
        'price': 180,
        'levelRequired': 6,
        'rarity': 'rare',
        'description': 'Perfect workout music'
    },
    {
        'id': 10,
        'name': 'Gym Bag',
        'category': 'accessories',
        'icon': '👜',
        'price': 220,
        'levelRequired': 8,
        'rarity': 'epic',
        'description': 'Professional gym bag'
    }
]

# Achievement definitions
DEFAULT_ACHIEVEMENTS = [
    {
        'id': 1,
        'name': 'First Steps',
        'description': 'Complete your first workout',
        'icon': '🏃',
        'reward': 50,
        'target': 1,
        'category': 'workouts'
    },
    {
        'id': 2,
        'name': 'Week Warrior',
        'description': 'Work out 7 days in a row',
        'icon': '🔥',
        'reward': 100,
        'target': 7,
        'category': 'streak'
    },
    {
        'id': 3,
        'name': 'Avatar Creator',
        'description': 'Create 5 unique avatars',
        'icon': '🎨',
        'reward': 150,
        'target': 5,
        'category': 'avatars'
    },
    {
        'id': 4,
        'name': 'Century Club',
        'description': 'Complete 100 workouts',
        'icon': '💯',
        'reward': 500,
        'target': 100,
        'category': 'workouts'
    },
    {
        'id': 5,
        'name': 'Marathon Master',
        'description': 'Run 26 miles total',
        'icon': '🏅',
        'reward': 300,
        'target': 26,
        'category': 'distance'
    },
    {
        'id': 6,
        'name': 'Strength Supreme',
        'description': 'Complete 50 strength workouts',
        'icon': '💪',
        'reward': 250,
        'target': 50,
        'category': 'strength'
    },
    {
        'id': 7,
        'name': 'Level Up Legend',
        'description': 'Reach level 10',
        'icon': '⭐',
        'reward': 1000,
        'target': 10,
        'category': 'level'
    },
    {
        'id': 8,
        'name': 'Fashionista',
        'description': 'Unlock 10 items',
        'icon': '👗',
        'reward': 200,
        'target': 10,
        'category': 'items'
    }
]


# ===================================
# 📦 PUBLIC INVENTORY ENDPOINTS (No Auth Required)
# ===================================

@inventory_bp.route('/inventory', methods=['GET'])
def get_inventory():
    """
    Get inventory items - Returns all items with ownership status if logged in
    NO AUTHENTICATION REQUIRED - Public endpoint
    """
    try:
        # Try to get user ID if they're logged in (optional)
        user_id = None
        try:
            from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass  # User not logged in, that's okay

        items = DEFAULT_ITEMS.copy()

        # If user is logged in, mark owned items
        if user_id:
            owned_items = UnlockedItem.query.filter_by(user_id=user_id).all()
            owned_ids = {item.item_catalog_id for item in owned_items if hasattr(item, 'item_catalog_id')}
            
            for item in items:
                item['owned'] = item['id'] in owned_ids
                item['equipped'] = False  # TODO: Track equipped status
        else:
            # Not logged in - mark nothing as owned
            for item in items:
                item['owned'] = False
                item['equipped'] = False

        return jsonify({
            'success': True,
            'items': items,
            'total': len(items),
            'authenticated': user_id is not None
        }), 200

    except Exception as e:
        print(f"❌ Error fetching inventory: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching inventory',
            'items': DEFAULT_ITEMS  # Return default items as fallback
        }), 500


@inventory_bp.route('/achievements', methods=['GET'])
def get_achievements():
    """
    Get achievements - Returns all achievements with progress if logged in
    NO AUTHENTICATION REQUIRED - Public endpoint
    """
    try:
        # Try to get user ID if they're logged in (optional)
        user_id = None
        try:
            from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass  # User not logged in, that's okay

        achievements = []
        
        for achievement in DEFAULT_ACHIEVEMENTS:
            ach_data = achievement.copy()
            
            if user_id:
                # Get user progress
                progress = UserProgress.query.filter_by(user_id=user_id).first()
                
                if progress:
                    # Calculate progress based on category
                    current = 0
                    target = achievement['target']
                    
                    if achievement['category'] == 'workouts':
                        current = min(progress.total_points // 10, target)  # Rough estimate
                    elif achievement['category'] == 'avatars':
                        current = progress.avatars_created
                    elif achievement['category'] == 'level':
                        current = progress.level
                    elif achievement['category'] == 'items':
                        current = progress.items_unlocked
                    elif achievement['category'] == 'streak':
                        current = progress.streak_days
                    else:
                        current = 0
                    
                    ach_data['progress'] = min(int((current / target) * 100), 100)
                    ach_data['unlocked'] = current >= target
                else:
                    ach_data['progress'] = 0
                    ach_data['unlocked'] = False
            else:
                # Not logged in - show 0 progress
                ach_data['progress'] = 0
                ach_data['unlocked'] = False
            
            achievements.append(ach_data)

        return jsonify({
            'success': True,
            'achievements': achievements,
            'total': len(achievements),
            'authenticated': user_id is not None
        }), 200

    except Exception as e:
        print(f"❌ Error fetching achievements: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching achievements',
            'achievements': DEFAULT_ACHIEVEMENTS  # Return default as fallback
        }), 500


# ===================================
# 🔒 AUTHENTICATED ENDPOINTS
# ===================================

@inventory_bp.route('/inventory/my-items', methods=['GET'])
@jwt_required()
def get_my_items():
    """Get only items owned by the logged-in user"""
    try:
        user_id = get_jwt_identity()
        
        # Get user's unlocked items
        unlocked_items = UnlockedItem.query.filter_by(user_id=user_id).all()
        
        # Build list of owned items
        owned_items = []
        for unlocked in unlocked_items:
            # Find the item in catalog
            item = next((i for i in DEFAULT_ITEMS if i['id'] == unlocked.item_catalog_id), None)
            if item:
                item_data = item.copy()
                item_data['owned'] = True
                item_data['equipped'] = False  # TODO: Track equipped status
                item_data['unlocked_at'] = unlocked.unlocked_at.isoformat()
                owned_items.append(item_data)
        
        return jsonify({
            'success': True,
            'items': owned_items,
            'total': len(owned_items)
        }), 200

    except Exception as e:
        print(f"❌ Error fetching user items: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching your items'
        }), 500


@inventory_bp.route('/inventory/purchase/<int:item_id>', methods=['POST'])
@jwt_required()
def purchase_item(item_id):
    """Purchase an item from the shop"""
    try:
        user_id = get_jwt_identity()
        
        # Find the item
        item = next((i for i in DEFAULT_ITEMS if i['id'] == item_id), None)
        if not item:
            return jsonify({
                'success': False,
                'message': 'Item not found'
            }), 404
        
        # Get user progress
        progress = UserProgress.query.filter_by(user_id=user_id).first()
        if not progress:
            return jsonify({
                'success': False,
                'message': 'User progress not found'
            }), 404
        
        # Check level requirement
        if progress.level < item['levelRequired']:
            return jsonify({
                'success': False,
                'message': f"Level {item['levelRequired']} required"
            }), 403
        
        # Check if user has enough points
        if progress.total_points < item['price']:
            return jsonify({
                'success': False,
                'message': f"Not enough coins. Need {item['price']}, have {progress.total_points}"
            }), 403
        
        # Check if already owned
        existing = UnlockedItem.query.filter_by(
            user_id=user_id,
            item_catalog_id=item_id
        ).first()
        
        if existing:
            return jsonify({
                'success': False,
                'message': 'Item already owned'
            }), 400
        
        # Purchase the item
        progress.total_points -= item['price']
        progress.items_unlocked += 1
        
        # Create unlocked item record
        new_item = UnlockedItem(
            user_id=user_id,
            item_catalog_id=item_id,
            unlock_method='purchase'
        )
        
        db.session.add(new_item)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f"Successfully purchased {item['name']}!",
            'remaining_points': progress.total_points,
            'item': item
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error purchasing item: {e}")
        return jsonify({
            'success': False,
            'message': 'Error purchasing item'
        }), 500


@inventory_bp.route('/inventory/equip/<int:item_id>', methods=['POST'])
@jwt_required()
def equip_item(item_id):
    """Equip an owned item"""
    try:
        user_id = get_jwt_identity()
        
        # Check if user owns the item
        unlocked = UnlockedItem.query.filter_by(
            user_id=user_id,
            item_catalog_id=item_id
        ).first()
        
        if not unlocked:
            return jsonify({
                'success': False,
                'message': 'You do not own this item'
            }), 404
        
        # TODO: Implement equipped status in database
        # For now, just return success
        
        return jsonify({
            'success': True,
            'message': 'Item equipped successfully'
        }), 200

    except Exception as e:
        print(f"❌ Error equipping item: {e}")
        return jsonify({
            'success': False,
            'message': 'Error equipping item'
        }), 500


# ===================================
# 🏆 ACHIEVEMENT ENDPOINTS
# ===================================

@inventory_bp.route('/achievements/claim/<int:achievement_id>', methods=['POST'])
@jwt_required()
def claim_achievement(achievement_id):
    """Claim reward for a completed achievement"""
    try:
        user_id = get_jwt_identity()
        
        # Find the achievement
        achievement = next((a for a in DEFAULT_ACHIEVEMENTS if a['id'] == achievement_id), None)
        if not achievement:
            return jsonify({
                'success': False,
                'message': 'Achievement not found'
            }), 404
        
        # Get user progress
        progress = UserProgress.query.filter_by(user_id=user_id).first()
        if not progress:
            return jsonify({
                'success': False,
                'message': 'User progress not found'
            }), 404
        
        # Check if achievement is completed
        # TODO: Track claimed achievements in database
        
        # Add reward points
        progress.total_points += achievement['reward']
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f"Claimed {achievement['reward']} coins!",
            'total_points': progress.total_points
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error claiming achievement: {e}")
        return jsonify({
            'success': False,
            'message': 'Error claiming achievement'
        }), 500


# ===================================
# 📊 STATS ENDPOINT
# ===================================

@inventory_bp.route('/inventory/stats', methods=['GET'])
@jwt_required()
def get_inventory_stats():
    """Get inventory statistics for the user"""
    try:
        user_id = get_jwt_identity()
        
        # Get user progress
        progress = UserProgress.query.filter_by(user_id=user_id).first()
        
        # Count owned items
        owned_count = UnlockedItem.query.filter_by(user_id=user_id).count()
        
        # Count achievements
        achievements_unlocked = 0
        for achievement in DEFAULT_ACHIEVEMENTS:
            if progress:
                current = 0
                target = achievement['target']
                
                if achievement['category'] == 'level':
                    current = progress.level
                elif achievement['category'] == 'avatars':
                    current = progress.avatars_created
                elif achievement['category'] == 'items':
                    current = progress.items_unlocked
                
                if current >= target:
                    achievements_unlocked += 1
        
        return jsonify({
            'success': True,
            'stats': {
                'level': progress.level if progress else 1,
                'total_points': progress.total_points if progress else 0,
                'items_owned': owned_count,
                'achievements_unlocked': achievements_unlocked,
                'avatars_created': progress.avatars_created if progress else 0
            }
        }), 200

    except Exception as e:
        print(f"❌ Error fetching stats: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching stats'
        }), 500


# ===================================
# 🛠️ ADMIN/TESTING ENDPOINTS
# ===================================

@inventory_bp.route('/inventory/seed', methods=['POST'])
def seed_item_catalog():
    """Seed the item catalog (development only)"""
    try:
        # Check if items already exist
        existing_count = ItemCatalog.query.count()
        if existing_count > 0:
            return jsonify({
                'success': False,
                'message': f'Catalog already has {existing_count} items'
            }), 400
        
        # Add default items to catalog
        for item_data in DEFAULT_ITEMS:
            item = ItemCatalog(
                id=item_data['id'],
                item_name=item_data['name'],
                item_category=item_data['category'],
                item_value=item_data['icon'],
                unlock_cost=item_data['price'],
                unlock_level=item_data['levelRequired'],
                rarity=item_data['rarity'],
                is_default=False,
                avatar_style='all'  # Works with all avatar styles
            )
            db.session.add(item)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Successfully seeded {len(DEFAULT_ITEMS)} items'
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error seeding catalog: {e}")
        return jsonify({
            'success': False,
            'message': 'Error seeding catalog'
        }), 500