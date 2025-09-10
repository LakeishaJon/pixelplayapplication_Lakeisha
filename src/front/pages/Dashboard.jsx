import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../js/auth';
import AvatarDisplay from '../components/AvatarDisplay';

export const Dashboard = () => {
    const { user, logout, authService } = useAuth();
    const [stats, setStats] = useState({
        storiesGenerated: 0,
        currentLevel: user?.level || 1,
        unlockedFeatures: 0,
        lastActivity: null
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading user data and stats
        const loadDashboardData = async () => {
            setLoading(true);

            // Simulate API calls for user stats
            setTimeout(() => {
                setStats({
                    storiesGenerated: Math.floor(Math.random() * 50) + 1,
                    currentLevel: user?.level || 1,
                    unlockedFeatures: calculateUnlockedFeatures(user?.level || 1),
                    lastActivity: new Date().toLocaleDateString()
                });

                setRecentActivity([
                    { type: 'story', title: 'Generated "The Magic Forest"', time: '2 hours ago' },
                    { type: 'level', title: 'Reached Level ' + (user?.level || 1), time: '1 day ago' },
                    { type: 'avatar', title: 'Updated avatar style', time: '3 days ago' }
                ]);

                setLoading(false);
            }, 1000);
        };

        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const calculateUnlockedFeatures = (level) => {
        const features = [
            { name: 'Basic Stories', levelRequired: 1 },
            { name: 'Adventure Stories', levelRequired: 3 },
            { name: 'Fantasy Stories', levelRequired: 5 },
            { name: 'Sci-Fi Stories', levelRequired: 8 },
            { name: 'Custom Characters', levelRequired: 10 },
            { name: 'Story Sharing', levelRequired: 15 },
            { name: 'Advanced Plots', levelRequired: 20 }
        ];
        return features.filter(feature => level >= feature.levelRequired).length;
    };

    const handleLevelUp = async () => {
        const result = await authService.levelUp();
        if (result.success) {
            setStats(prev => ({
                ...prev,
                currentLevel: result.newLevel,
                unlockedFeatures: calculateUnlockedFeatures(result.newLevel)
            }));
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
            <div className="container-fluid py-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="text-white mb-1">Welcome back, {user?.username || user?.email?.split('@')[0]}!</h1>
                                <p className="text-white-50">Ready to create some amazing stories?</p>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                                <span className="text-white-50">Level {stats.currentLevel}</span>
                                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title">{stats.storiesGenerated}</h3>
                                <p className="card-text">Stories Created</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-success text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title">{stats.currentLevel}</h3>
                                <p className="card-text">Current Level</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-warning text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title">{stats.unlockedFeatures}</h3>
                                <p className="card-text">Features Unlocked</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-info text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title">Active</h3>
                                <p className="card-text">Status</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Main Content */}
                    <div className="col-md-8">
                        {/* Story Generator CTA */}
                        <div className="card mb-4 border-0 shadow-lg">
                            <div className="card-body text-center p-5">
                                <h2 className="card-title mb-3">Create Your Next Story</h2>
                                <p className="card-text text-muted mb-4">
                                    Use AI to generate personalized stories based on your preferences and current level.
                                </p>
                                <Link to="/story-generator" className="btn btn-primary btn-lg me-3">
                                    Start Story Generator
                                </Link>
                                <Link to="/my-stories" className="btn btn-outline-secondary btn-lg">
                                    View My Stories
                                </Link>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card border-0 shadow">
                            <div className="card-header bg-transparent">
                                <h5 className="mb-0">Quick Actions</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <Link to="/avatar-dashboard" className="btn btn-outline-primary w-100">
                                            Manage Avatar
                                        </Link>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-outline-success w-100" onClick={handleLevelUp}>
                                            Level Up ({stats.currentLevel})
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <Link to="/story-templates" className="btn btn-outline-info w-100">
                                            Browse Templates
                                        </Link>
                                    </div>
                                    <div className="col-md-6">
                                        <Link to="/community" className="btn btn-outline-warning w-100">
                                            Community Stories
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-md-4">
                        {/* User Profile Card */}
                        <div className="card mb-4 border-0 shadow">
                            <div className="card-body text-center">
                                <div className="mb-3">
                                    {user && (
                                        <AvatarDisplay
                                            user={user}
                                            size={120}
                                            showLevel={true}
                                            className="mb-2"
                                        />
                                    )}
                                </div>
                                <h5 className="card-title">{user?.username || user?.email?.split('@')[0]}</h5>
                                <p className="text-muted">{user?.email}</p>
                                <div className="d-flex justify-content-around text-center">
                                    <div>
                                        <strong>{stats.currentLevel}</strong>
                                        <br />
                                        <small className="text-muted">Level</small>
                                    </div>
                                    <div>
                                        <strong>{stats.storiesGenerated}</strong>
                                        <br />
                                        <small className="text-muted">Stories</small>
                                    </div>
                                    <div>
                                        <strong>{stats.unlockedFeatures}</strong>
                                        <br />
                                        <small className="text-muted">Features</small>
                                    </div>
                                </div>
                                <Link to="/profile" className="btn btn-outline-primary btn-sm mt-3">
                                    Edit Profile
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card border-0 shadow">
                            <div className="card-header bg-transparent">
                                <h6 className="mb-0">Recent Activity</h6>
                            </div>
                            <div className="card-body">
                                {recentActivity.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="list-group-item border-0 px-0">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        {activity.type === 'story' && (
                                                            <div className="bg-primary rounded-circle p-2 text-white">
                                                                <i className="fas fa-book"></i>
                                                            </div>
                                                        )}
                                                        {activity.type === 'level' && (
                                                            <div className="bg-success rounded-circle p-2 text-white">
                                                                <i className="fas fa-star"></i>
                                                            </div>
                                                        )}
                                                        {activity.type === 'avatar' && (
                                                            <div className="bg-info rounded-circle p-2 text-white">
                                                                <i className="fas fa-user"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <p className="mb-1 small">{activity.title}</p>
                                                        <small className="text-muted">{activity.time}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted text-center">No recent activity</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};