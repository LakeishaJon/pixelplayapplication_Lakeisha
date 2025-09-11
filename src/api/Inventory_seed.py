"""
Seed script for populating inventory items and achievements.
Run this script to add sample data to your PixelPlay database.
"""

from api.models import db, InventoryItem, Achievement
from datetime import datetime


def seed_inventory_items():
    """Add sample inventory items to the database"""

    # Clothing items
    clothing_items = [
        # Superhero theme
        {
            'name': 'Superhero Cape',
            'description': 'A flowing cape that makes you feel heroic!',
            'category': 'clothing',
            'subcategory': 'cape',
            'rarity': 'epic',
            'xp_cost': 200,
            'level_required': 5,
            'color': '#DC2626',
            'icon': '🦸‍♂️'
        },
        {
            'name': 'Hero Mask',
            'description': 'Protect your secret identity!',
            'category': 'clothing',
            'subcategory': 'mask',
            'rarity': 'rare',
            'xp_cost': 100,
            'level_required': 3,
            'color': '#1F2937',
            'icon': '🎭'
        },

        # Athletic wear
        {
            'name': 'Golden Sneakers',
            'description': 'Run faster than the wind!',
            'category': 'clothing',
            'subcategory': 'shoes',
            'rarity': 'legendary',
            'xp_cost': 500,
            'level_required': 10,
            'color': '#FFD700',
            'icon': '👟'
        },
        {
            'name': 'Power Gloves',
            'description': 'Extra grip for all your exercises!',
            'category': 'clothing',
            'subcategory': 'gloves',
            'rarity': 'rare',
            'xp_cost': 150,
            'level_required': 4,
            'color': '#7C3AED',
            'icon': '🧤'
        },
        {
            'name': 'Champion Headband',
            'description': 'Keep sweat out of your eyes like a pro!',
            'category': 'clothing',
            'subcategory': 'headband',
            'rarity': 'common',
            'xp_cost': 50,
            'level_required': 2,
            'color': '#059669',
            'icon': '🏃‍♂️'
        },

        # Fun costumes
        {
            'name': 'Ninja Outfit',
            'description': 'Stealth mode activated!',
            'category': 'clothing',
            'subcategory': 'outfit',
            'rarity': 'epic',
            'xp_cost': 300,
            'level_required': 7,
            'color': '#374151',
            'icon': '🥷'
        },
        {
            'name': 'Dragon Wings',
            'description': 'Mythical wings for legendary workouts!',
            'category': 'clothing',
            'subcategory': 'wings',
            'rarity': 'legendary',
            'xp_cost': 800,
            'level_required': 15,
            'color': '#EF4444',
            'icon': '🐉'
        },
    ]

    # Accessories
    accessory_items = [
        {
            'name': 'Fitness Tracker',
            'description': 'Keep track of all your progress!',
            'category': 'accessory',
            'subcategory': 'watch',
            'rarity': 'rare',
            'xp_cost': 120,
            'level_required': 3,
            'color': '#059669',
            'icon': '⌚'
        },
        {
            'name': 'Champion Crown',
            'description': 'For true fitness royalty!',
            'category': 'accessory',
            'subcategory': 'crown',
            'rarity': 'legendary',
            'xp_cost': 600,
            'level_required': 12,
            'color': '#FFD700',
            'icon': '👑'
        },
        {
            'name': 'Cool Sunglasses',
            'description': 'Look awesome while working out!',
            'category': 'accessory',
            'subcategory': 'glasses',
            'rarity': 'common',
            'xp_cost': 75,
            'level_required': 2,
            'color': '#1F2937',
            'icon': '🕶️'
        },
        {
            'name': 'Magic Amulet',
            'description': 'Gives you extra motivation!',
            'category': 'accessory',
            'subcategory': 'jewelry',
            'rarity': 'epic',
            'xp_cost': 250,
            'level_required': 6,
            'color': '#7C3AED',
            'icon': '🔮'
        }
    ]

    # Power-ups
    powerup_items = [
        {
            'name': 'Energy Boost',
            'description': 'Extra energy for your next workout!',
            'category': 'power-up',
            'subcategory': 'energy',
            'rarity': 'common',
            'xp_cost': 25,
            'level_required': 1,
            'color': '#F59E0B',
            'icon': '⚡'
        },
        {
            'name': 'XP Multiplier',
            'description': 'Double XP for 24 hours!',
            'category': 'power-up',
            'subcategory': 'multiplier',
            'rarity': 'rare',
            'xp_cost': 200,
            'level_required': 5,
            'color': '#8B5CF6',
            'icon': '✨'
        },
        {
            'name': 'Super Strength Potion',
            'description': 'Feel extra strong during workouts!',
            'category': 'power-up',
            'subcategory': 'potion',
            'rarity': 'epic',
            'xp_cost': 300,
            'level_required': 8,
            'color': '#DC2626',
            'icon': '🧪'
        }
    ]

    # Badge items (special achievements)
    badge_items = [
        {
            'name': 'First Workout Badge',
            'description': 'Commemorates your very first workout!',
            'category': 'badge',
            'subcategory': 'milestone',
            'rarity': 'common',
            'xp_cost': 0,  # Earned through achievements
            'level_required': 1,
            'color': '#059669',
            'icon': '🏅',
            'is_unlockable': False  # Only earned through achievements
        },
        {
            'name': 'Week Warrior Badge',
            'description': 'Worked out every day for a week!',
            'category': 'badge',
            'subcategory': 'streak',
            'rarity': 'rare',
            'xp_cost': 0,
            'level_required': 1,
            'color': '#7C3AED',
            'icon': '🏆',
            'is_unlockable': False
        },
        {
            'name': 'Fitness Legend Badge',
            'description': 'Reached the highest level of fitness mastery!',
            'category': 'badge',
            'subcategory': 'legend',
            'rarity': 'legendary',
            'xp_cost': 0,
            'level_required': 1,
            'color': '#FFD700',
            'icon': '🌟',
            'is_unlockable': False
        }
    ]

    all_items = clothing_items + accessory_items + powerup_items + badge_items

    for item_data in all_items:
        # Check if item already exists
        existing_item = InventoryItem.query.filter_by(
            name=item_data['name']).first()
        if not existing_item:
            item = InventoryItem(**item_data)
            db.session.add(item)

    db.session.commit()
    print(f"✅ Added {len(all_items)} inventory items to database")


def seed_achievements():
    """Add sample achievements to the database"""

    achievements_data = [
        # Fitness achievements
        {
            'name': 'First Steps',
            'description': 'Complete your very first workout!',
            'category': 'fitness',
            'requirement_type': 'workouts',
            'requirement_value': 1,
            'xp_reward': 50,
            'icon': '🚀',
            'color': '#059669',
            'rarity': 'common'
        },
        {
            'name': 'Workout Warrior',
            'description': 'Complete 10 workouts',
            'category': 'fitness',
            'requirement_type': 'workouts',
            'requirement_value': 10,
            'xp_reward': 100,
            'icon': '💪',
            'color': '#7C3AED',
            'rarity': 'rare'
        },
        {
            'name': 'Fitness Master',
            'description': 'Complete 50 workouts',
            'category': 'fitness',
            'requirement_type': 'workouts',
            'requirement_value': 50,
            'xp_reward': 300,
            'icon': '🏆',
            'color': '#FFD700',
            'rarity': 'epic'
        },

        # Level achievements
        {
            'name': 'Level Up!',
            'description': 'Reach level 5',
            'category': 'milestone',
            'requirement_type': 'level',
            'requirement_value': 5,
            'xp_reward': 100,
            'icon': '📈',
            'color': '#3B82F6',
            'rarity': 'common'
        },
        {
            'name': 'Rising Star',
            'description': 'Reach level 10',
            'category': 'milestone',
            'requirement_type': 'level',
            'requirement_value': 10,
            'xp_reward': 200,
            'icon': '⭐',
            'color': '#F59E0B',
            'rarity': 'rare'
        },
        {
            'name': 'Fitness Legend',
            'description': 'Reach level 20',
            'category': 'milestone',
            'requirement_type': 'level',
            'requirement_value': 20,
            'xp_reward': 500,
            'icon': '🌟',
            'color': '#FFD700',
            'rarity': 'legendary'
        },

        # Time-based achievements
        {
            'name': 'Hour Hero',
            'description': 'Exercise for 60 minutes total',
            'category': 'endurance',
            'requirement_type': 'time_minutes',
            'requirement_value': 60,
            'xp_reward': 75,
            'icon': '⏰',
            'color': '#059669',
            'rarity': 'common'
        },
        {
            'name': 'Time Champion',
            'description': 'Exercise for 5 hours total',
            'category': 'endurance',
            'requirement_type': 'time_minutes',
            'requirement_value': 300,
            'xp_reward': 200,
            'icon': '⏱️',
            'color': '#7C3AED',
            'rarity': 'rare'
        },

        # Creative achievements
        {
            'name': 'Storyteller',
            'description': 'Create your first fitness story',
            'category': 'creative',
            'requirement_type': 'stories',
            'requirement_value': 1,
            'xp_reward': 50,
            'icon': '📚',
            'color': '#EC4899',
            'rarity': 'common'
        },
        {
            'name': 'Author',
            'description': 'Create 5 fitness stories',
            'category': 'creative',
            'requirement_type': 'stories',
            'requirement_value': 5,
            'xp_reward': 150,
            'icon': '✍️',
            'color': '#8B5CF6',
            'rarity': 'rare'
        },

        # Social achievements
        {
            'name': 'Team Player',
            'description': 'Complete a workout with a friend',
            'category': 'social',
            'requirement_type': 'group_workouts',
            'requirement_value': 1,
            'xp_reward': 75,
            'icon': '👥',
            'color': '#10B981',
            'rarity': 'common'
        },
        {
            'name': 'Motivator',
            'description': 'Help 5 friends complete workouts',
            'category': 'social',
            'requirement_type': 'friends_helped',
            'requirement_value': 5,
            'xp_reward': 200,
            'icon': '🤝',
            'color': '#F59E0B',
            'rarity': 'rare'
        },

        # Streak achievements
        {
            'name': 'Week Warrior',
            'description': 'Work out for 7 days in a row',
            'category': 'consistency',
            'requirement_type': 'streak_days',
            'requirement_value': 7,
            'xp_reward': 150,
            'icon': '🔥',
            'color': '#EF4444',
            'rarity': 'rare'
        },
        {
            'name': 'Unstoppable',
            'description': 'Work out for 30 days in a row',
            'category': 'consistency',
            'requirement_type': 'streak_days',
            'requirement_value': 30,
            'xp_reward': 500,
            'icon': '🚀',
            'color': '#FFD700',
            'rarity': 'legendary'
        }
    ]

    for achievement_data in achievements_data:
        # Check if achievement already exists
        existing_achievement = Achievement.query.filter_by(
            name=achievement_data['name']).first()
        if not existing_achievement:
            achievement = Achievement(**achievement_data)
            db.session.add(achievement)

    db.session.commit()
    print(f"✅ Added {len(achievements_data)} achievements to database")


def run_seed():
    """Run all seeding functions"""
    print("🌱 Starting database seeding...")

    try:
        seed_inventory_items()
        seed_achievements()
        print("🎉 Database seeding completed successfully!")

    except Exception as e:
        print(f"❌ Error during seeding: {str(e)}")
        db.session.rollback()


if __name__ == "__main__":
    # Run this script directly to seed the database
    from app import app  # Import your Flask app
    with app.app_context():
        run_seed()
