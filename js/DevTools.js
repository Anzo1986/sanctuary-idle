
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

window.devSpawnRune = function () {
    if (!window.gameState) return;

    const runes = [
        { id: 'rune_power', name: 'Rune of Power', stat: 'damage', val: 50 + (window.gameState.stage * 10), rarity: 'common', suffix: '%', icon: 'assets/runes/rune_power.png' },
        { id: 'rune_iron', name: 'Rune of Iron', stat: 'bossDamage', val: 100 + (window.gameState.stage * 5), rarity: 'common', suffix: '%', icon: 'assets/runes/rune_iron.png' },
        { id: 'rune_greed', name: 'Rune of Greed', stat: 'goldFind', val: 200 + (window.gameState.stage * 10), rarity: 'rare', suffix: '%', icon: 'assets/runes/rune_greed.png' },
        { id: 'rune_vision', name: 'Rune of Vision', stat: 'magicFind', val: 50 + (window.gameState.stage * 2), rarity: 'rare', suffix: '%', icon: 'assets/runes/rune_vision.png' },
        { id: 'rune_fury', name: 'Rune of Fury', stat: 'attackSpeed', val: 0.20, rarity: 'legendary', suffix: '%', icon: 'assets/runes/rune_fury.png' },
        { id: 'rune_doom', name: 'Rune of Doom', stat: 'critDamage', val: 300 + (window.gameState.stage * 15), rarity: 'legendary', suffix: '%', icon: 'assets/runes/rune_doom.png' },
        // SKILL RUNES
        { id: 'rune_pyromancer', name: 'Rune of Pyromancer', type: 'skill', skillId: 'mage_1', stat: 'damageMult', val: 0.5, rarity: 'common', suffix: 'x Dmg', icon: 'assets/runes/rune_pyro.png' },
        { id: 'rune_assassin', name: 'Rune of Assassin', type: 'skill', skillId: 'rogue_1', stat: 'damageMult', val: 0.5, rarity: 'common', suffix: 'x Dmg', icon: 'assets/runes/rune_assassin.png' },
        { id: 'rune_shapeshifter', name: 'Rune of Beast', type: 'skill', skillId: 'druid_1', stat: 'clickDmgMult', val: 0.5, rarity: 'common', suffix: 'x Click', icon: 'assets/runes/rune_beast.png' }
    ];

    let pickedRune = runes[Math.floor(Math.random() * runes.length)];

    // Dynamic Skill Rune Logic for Rare/Legendary
    if (Math.random() < 0.3) {
        const skills = ['mage_1', 'mage_2', 'rogue_1', 'paladin_1', 'barbarian_1', 'necromancer_1', 'amazon_1'];
        const targetSkill = skills[Math.floor(Math.random() * skills.length)];
        const skillName = window.t ? window.t(`skill.name.${targetSkill}`) : targetSkill;

        if (Math.random() < 0.5) {
            pickedRune = {
                id: `rune_focus_${targetSkill}`,
                name: `Rune of Focus`,
                type: 'skill',
                skillId: targetSkill,
                stat: 'duration',
                val: 2000,
                rarity: 'rare',
                suffix: 's Duration',
                skillName: skillName,
                icon: 'assets/runes/rune_focus.png'
            };
        } else {
            pickedRune = {
                id: `rune_haste_${targetSkill}`,
                name: `Rune of Haste`,
                type: 'skill',
                skillId: targetSkill,
                stat: 'cooldown',
                val: -1000,
                rarity: 'legendary',
                suffix: 's Cooldown',
                skillName: skillName,
                icon: 'assets/runes/rune_haste.png'
            };
        }
    }

    const runeInstance = { ...pickedRune, uid: Date.now() + Math.random() };
    window.gameState.addRune(runeInstance);

    // Log
    const color = runeInstance.rarity === 'legendary' ? '#ff8000' : (runeInstance.rarity === 'rare' ? '#ffd700' : '#cfb53b');
    window.gameState.addToLog(`<span style="color:${color}; font-weight:bold;">[DEV] Spawned Rune: ${runeInstance.name}</span>`);
};
