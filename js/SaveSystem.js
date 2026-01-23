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

    exportSaveToString(gameState) {
        try {
            const data = gameState.exportState();
            const json = JSON.stringify(data);
            // Simple Base64 encoding (UTF-8 safe wrapper)
            const base64 = btoa(unescape(encodeURIComponent(json)));
            return base64;
        } catch (e) {
            console.error('Export Failed:', e);
            return null;
        }
    }

    importSaveFromString(str) {
        try {
            if (!str) return null;
            // Decode Base64
            const json = decodeURIComponent(escape(atob(str)));
            const data = JSON.parse(json);
            return data;
        } catch (e) {
            console.error('Import Failed (Invalid Data):', e);
            return null;
        }
    }
}

window.SaveManager = SaveManager;
