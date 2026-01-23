
// Dev Tools Logic

// Open Modal
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-dev');
    const modal = document.getElementById('dev-modal');
    const close = document.getElementById('close-dev');

    if (btn && modal) {
        btn.onclick = () => {
            modal.style.display = 'flex';
        };
    }

    if (close && modal) {
        close.onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Populate Unique Select
    const uniqueSelect = document.getElementById('dev-unique-select');
    if (uniqueSelect && window.UNIQUE_EFFECTS) {
        window.UNIQUE_EFFECTS.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = `${u.id} (${u.desc.substring(0, 30)}...)`;
            uniqueSelect.appendChild(opt);
        });
    }

    console.log("Dev Tools Initialized");
});

window.devSpawnSelectedUnique = function () {
    if (!window.gameState) return;
    const select = document.getElementById('dev-unique-select');
    if (!select || !select.value) {
        window.gameState.addToLog(`<span style="color:red">[DEV] Please select a Unique first.</span>`);
        return;
    }

    const effectId = select.value;
    const stage = window.gameState.stage || 50;

    // Pick a random slot to spawn it in
    const slots = ['head', 'chest', 'hands', 'legs', 'mainhand', 'amulet'];
    const randomSlot = slots[Math.floor(Math.random() * slots.length)];

    // Use Helper
    if (window.ItemConstructorHelper) {
        const item = window.ItemConstructorHelper.createUniqueWithEffect(effectId, stage, randomSlot);
        if (item) {
            if (window.gameState.inventoryManager.addItem(item)) {
                window.gameState.addToLog(`<span style="color:#cfb53b">[DEV] Spawned Unique: ${item.name}</span>`);
                window.renderInventory();
            } else {
                window.gameState.addToLog(`<span style="color:red">[DEV] Inventory Full!</span>`);
            }
        } else {
            window.gameState.addToLog(`<span style="color:red">[DEV] Failed to create item.</span>`);
        }
    }
};

window.devAdd = function (resource, amount) {
    if (!window.gameState) return;

    // Handle different resource types or direct property modification
    if (typeof window.gameState[resource] === 'number') {
        window.gameState[resource] += amount;
    } else {
        // Fallback for addResource method if it exists, or specialized handling
        // But main.js usually uses direct assignment for cinders/gold in simple logic or addResource
        if (resource === 'bossEssence') window.gameState.bossEssence += amount;
        if (resource === 'divinity' && window.gameState.reincarnationManager) window.gameState.reincarnationManager.divinity += amount;
        if (resource === 'skillPoints' && window.gameState.skillManager) window.gameState.skillManager.addSkillPoint(amount);
    }

    window.gameState.reincarnationManager.divinity = window.gameState.reincarnationManager.divinity || 0; // Ensure it's not NaN if initialized late

    window.gameState.recalculateStats();
    window.updateUI();
    window.gameState.addToLog(`<span style="color:#aaa">[DEV] Added ${amount} ${resource}</span>`);
};

window.devAddItem = function () {
    if (!window.gameState) return;

    // Force Legendary Drop
    const stage = window.gameState.stage || 30;
    // Mock Legendary Rarity
    const rarity = window.RARITY.LEGENDARY;
    // Or call rollDrop with ridiculous MF?
    // Better: explicit constructor
    // Items need specific slot...
    const slots = window.SLOTS;
    const slot = slots[Math.floor(Math.random() * slots.length)];

    const item = new window.Item(slot, rarity, stage);
    if (window.gameState.inventoryManager.addItem(item)) {
        window.gameState.addToLog(`<span style="color:orange">[DEV] Spawned Legendary ${item.name}</span>`);
    } else {
        window.gameState.addToLog(`<span style="color:red">[DEV] Inventory Full!</span>`);
    }

    window.renderInventory();
};

window.devAddSetItem = function () {
    if (!window.gameState) return;

    // Force Legendary then convert to Set
    const stage = window.gameState.stage || 50;
    const rarity = window.RARITY.LEGENDARY;
    const slots = window.SLOTS;
    const slot = slots[Math.floor(Math.random() * slots.length)];

    const item = new window.Item(slot, rarity, stage);
    // Force Set Conversion
    item.makeSetItem();

    // Safety: Ensure it became a set (it should effectively be manually set now)

    if (window.gameState.inventoryManager.addItem(item)) {
        window.gameState.addToLog(`<span style="color:#00ffff">[DEV] Spawned Set Item ${item.name}</span>`);
    } else {
        window.gameState.addToLog(`<span style="color:red">[DEV] Inventory Full!</span>`);
    }

    window.renderInventory();
};

window.devSkipToBoss = function () {
    if (!window.gameState) return;
    window.gameState.monstersKilledInStage = 10;
    window.gameState.spawnMonster();
    window.gameState.addToLog(`<span style="color:red">[DEV] Skipped to Boss!</span>`);
    window.updateUI();
};

window.devKillBoss = function () {
    if (!window.gameState) return;
    const monster = window.gameState.currentMonster;
    if (monster) {
        monster.currentHp = 0;
        window.gameState.onMonsterDeath();
        window.gameState.addToLog(`<span style="color:red">[DEV] INSTANT KILL!</span>`);
    }
};
