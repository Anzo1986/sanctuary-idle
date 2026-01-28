class GameState {
    constructor() {
        this.cinders = 0;
        this.gold = 0;
        this.materials = 0; // New resource: Arcane Dust
        this.bossEssence = 0; // New resource: Boss Essence
        this.dungeonKeys = 0; // Dungeon Keys
        this.stage = 1;

        this.monstersKilledInStage = 0;
        this.currentMonster = null;

        // Base Stats
        this.baseClickDamage = 1;
        this.baseDps = 0;

        // Pause State
        this.isPaused = false;

        // Skill System
        this.skillPoints = 0;
        this.purchasedSkills = [];

        // Managers
        this.unitManager = new window.UnitManager(this);
        this.inventoryManager = new window.InventoryManager(this);
        this.upgradeManager = new window.UpgradeManager(this);
        this.paragonManager = new window.ParagonManager(this);
        this.ascensionManager = new window.AscensionManager(this);

        this.reincarnationManager = new window.ReincarnationManager(this);
        this.merchantManager = new window.MerchantManager(this);
        this.dungeonManager = new window.DungeonManager(this);

        // Skill Buffs
        this.buffs = {
            // Mage
            cinderBonusExpires: 0,
            // Paladin
            divineAegisExpires: 0,
            auraOfMightExpires: 0,
            smiteDebuffExpires: 0,
            holyLightDebuffExpires: 0,
            // Necromancer
            curseExpires: 0,
            // Druid
            clickPowerExpires: 0,
            naturesGraceExpires: 0,
            // Barbarian
            battleShoutExpires: 0,
            bashDebuffExpires: 0,
            ironSkinExpires: 0,
            // Amazon
            strafeExpires: 0,
            criticalStrikeExpires: 0
        };

        // Timer for Thorns
        this.thornsTimer = 0;
        this.bossTimerFrozen = 0; // Timestamp for unfreeze
        this.achievementManager = new window.AchievementManager(this);
        this.nextBuffExpiry = Infinity;

        // Generic Buffs & DoTs
        this.activeBuffs = []; // [{id, expires, icon, name}]
        this.activeDots = [];
        this.bossesSinceLastKey = 0; // Pity timer for keys // [{type, dps, duration, timer}]



        if (window.SkillManager) {
            this.skillManager = new window.SkillManager(this);
        } else {
            console.error("Critical: SkillManager class is missing!");
            this.skillManager = null;
        }

        // Inventory Data
        this.units = {};
        this.inventory = [];
        this.equipment = {
            head: null, chest: null, hands: null, legs: null,
            mainhand: null, amulet: null
        };

        // Cache for calculated stats
        this.totalDps = 0;
        this.totalClickDamage = 0;

        // Attack Speed Logic
        this.attackTimer = 0;
        this.baseAttackSpeed = 1.0; // Attacks per second

        this.multipliers = {
            damage: 1,
            attackSpeed: 1.0, // Multiplier (1.0 = 100%)
            gold: 1,
            cinders: 1,
            critChance: 5,
            critDamage: 150 // Base 150% (1.5x)
        };

        this.log = [];
        this.lastMeteorTime = Date.now();
        this.meteorTimer = 0;

        // Auto Salvage Settings
        this.autoSalvage = {
            normal: false,
            magic: false,
            rare: false,
            epic: false
        };

        // Unique Mechanics State
        this.activeEffects = [];
        this.thunderStacks = 0;
        this.activeClones = []; // { duration: 10.0, attackTimer: 0 }
        this.shadowCloneCooldown = 0;



        // Statistics (Persistent)
        this.stats = {
            totalClicks: 0,
            totalBossKills: 0,
            totalLegendariesFound: 0,
            totalSetsFound: 0,
            totalUniquesFound: 0,
            totalUpgrades: 0,
            totalUnits: 0
        };

        this.spawnMonster();
    }

    update(dt) {
        // Dungeon Logic Delegation
        if (this.dungeonManager && this.dungeonManager.inDungeon) {
            this.dungeonManager.update(dt);

            // Dungeon Modifier: Regenerating
            if (this.dungeonManager.activeModifiers.includes('regen') &&
                this.currentMonster && this.currentMonster.currentHp > 0 &&
                this.currentMonster.currentHp < this.currentMonster.maxHp) {

                const regenAmount = this.currentMonster.maxHp * 0.02 * dt; // 2% per sec
                this.currentMonster.currentHp += regenAmount;
                if (this.currentMonster.currentHp > this.currentMonster.maxHp) {
                    this.currentMonster.currentHp = this.currentMonster.maxHp;
                }
            }
        }

        // Mage Ability: Meteor (T5) - Every 10s
        if (this.ascensionManager.hasAbility('meteor')) {
            // dt is in seconds (e.g. 0.033). If missing, assume 16ms (0.016s). BUT allow 0!
            const safeDt = (dt !== undefined) ? dt : 0.016;
            this.meteorTimer += safeDt;

            if (this.meteorTimer >= 10.0) {
                this.meteorTimer = 0;

                const dmg = (this.averageDps || this.totalDps) * 5;
                const result = this.damageMonster(dmg, true);
                this.addToLog(`<span style="color:#ff00ff">Meteor! dealt ${window.formatNumber(dmg)} dmg</span>`);

                if (window.showCombatEffect) window.showCombatEffect("☄️ METEOR!", "#ff00ff");
            }
        }

        this.updateBuffs(dt);

        // Check for buff expirations to update stats immediately
        if (Date.now() >= this.nextBuffExpiry) {
            this.recalculateStats();
        }
        this.updateDots(dt);

        // Boss Timer Logic
        if (this.bossTimer !== null) {
            // Check for Frost Nova Freeze
            if (this.bossTimerFrozen && this.bossTimerFrozen > Date.now()) {
                // Timer is frozen, do not decrement
            } else {
                this.bossTimerFrozen = null; // Clear if expired
                this.bossTimer -= dt;
                if (this.bossTimer <= 0) {
                    this.bossTimer = 0;
                    this.failBoss();
                }
            }
        }

        // Shadow Clone Cooldown
        if (this.shadowCloneCooldown > 0) {
            this.shadowCloneCooldown -= dt;
        }

        // Check Achievements periodically
        this.achievementTimer = (this.achievementTimer || 0) + dt;
        if (this.achievementTimer >= 1.0) {
            this.achievementTimer = 0;
            if (this.achievementManager) this.achievementManager.checkAchievements();
        }

        // Barbarian: Iron Skin (Thorns)
        // Deals {thorns}% Click Damage to monster every second
        if (this.buffs && this.buffs.ironSkinExpires > Date.now()) {
            this.thornsTimer = (this.thornsTimer || 0) + dt;
            if (this.thornsTimer >= 1.0) {
                this.thornsTimer = 0;
                // Deal Thorns Damage (Dynamic)
                const stats = this.skillManager ? this.skillManager.getSkillStats('barbarian_4') : null;
                const mult = stats ? stats.thornsMult : 5;

                const thornsDmg = (this.totalClickDamage || 1) * mult;
                if (window.showCombatEffect) window.showCombatEffect("🛡️ Thorns", "#aaaaaa");
                this.damageMonster(thornsDmg, true, 'skill'); // Source 'skill' to avoid loops
            }
        } else {
            this.thornsTimer = 0;
        }
    }

    /*
    triggerAutoAttack() {
        // 1. Deal Main Damage
        this.damageMonster(this.totalDps, true, 'auto');

        // 2. Check for Echo of Thunder (Item or Ascension)
        const hasEchoItem = this.activeEffects && this.activeEffects.includes('echo_thunder');
        const ascEcho = this.ascensionManager.getMultipliers().echoThunder; // boolean or value? usually boolean flag

        if (hasEchoItem || ascEcho) {
            let echoChance = 0.20; // Base 20% (Item)
            // If Ascension T8 selected, maybe increase chance or just enable? 
            // "Echo of Thunder (Global)" usually implies 100% or same chance?
            // Let's assume 20% base.

            if (Math.random() < echoChance) {
                const thunderDmg = (this.totalDps || 0) * 0.5; // 50% DPS
                this.damageMonster(thunderDmg, true, 'proc');
                if (window.showCombatEffect) window.showCombatEffect("⚡ ECHO", "#00ffff");
            }
        }
    }
    */

    addResource(type, amount) {
        if (type === 'cinders') this.cinders += amount;
        if (type === 'gold') this.gold += amount;
        if (type === 'materials') this.materials += amount;
        if (type === 'essence') this.bossEssence += amount;
        if (type === 'dungeonKeys') this.dungeonKeys += amount;
    }

    addToLog(msg) {
        const time = new Date().toLocaleTimeString();
        this.log.unshift(`<span style="color:#666; font-size:0.8em;">[${time}]</span> ${msg}`);
        if (this.log.length > 20) this.log.pop();

        // Force UI update for log if possible, or wait for next frame
        // window.updateUI(); // Might cause lag if called too often
    }

    addRune(rune) {
        if (!this.dungeonRunes) this.dungeonRunes = [];
        this.dungeonRunes.push(rune);
    }

    removeRune(index) {
        if (this.dungeonRunes && index > -1 && index < this.dungeonRunes.length) {
            this.dungeonRunes.splice(index, 1);
            return true;
        }
        return false;
    }

    // Delegated Methods
    buyUnit(unitId, amount = 1) {
        const success = this.unitManager.buyUnit(unitId, amount);
        if (success) {
            this.recalculateStats();
        }
        return success;
    }

    getNextBuffExpiry() {
        let min = Infinity;
        const now = Date.now();
        if (this.buffs) {
            for (const key in this.buffs) {
                const val = this.buffs[key];
                // Check if buff is active (expiry in future)
                if (typeof val === 'number' && val > now) {
                    if (val < min) min = val;
                }
            }
        }
        return min; // Returns Infinity if no active buffs
    }

    recalculateStats() {
        // ... (Lines 84-91 stay same, implicit)
        // 1. Equipment Bonuses
        const equipMults = this.inventoryManager.calculateMultipliers();
        this.skillBonuses = equipMults.skillBonuses || {}; // Store for SkillManager
        // 2. Upgrade Bonuses
        const upgradeBonuses = this.upgradeManager.getMultipliers();
        // 3. Paragon Bonuses
        const paragonBonuses = this.paragonManager.getMultipliers();
        // 4. Ascension Bonuses
        const ascBonuses = this.ascensionManager.getMultipliers();
        // 5. Reincarnation Bonuses
        const reincarnatus = this.reincarnationManager.getMultipliers();
        // 6. Achievement Bonuses
        const achievementBonuses = this.achievementManager.getMultipliers();

        // Calculate Multipliers
        // Additive logic for Reincarnation bonuses (or Multiplicative? Let's do additive to base 1).

        // Damage
        this.multipliers.damage = 1
            + (equipMults.damage / 100)
            + upgradeBonuses.globalDpsMult
            + (paragonBonuses.damage / 100)
            + (ascBonuses.globalMult || 0)
            + reincarnatus.damage // e.g. 0.10
            + achievementBonuses.damage;

        // Barbarian: Battle Shout
        if (this.buffs.battleShoutExpires > Date.now()) {
            this.multipliers.damage *= 1.5; // x1.5 Multiplicative (was +0.5 additive)
        }

        // Necro T2: Stage Scaling (+1% Global Dmg per 10 Stages)
        if (ascBonuses.stageScaling) {
            // e.g. Stage 100 -> 10 * 0.01 = +0.10 (10%)
            this.multipliers.damage += (ascBonuses.stageScaling * Math.floor(this.stage / 10));
        }

        // Gold
        this.multipliers.gold = 1
            + (equipMults.gold / 100)
            + upgradeBonuses.goldMult
            + (paragonBonuses.gold / 100)
            + (ascBonuses.goldMult || 0)
            + reincarnatus.gold
            + achievementBonuses.gold;

        // Cinders
        this.multipliers.cinders = (equipMults.cinders || 1)
            + ((paragonBonuses.cinderGain || 0) / 100)
            + ((upgradeBonuses.cinderGain || 0) / 100)
            + ((ascBonuses.cinderGain || 0) / 100)
            + (reincarnatus.cinderGain || 0)
            + achievementBonuses.cinders;

        // Crit Chance
        this.multipliers.critChance = 5
            + equipMults.critChance
            + upgradeBonuses.critChanceFlat
            + paragonBonuses.critChance
            + (ascBonuses.critChance || 0)
            + reincarnatus.critChance
            + achievementBonuses.critChance;

        // Amazon: Critical Strike
        // Now handles Damage Multiplication in damageMonster instead of Stat Manipulation

        // Crit Damage
        this.multipliers.critDamage = 150 + (equipMults.critDamage || 0) + (paragonBonuses.critDamage || 0) + achievementBonuses.critDamage;

        // New Stats
        this.multipliers.heroDamage = 1 + ((equipMults.heroDamage || 0) / 100) + ((paragonBonuses.heroDamage || 0) / 100) + ((upgradeBonuses.heroDamage || 0) / 100) + (achievementBonuses.heroDamage || 0);
        this.multipliers.bossDamage = 1 + ((equipMults.bossDamage || 0) / 100) + ((paragonBonuses.bossDamage || 0) / 100) + ((upgradeBonuses.bossDamage || 0) / 100) + (achievementBonuses.bossDamage || 0);

        if (ascBonuses.bossDamageTaken) this.multipliers.bossDamage += (ascBonuses.bossDamageTaken / 100);

        this.multipliers.magicFind = (equipMults.magicFind || 0) + (paragonBonuses.magicFind || 0) + (upgradeBonuses.magicFind || 0) + (ascBonuses.magicFind || 0) + (achievementBonuses.magicFind || 0);
        this.multipliers.rareFind = (ascBonuses.rareFind || 0); // Store Rare Find
        this.multipliers.doubleDamageChance = (equipMults.doubleDamage || 0) + (paragonBonuses.doubleDamage || 0) + (upgradeBonuses.doubleDamage || 0) + achievementBonuses.doubleDamage;

        // Attack Speed (Additive %)
        // Base 1.0 (100%) + (Equipment% / 100) + (Ascension% / 100)
        // Can add Paragon/Upgrade sources later
        this.multipliers.attackSpeed = 1.0 + ((equipMults.attackSpeed || 0) / 100) + ((ascBonuses.attackSpeed || 0) / 100) + ((paragonBonuses.attackSpeed || 0) / 100);

        // Amazon: Strafe
        if (this.buffs.strafeExpires > Date.now()) {
            this.multipliers.attackSpeed *= 2.0; // x2 Multiplier
        }

        // Store Cost Reduction for UI usage
        // Reincarnation + Necro T5 (Army of the Dead: -50% Unit Costs)
        let armyBonus = 0;
        if (ascBonuses.abilities.includes('army')) {
            armyBonus = 0.20; // 20% Cost Reduction
        }
        this.multipliers.costReduction = Math.min(0.90, (reincarnatus.costReduction || 0) + armyBonus);

        // ABILITY IMPLEMENTATIONS


        // Barbarian T5: Whirlwind (Double Hit = +20% Double Dmg Chance)
        if (ascBonuses.abilities.includes('whirlwind')) {
            this.multipliers.doubleDamageChance += 20;
        }

        // Druid T6: Primal Instinct (Handled in SkillManager/calculateClickDamage)
        // Removed World Tier global multipliers
        if (ascBonuses.abilities.includes('primal_instinct')) {
            // No global stat changes, effect is on Shapeshift skill
        }

        // Store Unique Effects
        this.activeEffects = equipMults.activeEffects || [];

        // --- Paladin Buffs ---
        if (this.buffs.divineAegisExpires > Date.now()) {
            this.multipliers.critDamage *= 2; // Multiplicative x2
        }

        // Apply Diminishing Returns to Double Damage Chance
        // Cap at 80% with exponential approach
        this.multipliers.rawDoubleDamage = this.multipliers.doubleDamageChance; // Preserve for UI
        this.multipliers.doubleDamageChance = this.applyDiminishingReturns(this.multipliers.doubleDamageChance * 0.5, 80);

        // Calculate Totals
        const unitDps = this.unitManager.calculateTotalDps();
        this.totalDps = unitDps * this.multipliers.damage * this.multipliers.heroDamage;

        // Click Damage
        const baseClick = this.baseClickDamage + upgradeBonuses.clickDamageFlat;
        const clickPercentInfo = equipMults.clickDamage || 0;
        const paragonClickPercent = paragonBonuses.clickDamage || 0;
        const ascClickPercent = ascBonuses.clickDamagePct || 0;
        const achievementClickPercent = achievementBonuses.clickDamage || 0;

        // Weapon Flat Damage
        const weaponFlat = (this.equipment.mainhand && this.equipment.mainhand.clickDamageFlat) ? this.equipment.mainhand.clickDamageFlat : 0;

        // Paladin Holy Shield Integration: Click Damage += 10% Minion DPS
        let holyShieldBonus = 0;
        if (ascBonuses.abilities.includes('holy_shield')) {
            holyShieldBonus = Math.floor(this.unitManager.calculateTotalDps() * 0.10);
        }

        // Base Synergy: Always grant 1% of Unit DPS to Click Damage (ensures relevance)
        const baseSynergy = Math.floor(this.unitManager.calculateTotalDps() * 0.01);

        // Store percentage for UI
        this.multipliers.clickDamagePct = (clickPercentInfo + paragonClickPercent + ascClickPercent + achievementClickPercent);

        this.totalClickDamage = (baseClick + weaponFlat + holyShieldBonus + baseSynergy) * this.multipliers.damage * (1 + this.multipliers.clickDamagePct / 100);

        // --- Calculate Average DPS (Visual Representation of Power) ---
        // New Additive Average Calculation
        const calcAvgMult = () => {
            const chance = this.multipliers.critChance;
            const damageMult = this.multipliers.critDamage / 100;

            if (chance <= 0) return 1;

            // Average Tier = Chance / 100 (e.g. 307% -> 3.07 tiers)
            // Formula: 1 + AvgTier * (Mult - 1)
            const avgTier = chance / 100;
            const avgMultiplier = 1 + (avgTier * (damageMult - 1));

            return avgMultiplier;
            return avgMultiplier;
        };

        const critAvgMult = calcAvgMult();
        // Double Damage
        let doubleMult = 1;
        if (this.multipliers.doubleDamageChance > 0) {
            doubleMult = 1 + (this.applyDiminishingReturns(this.multipliers.doubleDamageChance, 100) / 100);
            // Note: GameState uses 80 cap elsewhere? Let's generic it or just use 1 + pct/100
            // Actually main logic uses multiplier directly. Visual DPS should reflect it.
            // Let's use simple logic:
            doubleMult = 1 + (this.multipliers.doubleDamageChance / 100);
        }

        // Average DPS for display (considering crit)
        // Note: We clamp crit chance for visual average to match the 50-tier cap in combat
        const effectiveCritChance = Math.min(this.multipliers.critChance, 50000); // 50,000% Virtual Cap (High enough)
        let avgCritMult = 1 + (effectiveCritChance / 100) * ((this.multipliers.critDamage / 100) - 1);

        // Cap Removed

        this.averageDps = this.totalDps * avgCritMult * doubleMult * this.multipliers.attackSpeed;

        // NEW: Average Click Damage (Base + Crit Average)
        // Matches the logic above to better represent actual click output
        this.averageClickDamage = this.totalClickDamage * avgCritMult * doubleMult;

        // Apply visual cap to click damage if needed? No, let user see the huge number.

        // Schedule next update based on earliest buff expiration
        this.nextBuffExpiry = this.getNextBuffExpiry();
    }

    softReset() {
        const maxStageReached = this.stage;
        let preservedLevel = 10;

        if (this.reincarnationManager) {
            // New Blessing: Preservation (Value 2 = +2 Levels per rank)
            const retentionBonus = (this.reincarnationManager.blessings.preservation || 0) * 2;
            preservedLevel += retentionBonus;
        }

        // Cap at Max Stage Reached (cannot upgrade items by reincarnating early)
        if (preservedLevel > maxStageReached) preservedLevel = maxStageReached;

        console.log(`Reincarnation: Downgrading Items to Level ${preservedLevel} (Max Stage: ${maxStageReached})`);

        // Apply to Inventory
        this.inventory.forEach(item => {
            if (item && typeof item.adjustLevel === 'function') {
                item.adjustLevel(preservedLevel);
                // Reset Upgrades too? 
                // "getragenen items sowie die items im inventar auf level 10 herabgestuft werden"
                // Usually upgrade level (Reinforce +1) is separate from Item Level (Stage).
                // Assuming Upgrade Level persists or user didn't specify.
                // Keeping upgrades is friendlier.
            }
        });

        // Apply to Equipment
        Object.values(this.equipment).forEach(item => {
            if (item && typeof item.adjustLevel === 'function') {
                item.adjustLevel(preservedLevel);
            }
        });


        this.gold = 0;
        this.cinders = 0;
        this.materials = 0;

        // Reset Stage
        const startBonus = (this.reincarnationManager && this.reincarnationManager.getMultipliers().startStage) || 0;
        this.stage = 1 + startBonus;
        this.monstersKilledInStage = 0;

        // Reset Units
        this.unitManager.reset();

        // Reset Upgrades
        this.upgradeManager.reset();

        // Calculations
        this.recalculateStats();
        this.spawnMonster();
        window.updateUI();

        // Force Item UI Refresh
        if (window.renderInventory) window.renderInventory();
    }

    spawnMonster() {
        // Dungeon Handling
        if (this.dungeonManager && this.dungeonManager.inDungeon) {
            // If Dungeon Boss is supposedly spawned via manager, do nothing or handle it there
            if (this.dungeonManager.dungeonBossSpawned) {
                // Manager handles it
                return;
            }
            // Spawn Dungeon Mob
            const scalingStage = this.stage; // Or custom dungeon level logic
            this.currentMonster = new window.Monster(scalingStage, false);
            this.currentMonster.name = "Dungeon " + this.currentMonster.name;
            // Buff Dungeon Mobs slightly?
            let hpMult = 1.2;
            if (this.dungeonManager.activeModifiers.includes('tanky')) hpMult += 0.5; // +50%

            this.currentMonster.maxHp = Math.ceil(this.currentMonster.maxHp * hpMult);
            this.currentMonster.currentHp = this.currentMonster.maxHp;
            this.bossTimer = null;
            return;
        }

        const isBoss = this.monstersKilledInStage >= 10;
        this.currentMonster = new window.Monster(this.stage, isBoss);

        // Apply Reincarnation Blessings Multipliers
        // (Damage/Gold/etc handled in recalculateStats or onDeath, but HP/Spawn logic is here)
        if (this.reincarnationManager) {
            const mults = this.reincarnationManager.getMultipliers();

            // 1. Thanatos' Gaze: Reduce Max HP
            if (mults.monsterHpRed > 0) {
                // Max reduction clamped in ReincarnationManager (Max 50%)
                this.currentMonster.maxHp = Math.floor(this.currentMonster.maxHp * (1 - mults.monsterHpRed));
                this.currentMonster.currentHp = this.currentMonster.maxHp;
            }

            // 2. Alpha Monster Chance (Base 1% + Bonus)
            // Only for non-bosses
            if (!isBoss) {
                const baseAlphaChance = 0.01;
                const totalAlphaChance = baseAlphaChance + mults.alphaChance;

                if (Math.random() < totalAlphaChance) {
                    this.currentMonster.isAlpha = true;
                    this.currentMonster.maxHp *= 2;
                    this.currentMonster.currentHp = this.currentMonster.maxHp;
                    this.currentMonster.name = `Alpha ${this.currentMonster.name}`;
                    // Maybe add visual flair later
                    this.addToLog(`<span style="color:#ffd700; font-weight:bold;">An Alpha Monster appeared!</span>`);
                }
            }
        } else {
            // Fallback for no manager (fresh start?)
            if (!isBoss && Math.random() < 0.01) {
                this.currentMonster.isAlpha = true;
                this.currentMonster.maxHp *= 2;
                this.currentMonster.currentHp = this.currentMonster.maxHp;
                this.currentMonster.name = `Alpha ${this.currentMonster.name}`;
                this.addToLog(`<span style="color:#ffd700; font-weight:bold;">An Alpha Monster appeared!</span>`);
            }
        }

        if (isBoss) {
            // Get Ascension Bonus for Boss Timer
            const ascBonus = (this.ascensionManager && this.ascensionManager.getMultipliers().bossTimer) || 0;
            const reincBonus = (this.reincarnationManager && this.reincarnationManager.getMultipliers().bossTimer) || 0;

            this.bossTimer = 60 + ascBonus + reincBonus;
            this.addToLog(`<span style="color:#ff4400">Boss Spawned! ${this.bossTimer}s remaining!</span>`);
        } else {
            this.bossTimer = null;
        }
    }

    failBoss() {
        if (!this.currentMonster || !this.currentMonster.isBoss) return;

        this.addToLog(`<span style="color:red">Boss Fight Failed! Retreating...</span>`);
        this.monstersKilledInStage = 0;
        this.currentMonster = null;
        this.bossTimer = null;
        this.spawnMonster(); // Spawns normal mob
    }

    // Pass 'source' for visual distinction (default 'generic' to avoid accidental triggers)
    damageMonster(amount, allowCrit = true, source = 'generic') {
        if (!this.currentMonster) return { damage: 0, isCrit: false, isDead: false };

        // Aura of Might: Trigger Lightning on Manual Click
        if (source === 'manual_click' && this.buffs && this.buffs.auraOfMightExpires > Date.now()) {
            // Dynamic DPS Multiplier
            const stats = this.skillManager ? this.skillManager.getSkillStats('paladin_4') : null;
            const mult = stats ? (stats.dpsMult || 1.0) : 1.0;

            const lightningDmg = (this.totalDps || 0) * mult;
            // Call recursively but with 'skill' source to avoid infinite loop
            this.damageMonster(lightningDmg, true, 'skill');
            if (window.showCombatEffect) window.showCombatEffect("⚡", "#ffaa00");
        }

        let finalDamage = amount;
        let isCrit = false;

        let critTier = 0;
        let accumulatedBonus = 0; // For debug logging scope

        if (allowCrit) {
            let chanceRemaining = this.multipliers.critChance;
            let baseCritMult = (this.multipliers.critDamage / 100);

            // Rogue T6 moved to Proc Logic below

            // Multi-Crit Loop (Additive Scaling)
            // Stacking: Base * (1 + Tier * (CritMult - 1))
            // Example: 200% Damage (x2)
            // Tier 1: x2 (+100%)
            // Tier 2: x3 (+200%)
            const bonusPerTier = baseCritMult - 1; // e.g. 2.0 -> +1.0 per tier

            let loopGuard = 0;
            const SAFEGURD_MAX_TIERS = 1000; // Increased to 1000 (virtually uncapped)

            while (chanceRemaining > 0 && loopGuard < SAFEGURD_MAX_TIERS) {
                if (chanceRemaining >= 100 || (Math.random() * 100 < chanceRemaining)) {
                    accumulatedBonus += bonusPerTier;
                    critTier++;
                    isCrit = true;
                } else {
                    break;
                }
                chanceRemaining -= 100;
                loopGuard++;
            }

            // Safety Cap Removed as requested
            // if (accumulatedBonus > 500) accumulatedBonus = 500; 

            // Apply Final Multiplier
            if (isCrit) {
                finalDamage *= (1 + accumulatedBonus);

                // Amazon: Critical Strike (Lethal Strikes)
                if (this.buffs && this.buffs.criticalStrikeExpires > Date.now()) {
                    finalDamage *= 2.0;
                }
            }
        }
        // Double Damage Chance (Global Stat)
        let isDouble = false;
        if (Math.random() * 100 < this.multipliers.doubleDamageChance) {
            finalDamage *= 2;
            isDouble = true;
            // if (window.showCombatEffect && allowCrit) window.showCombatEffect("💥 DOUBLE!", "#ff8800"); 
        }

        // Apply Boss Damage Multiplier
        if (this.currentMonster.isBoss) {
            finalDamage *= this.multipliers.bossDamage;
        }

        // Apply Curse (Necromancer Skill)
        if (this.buffs && this.buffs.curseExpires > Date.now()) {
            const stats = this.skillManager ? this.skillManager.getSkillStats('necromancer_3') : null;
            const bonus = stats ? stats.damageTaken : 0.5;
            finalDamage *= (1 + bonus); // +50% Damage -> 1.5x
        }

        // Apply Smite Debuff (Judgement)
        if (this.buffs && this.buffs.smiteDebuffExpires > Date.now()) {
            const stats = this.skillManager ? this.skillManager.getSkillStats('paladin_3') : null;
            const bonus = stats ? stats.damageTaken : 0.3;
            finalDamage *= (1 + bonus); // +30% Damage Taken
        }

        // Apply Barbarian Bash Debuff (Shatter Armor)
        // +50% Damage Taken from CLICKS
        if (source === 'manual_click' && this.buffs && this.buffs.bashDebuffExpires > Date.now()) {
            const stats = this.skillManager ? this.skillManager.getSkillStats('barbarian_3') : null;
            const bonus = stats ? stats.debuffMult : 0.5;
            finalDamage *= (1 + bonus);
        }

        // Unique Effect: The Executioner (Item or Ascension T8)
        if ((this.activeEffects && this.activeEffects.includes('executioner')) ||
            (this.ascensionManager.getMultipliers().executioner)) {

            const ascThresh = this.ascensionManager.getMultipliers().executioner || 0;
            const itemThresh = (this.activeEffects && this.activeEffects.includes('executioner')) ? (this.currentMonster.isBoss ? 0.05 : 0.15) : 0;

            // Use highest logic?
            // Item: Boss 5%, Non-Boss 15%
            // Ascension T8: Non-Boss 5% (Val is 0.05). User request: Only Non-Boss.

            let thresh = 0;
            if (this.currentMonster.isBoss) {
                // Only Item grants Boss Execute
                thresh = (this.activeEffects.includes('executioner')) ? 0.05 : 0;
            } else {
                // Non-Boss: Max of both
                thresh = Math.max(itemThresh, ascThresh);
            }

            if (thresh > 0 && this.currentMonster.currentHp / this.currentMonster.maxHp < thresh) {
                finalDamage = this.currentMonster.currentHp + 1; // Instant Kill
                if (window.showCombatEffect) window.showCombatEffect("☠️ EXECUTE!", "#ff0000");
            }
        }

        // Unique Effect: Shadow Clone (Trigger on CLICK only)
        // 2% Chance, 20s Cooldown, Single Instance
        if ((source === 'click' || source === 'manual_click') && this.activeEffects.includes('shadow_clone')) {
            if (this.shadowCloneCooldown <= 0 && this.activeClones.length === 0) {
                // 2% Chance
                if (Math.random() < 0.02) {
                    this.activeClones.push({ duration: 10.0, attackTimer: 0 });
                    this.shadowCloneCooldown = 20.0;
                    if (window.showCombatEffect) window.showCombatEffect("👥 CLONE!", "#bf40bf");
                }
            }
        }

        // Show Floating Text (Global Helper)
        if (window.showFloatingDamage && source !== 'manual_click' && source !== 'skill') {
            window.showFloatingDamage(finalDamage, isCrit, source, critTier, isDouble);
        }

        // Calculate Overkill (Before taking damage which clamps HP)
        const hpBeforeHit = this.currentMonster.currentHp;
        const overkill = finalDamage - hpBeforeHit;

        // Apply Damage & Check Death (moved from dual call)
        const isDead = this.currentMonster.takeDamage(finalDamage);

        if (isDead) {
            // Store Overkill if we have the specific Unique Effect OR Ascension T8
            // Prevent recursive overkill generation if source is 'overkill'
            const hasOverkill = (this.activeEffects && this.activeEffects.includes('overkill_explosion')) || this.ascensionManager.getMultipliers().overkill;

            if (overkill > 0 && source !== 'overkill' && hasOverkill) {
                this.pendingOverkill = overkill;
            } else {
                this.pendingOverkill = 0;
            }

            this.onMonsterDeath();
        }

        if (source !== 'skill' && source !== 'proc' && source !== 'dot' && source !== 'bleed' &&
            this.activeBuffs && // Safety check
            this.ascensionManager.hasAbility('fan_of_knives') && Math.random() < 0.02) {

            const fanDmg = (this.averageDps || this.totalDps) * 3;
            if (window.showCombatEffect) window.showCombatEffect("🔪 FAN!", "#cc0000");

            // Trigger separately to avoid modifying current return
            setTimeout(() => {
                this.damageMonster(fanDmg, true, 'proc');

                // Max 1 Active Bleed: Refresh if exists
                const existingBleed = this.activeDots.find(d => d.type === 'bleed');
                if (existingBleed) {
                    existingBleed.duration = 10.0;
                    existingBleed.timer = 0;
                    // Optional: Update DPS if player grew stronger?
                    existingBleed.dps = (this.averageDps || this.totalDps);
                } else {
                    const bleedDps = (this.averageDps || this.totalDps);
                    this.applyDot(bleedDps, 10.0, 'bleed');
                }
            }, 50);
        }

        return { damage: finalDamage, isCrit, isDead, critTier, isDouble };
    }

    getMonsterCinders(maxHp) {
        let mult = this.multipliers.cinders;
        // Arcane Intellect Buff Check
        if (this.buffs && this.buffs.cinderBonusExpires > Date.now()) {
            mult += 1.0; // +100% Additive
        }
        // Nature's Grace Buff Check
        if (this.buffs && this.buffs.naturesGraceExpires > Date.now()) {
            mult += 0.5; // +50% Additive
        }
        // Holy Light (Illuminated) Check
        if (this.buffs && this.buffs.holyLightDebuffExpires > Date.now()) {
            mult += 1.0; // Double drops (Base + 100%)
        }

        // Ascension T8: Druid Balance (+20% All Resources)
        const ascRes = this.ascensionManager.getMultipliers().resourceGain || 0;
        mult += ascRes;

        return Math.floor(maxHp * mult);
    }

    getMonsterGold(maxHp) {
        // Base Gold Calculation (Approximate based on stage logic)
        // Note: maxHp isn't directly used for gold in current logic, but stage is.
        // We'll use this.stage for calculation to keep it consistent.

        // Rogue Ability: Bounty Hunter (T4) - +20% Boss Gold
        let goldMult = this.multipliers.gold;
        if (this.currentMonster && this.currentMonster.isBoss && this.ascensionManager.hasAbility('bossGold')) {
            const bonus = this.ascensionManager.getMultipliers().bossGold || 0;
            goldMult *= (1 + bonus / 100);
        }

        // Nature's Grace Buff Check
        if (this.buffs && this.buffs.naturesGraceExpires > Date.now()) {
            goldMult += 0.5; // +50% Additive
        }

        // Ascension T8: Druid Balance (+20% All Resources)
        // Be careful: if goldMult is a multiplier (1.0 base), do we Add 0.2 or Multiply by 1.2?
        // Ascension logic usually additive for "Gold Find".
        const ascRes = this.ascensionManager.getMultipliers().resourceGain || 0;
        goldMult += ascRes;

        const goldDrop = Math.floor(10 * Math.pow(1.5, this.stage - 1) * goldMult);

        // Boss Multiplier
        const bossMultiplier = (this.currentMonster && this.currentMonster.isBoss) ? 10 : 1;

        return goldDrop * bossMultiplier;
    }

    onMonsterDeath() {
        // Dungeon Logic Hook
        if (this.dungeonManager && this.dungeonManager.inDungeon) {
            this.dungeonManager.onMonsterDeath();
            // We still award minimal Gold/XP? 
            // Let's grant standard rewards for now to make it worth it.
        }

        // Award Cinders 
        const cinderDrop = this.getMonsterCinders(this.currentMonster.maxHp);
        this.addResource('cinders', cinderDrop);

        // Unique Effect: Time Warp
        // 5% Chance to skip next monster (Count as 2 kills, get double rewards)
        let isTimeWarp = false;
        if (this.activeEffects && this.activeEffects.includes('time_warp')) {
            if (Math.random() < 0.05) {
                isTimeWarp = true;
                if (window.showCombatEffect) window.showCombatEffect("⏳ TIME WARP!", "#cfb53b");
            }
        }

        const finalGold = isTimeWarp ? this.getMonsterGold(this.currentMonster.maxHp) * 2 : this.getMonsterGold(this.currentMonster.maxHp);

        this.addResource('gold', finalGold);

        // Drop Logic
        const isBoss = this.currentMonster.isBoss;
        const dropChance = isBoss ? 1.0 : 0.3; // Bosses always drop items

        // Roll Drops (Run twice if Time Warp? Or just one drop?)
        // User "Skip next monster". Usually implies getting its rewards too. 
        // Let's roll drop twice if warp.
        const rolls = isTimeWarp ? 2 : 1;

        for (let i = 0; i < rolls; i++) {
            const dropRoll = Math.random();
            if (dropRoll < dropChance) {
                const mfBonus = isBoss ? 200 : 0;
                const isAlpha = this.currentMonster.isAlpha || false;

                // Diminishing Returns on Magic Find > 100%
                // Prevents runaway drop rates. 350% -> ~183%.
                let effectiveMf = this.multipliers.magicFind + mfBonus;
                if (effectiveMf > 100) {
                    effectiveMf = 100 + Math.pow(effectiveMf - 100, 0.6);
                }

                const item = window.Item.rollDrop(
                    this.stage,
                    effectiveMf,
                    isBoss,
                    this.multipliers.rareFind,
                    isAlpha
                );

                // Track Stats by Type (Run BEFORE Auto-Salvage so it counts)
                if (item.rarity.id === 'legendary') {
                    if (!this.stats.totalLegendariesFound) this.stats.totalLegendariesFound = 0;
                    this.stats.totalLegendariesFound++;
                } else if (item.rarity.id === 'set') {
                    if (!this.stats.totalSetsFound) this.stats.totalSetsFound = 0;
                    this.stats.totalSetsFound++;
                } else if (item.rarity.id === 'unique') {
                    if (!this.stats.totalUniquesFound) this.stats.totalUniquesFound = 0;
                    this.stats.totalUniquesFound++;
                }

                // Auto-Salvage Check
                if (this.autoSalvage[item.rarity.id]) {
                    const mats = item.getSalvageValue();
                    this.addResource('materials', mats);
                    this.addToLog(`<span style="color:#aaa">Auto-Salvaged ${item.name} (+${mats} Dust)</span>`);
                } else {
                    if (this.inventoryManager.addItem(item)) {
                        this.addToLog(`Dropped: <span style="color:${item.rarity.color}">${item.name}</span>`);
                    } else {
                        // Inventory Full -> Auto-Salvage fallback
                        const mats = item.getSalvageValue();
                        this.addResource('materials', mats);
                        this.addToLog(`Inventory Full! Auto-Salvaged <span style="color:${item.rarity.color}">${item.name}</span> for ${mats} Dust.`);
                    }
                }
            }
        }

        if (this.currentMonster.isBoss) {
            this.stage++;
            this.monstersKilledInStage = 0;
            // If Warp on Boss Kill, we skip the first mob of next stage
            if (isTimeWarp) this.monstersKilledInStage++;

            this.addToLog(`Boss Defeated! Stage ${this.stage}`);

            // Paragon Point every stage
            if (this.stage > 1) {
                this.paragonManager.addPoints(1);

                // Boss Essence Drop
                this.addResource('essence', 1);

                // Amazon Lightning Fury Ability Check
                if (this.ascensionManager.hasAbility('lightning_fury') && Math.random() < 0.05) {
                    this.addResource('essence', 1);
                    this.addToLog(`<span style="color:#cfb53b">Lightning Fury! +1 Extra Essence</span>`);
                }

                this.addToLog(`<span style="color:#cfb53b">Boss Defeated! +1 Essence, +1 Paragon</span>`);

                // Stat Track
                this.stats.totalBossKills = (this.stats.totalBossKills || 0) + 1;

                // Dungeon Key Drop Logic (Base 25% + Pity)
                this.bossesSinceLastKey = (this.bossesSinceLastKey || 0) + 1;

                let dropKey = false;
                if (!this.dungeonManager.inDungeon) {
                    // 10% Chance OR Guaranteed every 10 bosses
                    if (Math.random() < 0.10 || this.bossesSinceLastKey >= 10) {
                        dropKey = true;
                    }
                }

                if (dropKey) {
                    this.addResource('dungeonKeys', 1);
                    this.addToLog(`<span style="color:#ff8800; font-weight:bold; font-size:1.1rem;">🗝️ Dungeon Key Dropped!</span>`);
                    this.bossesSinceLastKey = 0;
                    if (window.showCombatEffect) window.showCombatEffect("🗝️ KEY!", "#ff8800");
                }
            }
        } else {
            this.monstersKilledInStage++;
            if (isTimeWarp) this.monstersKilledInStage++;
        }

        const prevBossHp = this.currentMonster.isBoss ? this.currentMonster.maxHp : 0;

        this.spawnMonster();

        // Necro Ability: Corpse Explosion (T4)
        // Deal 50% of Boss HP to next monster
        if (prevBossHp > 0 && this.ascensionManager.hasAbility('corpse_explosion')) {
            const explosionDmg = prevBossHp * 0.5;
            this.damageMonster(explosionDmg, false, 'corpse_explosion');
            this.addToLog(`<span style="color:#00ff00">Corpse Explosion! dealt ${window.formatNumber(explosionDmg)} dmg</span>`);
        }

        // Unique Effect: Overkill Explosion
        if (this.pendingOverkill > 0) {
            this.damageMonster(this.pendingOverkill, false, 'overkill');
            // Visual Effect
            if (window.showCombatEffect) window.showCombatEffect("💥 BOOM!", "#ff0000");
            this.pendingOverkill = 0; // Reset
        }
    }

    calculateOfflineProgress(seconds, silent = false) {
        // Calculate rough DPS for offline
        // Since we haven't loaded everything fully yet (units/upgrades are loaded AFTER this call normally if we put it at top of importState?
        // Wait! importState loads Units/Upgrades AFTER resources. 
        // We need to run this AFTER loading everything. 
        // Moving the call to end of importState would be better, but let's see where I placed it.
        // I placed it at top of importState. That is BAD because units/upgrades aren't loaded yet.
        // Correct fix: Move the *call* to the end of importState. 

        // Let's define the method first.

        // This method assumes state is loaded.
        // We simulate "average" kills.
        // Formula: DPS * Seconds * (Gold Multipliers) * 0.5 (Inefficiency penalty)

        // We need to run recalculateStats first to ensure multipliers are correct.
        this.recalculateStats();

        const dps = this.totalDps; // This includes multipliers
        // Monster HP at current stage
        const monsterHp = 10 * Math.pow(1.15, this.stage - 1); // Approx

        // Kills per second (Theoretical)
        const killsPerSec = dps / monsterHp;

        // Cap kills per sec reasonably (e.g. 5/sec) to avoid glitches
        const cappedKPS = Math.min(5, killsPerSec);

        const totalKills = Math.floor(cappedKPS * seconds * 0.5); // 50% efficiency

        // Calculate Gold
        const goldPerKill = 5 * Math.pow(1.15, this.stage - 1) * this.multipliers.gold;
        const totalGold = Math.floor(totalKills * goldPerKill);

        // Calculate Dust (Approximate drop rate logic? Or just skip dust? User asked for Dust)
        // Discard/Salvage logic... 
        // Let's give flat Dust based on kills? Item drop chance is complex.
        // Simplification: Dust = TotalKills * 0.1 (10% chance) * Stage Scaling
        const dustPerKill = 0.5 * (1 + (this.stage * 0.05));
        const totalDust = Math.floor(totalKills * dustPerKill);

        // Calculate Cinders (using same logic as onDeath)
        const cindersPerKill = this.getMonsterCinders(monsterHp);
        const totalCinders = Math.floor(totalKills * cindersPerKill);

        if (totalGold > 0 || totalDust > 0 || totalCinders > 0) {
            this.gold += totalGold;
            this.materials += totalDust;
            this.cinders += totalCinders;

            // Log it (Delayed so UI exists)
            // Only log if NOT silent (silent used for short pauses in GameLoop)
            if (!silent) {
                const formattedTime = (seconds / 60).toFixed(0);
                const formattedGold = window.formatNumber(totalGold);
                const formattedDust = window.formatNumber(totalDust);
                const formattedCinders = window.formatNumber(totalCinders);

                // Create Log Entry
                setTimeout(() => {
                    this.addToLog(`<div style="background:#222; border:1px solid #444; padding:10px; margin:5px 0;">
                        <h3 style="color:#cfb53b; margin:0 0 5px 0;">Welcome Back!</h3>
                        <p style="margin:0; color:#aaa;">You were away for ${formattedTime} minutes.</p>
                        <p style="margin:5px 0 0 0;">
                            Gained: <br>
                            <span style="color:#ffd700">${formattedGold} Gold</span>, 
                            <span style="color:#d4a1d4">${formattedDust} Dust</span>,
                            <span style="color:#ff4400">${formattedCinders} Cinders</span>
                        </p>
                    </div>`);
                }, 1000);

                // Trigger Visual Popup
                if (window.showOfflinePopup) {
                    window.showOfflinePopup({
                        time: formattedTime,
                        gold: formattedGold,
                        dust: formattedDust,
                        cinders: formattedCinders
                    });
                }
            }
        }
    }


    applyDiminishingReturns(value, max) {
        if (value <= 0) return 0;
        // Formula: Max * (1 - e^(-Value / Max))
        // Linear at start (slope 1), asymptotic to Max.
        return max * (1 - Math.exp(-value / max));
    }

    exportState() {
        return {
            timestamp: Date.now(),
            resources: {
                cinders: this.cinders,
                gold: this.gold,
                materials: this.materials,
                bossEssence: this.bossEssence,
                skillPoints: this.skillPoints,
                dungeonKeys: this.dungeonKeys,
                purchasedSkills: this.purchasedSkills,
                equippedSkills: this.equippedSkills,
                dungeonRunes: this.dungeonRunes
            },
            progression: {
                stage: this.stage
            },
            units: this.units,
            upgrades: this.upgradeManager.levels,
            inventory: this.inventory.map(item => item),
            equipment: this.equipment,
            paragon: {
                points: this.paragonManager.points,
                unlockedNodes: this.paragonManager.unlockedNodes
            },
            ascension: this.ascensionManager.exportData(),
            reincarnation: this.reincarnationManager.exportData(),
            autoSalvage: this.autoSalvage,
            stats: this.stats,
            achievements: this.achievementManager.exportData()
        };
    }

    triggerAutoAttack() {
        // Core Damage Logic for Auto Attacks
        // Uses Attack Speed logic from main.js (called when timer fires)

        // 1. Regular Damage (Minions/Units DPS tick)
        this.damageMonster(this.totalDps, true, 'hero');

        // Amazon T8: Rain of Arrows (Every 10th Attack)
        if (this.ascensionManager.getMultipliers().autoSkillProcs && this.ascensionManager.getMultipliers().autoSkillProcs.rain_of_arrows) {
            this.rainOfArrowsCounter = (this.rainOfArrowsCounter || 0) + 1;
            const threshold = this.ascensionManager.getMultipliers().autoSkillProcs.rain_of_arrows;

            if (this.rainOfArrowsCounter >= threshold) {
                this.rainOfArrowsCounter = 0;
                // Free Multi-Shot logic: 10 arrows x 60% DPS each = 600% Total DPS
                // But simplified: Just deal 600% Damage as a burst
                // Or better: Simulate the skill effect if we can.
                // For now, burst damage with visual.
                const arrowDmg = this.totalDps * 6;
                this.damageMonster(arrowDmg, true, 'skill');
                this.addToLog(`<span style="color:#ffd700">Rain of Arrows!</span>`);
                if (window.showCombatEffect) window.showCombatEffect("🏹 RAIN!", "#ffd700");
            }
        }

        // 2. Thunder Echo Logic
        const ascEcho = this.ascensionManager.getMultipliers().echoThunder;
        if (this.activeEffects.includes('echo_thunder') || ascEcho) {
            this.thunderStacks++;

            if (this.thunderStacks >= 10) {
                this.thunderStacks = 0;
                // 1000% DPS
                const thunderDmg = this.totalDps * 10;
                this.currentMonster.takeDamage(thunderDmg);
                window.showCombatEffect(`⚡ ${window.formatNumber(thunderDmg)}`, '#00ffff');
                this.addToLog(`Thunder Echo deals ${window.formatNumber(thunderDmg)} damage!`);
            }
        }
    }

    updateClones(dt) {
        if (this.activeClones.length === 0) return;

        // Filter out expired (ensure we clear BEFORE processing to avoid ghost ticks)
        this.activeClones = this.activeClones.filter(c => c.duration > 0);

        // Fixed 1.0s interval
        const atkInterval = 1.0;

        this.activeClones.forEach(clone => {
            clone.duration -= dt;
            clone.attackTimer += dt;

            if (clone.attackTimer >= atkInterval) {
                clone.attackTimer -= atkInterval; // Maintain rhythm
                try {
                    let dmg = this.calculateClickDamage();

                    // Boost for Necromancer Summons
                    // FIX: Use totalDps instead of averageDps to avoid Double Dipping on Crit Multipliers.
                    // We multiply by Attack Speed manually because Minions attack at a fixed 1.0s rate, 
                    // so they need this multiplier to scale with that stat.
                    const dpsSource = (this.totalDps || 0) * (this.multipliers.attackSpeed || 1.0);

                    if (clone.type === 'skeleton') {
                        dmg += dpsSource * 0.50; // 50% DPS
                    } else if (clone.type === 'golem') {
                        dmg += dpsSource * 1.00; // 100% DPS (45s Cooldown)
                    } else if (clone.type === 'wolf') {
                        dmg += dpsSource * 1.00; // 100% DPS (45s Cooldown)
                    } else if (clone.type === 'valkyrie') {
                        dmg += dpsSource * 1.50; // 150% DPS (60s Cooldown - Highest)
                    }

                    if (Number.isFinite(dmg) && dmg > 0) {
                        this.damageMonster(dmg, true, clone.type || 'clone');
                    }
                } catch (err) {
                    console.error("Clone Attack Error:", err);
                }
            }
        });
    }

    // Helper to get total click damage for calculation
    calculateClickDamage() {
        let val = this.totalClickDamage;

        if (this.buffs && this.buffs.clickPowerExpires > Date.now()) {
            let mult = 1.5; // Default: +50%

            // Check for Primal Instinct (Druid T6)
            if (this.ascensionManager && this.ascensionManager.getMultipliers) {
                const bonuses = this.ascensionManager.getMultipliers();
                if (bonuses.abilities && bonuses.abilities.includes('primal_instinct')) {
                    mult = 2.0; // +100%
                }
            }
            val *= mult;
        }
        return val;
    }

    importState(data) {
        if (!data) return;

        // Resources
        if (data.resources) {
            this.cinders = data.resources.cinders || 0;
            this.gold = data.resources.gold || 0;
            this.materials = data.resources.materials || 0;
            this.bossEssence = data.resources.bossEssence || 0;
            this.skillPoints = data.resources.skillPoints || 0;
            this.dungeonKeys = data.resources.dungeonKeys || 0;
            this.purchasedSkills = data.resources.purchasedSkills || [];
            this.equippedSkills = data.resources.equippedSkills || [null, null, null, null];
            this.dungeonRunes = data.resources.dungeonRunes || [];
        }

        // Progression
        if (data.progression) {
            this.stage = data.progression.stage || 1;
        }

        // Units
        if (data.units) {
            this.units = data.units;
        }

        // Upgrades
        if (data.upgrades) {
            this.upgradeManager.levels = { ...this.upgradeManager.levels, ...data.upgrades };
        }

        // Paragon
        this.paragonManager.points = data.paragon.points || 0;
        this.paragonManager.unlockedNodes = (data.paragon.unlockedNodes || [0]).map(Number); // Force Numbers

        // Fix: Ensure critical nodes are unlocked (e.g. Return Gate)
        if (!this.paragonManager.unlockedNodes.includes(2000)) {
            this.paragonManager.unlockedNodes.push(2000);
        }
        // Ascension
        if (data.ascension) {
            this.ascensionManager.importData(data.ascension);
        }
        // Reincarnation
        if (data.reincarnation) {
            this.reincarnationManager.importData(data.reincarnation);
        }

        if (data.autoSalvage) {
            this.autoSalvage = { ...this.autoSalvage, ...data.autoSalvage };
        }

        if (data.stats) {
            this.stats = { ...this.stats, ...data.stats };
        }

        // Achievements
        if (data.achievements) {
            this.achievementManager.importData(data.achievements);
        }

        // Inventory
        const restoreItem = (itemData) => {
            if (!itemData) return null;
            const item = new window.Item(itemData.slot, itemData.rarity);
            Object.assign(item, itemData);
            if (item.stats && item.stats.minionDamage !== undefined) {
                item.stats.heroDamage = item.stats.minionDamage;
                delete item.stats.minionDamage;
            }
            return item;
        };

        if (data.inventory) {
            this.inventory = data.inventory.map(restoreItem).filter(i => i);
        }

        if (data.equipment) {
            Object.keys(this.equipment).forEach(slot => {
                this.equipment[slot] = restoreItem(data.equipment[slot]);
            });
        }

        this.recalculateStats();

        // Offline Progress Check (Run AFTER stats are loaded)
        if (data.timestamp) {
            const now = Date.now();
            const lastSave = data.timestamp;
            const diffSeconds = (now - lastSave) / 1000;

            if (diffSeconds > 60) {
                this.calculateOfflineProgress(diffSeconds);
            }
        }
    }


    // --- Buff System ---
    addBuff(id, durationSec, icon) {
        // Remove existing if any (refresh)
        this.activeBuffs = this.activeBuffs.filter(b => b.id !== id);
        this.activeBuffs.push({
            id: id,
            expires: Date.now() + (durationSec * 1000),
            icon: icon
        });
        this.renderBuffs();
    }

    removeBuff(id) {
        this.activeBuffs = this.activeBuffs.filter(b => b.id !== id);
        this.renderBuffs();
    }

    hasBuff(id) {
        return this.activeBuffs.some(b => b.id === id);
    }

    updateBuffs(dt) {
        const now = Date.now();
        let changed = false;

        // Filter expired
        const prevLen = this.activeBuffs.length;
        this.activeBuffs = this.activeBuffs.filter(b => b.expires > now);

        if (this.activeBuffs.length !== prevLen) {
            this.renderBuffs();
        }
    }

    renderBuffs() {
        const container = document.getElementById('buffs-container');
        if (!container) return; // Should created in index.html

        container.innerHTML = '';
        this.activeBuffs.forEach(buff => {
            const el = document.createElement('div');
            el.className = 'buff-icon';
            el.innerHTML = buff.icon || '?';
            const remaining = Math.ceil((buff.expires - Date.now()) / 1000);

            let displayTime = remaining;
            if (remaining > 9000) displayTime = '∞';

            el.title = `${buff.id} (${remaining > 9000 ? 'Infinite' : remaining + 's'})`;

            // Optional: Timer text overlay
            const timer = document.createElement('span');
            timer.className = 'buff-timer';
            timer.textContent = displayTime;
            el.appendChild(timer);

            container.appendChild(el);
        });
    }



    // --- DoT System ---
    applyDot(dps, duration, type) {
        this.activeDots.push({
            type: type,
            dps: dps,
            duration: duration,
            timer: 0 // Accumulator for ticks
        });
    }

    updateDots(dt) {
        if (this.activeDots.length === 0) return;

        // Filter expired
        this.activeDots = this.activeDots.filter(d => d.duration > 0);

        this.activeDots.forEach(dot => {
            dot.duration -= dt;
            dot.timer += dt;

            // Tick every 0.5s or 1.0s? Let's do 0.5s for responsiveness
            const tickInterval = 0.5;
            if (dot.timer >= tickInterval) {
                dot.timer -= tickInterval;
                const tickDmg = dot.dps * tickInterval;
                this.damageMonster(tickDmg, false, dot.type || 'dot'); // No crit on DoTs usually
            }
        });
    }
}
window.GameState = GameState;
