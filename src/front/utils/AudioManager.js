// AudioManager.js - Complete Audio Management System for PixelPlay
// Handles both background music (HTML5 Audio) and sound effects (Web Audio API)

class AudioManager {
  constructor() {
    this.audioEnabled = true;
    this.musicVolume = 0.2;
    this.effectsVolume = 0.1;
    this.backgroundMusic = null;
    this.audioContext = null;

    // Audio file paths configuration
    this.audioBasePath = "/audio";
    this.musicTracks = {
      dance: "upbeat-dance.mp3",
      ninja: "action-theme.mp3",
      yoga: "calm-ambient.mp3",
      rhythm: "electronic-beat.mp3",
      lightning-ladders": "energetic-workout.mp3",
      shadow-punch": "combat-music.mp3",
      adventure: "adventure-theme.mp3",
      superhero: "heroic-theme.mp3",
      magic: "mystical-ambient.mp3",
      sports: "sports-theme.mp3",
    };

    // Sound effect frequencies for Web Audio API
    this.soundEffects = {
      success: [800, 1200],
      countdown: [600],
      complete: [400, 800, 1200],
      button: [440],
      error: [300],
      levelUp: [523, 659, 784, 1047],
    };
  }

  // Initialize audio context (call once on first user interaction)
  init() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      console.log("AudioManager initialized successfully");
      return true;
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
      return false;
    }
  }

  // Enable/disable all audio
  setAudioEnabled(enabled) {
    this.audioEnabled = enabled;

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = enabled ? this.musicVolume : 0;
    }

    console.log("Audio", enabled ? "enabled" : "disabled");
  }

  // Set volume levels (0.0 to 1.0)
  setVolume(musicVolume = 0.2, effectsVolume = 0.1) {
    this.musicVolume = Math.max(0, Math.min(1, musicVolume));
    this.effectsVolume = Math.max(0, Math.min(1, effectsVolume));

    if (this.backgroundMusic && this.audioEnabled) {
      this.backgroundMusic.volume = this.musicVolume;
    }
  }

  // Background Music Management (HTML5 Audio)
  async startBackgroundMusic(gameId) {
    if (!this.audioEnabled || !this.musicTracks[gameId]) {
      console.log("Audio disabled or no music track for:", gameId);
      return false;
    }

    // Stop any existing music
    this.stopBackgroundMusic();

    try {
      const musicPath = `${this.audioBasePath}/${this.musicTracks[gameId]}`;
      console.log("Loading background music:", musicPath);

      this.backgroundMusic = new Audio(musicPath);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.musicVolume;

      // Handle loading errors gracefully
      this.backgroundMusic.addEventListener("error", (e) => {
        console.warn(`Music file not found: ${musicPath}`);
        console.log("Game will continue without background music");
      });

      // Handle successful load
      this.backgroundMusic.addEventListener("canplaythrough", () => {
        console.log("Background music loaded successfully:", gameId);
      });

      await this.backgroundMusic.play();
      console.log("Background music started for:", gameId);
      return true;
    } catch (error) {
      console.warn("Could not play background music:", error.message);
      return false;
    }
  }

  pauseBackgroundMusic() {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      console.log("Background music paused");
    }
  }

  resumeBackgroundMusic() {
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch((error) => {
        console.warn("Could not resume background music:", error.message);
      });
      console.log("Background music resumed");
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
      console.log("Background music stopped");
    }
  }

  // Sound Effects (Web Audio API)
  playSoundEffect(effectType, duration = 0.3) {
    if (
      !this.audioEnabled ||
      !this.audioContext ||
      !this.soundEffects[effectType]
    ) {
      return;
    }

    try {
      const frequencies = this.soundEffects[effectType];
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Set frequency pattern based on effect type
      if (frequencies.length === 1) {
        oscillator.frequency.setValueAtTime(
          frequencies[0],
          this.audioContext.currentTime
        );
      } else {
        // Multiple frequencies for complex sounds
        oscillator.frequency.setValueAtTime(
          frequencies[0],
          this.audioContext.currentTime
        );
        frequencies.slice(1).forEach((freq, index) => {
          const time =
            this.audioContext.currentTime +
            (duration / frequencies.length) * (index + 1);
          oscillator.frequency.setValueAtTime(freq, time);
        });
      }

      // Volume envelope
      gainNode.gain.setValueAtTime(
        this.effectsVolume,
        this.audioContext.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn("Sound effect failed:", error);
    }
  }

  // Convenience methods for common game events
  playSuccessSound() {
    this.playSoundEffect("success");
  }

  playCountdownSound() {
    this.playSoundEffect("countdown");
  }

  playCompletionSound() {
    this.playSoundEffect("complete", 0.6);
  }

  playButtonSound() {
    this.playSoundEffect("button", 0.2);
  }

  playErrorSound() {
    this.playSoundEffect("error");
  }

  playLevelUpSound() {
    this.playSoundEffect("levelUp", 1.0);
  }

  // Check if a game has background music available
  hasBackgroundMusic(gameId) {
    return Boolean(this.musicTracks[gameId]);
  }

  // Get list of all supported games with music
  getGamesWithMusic() {
    return Object.keys(this.musicTracks);
  }

  // Cleanup - call when component unmounts
  cleanup() {
    this.stopBackgroundMusic();

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(console.warn);
    }

    console.log("AudioManager cleaned up");
  }

  // Debug info
  getStatus() {
    return {
      audioEnabled: this.audioEnabled,
      musicVolume: this.musicVolume,
      effectsVolume: this.effectsVolume,
      hasBackgroundMusic: Boolean(this.backgroundMusic),
      musicPaused: this.backgroundMusic ? this.backgroundMusic.paused : null,
      audioContextState: this.audioContext ? this.audioContext.state : null,
      supportedGames: Object.keys(this.musicTracks),
    };
  }
}

// Export singleton instance
const audioManager = new AudioManager();
export default audioManager;

// Usage Examples:
/*

// Initialize on first user interaction
audioManager.init();

// Start background music for a game
await audioManager.startBackgroundMusic('dance');

// Play sound effects
audioManager.playSuccessSound();
audioManager.playCompletionSound();

// Control music during gameplay
audioManager.pauseBackgroundMusic();
audioManager.resumeBackgroundMusic();
audioManager.stopBackgroundMusic();

// Control volume
audioManager.setVolume(0.3, 0.15); // music, effects

// Enable/disable audio
audioManager.setAudioEnabled(false);

// Check game audio support
if (audioManager.hasBackgroundMusic('ninja')) {
  // Game supports background music
}

// Cleanup
audioManager.cleanup();

*/
