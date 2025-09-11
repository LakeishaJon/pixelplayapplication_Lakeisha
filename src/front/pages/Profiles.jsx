import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../js/auth';
import AvatarDisplay from '../components/AvatarDisplay';

export const Profile = () => {
    const { user, updateProfile, authService } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        email: user?.email || '',
        username: user?.username || user?.email?.split('@')[0] || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const result = await updateProfile(profileData);

        if (result.success) {
            setMessage('Profile updated successfully!');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const result = await authService.changePassword(
            passwordData.currentPassword,
            passwordData.newPassword
        );

        if (result.success) {
            setMessage('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleAvatarCustomization = async (customization) => {
        const result = await authService.updateAvatar(customization);
        if (result.success) {
            setMessage('Avatar updated successfully!');
        } else {
            setError('Failed to update avatar');
        }
    };

    const availableThemes = ['superhero', 'space', 'nature', 'princess', 'ninja', 'pirate'];
    const availableColors = ['blue', 'red', 'green', 'purple', 'orange', 'pink', 'yellow', 'black'];
    const availableMoods = ['happy', 'sad', 'surprised', 'angry', 'neutral'];

    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
            <div className="container py-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="text-white mb-1">Profile Settings</h1>
                                <p className="text-white-50">Manage your account and avatar preferences</p>
                            </div>
                            <Link to="/dashboard" className="btn btn-outline-light">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {message && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3 mb-4">
                        <div className="card">
                            <div className="card-body text-center">
                                {user && (
                                    <AvatarDisplay
                                        user={user}
                                        size={120}
                                        showLevel={true}
                                        className="mb-3"
                                    />
                                )}
                                <h5>{user?.username || user?.email?.split('@')[0]}</h5>
                                <p className="text-muted">{user?.email}</p>
                                <p className="badge bg-primary">Level {user?.level || 1}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="card mt-3">
                            <div className="list-group list-group-flush">
                                <button
                                    className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    Profile Information
                                </button>
                                <button
                                    className={`list-group-item list-group-item-action ${activeTab === 'avatar' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('avatar')}
                                >
                                    Avatar Settings
                                </button>
                                <button
                                    className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('password')}
                                >
                                    Change Password
                                </button>
                                <button
                                    className={`list-group-item list-group-item-action ${activeTab === 'stats' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('stats')}
                                >
                                    Account Stats
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9">
                        {/* Profile Information Tab */}
                        {activeTab === 'profile' && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Profile Information</h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleProfileUpdate}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label">Username</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="username"
                                                value={profileData.username}
                                                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                                disabled={loading}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Updating...' : 'Update Profile'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Avatar Settings Tab */}
                        {activeTab === 'avatar' && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Avatar Customization</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6>Current Avatar</h6>
                                            {user && (
                                                <AvatarDisplay
                                                    user={user}
                                                    size={150}
                                                    showLevel={true}
                                                    className="mb-3"
                                                />
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <h6>Customization Options</h6>

                                            <div className="mb-3">
                                                <label className="form-label">Theme</label>
                                                <select
                                                    className="form-select"
                                                    value={user?.avatarData?.theme || 'superhero'}
                                                    onChange={(e) => handleAvatarCustomization({ theme: e.target.value })}
                                                >
                                                    {availableThemes.map(theme => (
                                                        <option key={theme} value={theme}>
                                                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Background Color</label>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {availableColors.map(color => (
                                                        <button
                                                            key={color}
                                                            type="button"
                                                            className={`btn btn-sm ${user?.avatarData?.backgroundColor === color ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                            style={{
                                                                backgroundColor: color === 'black' ? '#000' : color,
                                                                color: ['black', 'blue', 'purple'].includes(color) ? 'white' : 'black',
                                                                minWidth: '40px',
                                                                height: '40px'
                                                            }}
                                                            onClick={() => handleAvatarCustomization({ backgroundColor: color })}
                                                        >
                                                            {user?.avatarData?.backgroundColor === color ? '✓' : ''}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Mood</label>
                                                <select
                                                    className="form-select"
                                                    value={user?.avatarData?.mood || 'happy'}
                                                    onChange={(e) => handleAvatarCustomization({ mood: e.target.value })}
                                                >
                                                    {availableMoods.map(mood => (
                                                        <option key={mood} value={mood}>
                                                            {mood.charAt(0).toUpperCase() + mood.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Password Change Tab */}
                        {activeTab === 'password' && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Change Password</h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="mb-3">
                                            <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="newPassword" className="form-label">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                required
                                                minLength={6}
                                                disabled={loading}
                                            />
                                            <div className="form-text">Must be at least 6 characters</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Changing Password...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Account Stats Tab */}
                        {activeTab === 'stats' && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Account Statistics</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <h6>Account Information</h6>
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Member Since</td>
                                                        <td>January 2024</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Current Level</td>
                                                        <td>Level {user?.level || 1}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Avatar Style</td>
                                                        <td>{user?.avatarData?.style || 'pixel-art'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Last Login</td>
                                                        <td>Today</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <h6>Activity Stats</h6>
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Stories Generated</td>
                                                        <td>47</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Words Written</td>
                                                        <td>23,450</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Favorite Genre</td>
                                                        <td>Fantasy</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Reading Time</td>
                                                        <td>3h 42m</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <h6>Level Progress</h6>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between">
                                            <span>Level {user?.level || 1}</span>
                                            <span>Next: Level {(user?.level || 1) + 1}</span>
                                        </div>
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${((user?.level || 1) % 5) * 20 + 20}%` }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">Generate more stories to level up!</small>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};