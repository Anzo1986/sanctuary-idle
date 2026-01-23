class InventoryManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.maxSize = 20;
    }

    addItem(item) {
        if (this.gameState.inventory.length < this.maxSize) {
            this.gameState.inventory.push(item);
            return true;
        }
        return false;
    }

    equipItem(item) {
        const idx = this.gameState.inventory.indexOf(item);
        if (idx > -1) {
            const current = this.gameState.equipment[item.slot];

            if (current) {
                // Swap in place
                this.gameState.inventory[idx] = current;
            } else {
                // Remove if slot was empty
                this.gameState.inventory.splice(idx, 1);
            }

            this.gameState.equipment[item.slot] = item;

            this.gameState.recalculateStats();
            return true;
        }
        return false;
    }

    unequipItem(slot) {
        const item = this.gameState.equipment[slot];
        if (item && this.gameState.inventory.length < this.maxSize) {
            this.gameState.equipment[slot] = null;
            this.gameState.inventory.push(item);
            this.gameState.recalculateStats();
            return true;
        }
        return false;
    }

    calculateAffinityBonuses() {
        const counts = {};
        // Classes: mage, rogue, paladin, amazon, necro, barbarian, druid

        // Count equipped items per class
        Object.values(this.gameState.equipment).forEach(item => {
            if (item && item.classAffinity) {
                counts[item.classAffinity] = (counts[item.classAffinity] || 0) + 1;
            }
        });

        const bonuses = {
            heroDamage: {}, // e.g. { mage: 0.5, rogue: 0.5 }
            globalDps: 0,
            cinders: 0,
            critChance: 0,
            skillLevel: 0, // Placeholder
            uniqueMultiplier: 1,
            magicFind: 0
        };

        // Apply Bonuses based on counts
        const heroIds = ['mage', 'rogue', 'paladin', 'amazon', 'necro', 'barbarian', 'druid'];

        heroIds.forEach(heroId => {
            const count = counts[heroId] || 0;
            if (count >= 2) {
                // 2 Pieces: +50% Global Damage
                bonuses.globalDps += 0.5;
            }
            if (count >= 3) {
                // 3 Pieces: Utility
                if (heroId === 'mage') bonuses.cinders += 0.20;
                if (heroId === 'rogue') bonuses.critChance += 5;
                if (heroId === 'paladin') bonuses.bossDamage += 0.30; // Was +10% Global. Now +30% Boss Dmg (Smite) and maybe +10% Global? No, just Boss.
                if (heroId === 'amazon') bonuses.magicFind += 20;
                if (heroId === 'necro') bonuses.heroDamage += 0.30; // Was +25% Global. Now +30% Hero Dmg.
                if (heroId === 'barbarian') bonuses.critDamage += 20; // Was +5% Global. Now +20% Crit Dmg.
                if (heroId === 'druid') bonuses.uniqueMultiplier += 0.1;
            }
            if (count >= 4) {
                // 4 Pieces: +100% Global Damage
                bonuses.globalDps += 1.0;
            }
        });

        return bonuses;
    }

    calculateMultipliers() {
        // Base logic from items...
        let mults = {
            damage: 0,
            gold: 0,
            cinders: 1,
            critChance: 0,
            clickDamage: 0,
            critDamage: 0,
            heroDamage: 0,
            attackSpeed: 0 // New stat: % Increase (Additive)
        };

        let heroDamagePercent = 0; // Base 0%
        let bossDamagePercent = 0;
        let magicFindPercent = 0;
        let cinderGainPercent = 0;
        let clickDamagePercent = 0;
        let doubleDamagePercent = 0;

        // Inventory/Equipment standard stats
        Object.values(this.gameState.equipment).forEach(item => {
            if (!item) return;

            // Use item.getStats() if available, otherwise item.stats
            const itemStats = typeof item.getStats === 'function' ? item.getStats() : item.stats;

            Object.entries(itemStats).forEach(([stat, val]) => {
                // Map Item Stats (Item.js) to Inventory Multipliers
                let mappedStat = stat;
                if (stat === 'goldFind') mappedStat = 'gold';
                if (stat === 'globalDps') mappedStat = 'damage';

                if (mults[mappedStat] !== undefined) {
                    mults[mappedStat] += val;
                }

                // Handle new stats specifically (mapped from Item.js stat IDs)
                if (stat === 'heroDamage') heroDamagePercent += val;
                if (stat === 'bossDamage') bossDamagePercent += val;
                if (stat === 'magicFind') magicFindPercent += val;
                if (stat === 'cinderGain') cinderGainPercent += val;
                if (stat === 'doubleDamage') doubleDamagePercent += val;
                if (stat === 'clickDamage') clickDamagePercent += val;
            });
        });

        // --- NEW: Apply Class Affinity Bonuses ---
        const affBonuses = this.calculateAffinityBonuses();

        // 1. Apply Global DPS
        mults.damage += (affBonuses.globalDps * 100);

        // 2. Apply Utility
        cinderGainPercent += (affBonuses.cinders * 100);
        mults.critChance += affBonuses.critChance;
        magicFindPercent += affBonuses.magicFind;

        // 3. Hero Damage Integration
        // Ideally we pass this to AscensionManager or GameState stores it separately?
        // Current GameState structure for hero damage relies on AscensionManager.
        // We should add a 'classAffinityBonuses' to GameState or inject it into a global modifier list.
        // EASIEST: Store it in a public property on InventoryManager and let GameState read it.
        this.currentAffinityBonuses = affBonuses;

        // Apply Set Bonuses from 'set' items (Legacy Set Items if any)
        const setCounts = {};
        Object.values(this.gameState.equipment).forEach(item => {
            if (item && item.set) {
                setCounts[item.set] = (setCounts[item.set] || 0) + 1;
            }
        });

        Object.entries(setCounts).forEach(([setName, count]) => {
            const setDef = window.ITEM_SETS[setName];
            if (!setDef) return;

            Object.entries(setDef.bonuses).forEach(([requiredCount, bonus]) => {
                if (count >= parseInt(requiredCount)) {
                    // Existing
                    if (bonus.stat === 'dps' || bonus.stat === 'damage') mults.damage += (bonus.val * 100);
                    if (bonus.stat === 'gold') mults.gold += (bonus.val * 100);
                    if (bonus.stat === 'critChance') mults.critChance += bonus.val;
                    if (bonus.stat === 'clickDamage') clickDamagePercent += bonus.val;
                    if (bonus.stat === 'critDamage') mults.critDamage += bonus.val;

                    // New
                    if (bonus.stat === 'heroDamage') heroDamagePercent += bonus.val;
                    if (bonus.stat === 'bossDamage') bossDamagePercent += bonus.val;
                    if (bonus.stat === 'magicFind') magicFindPercent += bonus.val;
                    if (bonus.stat === 'cinderGain') cinderGainPercent += bonus.val;
                    if (bonus.stat === 'doubleDamage') doubleDamagePercent += bonus.val;
                }
            });
        });

        return {
            damage: mults.damage,
            gold: mults.gold,
            cinders: 1 + (cinderGainPercent / 100),
            critChance: mults.critChance, // Removed weird -5 offset, assumes mults only counts Item/Set bonuses
            clickDamage: clickDamagePercent,
            critDamage: mults.critDamage,
            heroDamage: heroDamagePercent,
            bossDamage: bossDamagePercent,
            magicFind: magicFindPercent,
            doubleDamage: doubleDamagePercent,
            attackSpeed: mults.attackSpeed,

            // Expose affinity bonuses for GameState to pick up
            classAffinity: affBonuses,

            // Unique Effects
            activeEffects: this.collectActiveEffects()
        };
    }

    collectActiveEffects() {
        const effects = [];
        Object.values(this.gameState.equipment).forEach(item => {
            if (item && item.effectId) {
                effects.push(item.effectId);
            }
        });
        return effects;
    }
}
window.InventoryManager = InventoryManager;
