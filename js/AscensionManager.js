const ASCENSION_TREE = {
    mage: {
        name: "Mage",
        tiers: [
            { cost: 10, desc: "+200% Mage Damage (x3)", type: 'heroDamage', val: 2, target: 'mage' },
            { cost: 25, desc: "+10% Cinder Gain", type: 'cinderGain', val: 0.1 },
            { cost: 50, desc: "+400% Mage Damage (x5)", type: 'heroDamage', val: 4, target: 'mage' },
            { cost: 75, desc: "+5s Boss Timer", type: 'bossTimer', val: 5 },
            { cost: 125, desc: "+600% Mage Damage (x7)", type: 'heroDamage', val: 6, target: 'mage' },
            { cost: 200, desc: "Meteor (500% DPS / 10s)", type: 'ability', id: 'meteor' },
            { cost: 350, desc: "+1000% Mage Damage (x11)", type: 'heroDamage', val: 10, target: 'mage' },
            { cost: 600, desc: "Time Warp (-2s Cooldowns)", type: 'cooldownReduction', val: 2.0 },
            { cost: 1000, desc: "+2500% Mage Damage (x26)", type: 'heroDamage', val: 25, target: 'mage' }
        ]
    },
    rogue: {
        name: "Rogue",
        tiers: [
            { cost: 10, desc: "+200% Rogue Damage (x3)", type: 'heroDamage', val: 2, target: 'rogue' },
            { cost: 25, desc: "+2% Crit Chance", type: 'critChance', val: 2 },
            { cost: 50, desc: "+400% Rogue Damage (x5)", type: 'heroDamage', val: 4, target: 'rogue' },
            { cost: 75, desc: "+20% Boss Gold", type: 'bossGold', val: 0.2 },
            { cost: 125, desc: "+600% Rogue Damage (x7)", type: 'heroDamage', val: 6, target: 'rogue' },
            { cost: 200, desc: "Fan of Knives (AoE + Bleed)", type: 'ability', id: 'fan_of_knives' },
            { cost: 350, desc: "+1000% Rogue Damage (x11)", type: 'heroDamage', val: 10, target: 'rogue' },
            { cost: 600, desc: "Executioner (Kill < 5% HP)", type: 'executioner', val: 0.05 },
            { cost: 1000, desc: "+2500% Rogue Damage (x26)", type: 'heroDamage', val: 25, target: 'rogue' }
        ]
    },
    paladin: {
        name: "Paladin",
        tiers: [
            { cost: 10, desc: "+150% Paladin Damage (x2.5)", type: 'heroDamage', val: 1.5, target: 'paladin' },
            { cost: 25, desc: "+5% Global DPS", type: 'globalMult', val: 0.05 },
            { cost: 50, desc: "+300% Paladin Damage (x4)", type: 'heroDamage', val: 3, target: 'paladin' },
            { cost: 75, desc: "Holy Shield (+10% Hero DPS to Click)", type: 'ability', id: 'holy_shield' },
            { cost: 125, desc: "+450% Paladin Damage (x5.5)", type: 'heroDamage', val: 4.5, target: 'paladin' },
            { cost: 200, desc: "Judgement (+20% Dmg taken by Bosses)", type: 'bossDamageTaken', val: 0.2 },
            { cost: 350, desc: "+800% Paladin Damage (x9)", type: 'heroDamage', val: 8, target: 'paladin' },
            { cost: 600, desc: "Divinity (+10% Div Gain)", type: 'divinityGain', val: 0.1 },
            { cost: 1000, desc: "+2000% Paladin Damage (x21)", type: 'heroDamage', val: 20, target: 'paladin' }
        ]
    },
    amazon: {
        name: "Amazon",
        tiers: [
            { cost: 10, desc: "+150% Amazon Damage", type: 'heroDamage', val: 1.5, target: 'amazon' },
            { cost: 25, desc: "+10% Magic Find", type: 'magicFind', val: 10 },
            { cost: 50, desc: "+300% Amazon Damage", type: 'heroDamage', val: 3, target: 'amazon' },
            { cost: 75, desc: "Lightning Fury (5% Chance +1 Essence)", type: 'ability', id: 'lightning_fury' },
            { cost: 125, desc: "+450% Amazon Damage", type: 'heroDamage', val: 4.5, target: 'amazon' },
            { cost: 200, desc: "Valkyrie (+30% Attack Speed)", type: 'attackSpeed', val: 0.3 },
            { cost: 350, desc: "+800% Amazon Damage", type: 'heroDamage', val: 8, target: 'amazon' },
            { cost: 600, desc: "Rain of Arrows (Every 10th Atk Free Multi-Shot)", type: 'autoSkillProc', id: 'rain_of_arrows', val: 10 },
            { cost: 1000, desc: "+2000% Amazon Damage", type: 'heroDamage', val: 20, target: 'amazon' }
        ]
    },
    necro: {
        name: "Necromancer",
        tiers: [
            { cost: 10, desc: "+150% Necro Damage", type: 'heroDamage', val: 1.5, target: 'necro' },
            { cost: 25, desc: "+1% Global DPS per 10 Stages", type: 'stageScaling', val: 0.01 },
            { cost: 50, desc: "+300% Necro Damage", type: 'heroDamage', val: 3, target: 'necro' },
            { cost: 75, desc: "Corpse Explosion (50% HP Dmg on Boss Kill)", type: 'ability', id: 'corpse_explosion' },
            { cost: 125, desc: "+450% Necro Damage", type: 'heroDamage', val: 4.5, target: 'necro' },
            { cost: 200, desc: "Army of the Dead (-20% Unit Costs)", type: 'ability', id: 'army' },
            { cost: 350, desc: "+800% Necro Damage", type: 'heroDamage', val: 8, target: 'necro' },
            { cost: 600, desc: "Eternal Servant (+30s Minion Duration)", type: 'minionDuration', val: 30 },
            { cost: 1000, desc: "+2000% Necro Damage", type: 'heroDamage', val: 20, target: 'necro' }
        ]
    },
    barbarian: {
        name: "Barbarian",
        tiers: [
            { cost: 10, desc: "+150% Barb Damage", type: 'heroDamage', val: 1.5, target: 'barbarian' },
            { cost: 25, desc: "+20% Click Damage", type: 'clickDamagePct', val: 20 },
            { cost: 50, desc: "+300% Barb Damage", type: 'heroDamage', val: 3, target: 'barbarian' },
            { cost: 75, desc: "+50% Gold Find", type: 'goldMult', val: 0.5 },
            { cost: 125, desc: "+450% Barb Damage", type: 'heroDamage', val: 4.5, target: 'barbarian' },
            { cost: 200, desc: "Whirlwind (+20% Double Dmg Chance)", type: 'ability', id: 'whirlwind' },
            { cost: 350, desc: "+800% Barb Damage", type: 'heroDamage', val: 8, target: 'barbarian' },
            { cost: 600, desc: "Overkill (Excess Dmg hits next)", type: 'overkill', val: 1 }, // Boolean flag
            { cost: 1000, desc: "+2000% Barb Damage", type: 'heroDamage', val: 20, target: 'barbarian' }
        ]
    },
    druid: {
        name: "Druid",
        tiers: [
            { cost: 10, desc: "+150% Druid Damage", type: 'heroDamage', val: 1.5, target: 'druid' },
            { cost: 25, desc: "+20% Rare Drop Chance", type: 'rareFind', val: 20 },
            { cost: 50, desc: "+300% Druid Damage", type: 'heroDamage', val: 3, target: 'druid' },
            { cost: 75, desc: "Nature's Fury (All Heroes +50% Dmg)", type: 'allHeroDamage', val: 0.5 },
            { cost: 125, desc: "+450% Druid Damage", type: 'heroDamage', val: 4.5, target: 'druid' },
            { cost: 200, desc: "Primal Instinct (Shapeshift: +10s & +100% Click Dmg)", type: 'ability', id: 'primal_instinct' },
            { cost: 350, desc: "+800% Druid Damage", type: 'heroDamage', val: 8, target: 'druid' },
            { cost: 600, desc: "Balance (+20% All Resources)", type: 'resourceGain', val: 0.2 },
            { cost: 1000, desc: "+2000% Druid Damage", type: 'heroDamage', val: 20, target: 'druid' }
        ]
    }
};

class AscensionManager {
    constructor(gameState) {
        this.gameState = gameState;
        // Stores current tier level (0-9) for each hero id
        this.levels = {
            mage: 0,
            rogue: 0,
            paladin: 0,
            amazon: 0,
            necro: 0,
            barbarian: 0,
            druid: 0
        };
    }

    importData(data) {
        if (!data) return;
        let newLevels = data.levels || {};

        // Migration: Fix corrupted nested 'levels' from previous bug
        if (newLevels.levels) {
            newLevels = { ...newLevels, ...newLevels.levels };
            delete newLevels.levels;
        }

        this.levels = { ...this.levels, ...newLevels };
    }

    exportData() {
        return {
            levels: this.levels
        };
    }

    canAfford(heroId) {
        if (!ASCENSION_TREE[heroId]) return false;
        const currentLvl = this.levels[heroId];
        // Max level is now 9
        if (currentLvl >= 9) return false;

        const nextTier = ASCENSION_TREE[heroId].tiers[currentLvl];
        return this.gameState.bossEssence >= nextTier.cost;
    }

    buyAscension(heroId) {
        if (!this.canAfford(heroId)) return false;

        const currentLvl = this.levels[heroId];
        const nextTier = ASCENSION_TREE[heroId].tiers[currentLvl];

        this.gameState.bossEssence -= nextTier.cost;
        this.levels[heroId]++;

        this.gameState.recalculateStats();
        // Force Save to prevent data loss on reload
        if (window.saveManager) window.saveManager.save(this.gameState);
        return true;
    }

    getMultipliers() {
        const bon = {
            heroDamage: {},
            cinderGain: 0,
            critChance: 0,
            bossTimer: 0,
            bossGold: 0,
            globalMult: 0,
            magicFind: 0,
            clickDamagePct: 0,
            goldMult: 0,
            bossDamageTaken: 0,
            allHeroDamage: 0,
            rareFind: 0,
            stageScaling: 0,
            attackSpeed: 0,

            // New Stats
            cooldownReduction: 0,
            executioner: 0,
            divinityGain: 0,
            minionDuration: 0,
            overkill: false,
            resourceGain: 0, // General Resource Gain (Gold + Cinders + Dust maybe?)

            // Auto Proc Logic (Map)
            autoSkillProcs: {},

            // Abilities flags
            abilities: []
        };


        Object.keys(this.levels).forEach(heroId => {
            const lvl = this.levels[heroId];
            if (lvl === 0) return;

            const def = ASCENSION_TREE[heroId];
            if (!def) return;

            for (let i = 0; i < lvl; i++) {
                const tier = def.tiers[i];

                if (tier.type === 'ability') {
                    bon.abilities.push(tier.id);
                } else if (tier.type === 'heroDamage') {
                    if (!bon.heroDamage[tier.target]) bon.heroDamage[tier.target] = 0;
                    bon.heroDamage[tier.target] += tier.val;
                } else if (tier.type === 'autoSkillProc') {
                    bon.autoSkillProcs[tier.id] = tier.val;
                } else if (tier.type === 'overkill') {
                    bon.overkill = true;
                } else {
                    // Generic Accumulator for all other numeric stats (goldMult, etc.)
                    if (bon[tier.type] !== undefined) {
                        bon[tier.type] += tier.val;
                    }
                }
            }
        });

        return bon;
    }

    hasAbility(abilityId) {
        const mults = this.getMultipliers();
        return mults.abilities.includes(abilityId);
    }
}

window.AscensionManager = AscensionManager;
window.ASCENSION_TREE = ASCENSION_TREE;
