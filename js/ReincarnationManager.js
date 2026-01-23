class ReincarnationManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.divinity = 0;
        this.blessings = {
            might: 0,
            greed: 0,
            swiftness: 0,
            fortune: 0,
            wisdom: 0,
            chronos: 0,
            hephaestus: 0,
            authority: 0,
            gaze: 0,
            hunt: 0,
            preservation: 0,
            spark: 0
        };

        this.BLESSING_DEFINITIONS = {
            // Damage / Combat
            might: { name: "Ares' Might", desc: "+10% All Damage", baseCost: 1, costScaling: 1.3, type: 'damage', value: 0.10 },
            fortune: { name: "Tyche's Fortune", desc: "+1% Crit Chance (Max 50%)", baseCost: 5, costScaling: 1.5, type: 'crit', value: 1, maxLevel: 50 },
            hunt: { name: "Artemis' Hunt", desc: "+1% Alpha Chance (Max 4)", baseCost: 15, costScaling: 1.5, type: 'alphaChance', value: 0.01, maxLevel: 4 },
            gaze: { name: "Thanatos' Gaze", desc: "-2% Monster HP (Max 50%)", baseCost: 10, costScaling: 1.5, type: 'monsterHp', value: 0.02, maxLevel: 25 },

            // Economy
            greed: { name: "Mammon's Greed", desc: "+10% Gold Gain", baseCost: 1, costScaling: 1.3, type: 'gold', value: 0.10 },
            spark: { name: "Prometheus' Spark", desc: "+10% Cinder Gain", baseCost: 10, costScaling: 1.5, type: 'cinderGain', value: 0.10 },
            authority: { name: "Zeus' Authority", desc: "+10% Divinity Gain", baseCost: 10, costScaling: 1.5, type: 'divinity', value: 0.10 },
            wisdom: { name: "Athena's Wisdom", desc: "-2% Unit Costs (Max 90%)", baseCost: 10, costScaling: 1.5, type: 'costRed', value: 0.02, maxLevel: 45 },

            // Items / Forge
            hephaestus: { name: "Hephaestus' Favor", desc: "+20% Item Stats", baseCost: 10, costScaling: 1.4, type: 'itemStat', value: 0.20 },
            preservation: { name: "Memory of Ages", desc: "+2 Item Retention Level", baseCost: 50, costScaling: 1.4, type: 'itemLevel', value: 2, maxLevel: 50 },

            // Utility
            swiftness: { name: "Hermes' Swiftness", desc: "+2s Boss Timer", baseCost: 2, costScaling: 1.4, type: 'bossTimer', value: 2 },
            chronos: { name: "Chronos' Sprung", desc: "Start at Stage +5", baseCost: 20, costScaling: 1.4, type: 'stageStart', value: 5, maxLevel: 20 }
        };
    }

    importData(data) {
        if (!data) return;
        this.divinity = data.divinity || 0;
        this.blessings = { ...this.blessings, ...(data.blessings || {}) };
        // Ensure new blessings are initialized
        if (this.blessings.authority === undefined) this.blessings.authority = 0;
        if (this.blessings.gaze === undefined) this.blessings.gaze = 0;
        if (this.blessings.hunt === undefined) this.blessings.hunt = 0;
        if (this.blessings.preservation === undefined) this.blessings.preservation = 0;
        if (this.blessings.spark === undefined) this.blessings.spark = 0;
    }

    exportData() {
        return {
            divinity: this.divinity,
            blessings: this.blessings
        };
    }

    calculateDivinityGain() {
        // 1. Hero Levels: 1 Divinity per 50 Total Levels
        const totalUnitLevels = this.gameState.unitManager.getTotalLevels();
        let gain = Math.floor(totalUnitLevels / 50);

        // 2. Stage Scaling
        const currentStage = this.gameState.stage;

        if (currentStage >= 50) {
            for (let s = 50; s < currentStage; s++) {
                const tierVal = 1 + Math.floor((s - 50) / 10);
                gain += tierVal;
            }
        }

        // Apply Authority Multiplier (Reincarnation)
        const authMult = 1 + (this.blessings.authority || 0) * this.BLESSING_DEFINITIONS.authority.value;

        // Ascension T8: Paladin Divinity (+10% Gain)
        let ascMult = 0;
        if (this.gameState.ascensionManager && this.gameState.ascensionManager.getMultipliers) {
            ascMult = this.gameState.ascensionManager.getMultipliers().divinityGain || 0;
        }

        gain = Math.floor(gain * (authMult + ascMult));

        return Math.max(0, gain);
    }

    canReincarnate() {
        return this.gameState.stage >= 50 || this.calculateDivinityGain() > 0;
    }

    reincarnate() {
        const gain = this.calculateDivinityGain();
        if (gain <= 0 && !confirm("You will gain 0 Divinity. Reincarnate anyway?")) return false;

        this.divinity += gain;
        this.gameState.addToLog(`<span style="color:#00ffff; font-weight:bold;">REINCARNATION! Gained ${gain} Divinity.</span>`);

        // Skill Point Reward
        this.gameState.skillManager.addSkillPoint(1);
        this.gameState.addToLog(`<span style="color:#ffff00; font-weight:bold;">+1 Skill Point!</span>`);

        this.gameState.softReset();
        return true;
    }

    getBlessingCost(id) {
        const def = this.BLESSING_DEFINITIONS[id];
        const level = this.blessings[id] || 0;
        if (def.maxLevel && level >= def.maxLevel) return Infinity;

        // Exponential Progression
        // Formula: baseCost * (costScaling ^ level)
        return Math.floor(def.baseCost * Math.pow(def.costScaling, level));
    }

    buyBlessing(id) {
        // Ensure initialized
        if (this.blessings[id] === undefined) this.blessings[id] = 0;

        const cost = this.getBlessingCost(id);
        if (this.divinity >= cost) {
            this.divinity -= cost;
            this.blessings[id]++;
            this.gameState.recalculateStats();
            return true;
        }
        return false;
    }

    getEffectDisplay(id) {
        const def = this.BLESSING_DEFINITIONS[id];
        const lvl = this.blessings[id] || 0;

        // Calculate current value based on level
        // Formula: value * level? Or additive? Definition says 'value' is per level usually.
        // Looking at getMultipliers:
        // mults.damage = (this.blessings.might || 0) * this.BLESSING_DEFINITIONS.might.value;
        // So it is linear: lvl * value.

        let val = lvl * def.value;

        // Formatting
        if (def.type === 'damage' || def.type === 'gold' || def.type === 'cinderGain' || def.type === 'costRed' || def.type === 'itemStat' || def.type === 'divinity' || def.type === 'monsterHp' || def.type === 'alphaChance') {
            return `+${Math.floor(val * 100)}%`;
        }
        if (def.type === 'crit') {
            return `+${val.toFixed(0)}%`; // Crit is flat %
        }
        if (def.type === 'bossTimer') {
            return `+${val}s`;
        }
        if (def.type === 'stageStart') {
            return `+${val} Stages`;
        }
        if (def.type === 'itemLevel') {
            return `Lvl ${10 + val}`; // Base 10 + Value
        }

        return `${val}`;
    }

    getMultipliers() {
        const mults = {
            damage: 0,
            gold: 0,
            bossTimer: 0,
            critChance: 0,
            costReduction: 0,
            startStage: 0,
            itemStatMult: 1,
            monsterHpRed: 0,
            alphaChance: 0
        };

        // Calculate bonuses (Safe access with || 0)
        mults.damage = (this.blessings.might || 0) * this.BLESSING_DEFINITIONS.might.value;
        mults.gold = (this.blessings.greed || 0) * this.BLESSING_DEFINITIONS.greed.value;
        mults.bossTimer = (this.blessings.swiftness || 0) * this.BLESSING_DEFINITIONS.swiftness.value;
        mults.critChance = (this.blessings.fortune || 0) * this.BLESSING_DEFINITIONS.fortune.value;
        mults.costReduction = (this.blessings.wisdom || 0) * this.BLESSING_DEFINITIONS.wisdom.value;
        mults.startStage = (this.blessings.chronos || 0) * this.BLESSING_DEFINITIONS.chronos.value;
        mults.itemStatMult = 1 + ((this.blessings.hephaestus || 0) * this.BLESSING_DEFINITIONS.hephaestus.value);

        // New Multipliers
        mults.monsterHpRed = (this.blessings.gaze || 0) * this.BLESSING_DEFINITIONS.gaze.value;
        mults.alphaChance = (this.blessings.hunt || 0) * this.BLESSING_DEFINITIONS.hunt.value;

        // New Cinder Gain (Spark)
        mults.cinderGain = (this.blessings.spark || 0) * this.BLESSING_DEFINITIONS.spark.value;

        return mults;
    }
}
window.ReincarnationManager = ReincarnationManager;
