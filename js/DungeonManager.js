class DungeonManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.inDungeon = false;
        this.dungeonTimer = 0;
        this.dungeonLevel = 1; // 1 = Normal, 2 = Hard, ...
        this.killsInDungeon = 0;
        this.killsRequired = 20; // Kills to spawn Dungeon Boss
        this.dungeonBossSpawned = false;
        this.activeModifiers = []; // List of active modifier IDs

        // Save state to return to
        this.savedStage = 1;
        this.savedMonsterKills = 0;
        this.savedBossTimer = null;
    }

    startDungeon(level = 1, modifiers = []) {
        if (this.gameState.dungeonKeys < 1) {
            this.gameState.addToLog(`<span style="color:red">Not enough Dungeon Keys!</span>`);
            return false;
        }

        // Deduct Key
        this.gameState.dungeonKeys--;
        if (window.updateUI) window.updateUI(); // Force UI update

        // Save current state
        this.savedStage = this.gameState.stage;
        this.savedMonsterKills = this.gameState.monstersKilledInStage;
        this.savedBossTimer = this.gameState.bossTimer;

        // Init Dungeon State
        this.inDungeon = true;
        this.dungeonLevel = level;
        this.activeModifiers = modifiers;

        // Apply Modifiers to Init Values
        let timeLimit = 120.0;
        if (this.activeModifiers.includes('rush')) timeLimit -= 30;
        this.dungeonTimer = timeLimit;

        this.killsRequired = 20;
        if (this.activeModifiers.includes('horde')) this.killsRequired = 30; // +50%

        this.killsInDungeon = 0;
        this.dungeonBossSpawned = false;

        // Set temp stage (Visual only mostly, or used for scaling)
        // Let's say Dungeon Level 1 scales like Stage 50, Lvl 2 like Stage 100?
        // OR: Scale based on Player's Highest Stage?
        // For simple start: Dungeon Mobs scale to Current Stage but +20% stats

        // Set Random Background with console log for debug
        const bgNum = Math.floor(Math.random() * 5) + 1;
        const panel = document.getElementById('panel-center');
        if (panel) {
            // Force redraw/update
            panel.style.transition = "background-image 0.5s ease-in-out";
            const newBg = `assets/backgrounds/dungeon_${bgNum}.png`;
            panel.style.backgroundImage = `url('${newBg}')`;
            console.log("Dungeon BG Set:", newBg);
        }

        this.gameState.addToLog(`<span style="color:#cfb53b; font-weight:bold;">Entered the Dungeon! Survive and Kill!</span>`);

        // Force Spawn Dungeon Monster
        // We trick the game state slightly or handle spawn in GameState
        this.gameState.spawnMonster();

        // Update UI
        this.updateDungeonUI();
        document.getElementById('dungeon-modal').style.display = 'none';

        // Show Dungeon Title
        const titleEl = document.getElementById('dungeon-title-display');
        if (titleEl) titleEl.style.display = 'inline';

        return true;
    }

    exitDungeon(success = false) {
        this.inDungeon = false;

        // Reset Background to Default
        const panel = document.getElementById('panel-center');
        if (panel) {
            panel.style.backgroundImage = ""; // Reset to CSS default
        }

        // Restore State
        this.gameState.stage = this.savedStage;
        this.gameState.monstersKilledInStage = this.savedMonsterKills;
        this.gameState.bossTimer = this.savedBossTimer;

        // Hide Dungeon UI
        const hud = document.getElementById('dungeon-hud');
        if (hud) hud.style.display = 'none';

        // Hide Dungeon Title
        const titleEl = document.getElementById('dungeon-title-display');
        if (titleEl) titleEl.style.display = 'none';

        if (success) {
            this.gameState.addToLog(`<span style="color:#00ff00; font-weight:bold;">DUNGEON CLEARED!</span>`);
            // Show flashy notification
            if (window.showUIText) {
                window.showUIText("DUNGEON CLEARED!", window.innerWidth / 2, window.innerHeight / 3, "#00ff00");
            }
            // Or better, a central overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%);
                font-size: 3rem; color: #ffd700; font-weight: bold; text-shadow: 0 0 20px #ff0000;
                pointer-events: none; z-index: 3000; animation: fadeOut 3s forwards;
            `;
            overlay.innerText = "DUNGEON CLEARED!";
            document.body.appendChild(overlay);
            setTimeout(() => overlay.remove(), 3000);

            // Calculate Loot Bonus
            let lootBonus = 1.0;
            DungeonManager.MODIFIERS.forEach(mod => {
                if (this.activeModifiers.includes(mod.id)) {
                    lootBonus += mod.lootMult;
                }
            });

            this.gameState.addToLog(`Loot Bonus: <span style="color:#00ffff">${((lootBonus - 1) * 100).toFixed(0)}%</span>`);

            // Apply Rewards (Simple for now: Random materials or gold)
            // Ideally this calls a drop table.

            // --- RUNE DROP LOGIC ---
            // Base Chance 50% * Loot Bonus
            let runeDrops = 0;
            let chanceRemaining = 0.5 * lootBonus;

            // Handle Multi-Drops (e.g. 150% chance = 1 guaranteed + 50% for 2nd)
            while (chanceRemaining > 0) {
                if (Math.random() < chanceRemaining) {
                    runeDrops++;
                }
                chanceRemaining -= 1.0;
            }

            if (runeDrops > 0) {
                const runes = [
                    { id: 'rune_power', name: 'Rune of Power', stat: 'damage', val: 50 + (this.gameState.stage * 10), rarity: 'common', suffix: '%', icon: 'assets/runes/rune_power.png' },
                    { id: 'rune_iron', name: 'Rune of Iron', stat: 'bossDamage', val: 100 + (this.gameState.stage * 5), rarity: 'common', suffix: '%', icon: 'assets/runes/rune_iron.png' },
                    { id: 'rune_greed', name: 'Rune of Greed', stat: 'goldFind', val: 200 + (this.gameState.stage * 10), rarity: 'rare', suffix: '%', icon: 'assets/runes/rune_greed.png' },
                    { id: 'rune_vision', name: 'Rune of Vision', stat: 'magicFind', val: 50 + (this.gameState.stage * 2), rarity: 'rare', suffix: '%', icon: 'assets/runes/rune_vision.png' },
                    { id: 'rune_fury', name: 'Rune of Fury', stat: 'attackSpeed', val: 0.20, rarity: 'legendary', suffix: '%', icon: 'assets/runes/rune_fury.png' },
                    { id: 'rune_doom', name: 'Rune of Doom', stat: 'critDamage', val: 300 + (this.gameState.stage * 15), rarity: 'legendary', suffix: '%', icon: 'assets/runes/rune_doom.png' },
                    // SKILL RUNES
                    { id: 'rune_pyromancer', name: 'Rune of Pyromancer', type: 'skill', skillId: 'mage_1', stat: 'damageMult', val: 0.5, rarity: 'common', suffix: 'x Dmg', icon: 'assets/runes/rune_pyro.png' },
                    { id: 'rune_assassin', name: 'Rune of Assassin', type: 'skill', skillId: 'rogue_1', stat: 'damageMult', val: 0.5, rarity: 'common', suffix: 'x Dmg', icon: 'assets/runes/rune_assassin.png' },
                    { id: 'rune_shapeshifter', name: 'Rune of Beast', type: 'skill', skillId: 'druid_1', stat: 'clickDmgMult', val: 0.5, rarity: 'common', suffix: 'x Click', icon: 'assets/runes/rune_beast.png' }
                ];

                for (let i = 0; i < runeDrops; i++) {
                    // Rarity Roll (Scaled by Bonus)
                    // Base: 5% Leg, 25% Rare, 70% Common
                    // Bonus 2.0x -> 10% Leg, 50% Rare...
                    const rarityRoll = Math.random();
                    let rarityPool = 'common';
                    if (rarityRoll < 0.05) rarityPool = 'legendary'; // 5%
                    else if (rarityRoll < 0.25) rarityPool = 'rare'; // 20%

                    // --- DYNAMIC RUNES (Rare/Legendary Skill Mods) ---
                    // 20% Chance to generate a specialized Skill Rune instead of standard pool
                    let dynamicRune = null;
                    if (Math.random() < 0.2 && rarityPool !== 'common') {
                        const skills = ['mage_1', 'mage_2', 'rogue_1', 'paladin_1', 'barbarian_1', 'necromancer_1', 'amazon_1']; // Simplified list
                        const targetSkill = skills[Math.floor(Math.random() * skills.length)];
                        const skillName = window.t ? window.t(`skill.name.${targetSkill}`) : targetSkill;

                        if (rarityPool === 'rare') {
                            // Rune of Focus (Duration/Effect)
                            dynamicRune = {
                                id: `rune_focus_${targetSkill}`,
                                name: `Rune of Focus`,
                                type: 'skill',
                                skillId: targetSkill,
                                stat: 'duration',
                                val: 2000,
                                rarity: 'rare',
                                suffix: 's Duration',
                                skillName: skillName, // Store specific skill name
                                icon: 'assets/runes/rune_focus.png'
                            };
                        } else if (rarityPool === 'legendary') {
                            // Rune of Haste (Cooldown)
                            dynamicRune = {
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

                    let pickedRune = dynamicRune;

                    if (!pickedRune) {
                        // Filter Pool
                        const pool = runes.filter(r => r.rarity === rarityPool);
                        // Fallback if pool empty (shouldn't happen but safety)
                        const finalPool = pool.length > 0 ? pool : runes;
                        pickedRune = finalPool[Math.floor(Math.random() * finalPool.length)];
                    }
                    // Create Instance
                    const runeInstance = { ...pickedRune, uid: Date.now() + Math.random() };

                    // Add to GameState
                    this.gameState.addRune(runeInstance);

                    // Fancy Log
                    const color = runeInstance.rarity === 'legendary' ? '#ff8000' : (runeInstance.rarity === 'rare' ? '#ffd700' : '#cfb53b');
                    this.gameState.addToLog(`<span style="color:${color}; font-weight:bold;">✨ FOUND: ${runeInstance.name} (${runeInstance.rarity.toUpperCase()})</span>`);
                }
            }

            // TRIGGER RUNE FORGE
            if (window.openRuneForge) {
                setTimeout(() => window.openRuneForge(), 1500); // Small delay for dramatic effect
            }
        } else {
            this.gameState.addToLog(`<span style="color:red; font-weight:bold;">Dungeon Failed! Time ran out.</span>`);
        }

        // Respawn normal world monster
        this.gameState.spawnMonster();
    }

    update(dt) {
        if (!this.inDungeon) return;

        // Timer Logic
        this.dungeonTimer -= dt;
        if (this.dungeonTimer <= 0) {
            this.dungeonTimer = 0;
            this.exitDungeon(false); // Fail
            return;
        }

        // Update UI every tick (or throttle if needed)
        this.updateDungeonUI();
    }

    onMonsterDeath() {
        if (!this.inDungeon) return;

        if (this.dungeonBossSpawned) {
            // BOSS DEAD -> WIN!
            this.exitDungeon(true);
            return;
        }

        this.killsInDungeon++;

        // Check for Boss Spawn
        if (this.killsInDungeon >= this.killsRequired) {
            this.spawnDungeonBoss();
        } else {
            // Force Respawn handled by GameState, but we ensure it's a dungeon mob
        }

        // Ensure UI updates
        this.updateDungeonUI();
    }

    spawnDungeonBoss() {
        this.dungeonBossSpawned = true;
        this.gameState.currentMonster = new window.Monster(this.gameState.stage, true);

        // Base Stats
        this.gameState.currentMonster.name = "Dungeon Guardian";
        this.gameState.currentMonster.maxHp *= 5; // Base tough

        // Modifier: Titan
        if (this.activeModifiers.includes('titan')) {
            this.gameState.currentMonster.maxHp *= 2;
            this.gameState.currentMonster.name = "Titan Guardian";
        }

        this.gameState.currentMonster.currentHp = this.gameState.currentMonster.maxHp;
        this.gameState.currentMonster.isBoss = true;

        this.gameState.addToLog(`<span style="color:#ff0000; font-size:1.1rem; font-weight:bold;">THE GUARDIAN AWAKENS!</span>`);
    }

    updateDungeonUI() {
        const hud = document.getElementById('dungeon-hud');
        if (!hud) return;

        hud.style.display = 'flex';

        const timerEl = document.getElementById('dungeon-timer');
        const progressEl = document.getElementById('dungeon-progress-text');
        const barEl = document.getElementById('dungeon-progress-bar');

        if (timerEl) timerEl.innerText = this.dungeonTimer.toFixed(1) + 's';

        if (this.dungeonBossSpawned) {
            if (progressEl) progressEl.innerText = "BOSS FIGHT";
            if (barEl) barEl.style.width = "100%";
            if (barEl) barEl.style.backgroundColor = "#ff0000";
        } else {
            if (progressEl) progressEl.innerText = `${this.killsInDungeon} / ${this.killsRequired}`;
            const pct = (this.killsInDungeon / this.killsRequired) * 100;
            if (barEl) barEl.style.width = pct + "%";
            if (barEl) barEl.style.backgroundColor = "#cfb53b";
        }
    }
}

DungeonManager.MODIFIERS = [
    { id: 'regen', name: 'Regenerating', desc: 'Enemies heal 2% HP/sec', lootMult: 0.25 },
    { id: 'tanky', name: 'Tanky', desc: 'Enemies have +50% HP', lootMult: 0.20 },
    { id: 'rush', name: 'Rush', desc: '-30s Dungeon Timer', lootMult: 0.15 },
    { id: 'horde', name: 'Horde', desc: '+50% Kills required', lootMult: 0.25 },
    { id: 'titan', name: 'Titan', desc: 'Boss HP +100%', lootMult: 0.30 }
];

window.DungeonManager = DungeonManager;
