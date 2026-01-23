const CACHE_NAME = 'sanctuary-idle-v58';
const ASSETS = [
    './',
    './index.html',
    './styles/main.css',
    './styles/combat.css',
    './assets/ui/splash.png',
    './assets/ui/paragon_door.png',
    './js/main.js',
    './js/GameState.js',
    './js/Unit.js',
    './js/Item.js',
    './js/Monster.js',
    './js/Inventory.js',
    './js/Upgrade.js',
    './js/SkillManager.js',
    './js/ReincarnationManager.js',
    './js/AscensionManager.js',
    './js/Paragon.js',
    './js/AchievementManager.js',
    './js/SaveSystem.js',
    './js/MerchantManager.js',
    './js/AudioManager.js',
    './js/DevTools.js',
    './js/LocalizationManager.js',
    './js/translations.js',
    './js/ReincarnationUI.js'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) {
                            return caches.delete(key);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
