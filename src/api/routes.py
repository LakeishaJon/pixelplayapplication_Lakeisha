"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task, Game
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

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
# GAME MANAGEMENT ENDPOINTS
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


@api.route('/games/<int:game_id>', methods=['GET'])
@jwt_required()
def get_game(game_id):
    """Get a specific game by ID"""
    try:
        user_id = get_jwt_identity()
        game = Game.query.filter_by(id=game_id, user_id=user_id).first()

        if not game:
            return jsonify({
                'success': False,
                'message': 'Game not found'
            }), 404

        return jsonify({
            'success': True,
            'game': game.serialize()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching game: {str(e)}'
        }), 500


@api.route('/games/<int:game_id>', methods=['PUT'])
@jwt_required()
def update_game(game_id):
    """Update a game"""
    try:
        user_id = get_jwt_identity()
        game = Game.query.filter_by(id=game_id, user_id=user_id).first()

        if not game:
            return jsonify({
                'success': False,
                'message': 'Game not found'
            }), 404

        data = request.get_json()

        # Update fields if provided
        if 'name' in data:
            game.name = data['name']
        if 'progress' in data:
            if not game.update_progress(data['progress']):
                return jsonify({
                    'success': False,
                    'message': 'Progress must be between 0 and 100'
                }), 400

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Game updated successfully',
            'game': game.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating game: {str(e)}'
        }), 500


@api.route('/games/<int:game_id>', methods=['DELETE'])
@jwt_required()
def delete_game(game_id):
    """Delete a game"""
    try:
        user_id = get_jwt_identity()
        game = Game.query.filter_by(id=game_id, user_id=user_id).first()

        if not game:
            return jsonify({
                'success': False,
                'message': 'Game not found'
            }), 404

        db.session.delete(game)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Game deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error deleting game: {str(e)}'
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


@api.route('/games/stats', methods=['GET'])
@jwt_required()
def get_game_stats():
    """Get game statistics for the user"""
    try:
        user_id = get_jwt_identity()

        total_games = Game.query.filter_by(user_id=user_id).count()
        completed_games = Game.query.filter_by(
            user_id=user_id).filter(Game.progress >= 100).count()
        in_progress_games = total_games - completed_games

        # Calculate average progress
        games = Game.query.filter_by(user_id=user_id).all()
        avg_progress = sum(game.progress for game in games) / \
            total_games if total_games > 0 else 0

        return jsonify({
            'success': True,
            'stats': {
                'totalGames': total_games,
                'completedGames': completed_games,
                'inProgressGames': in_progress_games,
                'averageProgress': round(avg_progress, 2),
                'completionRate': round((completed_games / total_games * 100), 2) if total_games > 0 else 0
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching stats: {str(e)}'
        }), 500
