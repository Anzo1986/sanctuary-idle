class SaveManager {
    constructor() {
        this.STORAGE_KEY = 'sanctuary_idle_save_v1';
    }

    save(gameState) {
        try {
            const data = gameState.exportState();
            const serialized = JSON.stringify(data);
            localStorage.setItem(this.STORAGE_KEY, serialized);
            console.log('Game Saved at', new Date().toLocaleTimeString());
            return true;
        } catch (e) {
            console.error('Save Failed:', e);
            return false;
        }
    }

    load() {
        try {
            const serialized = localStorage.getItem(this.STORAGE_KEY);
            if (!serialized) return null;
            return JSON.parse(serialized);
        } catch (e) {
            console.error('Load Failed:', e);
            return null;
        }
    }

    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        window.location.reload();
    }
}

window.SaveManager = SaveManager;
