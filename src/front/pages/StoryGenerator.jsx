<<<<<<< HEAD
// --- src/pages/StoryGenerator.jsx ---
import React from 'react';
const StoryGenerator = () => <div className="placeholder-page"><h1>AI Story Generator</h1><p>Coming Soon!</p></div>
export default StoryGenerator;
=======
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../js/auth';
import AvatarDisplay from '../components/AvatarDisplay';

export const StoryGenerator = () => {
    const { user } = useAuth();
    const [storyParams, setStoryParams] = useState({
        genre: 'adventure',
        length: 'short',
        characters: 'default',
        setting: 'fantasy',
        mood: 'exciting'
    });
    const [generatedStory, setGeneratedStory] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showStory, setShowStory] = useState(false);

    const genres = [
        { id: 'adventure', name: 'Adventure', requiredLevel: 1 },
        { id: 'fantasy', name: 'Fantasy', requiredLevel: 3 },
        { id: 'scifi', name: 'Sci-Fi', requiredLevel: 5 },
        { id: 'mystery', name: 'Mystery', requiredLevel: 8 },
        { id: 'horror', name: 'Horror', requiredLevel: 12 },
        { id: 'romance', name: 'Romance', requiredLevel: 10 }
    ];

    const storyLengths = [
        { id: 'short', name: 'Short (2-3 minutes)', words: '300-500' },
        { id: 'medium', name: 'Medium (5-7 minutes)', words: '800-1200' },
        { id: 'long', name: 'Long (10-15 minutes)', words: '1500-2500' }
    ];

    const settings = [
        'Fantasy Kingdom', 'Space Station', 'Underwater City', 'Magical Forest',
        'Desert Oasis', 'Mountain Village', 'Time Portal', 'Robot City'
    ];

    const moods = [
        'Exciting', 'Mysterious', 'Funny', 'Heartwarming', 'Suspenseful', 'Inspiring'
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Simulate story generation (replace with actual AI API call)
        setTimeout(() => {
            const sampleStory = `Once upon a time in a ${storyParams.setting.toLowerCase()}, there lived a brave hero much like ${user?.username || 'you'}. 

The ${storyParams.mood} adventure began when mysterious lights appeared in the sky. Our hero, with courage in their heart, decided to investigate these strange phenomena.

As they ventured deeper into the unknown, they discovered that the lights were actually messages from an ancient civilization. These beings had been watching over the realm for centuries, waiting for someone worthy to receive their wisdom.

The hero learned that they possessed a special gift - the ability to understand the language of light itself. With this newfound power, they could communicate with creatures from other dimensions and bring peace to their world.

Through trials and challenges, our hero grew stronger and wiser. They faced their fears, helped others in need, and ultimately saved their realm from an approaching darkness.

The story ends with our hero returning home, forever changed by their journey, carrying the wisdom of the ancients and the knowledge that true strength comes from helping others.

*This ${storyParams.length} ${storyParams.genre} story was generated based on your preferences and current level (${user?.level || 1}).*`;

            setGeneratedStory(sampleStory);
            setIsGenerating(false);
            setShowStory(true);
        }, 3000);
    };

    const handleSaveStory = () => {
        // Implement save functionality
        alert('Story saved to your collection!');
    };

    const handleShare = () => {
        // Implement share functionality
        alert('Story shared!');
    };

    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
            <div className="container py-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 className="text-white mb-1">AI Story Generator</h1>
                                <p className="text-white-50">Create personalized stories powered by AI</p>
                            </div>
                            <Link to="/dashboard" className="btn btn-outline-light">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Story Configuration */}
                    <div className="col-md-8">
                        {!showStory ? (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Story Parameters</h5>
                                </div>
                                <div className="card-body">
                                    {/* Genre Selection */}
                                    <div className="mb-4">
                                        <label className="form-label h6">Genre</label>
                                        <div className="row">
                                            {genres.map(genre => (
                                                <div key={genre.id} className="col-md-4 mb-2">
                                                    <button
                                                        className={`btn w-100 ${storyParams.genre === genre.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                        onClick={() => setStoryParams({ ...storyParams, genre: genre.id })}
                                                        disabled={user?.level < genre.requiredLevel}
                                                    >
                                                        {genre.name}
                                                        {user?.level < genre.requiredLevel && (
                              <br /><small>Level {genre.requiredLevel}</small>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Story Length */}
                                    <div className="mb-4">
                                        <label className="form-label h6">Story Length</label>
                                        <div className="row">
                                            {storyLengths.map(length => (
                                                <div key={length.id} className="col-md-4 mb-2">
                                                    <button
                                                        className={`btn w-100 ${storyParams.length === length.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                        onClick={() => setStoryParams({ ...storyParams, length: length.id })}
                                                    >
                                                        {length.name}
                                                        <br /><small>{length.words} words</small>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Setting */}
                                    <div className="mb-4">
                                        <label htmlFor="setting" className="form-label h6">Setting</label>
                                        <select
                                            className="form-select"
                                            value={storyParams.setting}
                                            onChange={(e) => setStoryParams({ ...storyParams, setting: e.target.value })}
                                        >
                                            {settings.map(setting => (
                                                <option key={setting} value={setting}>{setting}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Mood */}
                                    <div className="mb-4">
                                        <label htmlFor="mood" className="form-label h6">Mood</label>
                                        <select
                                            className="form-select"
                                            value={storyParams.mood}
                                            onChange={(e) => setStoryParams({ ...storyParams, mood: e.target.value })}
                                        >
                                            {moods.map(mood => (
                                                <option key={mood} value={mood}>{mood}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Generate Button */}
                                    <div className="text-center">
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={handleGenerate}
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Generating Story...
                                                </>
                                            ) : (
                                                'Generate Story'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Generated Story Display */
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Your Generated Story</h5>
                                    <div>
                                        <button className="btn btn-outline-primary btn-sm me-2" onClick={handleSaveStory}>
                                            Save Story
                                        </button>
                                        <button className="btn btn-outline-success btn-sm me-2" onClick={handleShare}>
                                            Share
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => setShowStory(false)}
                                        >
                                            Generate New
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                                        {generatedStory}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="col-md-4">
                        {/* User Info */}
                        <div className="card mb-4">
                            <div className="card-body text-center">
                                {user && (
                                    <AvatarDisplay
                                        user={user}
                                        size={100}
                                        showLevel={true}
                                        className="mb-3"
                                    />
                                )}
                                <h6>{user?.username || user?.email?.split('@')[0]}</h6>
                                <p className="text-muted">Level {user?.level || 1}</p>
                            </div>
                        </div>

                        {/* Story Tips */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6 className="mb-0">Story Tips</h6>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    <li className="mb-2">🎭 Try different genres to unlock new story elements</li>
                                    <li className="mb-2">📚 Longer stories provide more character development</li>
                                    <li className="mb-2">🌟 Level up to access premium story types</li>
                                    <li className="mb-2">💾 Save your favorite stories to read later</li>
                                </ul>
                            </div>
                        </div>

                        {/* Level Progress */}
                        <div className="card">
                            <div className="card-header">
                                <h6 className="mb-0">Level Progress</h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-2">
                                    <div className="d-flex justify-content-between">
                                        <span>Current Level</span>
                                        <span>{user?.level || 1}</span>
                                    </div>
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${((user?.level || 1) % 5) * 20}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <small className="text-muted">
                                    Generate more stories to level up and unlock new features!
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
>>>>>>> feature/Frontend-Build-Dashboard-page
