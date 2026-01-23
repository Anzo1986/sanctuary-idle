class AudioManager {
    constructor() {
        this.bgm = new Audio();
        this.bgm.loop = false; // Disable loop to allow playlist cycling
        this.volume = 0.5;
        this.isMuted = false;

        // Playlist Configuration
        this.playlist = [
            'assets/music/bgm.mp3',
            'assets/music/bgm2.mp3',
            'assets/music/bgm3.mp3',
            'assets/music/bgm4.mp3',
            'assets/music/bgm5.mp3',
            'assets/music/bgm6.mp3',
            'assets/music/bgm7.mp3',
            'assets/music/bgm8.mp3',
            'assets/music/bgm9.mp3',
            'assets/music/bgm10.mp3'
        ];
        this.currentIndex = 0;

        this.loadSettings();

        // Event Listeners
        this.bgm.addEventListener('ended', () => {
            console.log("Track ended. Playing next...");
            this.playNext();
        });

        // Error Handling (Skip missing tracks)
        this.currentRetryCount = 0;
        this.maxRetries = this.playlist.length; // Stop if we've tried every track

        this.bgm.addEventListener('error', (e) => {
            console.warn(`Audio error for ${this.bgm.src}. Skipping to next...`);

            this.currentRetryCount++;
            if (this.currentRetryCount >= this.maxRetries) {
                console.error("All audio tracks failed to load. Stopping playback to prevent infinite loop.");
                return;
            }

            // Short delay to prevent CPU spike if all fail instantly
            setTimeout(() => {
                this.playNext(true); // true = indicate this is a retry/skip
            }, 100);
        });

        // Reset retry count on successful play
        this.bgm.addEventListener('playing', () => {
            this.currentRetryCount = 0;
        });

        // Initialize first track
        this.setTrack(this.playlist[this.currentIndex]);
    }

    setTrack(url) {
        this.bgm.src = url;
    }

    play() {
        this.bgm.play().catch(e => {
            console.log("Audio play blocked or failed:", e);
        });
    }

    pause() {
        this.bgm.pause();
    }

    playNext(isAutoSkip = false) {
        // If user manually clicked next, reset retry count
        if (!isAutoSkip) {
            this.currentRetryCount = 0;
        }

        this.currentIndex++;
        if (this.currentIndex >= this.playlist.length) {
            this.currentIndex = 0;
        }
        this.setTrack(this.playlist[this.currentIndex]);
        this.play();
    }

    setVolume(val) {
        this.volume = parseFloat(val);
        if (this.volume < 0) this.volume = 0;
        if (this.volume > 1) this.volume = 1;

        this.bgm.volume = this.isMuted ? 0 : this.volume;
        this.saveSettings();
    }

    toggleMute(forceState = null) {
        if (forceState !== null) {
            this.isMuted = forceState;
        } else {
            this.isMuted = !this.isMuted;
        }

        this.bgm.volume = this.isMuted ? 0 : this.volume;
        this.saveSettings();
        return this.isMuted;
    }

    saveSettings() {
        const settings = {
            volume: this.volume,
            isMuted: this.isMuted
        };
        localStorage.setItem('sanctuaryIdle_audioSettings', JSON.stringify(settings));
    }

    loadSettings() {
        const settings = localStorage.getItem('sanctuaryIdle_audioSettings');
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                this.volume = parsed.volume !== undefined ? parsed.volume : 0.5;
                this.isMuted = parsed.isMuted !== undefined ? parsed.isMuted : false;
                this.bgm.volume = this.isMuted ? 0 : this.volume;
            } catch (e) {
                console.error("Failed to load audio settings", e);
            }
        }
    }
}

window.AudioManager = AudioManager;
