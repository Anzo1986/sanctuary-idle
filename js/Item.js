const RARITY = {
    NORMAL: { id: 'normal', name: 'Normal', color: '#ffffff', chance: 0.5, statCount: 1 },    // White
    MAGIC: { id: 'magic', name: 'Magic', color: '#00ff00', chance: 0.25, statCount: 2 },     // Green
    RARE: { id: 'rare', name: 'Rare', color: '#4d90ff', chance: 0.10, statCount: 3 },       // Blue
    EPIC: { id: 'epic', name: 'Epic', color: '#a335ee', chance: 0.03, statCount: 4 },       // Violet
    LEGENDARY: { id: 'legendary', name: 'Legendary', color: '#ff8000', chance: 0.01, statCount: 5 }, // Orange
    UNIQUE: { id: 'unique', name: 'Unique', color: '#cfb53b', chance: 0.001, statCount: 7 }   // Gold
};

const MAX_UNIQUE_CHANCE = 0.02; // Hard Cap at 2%

const SLOTS = ['head', 'chest', 'hands', 'legs', 'mainhand', 'amulet'];

const SLOT_ICONS = {
    head: '🪖',
    chest: '🥋',
    hands: '🧤',
    legs: '🦵',
    mainhand: '⚔️',
    amulet: '📿'
};

const STAT_TYPES = [
    { id: 'critChance', name: 'Crit Chance', min: 1, max: 5, suffix: '%', desc: 'Chance to deal critical hits (150% damage).' },
    { id: 'clickDamage', name: 'Click Damage', min: 5, max: 20, suffix: '%', desc: 'Increases the damage dealt by your clicks.' },
    { id: 'globalDps', name: 'All Damage', min: 5, max: 15, suffix: '%', desc: 'Increases damage dealt by all sources (Heroes & Clicks).' },
    { id: 'goldFind', name: 'Gold Find', min: 10, max: 50, suffix: '%', desc: 'Increases Gold dropped by monsters.' },
    { id: 'critDamage', name: 'Crit Damage', min: 10, max: 50, suffix: '%', desc: 'Increases the damage multiplier of critical hits.' },
    { id: 'heroDamage', name: 'Hero Dmg', min: 10, max: 40, suffix: '%', desc: 'Increases damage dealt by your Heroes.' },
    { id: 'bossDamage', name: 'Boss Dmg', min: 10, max: 40, suffix: '%', desc: 'Increases damage dealt to Bosses.' },
    { id: 'magicFind', name: 'Magic Find', min: 5, max: 25, suffix: '%', desc: 'Increases chance to find higher quality items. Has diminishing returns (Unique Hard Cap at 2%).' },
    { id: 'cinderGain', name: 'Cinder Gain', min: 5, max: 25, suffix: '%', desc: 'Increases Cinders dropped by monsters.' },
    { id: 'doubleDamage', name: 'Double Dmg', min: 1, max: 3, suffix: '%', desc: 'Chance to deal double damage. Has diminishing returns (Hard Cap at 80%).' },
    { id: 'attackSpeed', name: 'Attack Speed', min: 0, max: 0, suffix: '%', desc: 'Increases rate of auto-attacks.', excludeFromDrop: true }
];

const ITEM_SETS = {
    "Angelic": {
        name: "Angelic Raiment",
        class: "paladin",
        color: "#00ffff",
        items: {
            head: "Angelic Halo",
            chest: "Angelic Robes",
            hands: "Angelic Grasps",
            legs: "Angelic Treads",
            mainhand: "Angelic Blade",
            amulet: "Angelic Ward"
        },
        bonuses: {
            2: { stat: 'gold', val: 0.5, desc: '+50% Gold Find' },
            4: { stat: 'heroDamage', val: 100, desc: '+100% Hero Dmg' },
            6: { stat: 'bossDamage', val: 100, desc: '+100% Boss Dmg' }
        }
    },
    "Demonic": {
        name: "Demonic Guise",
        class: "necro",
        color: "#00ff00",
        items: {
            head: "Demonic Horns",
            chest: "Demonic Cage",
            hands: "Demonic Claws",
            legs: "Demonic Hooves",
            mainhand: "Demonic Cleaver",
            amulet: "Demonic Heart"
        },
        bonuses: {
            2: { stat: 'critChance', val: 10, desc: '+10% Crit Chance' },
            4: { stat: 'clickDamage', val: 100, desc: '+100% Click Damage' },
            6: { stat: 'critDamage', val: 100, desc: '+100% Crit Damage' }
        }
    }
};

window.CLASS_ICONS = {
    druid: {
        head: "assets/items/spirit_headdress.png",
        chest: "assets/items/spirit_pelt.png",
        hands: "assets/items/spirit_wraps.png",
        legs: "assets/items/spirit_striders.png",
        mainhand: "assets/items/spirit_staff.png",
        amulet: "assets/items/spirit_totem.png"
    },
    paladin: {
        head: "assets/items/paladin_helm.png",
        chest: "assets/items/paladin_plate.png",
        hands: "assets/items/paladin_gauntlets.png",
        legs: "assets/items/paladin_greaves.png",
        mainhand: "assets/items/paladin_mace.png",
        amulet: "assets/items/paladin_rosary.png"
    },
    necro: {
        head: "assets/items/necro_skull.png",
        chest: "assets/items/necro_armor.png",
        hands: "assets/items/necro_gloves.png",
        legs: "assets/items/necro_leggings.png",
        mainhand: "assets/items/necro_scythe.png",
        amulet: "assets/items/necro_talisman.png"
    },
    mage: {
        head: "assets/items/mage_head.png",
        chest: "assets/items/mage_chest.png",
        hands: "assets/items/mage_hands.png",
        legs: "assets/items/mage_legs.png",
        mainhand: "assets/items/mage_mainhand.png",
        amulet: "assets/items/mage_amulet.png"
    },
    rogue: {
        head: "assets/items/rogue_head.png",
        chest: "assets/items/rogue_chest.png",
        hands: "assets/items/rogue_hands.png",
        legs: "assets/items/rogue_legs.png",
        mainhand: "assets/items/rogue_mainhand.png",
        amulet: "assets/items/rogue_amulet.png"
    },
    amazon: {
        head: "assets/items/amazon_head.png",
        chest: "assets/items/amazon_chest.png",
        hands: "assets/items/amazon_hands.png",
        legs: "assets/items/amazon_legs.png",
        mainhand: "assets/items/amazon_mainhand.png",
        amulet: "assets/items/amazon_amulet.png"
    },
    barbarian: {
        head: "assets/items/barbarian_head.png",
        chest: "assets/items/barbarian_chest.png",
        hands: "assets/items/barbarian_hands.png",
        legs: "assets/items/barbarian_legs.png",
        mainhand: "assets/items/barbarian_mainhand.png",
        amulet: "assets/items/barbarian_amulet.png"
    }
};

window.SET_ICONS = {
    "Angelic Halo": "assets/items/angelic_halo.png",
    "Angelic Robes": "assets/items/angelic_robes.png",
    "Angelic Grasps": "assets/items/angelic_grasps.png",
    "Angelic Treads": "assets/items/angelic_treads.png",
    "Angelic Blade": "assets/items/angelic_blade.png",
    "Angelic Ward": "assets/items/angelic_ward.png",
    "Demonic Horns": "assets/items/demonic_horns.png",
    "Demonic Cage": "assets/items/demonic_cage.png",
    "Demonic Claws": "assets/items/demonic_claws.png",
    "Demonic Hooves": "assets/items/demonic_hooves.png",
    "Demonic Cleaver": "assets/items/demonic_cleaver.png",
    "Demonic Heart": "assets/items/demonic_heart.png"
};

class ItemConstructorHelper {
    static createUniqueWithEffect(effectId, stage, slot = 'mainhand') {
        const effect = window.UNIQUE_EFFECTS.find(u => u.id === effectId);
        if (!effect) return null;

        // Ensure global RARITY is available
        const rarity = window.RARITY ? window.RARITY.UNIQUE : { id: 'unique', name: 'Unique', color: '#cfb53b', chance: 0.001, statCount: 7 };

        // Ensure slot is valid or random if not provided (though DevTools usually provides one)
        // If specific slot requested via argument (e.g. from existing logic), use it.

        const item = new Item(slot, rarity, stage);

        // Force Effect
        item.effectId = effect.id;
        item.effectDesc = effect.desc;
        item.flavor = effect.flavor;


        return item;
    }
}
window.ItemConstructorHelper = ItemConstructorHelper; // Expose helper

const UNIQUE_EFFECTS = [
    {
        id: 'overkill_explosion',
        desc: "Minion kills deal 50-100% Overkill Damage to next enemy.",
        flavor: "The bones of your enemies shatter, piercing those who follow."
    },
    {
        id: 'executioner',
        desc: "Instantly kill enemies below 15% HP (Bosses 5%).",
        flavor: "Heads will roll."
    },
    {
        id: 'time_warp',
        desc: "5% Chance on Kill to warp time (skip next monster).",
        flavor: "Time flows like sand..."
    },
    {
        id: 'frenzy',
        desc: "+20% Attack Speed.",
        flavor: "Fury unleased."
    },
    {
        id: 'echo_thunder',
        desc: "Every 10th attack triggers a Lightning Bolt for 1000% DPS.",
        flavor: "The storm answers your call."
    },
    {
        id: 'shadow_clone',
        desc: "2% Chance on Click to spawn a Shadow Clone (10s Duration, 20s Cooldown).",
        flavor: "You are not alone."
    }
];

// Expose for DevTools
window.UNIQUE_EFFECTS = UNIQUE_EFFECTS;
// Deprecated: Kept empty/legacy for compatibility if needed, but logic is removed.
window.UNIQUE_DEFINITIONS = [];

class Item {
    constructor(slot, rarity, stage = 1) {
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
        this.stage = stage; // Store stage first for scaling logic
        this.slot = slot;
        this.rarity = rarity;

        // Class Affinity
        // 50% chance to have a specific class affinity
        const classes = ['mage', 'rogue', 'paladin', 'amazon', 'necro', 'barbarian', 'druid'];
        this.classAffinity = classes[Math.floor(Math.random() * classes.length)];

        this.greaterStats = {};
        this.stats = this.rollStats(rarity.statCount);
        this.name = this.generateName();
        this.icon = SLOT_ICONS[slot] || '❓';

        // Class Specific Icons
        if (window.CLASS_ICONS && this.classAffinity && window.CLASS_ICONS[this.classAffinity] && window.CLASS_ICONS[this.classAffinity][slot]) {
            this.icon = window.CLASS_ICONS[this.classAffinity][slot];
        }
        this.set = null;
        this.upgradeLevel = 0;
        this.maxUpgrades = 10;
        this.effectId = null; // New property for Unique Effects
        this.effectDesc = null;
        this.flavor = null;

        // Weapon Intrinsic: Flat Click Damage
        // Scales with Stage: 5 * 1.1^(stage-1)
        if (slot === 'mainhand') {
            const baseDmg = 10 * Math.pow(1.16, stage - 1);
            this.clickDamageFlat = Math.floor(baseDmg);
        }

        // UNIQUE HANDLING
        if (rarity.id === 'unique') {
            // Apply Random Unique Effect
            if (UNIQUE_EFFECTS.length > 0) {
                const effect = UNIQUE_EFFECTS[Math.floor(Math.random() * UNIQUE_EFFECTS.length)];
                this.effectId = effect.id;
                this.effectDesc = effect.desc;
                this.flavor = effect.flavor;

                // Fancy Name Generation
                // E.g. "Executioner's [BaseName]" or "[BaseName] of Time"
                // For now: "Primal [BaseName]" + Flavor Name suffix?
                // Let's use a simple reliable prefix for now.
                this.name = "Primal " + this.name;
            }

            // 25% chance for Legendary items to become Set items (Buffed from 10%)
            if (rarity.id === 'legendary' && Math.random() < 0.25) {
                this.makeSetItem();
            }
        }

        // 25% chance for Legendary items to become Set items (Buffed from 10%)
        if (rarity.id === 'legendary' && Math.random() < 0.25) {
            this.makeSetItem();
        }
    }

    makeSetItem() {
        const sets = Object.keys(ITEM_SETS);
        const setName = sets[Math.floor(Math.random() * sets.length)];
        const setDef = ITEM_SETS[setName];

        this.set = setName;

        // Get specific name for this slot, fallback to generic if missing
        this.name = (setDef.items && setDef.items[this.slot])
            ? setDef.items[this.slot]
            : `${setName} Piece`;

        // Assign Custom Icon if defined
        if (typeof SET_ICONS !== 'undefined' && SET_ICONS[this.name]) {
            this.icon = SET_ICONS[this.name];
        }

        // Apply Fixed Class Affinity from Set
        if (setDef.class) {
            this.classAffinity = setDef.class;
        }

        // Recolor for set to distinct Teal
        this.rarity = { ...this.rarity, color: '#00ffff', id: 'set' };

        // Buff: Set Items have 6 Stats (Balanced against Uniques)
        this.stats = this.rollStats(6);
    }

    rollStats(count) {
        const stats = {};
        const availableTypes = window.STAT_TYPES.filter(t => !t.excludeFromDrop);

        // Stat Scaling: 2% per Item Level (Stage)
        const elementMult = Math.pow(1.02, Math.max(0, this.stage - 1));

        // Greater Stat Logic: 1% chance if Rarity is Legendary, Unique, or Set
        // Note: Set items use 'set' ID but we can check checking names or just allow if rarity.id is set/unique/legendary
        const canBeGreater = (this.rarity.id === 'legendary' || this.rarity.id === 'unique' || this.rarity.id === 'set');

        for (let i = 0; i < count; i++) {
            if (availableTypes.length === 0) break;
            const typeIndex = Math.floor(Math.random() * availableTypes.length);
            const type = availableTypes.splice(typeIndex, 1)[0];

            // Base Roll
            let val = Math.floor(Math.random() * (type.max - type.min + 1)) + type.min;

            // Apply Level Scaling
            if (type.id === 'magicFind' || type.id === 'bossDamage') {
                // Linear Scaling for Magic Find & Boss Damage: 2% per level
                // Base range * (1 + 0.02 * (Stage - 1))
                const linearMult = 1 + (0.02 * Math.max(0, this.stage - 1));
                val = Math.floor(val * linearMult);
            } else {
                // Exponential Scaling for others
                val = Math.floor(val * elementMult);
            }

            // Reincarnation Bonus (Hephaestus)
            if (window.gameState && window.gameState.reincarnationManager) {
                const mult = window.gameState.reincarnationManager.getMultipliers().itemStatMult || 1;
                val = Math.floor(val * mult);
            }

            // Greater Stat Check
            if (canBeGreater && Math.random() < 0.01) {
                val = Math.floor(val * 1.2);
                this.greaterStats[type.id] = true;
            }

            // Ensure at least 1
            val = Math.max(1, val);

            stats[type.id] = val;
        }
        return stats;
    }

    getSalvageValue() {
        switch (this.rarity.id) {
            case 'normal': return 1;
            case 'magic': return 3;
            case 'rare': return 10;
            case 'epic': return 25;
            case 'legendary': return 50;
            case 'set': return 150;
            case 'unique': return 250;
            default: return 1;
        }
    }

    generateName() {
        const slotNames = {
            head: ['Helm', 'Coif', 'Visor', 'Crown'],
            chest: ['Plate', 'Tunic', 'Cuirass', 'Robes'],
            hands: ['Gauntlets', 'Gloves', 'Grips', 'Touch'],
            legs: ['Greaves', 'Pants', 'Leggings', 'Boots'],
            mainhand: ['Sword', 'Axe', 'Wand', 'Mace', 'Scythe'],
            amulet: ['Amulet', 'Choker', 'Necklace', 'Talisman']
        };
        const base = slotNames[this.slot][Math.floor(Math.random() * slotNames[this.slot].length)];

        const prefixes = ['Mystic', 'Ancient', 'Glowing', 'Dark', 'Golden', 'Eternal', 'Cursed', 'Blessed'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

        return `${this.rarity.id !== 'normal' ? prefix + ' ' : ''}${base}`;
    }

    static rollDrop(stage, magicFind = 0, isBoss = false, rareFind = 0, isAlpha = false) {
        const rand = Math.random();

        // Stage Scaling: Increase luck by 2% per stage
        const stageMult = 1 + (stage * 0.02);

        // Helper to check chance with MF and Stage scaling
        const check = (rarity, isHighTier) => {
            const scaling = isHighTier ? stageMult : Math.max(1, stageMult * 0.5);
            // Bosses get 5x multiplier for high tier loot
            const bossMult = (isBoss && isHighTier) ? 5 : 1;
            // Alphas get 3x multiplier for high tier loot (Legendary/Unique/Set influence)
            const alphaMult = (isAlpha && isHighTier) ? 3 : 1;

            // Rare Find: Specific boost for Rarity > Magic
            const rareBonus = (rarity.id !== 'magic' && rarity.id !== 'normal') ? (1 + rareFind / 100) : 1;

            let p = (rarity.chance * (1 + magicFind / 100) * rareBonus * scaling * bossMult * alphaMult);

            // HARD CAP for Uniques
            if (rarity.id === 'unique' && p > MAX_UNIQUE_CHANCE) {
                p = MAX_UNIQUE_CHANCE;
            }

            return rand < p;
        };


        const create = (rarity) => new Item(SLOTS[Math.floor(Math.random() * SLOTS.length)], rarity, stage);

        // UNIQUE
        if (check(RARITY.UNIQUE, true)) return create(RARITY.UNIQUE);
        else if (check(RARITY.LEGENDARY, true)) return create(RARITY.LEGENDARY);
        else if (check(RARITY.EPIC, true)) return create(RARITY.EPIC);

        // Boss Guarantee: At least Rare
        if (isBoss) return create(RARITY.RARE);

        if (check(RARITY.RARE, true)) return create(RARITY.RARE);
        else if (check(RARITY.MAGIC, false)) return create(RARITY.MAGIC);
        else return create(RARITY.NORMAL);
    }

    static getDropChances(stage, magicFind = 0, rareFind = 0) {
        // Calculate probability of each tier
        // NOTE: This assumes Normal Mob (isBoss = false) for general display
        const stageMult = 1 + (stage * 0.02);

        const getChance = (rarity, isHighTier) => {
            const scaling = isHighTier ? stageMult : Math.max(1, stageMult * 0.5);
            const rareBonus = (rarity.id !== 'magic' && rarity.id !== 'normal') ? (1 + rareFind / 100) : 1;
            // Raw chance (0 to 1)
            let p = rarity.chance * (1 + magicFind / 100) * rareBonus * scaling;

            // HARD CAP for Uniques
            if (rarity.id === 'unique' && p > MAX_UNIQUE_CHANCE) {
                p = MAX_UNIQUE_CHANCE;
            }

            return Math.min(1, p);
        };

        // Cascade Logic:
        // P(Unique) = pUnique
        // P(Leg) = (1 - pUnique) * pLeg
        // P(Epic) = (1 - pUnique) * (1 - pLeg) * pEpic
        // ...

        const pUnique = getChance(RARITY.UNIQUE, true);
        const pLeg = getChance(RARITY.LEGENDARY, true);
        const pEpic = getChance(RARITY.EPIC, true);
        const pRare = getChance(RARITY.RARE, true);
        const pMagic = getChance(RARITY.MAGIC, false);

        // Actual Probabilities
        const actualUnique = pUnique;
        const actualLegTotal = (1 - pUnique) * pLeg;

        // Split Legendary into Set (25%) and Regular Legendary (75%)
        const actualSet = actualLegTotal * 0.25;
        const actualLegendary = actualLegTotal * 0.75;

        const actualEpic = (1 - pUnique) * (1 - pLeg) * pEpic;
        const actualRare = (1 - pUnique) * (1 - pLeg) * (1 - pEpic) * pRare;
        const actualMagic = (1 - pUnique) * (1 - pLeg) * (1 - pEpic) * (1 - pRare) * pMagic;
        // Normal is the rest? Or does it fail? It usually defaults to Normal if all checks fail.
        const actualNormal = 1 - (actualUnique + actualLegTotal + actualEpic + actualRare + actualMagic);

        return [
            { id: 'unique', name: 'Unique', val: actualUnique, color: RARITY.UNIQUE.color },
            { id: 'set', name: 'Set Item', val: actualSet, color: '#00ffff' }, // Cyan for Set Items
            { id: 'legendary', name: 'Legendary', val: actualLegendary, color: RARITY.LEGENDARY.color },
            { id: 'epic', name: 'Epic', val: actualEpic, color: RARITY.EPIC.color },
            { id: 'rare', name: 'Rare', val: actualRare, color: RARITY.RARE.color },
            { id: 'magic', name: 'Magic', val: actualMagic, color: RARITY.MAGIC.color },
            { id: 'normal', name: 'Normal', val: Math.max(0, actualNormal), color: RARITY.NORMAL.color }
        ];
    }

    upgrade() {
        if (this.upgradeLevel >= this.maxUpgrades) return false;
        this.upgradeLevel++;

        // Increase all stats by 10%
        Object.keys(this.stats).forEach(key => {
            let val = this.stats[key];
            val = Math.floor(val * 1.10);
            this.stats[key] = Math.max(1, val);
        });

        // Also scale weapon damage
        if (this.clickDamageFlat) {
            this.clickDamageFlat = Math.floor(this.clickDamageFlat * 1.10);
        }

        // Add new Stat at Max Level
        if (this.upgradeLevel === this.maxUpgrades) {
            const availableTypes = window.STAT_TYPES.filter(t => !this.stats[t.id]);

            if (availableTypes.length > 0) {
                const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];

                // Roll Value (using similar logic to rollStats but for single stat)
                const elementMult = Math.pow(1.02, Math.max(0, this.stage - 1));
                let val = Math.floor(Math.random() * (type.max - type.min + 1)) + type.min;

                if (type.id === 'magicFind' || type.id === 'bossDamage') {
                    const linearMult = 1 + (0.02 * Math.max(0, this.stage - 1));
                    val = Math.floor(val * linearMult);
                } else {
                    val = Math.floor(val * elementMult);
                }

                // Apply Reincarnation Bonus if accessible (optional, but consistent)
                if (window.gameState && window.gameState.reincarnationManager) {
                    const mult = window.gameState.reincarnationManager.getMultipliers().itemStatMult || 1;
                    val = Math.floor(val * mult);
                }

                val = Math.max(1, val);
                this.stats[type.id] = val;

                // Optional: Mark it as a special addition? 
                // We don't have a specific field for this, but it will show up in the tooltip.
            }
        }

        return true;
    }

    reforge(newLevel) {
        // Reforge brings item to current level (scaling stats)
        this.adjustLevel(newLevel);
    }


    adjustLevel(newLevel) {
        if (newLevel <= 0) newLevel = 1;

        const oldStage = this.stage;
        const oldMult = Math.pow(1.02, Math.max(0, oldStage - 1));
        const newMult = Math.pow(1.02, Math.max(0, newLevel - 1));
        const expRatio = newMult / oldMult;

        const oldLinear = 1 + (0.02 * Math.max(0, oldStage - 1));
        const newLinear = 1 + (0.02 * Math.max(0, newLevel - 1));
        const linearRatio = newLinear / oldLinear;

        this.stage = newLevel;

        // Apply to Stats
        Object.keys(this.stats).forEach(key => {
            let val = this.stats[key];

            if (key === 'magicFind' || key === 'bossDamage') {
                val = Math.floor(val * linearRatio);
            } else {
                val = Math.floor(val * expRatio);
            }

            this.stats[key] = Math.max(1, val);
        });

        // Recalculate Weapon Flat Damage if applicable
        if (this.slot === 'mainhand') {
            const baseDmg = 10 * Math.pow(1.16, this.stage - 1);
            this.clickDamageFlat = Math.floor(baseDmg);
        }
    }
}

window.Item = Item;
window.RARITY = RARITY;
window.SLOTS = SLOTS;
window.SLOT_ICONS = SLOT_ICONS;
window.STAT_TYPES = STAT_TYPES;
window.ITEM_SETS = ITEM_SETS;

window.SLOT_IMAGES = {
    head: 'assets/items/head.png',
    chest: 'assets/items/chest.png',
    hands: 'assets/items/hands.png',
    legs: 'assets/items/legs.png',
    mainhand: 'assets/items/mainhand.png',
    amulet: 'assets/items/amulet.png'
};
