import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../js/auth';

export const MyStories = () => {
    const { user } = useAuth();
    const [stories, setStories] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading user's stories
        setTimeout(() => {
            const mockStories = [
                {
                    id: 1,
                    title: "The Magic Forest Adventure",
                    genre: "fantasy",
                    length: "short",
                    createdAt: "2024-01-15",
                    words: 450,
                    isFavorite: true,
                    preview: "Once upon a time in a magical forest, there lived a brave hero who discovered ancient secrets..."
                },
                {
                    id: 2,
                    title: "Space Station Omega",
                    genre: "scifi",
                    length: "medium",
                    createdAt: "2024-01-12",
                    words: 1200,
                    isFavorite: false,
                    preview: "In the year 2157, aboard the massive Space Station Omega, strange signals began appearing..."
                },
                {
                    id: 3,
                    title: "The Mysterious Library",
                    genre: "mystery",
                    length: "long",
                    createdAt: "2024-01-10",
                    words: 2100,
                    isFavorite: true,
                    preview: "When the old librarian disappeared without a trace, our detective hero found clues that led to..."
                }
            ];
            setStories(mockStories);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredStories = stories.filter(story => {
        if (filter === 'all') return true;
        if (filter === 'favorites') return story.isFavorite;
        return story.genre === filter;
    });

    const toggleFavorite = (storyId) => {
        setStories(stories.map(story =>
            story.id === storyId
                ? { ...story, isFavorite: !story.isFavorite }
                : story
        ));
    };

    const deleteStory = (storyId) => {
        if (window.confirm('Are you sure you want to delete this story?')) {
            setStories(stories.filter(story => story.id !== storyId));
        }
    };

    const getGenreColor = (genre) => {
        const colors = {
            fantasy: 'text-bg-success',
            scifi: 'text-bg-primary',
            mystery: 'text-bg-dark',
            adventure: 'text-bg-warning',
            horror: 'text-bg-danger',
            romance: 'text-bg-info'
        };
        return colors[genre] || 'text-bg-secondary';
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading stories...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
            <div className="container py-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="text-white mb-1">My Stories</h1>
                                <p className="text-white-50">Your personal story collection</p>
                            </div>
                            <div>
                                <Link to="/story-generator" className="btn btn-primary me-2">
                                    Create New Story
                                </Link>
                                <Link to="/dashboard" className="btn btn-outline-light">
                                    Back to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-2">
                                    <button
                                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setFilter('all')}
                                    >
                                        All Stories ({stories.length})
                                    </button>
                                    <button
                                        className={`btn ${filter === 'favorites' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setFilter('favorites')}
                                    >
                                        Favorites ({stories.filter(s => s.isFavorite).length})
                                    </button>
                                    <button
                                        className={`btn ${filter === 'fantasy' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setFilter('fantasy')}
                                    >
                                        Fantasy
                                    </button>
                                    <button
                                        className={`btn ${filter === 'scifi' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setFilter('scifi')}
                                    >
                                        Sci-Fi
                                    </button>
                                    <button
                                        className={`btn ${filter === 'mystery' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setFilter('mystery')}
                                    >
                                        Mystery
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stories Grid */}
                <div className="row">
                    {filteredStories.length === 0 ? (
                        <div className="col-12">
                            <div className="card text-center">
                                <div className="card-body py-5">
                                    <h3>No stories found</h3>
                                    <p className="text-muted">
                                        {filter === 'all'
                                            ? "You haven't created any stories yet."
                                            : `No ${filter} stories found.`
                                        }
                                    </p>
                                    <Link to="/story-generator" className="btn btn-primary">
                                        Create Your First Story
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        filteredStories.map(story => (
                            <div key={story.id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <span className={`badge ${getGenreColor(story.genre)}`}>
                                            {story.genre}
                                        </span>
                                        <div>
                                            <button
                                                className={`btn btn-sm ${story.isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                                                onClick={() => toggleFavorite(story.id)}
                                            >
                                                {story.isFavorite ? '★' : '☆'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger ms-1"
                                                onClick={() => deleteStory(story.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{story.title}</h5>
                                        <p className="card-text text-muted small flex-grow-1">
                                            {story.preview}
                                        </p>
                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between text-muted small mb-2">
                                                <span>{story.words} words</span>
                                                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <button className="btn btn-primary btn-sm w-100">
                                                Read Story
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Stats */}
                {stories.length > 0 && (
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h6>Your Writing Stats</h6>
                                    <div className="row text-center">
                                        <div className="col-md-3">
                                            <h4>{stories.length}</h4>
                                            <small className="text-muted">Total Stories</small>
                                        </div>
                                        <div className="col-md-3">
                                            <h4>{stories.reduce((sum, story) => sum + story.words, 0).toLocaleString()}</h4>
                                            <small className="text-muted">Total Words</small>
                                        </div>
                                        <div className="col-md-3">
                                            <h4>{stories.filter(s => s.isFavorite).length}</h4>
                                            <small className="text-muted">Favorites</small>
                                        </div>
                                        <div className="col-md-3">
                                            <h4>{new Set(stories.map(s => s.genre)).size}</h4>
                                            <small className="text-muted">Genres Explored</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};