const UNIT_TYPES = {
    MAGE: { id: 'mage', name: 'Mage', baseCost: 15, baseDps: 1, desc: 'Casts minor spells.', image: 'assets/heroes/mage.png' },
    ROGUE: { id: 'rogue', name: 'Rogue', baseCost: 100, baseDps: 5, desc: 'Shoots arrows from the shadows.', image: 'assets/heroes/rogue.png' },
    PALADIN: { id: 'paladin', name: 'Paladin', baseCost: 1100, baseDps: 12, desc: 'A holy warrior.', image: 'assets/heroes/paladin.png' },
    AMAZON: { id: 'amazon', name: 'Amazon', baseCost: 12000, baseDps: 60, desc: 'Master of the spear.', image: 'assets/heroes/amazon.png' },
    NECRO: { id: 'necro', name: 'Necromancer', baseCost: 130000, baseDps: 220, desc: 'Raises the dead.', image: 'assets/heroes/necro.png' },
    BARBARIAN: { id: 'barbarian', name: 'Barbarian', baseCost: 1400000, baseDps: 550, desc: 'Spins through enemies.', image: 'assets/heroes/barbarian.png' },
    DRUID: { id: 'druid', name: 'Druid', baseCost: 20000000, baseDps: 2500, desc: 'Shapeshifts and controls nature.', image: 'assets/heroes/druid.png' }
};

class UnitManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    getCost(unitId) {
        const count = this.gameState.units[unitId] || 0;
        const def = UNIT_TYPES[unitId.toUpperCase()];
        if (!def) return Infinity;
        let cost = def.baseCost * Math.pow(1.15, count);
        if (this.gameState.multipliers.costReduction) {
            cost *= (1 - this.gameState.multipliers.costReduction);
        }
        return Math.floor(cost);
    }

    // Helper: Calculate cost for N levels
    getBulkCost(unitId, amount) {
        let totalCost = 0;
        let count = this.gameState.units[unitId] || 0;
        const def = UNIT_TYPES[unitId.toUpperCase()];
        if (!def) return { cost: Infinity, amount: 0 };

        let reduction = 0;
        if (this.gameState.multipliers.costReduction) {
            reduction = this.gameState.multipliers.costReduction;
        }

        for (let i = 0; i < amount; i++) {
            let nextCost = def.baseCost * Math.pow(1.15, count + i);
            if (reduction) nextCost *= (1 - reduction);
            totalCost += Math.floor(nextCost);
        }
        return { cost: totalCost, amount: amount };
    }

    // Helper: Get Max Affordable
    getMaxBuyable(unitId) {
        let count = this.gameState.units[unitId] || 0;
        const def = UNIT_TYPES[unitId.toUpperCase()];
        if (!def) return 0;

        let cinders = this.gameState.cinders;
        let buyable = 0;

        let reduction = 0;
        if (this.gameState.multipliers.costReduction) {
            reduction = this.gameState.multipliers.costReduction;
        }

        // Loop until unaffordable (Performance note: If >1000 buyable, this loop is slow. 
        // Optimized approach: Geometric series formula, but with floor() per level it's inexact.
        // For idle games, max buy usually caps at 100 or 1000. 
        // We can do a safe loop with a breakout limit e.g. 1000.
        while (true) {
            let nextCost = def.baseCost * Math.pow(1.15, count + buyable);
            if (reduction) nextCost *= (1 - reduction);
            nextCost = Math.floor(nextCost);

            if (cinders >= nextCost) {
                cinders -= nextCost;
                buyable++;
                if (buyable >= 1000) break; // Safety cap
            } else {
                break;
            }
        }
        return buyable;
    }

    buyUnit(unitId, amount = 1) {
        // Handle 'max'
        if (amount === 'max') {
            const max = this.getMaxBuyable(unitId);
            if (max === 0) return false;
            amount = max;
        }

        const bulk = this.getBulkCost(unitId, amount);

        if (this.gameState.cinders >= bulk.cost) {
            this.gameState.cinders -= bulk.cost;

            if (!this.gameState.units[unitId]) {
                this.gameState.units[unitId] = 0;
            }
            this.gameState.units[unitId] += amount;

            this.gameState.recalculateStats();
            return true;
        }
        return false;
    }

    calculateTotalDps() {
        // Recursion Guard
        if (this._isCalculatingDps) {
            // console.warn("Recursion prevented in calculateTotalDps");
            return 0;
        }
        this._isCalculatingDps = true;

        try {
            let total = 0;

            // Get Multipliers from Ascension Manager
            const ascMults = this.gameState.ascensionManager ? this.gameState.ascensionManager.getMultipliers().heroDamage : {};

            // All Stats Multiplier (Lilith Ascension Tier 4: Ascendant)
            const allHeroBonus = this.gameState.ascensionManager ? (this.gameState.ascensionManager.getMultipliers().allHeroDamage || 0) : 0;

            for (const [key, def] of Object.entries(UNIT_TYPES)) {
                const count = this.gameState.units[def.id] || 0;

                // Milestones: x4 every 25 levels
                const milestoneMult = Math.pow(4, Math.floor(count / 25));

                // Base DPS for this hero type
                let dps = count * def.baseDps;

                // Apply Ascension Multiplier
                const ascBonus = ascMults[def.id] || 0;

                // Apply Class Affinity Bonus
                let affinityBonus = 0;
                if (this.gameState.inventoryManager && this.gameState.inventoryManager.currentAffinityBonuses) {
                    const aff = this.gameState.inventoryManager.currentAffinityBonuses;
                    if (aff.heroDamage && aff.heroDamage[def.id]) {
                        affinityBonus = aff.heroDamage[def.id];
                    }
                }

                // Total Multiplier
                const statsMultiplier = (1 + ascBonus + allHeroBonus) * (1 + affinityBonus);

                total += dps * statsMultiplier * milestoneMult;
            }
            return total;
        } finally {
            this._isCalculatingDps = false;
        }
    }

    // Helper to get milestone mult for UI
    getMilestoneMultiplier(unitId) {
        const count = this.gameState.units[unitId] || 0;
        return Math.pow(4, Math.floor(count / 25));
    }

    getAllUnits() {
        return Object.values(UNIT_TYPES).map(def => ({
            ...def,
            count: this.gameState.units[def.id] || 0,
            currentCost: this.getCost(def.id)
        }));
    }
    reset() {
        this.gameState.units = {};
    }

    getTotalLevels() {
        return Object.values(this.gameState.units).reduce((a, b) => a + b, 0);
    }
}

window.UnitManager = UnitManager;
window.UNIT_TYPES = UNIT_TYPES;
