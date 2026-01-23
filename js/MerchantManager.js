class MerchantManager {
    constructor(gameState) {
        this.gameState = gameState;
        // Rates
        this.dustToGoldRate = 50; // 1 Dust = 50 Gold (Initial)
        this.dustToCindersRate = 1000; // 1 Dust = 1000 Cinders (Buffed from previous feedback)
    }

    // --- Rates ---
    // --- Rates ---
    getDustToGoldRate() {
        // Matches GameState.getMonsterGold base formula (approx)
        // Gold grows at 1.5^stage
        const stage = Math.max(1, this.gameState.stage);
        const goldMult = this.gameState.multipliers.gold || 1;

        // Base value of one monster kill equivalent
        const baseVal = 10 * Math.pow(1.5, stage - 1);

        // Nerfed Rate: 1 Dust = 1% of a Monster Kill (MASSIVE NERF)
        // User had 7M dust, so we need to be very strict.
        return Math.floor(baseVal * goldMult * 0.01);
    }

    getDustToCindersRate() {
        // Matches GameState.getMonsterCinders base formula
        // Cinders based on HP (1.3^stage)
        const stage = Math.max(1, this.gameState.stage);
        const hpEst = 50 * Math.pow(1.3, stage - 1);

        // Cinder Multiplier
        let mult = this.gameState.multipliers.cinders || 0.01;
        if (mult === 0) mult = 0.01;

        // Nerfed Rate: 1 Dust = 1% of a Monster Drop (approx)
        return Math.floor(Math.max(1, hpEst * mult * 0.01));
    }

    convertDustToGold(amount) {
        if (amount > this.gameState.materials) return 0;
        const rate = this.getDustToGoldRate();
        const gold = amount * rate;

        this.gameState.materials -= amount;
        this.gameState.gold += gold;
        return gold;
    }

    convertDustToCinders(amount) {
        if (amount > this.gameState.materials) return 0;
        const rate = this.getDustToCindersRate();
        const cinders = amount * rate;

        this.gameState.materials -= amount;
        this.gameState.cinders += cinders;
        return cinders;
    }

    // --- Gambler Logic ---
    getGambleCost(currency, slot) {
        // Costs scale with stage
        const stage = Math.max(1, this.gameState.stage);

        // Mystery Item (random) costs more due to higher roll/luck chance
        const isMystery = (slot === 'random');
        const mysteryMult = isMystery ? 1.5 : 1.0;

        if (currency === 'dust') {
            // Dust stays linear because Salvage values are flat (don't scale with stage)
            const base = 100 * (1 + (stage * 0.1));
            return Math.floor(base * mysteryMult);
        }
        if (currency === 'gold') {
            // Gold scales Exponentially (1.5^stage) to match inflation.
            // Cost = 500 x Monster Kill Gold (approx).
            const baseMonsterGold = 10 * Math.pow(1.5, stage - 1);
            return Math.floor(500 * baseMonsterGold * mysteryMult);
        }
        return Infinity;
    }

    gambleItem(slot, currency) {
        // Pass slot to get correct cost (mystery vs specific)
        const cost = this.getGambleCost(currency, slot);

        if (currency === 'dust') {
            if (this.gameState.materials < cost) return null;
            this.gameState.materials -= cost;
        } else if (currency === 'gold') {
            if (this.gameState.gold < cost) return null;
            this.gameState.gold -= cost;
        } else {
            return null;
        }

        // Generate Item
        if (!window.Item) return null;

        // Luck Boost for Mystery Item (slot === 'random')
        // We use the 'isAlpha' parameter (5th arg) of rollDrop which gives 3x chance for high tier loot
        const isMystery = (slot === 'random');

        // rollDrop(stage, magicFind, isBoss, rareFind, isAlpha)
        const item = window.Item.rollDrop(
            this.gameState.stage,
            this.gameState.multipliers.magicFind || 0,
            false, // isBoss
            0, // rareFind
            isMystery // isAlpha (Boost for Mystery Gamble)
        );

        // Force slot if specific gamble selected
        if (!isMystery) {
            item.slot = slot;
            // Regenerate name and icon to match the forced slot
            item.name = item.generateName();
            item.icon = window.SLOT_ICONS[slot] || item.icon;

            // Re-roll stats? Stats might be generic, but some (like weapon damage) are slot specific.
            // Safe to re-init some parts or just construct a new item with same rarity?
            // "ItemConstructorHelper" doesn't do generic logic easily. 
            // But Item constructor logic for 'mainhand' adds clickDamageFlat. 
            // If we swapped slot to mainhand post-creation, we missed that check.

            // Better approach: Create new Item with preserved rarity
            const forcedItem = new window.Item(slot, item.rarity, this.gameState.stage);
            // Copy high-roll stats if any (complex), so easier to just use the new item.
            // The original roll determined rarity. We keep that rarity.
            return this.finalizeGamble(forcedItem);
        }

        return this.finalizeGamble(item);
    }

    finalizeGamble(item) {
        // Add to inventory
        const added = this.gameState.inventoryManager.addItem(item);

        if (!added) {
            // Inventory Full -> Auto Salvage
            const mats = window.Item.getSalvageValue(item);
            this.gameState.materials += mats;
            return { item: item, salvaged: true, mats: mats };
        }

        return { item: item, salvaged: false, name: item.name, rarity: item.rarity };
    }
}

window.MerchantManager = MerchantManager;
