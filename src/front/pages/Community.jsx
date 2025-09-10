import { Link } from 'react-router-dom';

export const Community = () => {
    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="text-white">Community Stories</h1>
                        <p className="text-white-50">Discover stories shared by other users</p>
                    </div>
                    <Link to="/dashboard" className="btn btn-outline-light">Back to Dashboard</Link>
                </div>

                <div className="card">
                    <div className="card-body text-center py-5">
                        <h3>Community Features Coming Soon!</h3>
                        <p className="text-muted">Share your stories and discover amazing content from other creators.</p>
                        <Link to="/story-generator" className="btn btn-primary">Create a Story to Share</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};