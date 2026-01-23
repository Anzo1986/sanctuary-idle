const UPGRADE_TYPES = {
    SHARPEN: { id: 'sharpen', name: 'Whetstone', baseCost: 100, scale: 1.5, desc: '+5 Click Damage', icon: '🪨', image: 'assets/upgrades/sharpen.png', type: 'clickDamage', value: 5 },
    REINFORCE: { id: 'reinforce', name: 'Reinforce', baseCost: 500, scale: 1.6, desc: '+10% Global DPS', icon: '💪', image: 'assets/upgrades/reinforce.png', type: 'globalMult', value: 0.10 },
    GREED: { id: 'greed', name: 'Greed', baseCost: 250, scale: 1.8, desc: '+5% Gold Find', icon: '💰', image: 'assets/upgrades/greed.png', type: 'goldMult', value: 0.05 },
    CRIT: { id: 'crit', name: 'Lethality', baseCost: 1000, scale: 2.0, desc: '+1% Crit Chance', icon: '🎯', image: 'assets/upgrades/crit.png', type: 'critChance', value: 1 },

    // New Upgrades
    MINION: { id: 'minion_up', name: 'Command', baseCost: 2000, scale: 1.7, desc: '+10% Hero Dmg', icon: '🧟', image: 'assets/upgrades/minion.png', type: 'heroDamage', value: 10 },
    BOSS: { id: 'boss_up', name: 'Slayer', baseCost: 2500, scale: 1.7, desc: '+10% Boss Dmg', icon: '🪓', image: 'assets/upgrades/boss.png', type: 'bossDamage', value: 10 },
    MAGIC: { id: 'magic_up', name: 'Fortune', baseCost: 1500, scale: 1.8, desc: '+5% Magic Find', icon: '🔮', image: 'assets/upgrades/magic.png', type: 'magicFind', value: 5 },
    CINDER: { id: 'cinder_up', name: 'Ash Colle.', baseCost: 3000, scale: 1.9, desc: '+5% Cinder Gain', icon: '🔥', image: 'assets/upgrades/cinder.jpg', imgScale: 1.3, type: 'cinderGain', value: 5 },
    DOUBLE: { id: 'double_up', name: 'Overpower', baseCost: 5000, scale: 2.2, desc: '+0.5% Double Dmg', icon: '⚡', image: 'assets/upgrades/double.jpg', imgScale: 1.3, type: 'doubleDamage', value: 0.5 }
};

class UpgradeManager {
    constructor(gameState) {
        this.gameState = gameState;
        // Levels: { sharpen: 0, reinforce: 2 ... }
        this.levels = {};
        Object.keys(UPGRADE_TYPES).forEach(k => this.levels[UPGRADE_TYPES[k].id] = 0);
    }

    getCost(upgradeId, offset = 0) {
        const def = Object.values(UPGRADE_TYPES).find(u => u.id === upgradeId);
        if (!def) return 999999999;
        const lvl = this.levels[upgradeId] + offset;
        let cost = def.baseCost * Math.pow(def.scale, lvl);
        if (this.gameState.multipliers.costReduction) {
            cost *= (1 - this.gameState.multipliers.costReduction);
        }
        return Math.floor(cost);
    }

    getBulkCost(upgradeId, amount) {
        const def = Object.values(UPGRADE_TYPES).find(u => u.id === upgradeId);
        if (!def) return { cost: 0, count: 0 };

        let totalCost = 0;
        let count = 0;
        let currentLinkCost = 0;

        // Clone level to simulate
        let tempLvl = 0; // Offset

        if (amount === 'max') {
            // Safety limit (e.g. 1000) locally to prevent freeze loop? 
            // Better: Check affordability
            let budget = this.gameState.gold;
            while (true) {
                currentLinkCost = this.getCost(upgradeId, tempLvl);
                if (budget >= currentLinkCost) {
                    budget -= currentLinkCost;
                    totalCost += currentLinkCost;
                    count++;
                    tempLvl++;
                    if (count >= 1000) break; // Hard Limit per tick
                } else {
                    break;
                }
            }
        } else {
            const num = parseInt(amount);
            for (let i = 0; i < num; i++) {
                totalCost += this.getCost(upgradeId, i);
                count++; // Always count projected
            }
        }
        return { cost: totalCost, count: count };
    }

    buyUpgrade(upgradeId, amount = 1) {
        const bulk = this.getBulkCost(upgradeId, amount);

        // If amount is fixed number, check affordability
        // If max, getBulkCost already limited by budget return only affordables

        if (bulk.count > 0 && this.gameState.gold >= bulk.cost) {
            this.gameState.gold -= bulk.cost;
            this.levels[upgradeId] += bulk.count;
            this.gameState.recalculateStats();
            return true;
        }
        return false;
    }

    getAllUpgrades() {
        return Object.values(UPGRADE_TYPES).map(def => ({
            ...def,
            level: this.levels[def.id],
            currentCost: this.getCost(def.id)
        }));
    }

    getMultipliers() {
        // Calculates TOTAL bonuses from all upgrades
        let bonuses = {
            clickDamageFlat: 0,
            globalDpsMult: 0,
            goldMult: 0,
            critChanceFlat: 0,
            heroDamage: 0,
            bossDamage: 0,
            magicFind: 0,
            cinderGain: 0,
            doubleDamage: 0
        };

        Object.values(UPGRADE_TYPES).forEach(def => {
            const lvl = this.levels[def.id];
            if (lvl === 0) return;

            if (def.type === 'clickDamage') {
                // Quadratic scaling: Level 1=1, Lv2=3, Lv3=6, Lv10=55
                // The user wants "more per level".
                // Formula: value * (lvl * (lvl + 1) / 2)
                bonuses.clickDamageFlat += (def.value * (lvl * (lvl + 1) / 2));
            }
            if (def.type === 'globalMult') bonuses.globalDpsMult += (def.value * lvl);
            if (def.type === 'goldMult') bonuses.goldMult += (def.value * lvl);
            if (def.type === 'critChance') bonuses.critChanceFlat += (def.value * lvl);

            // New Types
            if (def.type === 'heroDamage') bonuses.heroDamage += (def.value * lvl);
            if (def.type === 'bossDamage') bonuses.bossDamage += (def.value * lvl);
            if (def.type === 'magicFind') bonuses.magicFind += (def.value * lvl);
            if (def.type === 'cinderGain') bonuses.cinderGain += (def.value * lvl);
            if (def.type === 'doubleDamage') bonuses.doubleDamage += (def.value * lvl);
        });

        return bonuses;
    }


    reset() {
        Object.keys(UPGRADE_TYPES).forEach(k => this.levels[UPGRADE_TYPES[k].id] = 0);
    }
}

window.UpgradeManager = UpgradeManager;
window.UPGRADE_TYPES = UPGRADE_TYPES;
