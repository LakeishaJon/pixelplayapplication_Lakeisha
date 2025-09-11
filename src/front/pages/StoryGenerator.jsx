// --- src/pages/StoryGenerator.jsx ---
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Logo from '../components/Logo'; // As requested, importing the Logo component

const SOCKET_SERVER_URL = 'http://127.0.0.1:5001';

// --- Warp Speed Background Component ---
// This component generates the divs needed for the CSS animation.
const WarpBackground = () => {
    // Generate an array of numbers from 1 to 50 for the streaks
    const streakCount = Array.from({ length: 50 }, (_, i) => i + 1);
    return (
        <div className="warp-background">
            {streakCount.map(n => (
                <div key={n} className={`streak s${n}`}></div>
            ))}
        </div>
    );
};


// --- STYLES COMPONENT (UPDATED WITH WARP SPEED BACKGROUND) ---
const Styles = () => (
  <style>{`
    /* --- Google Font Import --- */
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

    /* --- Keyframe Animations --- */
    @keyframes warp {
      0% {
        transform: rotate(var(--angle)) translateX(0) scaleX(0.1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: rotate(var(--angle)) translateX(100vw) scaleX(1);
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* --- Global and Body Styles --- */
    body {
      margin: 0;
      font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .app-container {
      background-color: #090a0f;
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow: hidden;
      position: relative; /* Needed for the background container */
    }

    /* --- Warp Speed Background Styles --- */
    .warp-background {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1px;
      height: 1px;
      transform-style: preserve-3d;
      perspective: 200px;
    }

    .streak {
      position: absolute;
      top: 0;
      left: 0;
      width: 150px;
      height: 2px;
      background: linear-gradient(to right, #E0B0FF, transparent); /* Mauve to transparent */
      border-radius: 1px;
      transform-origin: left center;
      animation-name: warp;
      animation-duration: 2s;
      animation-timing-function: ease-in;
      animation-iteration-count: infinite;
    }

    /* --- Generate styles for 50 streaks --- */
    ${Array.from({ length: 50 }, (_, i) => `
      .streak.s${i + 1} {
        --angle: ${Math.random() * 360}deg;
        animation-delay: ${Math.random() * -2}s;
        animation-duration: ${Math.random() * 1 + 1}s;
      }
    `).join('')}


    .main-content {
      width: 100%;
      max-width: 56rem;
      margin: 0 auto;
      text-align: center;
      z-index: 10;
    }

    /* --- Header --- */
    .app-header {
      margin-bottom: 2rem;
      animation: fadeIn 1s ease-in-out;
    }
    
    .logo-container {
      max-width: 200px;
      margin: 0 auto 1rem;
    }

    .app-title {
      font-size: 3rem; /* text-5xl for more impact */
      font-weight: 900;
      letter-spacing: -0.025em;
      background-image: linear-gradient(to right, #fde047, #a855f7, #6366f1);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      padding: 0 1rem;
    }

    .app-subtitle {
      font-size: 1.25rem; /* text-xl */
      color: #d1d5db; /* text-gray-300 */
      margin-top: 0.5rem;
    }

    /* --- Main Content Area --- */
    .app-main {
      width: 100%;
      background-color: rgba(24, 36, 51, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem; /* rounded-3xl */
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
      padding: 2.5rem; /* p-10 */
      animation: fadeIn 1.5s ease-in-out;
    }

    /* --- Generator View (With Prompt Input) --- */
    .generator-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
    }

    .prompt-instructions {
      color: #e5e7eb; /* text-gray-200 */
    }
    .prompt-instructions h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .prompt-instructions p {
      max-width: 40rem;
      margin: 0 auto 1rem;
      color: #9ca3af; /* text-gray-400 */
    }
    .prompt-instructions ul {
      list-style: none;
      padding: 0;
      display: inline-block;
      text-align: left;
      color: #d1d5db;
    }
    .prompt-instructions li::before {
      content: '✨';
      margin-right: 0.5rem;
    }

    .prompt-textarea {
      width: 100%;
      min-height: 100px;
      padding: 1rem;
      border-radius: 0.75rem; /* rounded-xl */
      background-color: rgba(17, 24, 39, 0.8);
      border: 2px solid #4f46e5;
      color: #ffffff;
      font-family: 'Nunito', sans-serif;
      font-size: 1.125rem;
      resize: vertical;
      box-shadow: 0 0 15px rgba(79, 70, 229, 0.5);
      transition: box-shadow 0.3s ease;
    }
    .prompt-textarea:focus {
      outline: none;
      box-shadow: 0 0 25px rgba(167, 139, 250, 0.7);
    }
    .prompt-textarea::placeholder {
      color: #6b7280; /* text-gray-500 */
    }

    .generate-button {
      background-image: linear-gradient(to right, #a78bfa, #6366f1);
      color: white;
      font-weight: 700;
      padding: 1rem 2.5rem; /* py-4 px-10 */
      border: none;
      border-radius: 9999px; /* rounded-full */
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 0 20px rgba(167, 139, 250, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.25rem;
      letter-spacing: 0.05em;
    }
    .generate-button:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 15px 20px -3px rgba(0, 0, 0, 0.3), 0 0 30px rgba(167, 139, 250, 0.6);
    }
    .generate-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* --- Progress Bar --- */
    .progress-bar {
      background-image: linear-gradient(to right, #a78bfa, #6366f1);
    }

    /* --- Unchanged styles --- */
    .status-message { font-size: 0.875rem; color: #9ca3af; margin-top: 1rem; }
    .error-message { color: #f87171; margin-top: 1rem; font-size: 0.875rem; max-width: 32rem; margin-left: auto; margin-right: auto; }
    .progress-bar-container { width: 100%; background-color: #374151; border-radius: 9999px; height: 0.625rem; margin-bottom: 1rem; }
    .status-message-generating { font-size: 1.125rem; color: #d1d5db; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 50% { opacity: .5; } }
    .video-wrapper { aspect-ratio: 16 / 9; width: 100%; }
    .video-player { width: 100%; height: 100%; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); background-color: black; }
    .controls-container { margin-top: 1rem; display: flex; align-items: center; justify-content: center; gap: 1rem; }
    .control-button { padding: 1rem; border-radius: 9999px; background-color: rgba(31, 41, 55, 0.7); border: 1px solid rgba(75, 85, 99, 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); cursor: pointer; transition: all 0.2s ease-in-out; }
    .control-button:hover { background-color: rgba(55, 65, 81, 0.9); transform: scale(1.05); }
    .icon { width: 2rem; height: 2rem; color: white; }
    .app-footer { margin-top: 2rem; color: #6b7280; font-size: 0.875rem; z-index: 10; }
  `}</style>
);

// --- MAIN APP COMPONENT ---
export default function StoryGenerator() {
  const [statusMessage, setStatusMessage] = useState('Tell us your story to begin!');
  const [errorMessage, setErrorMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState('');

  const videoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Socket.IO connection logic
    socketRef.current = io(SOCKET_SERVER_URL);
    const socket = socketRef.current;
    socket.on('connect', () => console.log('Socket.IO connected!'));
    socket.on('status_update', (data) => {
      console.log('Status Update:', data.message);
      setStatusMessage(data.message);
      if (data.progress) setProgress(data.progress);
    });
    socket.on('generation_complete', (data) => {
      console.log('Generation Complete! Video URL:', data.video_url);
      setVideoUrl(`${SOCKET_SERVER_URL}${data.video_url}`);
      setIsGenerating(false);
      setStatusMessage('Your adventure is ready!');
      setProgress(100);
    });
    socket.on('error', (data) => {
      console.error('Server Error:', data.message);
      setErrorMessage(data.message);
      setIsGenerating(false);
    });
    return () => socket.disconnect();
  }, []);

  const handleGenerateClick = () => {
    if (!prompt.trim()) {
      setErrorMessage('Please tell us what your adventure is about!');
      return;
    }
    setIsGenerating(true);
    setErrorMessage('');
    setVideoUrl(null);
    setProgress(0);
    setStatusMessage('Sending your great idea to the story machine...');
    socketRef.current.emit('start_generation', { prompt: prompt });
  };
  
  const handlePlayPause = () => {
    if (videoRef.current?.paused) videoRef.current?.play();
    else videoRef.current?.pause();
  };
  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <>
      <Styles />
      <div className="app-container">
        <WarpBackground />
        <div className="main-content">
          <header className="app-header">
            <div className="logo-container">
              <Logo />
            </div>
            <h1 className="app-title">What's Your Adventure?</h1>
            <p className="app-subtitle">Your adventure starts with a single sentence.</p>
          </header>

          <main className="app-main">
            {videoUrl ? (
              <VideoPlayer
                videoUrl={videoUrl} videoRef={videoRef} onPlayPause={handlePlayPause} onReplay={handleReplay} />
            ) : (
              <GeneratorView
                prompt={prompt}
                setPrompt={setPrompt}
                statusMessage={statusMessage}
                errorMessage={errorMessage}
                isGenerating={isGenerating}
                progress={progress}
                onGenerate={handleGenerateClick} />
            )}
          </main>
          
        </div>
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---
const GeneratorView = ({ prompt, setPrompt, statusMessage, errorMessage, isGenerating, progress, onGenerate }) => (
  <div className="generator-view">
    {isGenerating ? (
      <>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="status-message-generating">{statusMessage}</p>
      </>
    ) : (
      <>
        <div className="prompt-instructions">
          <p>Tell us your amazing idea, and we'll create a unique fitness story just for you!</p>
          <ul>
             <li>A brave space pirate looking for treasure!</li>
             <li>A friendly knight who has to rescue a silly dragon.</li>
             <li>An explorer discovering a jungle full of bouncy mushrooms!</li>
          </ul>
        </div>
        <textarea
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="For example: A magical unicorn that has to learn to fly..."
        />
        <button onClick={onGenerate} className="generate-button" disabled={!prompt.trim()}>
          Create My Adventure!
        </button>
      </>
    )}
    {errorMessage && <p className="error-message">{errorMessage}</p>}
  </div>
);

const VideoPlayer = ({ videoUrl, videoRef, onPlayPause, onReplay }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
 
    video.play().catch(error => console.log("Autoplay was prevented:", error));

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handlePause);
 
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handlePause);
    };
  }, [videoRef]);
 
  return (
    <div>
      <div className="video-wrapper">
        <video ref={videoRef} src={videoUrl} className="video-player" controls />
      </div>
      <div className="controls-container">
        <ControlButton onClick={onPlayPause}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</ControlButton>
        <ControlButton onClick={onReplay}><ReplayIcon /></ControlButton>
      </div>
    </div>
  );
};
 
const ControlButton = ({ onClick, children }) => (
  <button onClick={onClick} className="control-button">{children}</button>
);
 
// SVG Icons
const PlayIcon = () => <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = () => <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
const ReplayIcon = () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.693L7.985 5.01M18.015 14.655L12 21.672l-6.015-7.017" /></svg>;
