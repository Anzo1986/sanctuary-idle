class AchievementManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.achievements = this.getDefinitions();
        // unlockedIds = Condition Met (Ready to Claim)
        this.unlockedIds = new Set();
        // claimedIds = Reward Collected (Active Bonus)
        this.claimedIds = new Set();
    }

    getDefinitions() {
        return [
            // ==========================================
            // WEALTH: GOLD
            // ==========================================
            {
                id: 'gold_1',
                category: 'Wealth: Gold',
                name: 'Apprentice Merchant',
                description: 'Possess 1 Million Gold.',
                check: (gs) => gs.gold >= 1e6,
                reward: { type: 'gold', value: 0.10 },
                rewardText: '+10% Gold Find'
            },
            {
                id: 'gold_2',
                category: 'Wealth: Gold',
                name: 'Merchant',
                description: 'Possess 1 Billion Gold.',
                check: (gs) => gs.gold >= 1e9,
                reward: { type: 'gold', value: 0.20 },
                rewardText: '+20% Gold Find'
            },
            {
                id: 'gold_3',
                category: 'Wealth: Gold',
                name: 'Tycoon',
                description: 'Possess 1 Trillion Gold.',
                check: (gs) => gs.gold >= 1e12,
                reward: { type: 'gold', value: 0.30 },
                rewardText: '+30% Gold Find'
            },
            {
                id: 'gold_4',
                category: 'Wealth: Gold',
                name: 'Magnate',
                description: 'Possess 1 Quadrillion Gold.',
                check: (gs) => gs.gold >= 1e15,
                reward: { type: 'gold', value: 0.50 },
                rewardText: '+50% Gold Find'
            },
            {
                id: 'gold_5',
                category: 'Wealth: Gold',
                name: 'Baron',
                description: 'Possess 1 Quintillion Gold.',
                check: (gs) => gs.gold >= 1e18,
                reward: { type: 'gold', value: 1.00 },
                rewardText: '+100% Gold Find'
            },
            {
                id: 'gold_6',
                category: 'Wealth: Gold',
                name: 'Midas',
                description: 'Possess 1 Sextillion Gold.',
                check: (gs) => gs.gold >= 1e21,
                reward: { type: 'gold', value: 1.00 },
                rewardText: '+100% Gold Find'
            },
            {
                id: 'gold_7',
                category: 'Wealth: Gold',
                name: 'Golden God',
                description: 'Possess 1 Septillion Gold.',
                check: (gs) => gs.gold >= 1e24,
                reward: { type: 'gold', value: 1.00 },
                rewardText: '+100% Gold Find'
            },
            {
                id: 'gold_8',
                category: 'Wealth: Gold',
                name: 'Wealth Incarnate',
                description: 'Possess 10 Septillion Gold.',
                check: (gs) => gs.gold >= 1e25,
                reward: { type: 'gold', value: 1.00 },
                rewardText: '+100% Gold Find'
            },
            {
                id: 'gold_9',
                category: 'Wealth: Gold',
                name: 'Planet Broker',
                description: 'Possess 1 Octillion Gold.',
                check: (gs) => gs.gold >= 1e27,
                reward: { type: 'gold', value: 1.00 },
                rewardText: '+100% Gold Find'
            },
            {
                id: 'gold_10',
                category: 'Wealth: Gold',
                name: 'Galaxy Owner',
                description: 'Possess 1 Nonillion Gold.',
                check: (gs) => gs.gold >= 1e30,
                reward: { type: 'gold', value: 1.00 },
                rewardText: '+100% Gold Find'
            },
            {
                id: 'gold_11',
                category: 'Wealth: Gold',
                name: 'Universe Buyer',
                description: 'Possess 1 Decillion Gold.',
                check: (gs) => gs.gold >= 1e33,
                reward: { type: 'gold', value: 1.00 },
                rewardText: '+100% Gold Find'
            },

            // ==========================================
            // WEALTH: CINDERS (Rebalanced)
            // ==========================================
            {
                id: 'cinders_1',
                category: 'Wealth: Cinders',
                name: 'Spark Catcher',
                description: 'Possess 1 Million Cinders.',
                check: (gs) => gs.cinders >= 1e6,
                reward: { type: 'cinders', value: 0.10 },
                rewardText: '+10% Cinder Gain'
            },
            {
                id: 'cinders_2',
                category: 'Wealth: Cinders',
                name: 'Flame Keeper',
                description: 'Possess 1 Billion Cinders.',
                check: (gs) => gs.cinders >= 1e9,
                reward: { type: 'cinders', value: 0.20 },
                rewardText: '+20% Cinder Gain'
            },
            {
                id: 'cinders_3',
                category: 'Wealth: Cinders',
                name: 'Firestarter',
                description: 'Possess 1 Trillion Cinders.',
                check: (gs) => gs.cinders >= 1e12,
                reward: { type: 'cinders', value: 0.30 },
                rewardText: '+30% Cinder Gain'
            },
            {
                id: 'cinders_4',
                category: 'Wealth: Cinders',
                name: 'Inferno',
                description: 'Possess 1 Quadrillion Cinders.',
                check: (gs) => gs.cinders >= 1e15,
                reward: { type: 'cinders', value: 0.40 },
                rewardText: '+40% Cinder Gain'
            },
            {
                id: 'cinders_5',
                category: 'Wealth: Cinders',
                name: 'Hellfire',
                description: 'Possess 1 Quintillion Cinders.',
                check: (gs) => gs.cinders >= 1e18,
                reward: { type: 'cinders', value: 0.50 },
                rewardText: '+50% Cinder Gain'
            },
            {
                id: 'cinders_6',
                category: 'Wealth: Cinders',
                name: 'Cataclysm',
                description: 'Possess 1 Sextillion Cinders.',
                check: (gs) => gs.cinders >= 1e21,
                reward: { type: 'cinders', value: 0.75 },
                rewardText: '+75% Cinder Gain'
            },
            {
                id: 'cinders_7',
                category: 'Wealth: Cinders',
                name: 'Supernova',
                description: 'Possess 1 Septillion Cinders.',
                check: (gs) => gs.cinders >= 1e24,
                reward: { type: 'cinders', value: 1.00 },
                rewardText: '+100% Cinder Gain'
            },
            {
                id: 'cinders_8',
                category: 'Wealth: Cinders',
                name: 'Big Bang',
                description: 'Possess 1 Octillion Cinders.',
                check: (gs) => gs.cinders >= 1e27,
                reward: { type: 'cinders', value: 1.00 },
                rewardText: '+100% Cinder Gain'
            },
            {
                id: 'cinders_9',
                category: 'Wealth: Cinders',
                name: 'Universal Flame',
                description: 'Possess 1 Nonillion Cinders.',
                check: (gs) => gs.cinders >= 1e30,
                reward: { type: 'cinders', value: 1.00 },
                rewardText: '+100% Cinder Gain'
            },
            {
                id: 'cinders_10',
                category: 'Wealth: Cinders',
                name: 'Eternal Ember',
                description: 'Possess 1 Decillion Cinders.',
                check: (gs) => gs.cinders >= 1e33,
                reward: { type: 'cinders', value: 1.00 },
                rewardText: '+100% Cinder Gain'
            },

            // ==========================================
            // COMBAT: POWER (DPS)
            // ==========================================
            {
                id: 'dps_1',
                category: 'Combat: Power',
                name: 'Dangerous',
                description: 'Reach 100,000 DPS.',
                check: (gs) => gs.totalDps >= 100000,
                reward: { type: 'damage', value: 0.05 },
                rewardText: '+5% Damage'
            },
            {
                id: 'dps_2',
                category: 'Combat: Power',
                name: 'Deadly',
                description: 'Reach 100 Million DPS.',
                check: (gs) => gs.totalDps >= 1e8,
                reward: { type: 'damage', value: 0.10 },
                rewardText: '+10% Damage'
            },
            {
                id: 'dps_3',
                category: 'Combat: Power',
                name: 'Lethal',
                description: 'Reach 100 Billion DPS.',
                check: (gs) => gs.totalDps >= 1e11,
                reward: { type: 'damage', value: 0.15 },
                rewardText: '+15% Damage'
            },
            {
                id: 'dps_4',
                category: 'Combat: Power',
                name: 'Destructive',
                description: 'Reach 100 Trillion DPS.',
                check: (gs) => gs.totalDps >= 1e14,
                reward: { type: 'damage', value: 0.25 },
                rewardText: '+25% Damage'
            },
            {
                id: 'dps_5',
                category: 'Combat: Power',
                name: 'Cataclysmic',
                description: 'Reach 100 Quadrillion DPS.',
                check: (gs) => gs.totalDps >= 1e17,
                reward: { type: 'damage', value: 0.50 },
                rewardText: '+50% Damage'
            },
            {
                id: 'dps_6',
                category: 'Combat: Power',
                name: 'Apocalyptic',
                description: 'Reach 100 Quintillion DPS.',
                check: (gs) => gs.totalDps >= 1e20,
                reward: { type: 'damage', value: 1.00 },
                rewardText: '+100% Damage'
            },

            // ==========================================
            // COMBAT: CLICKS
            // ==========================================
            {
                id: 'click_1',
                category: 'Combat: Clicks',
                name: 'Determined',
                description: 'Click 1,000 times.',
                check: (gs) => gs.stats && gs.stats.totalClicks >= 1000,
                reward: { type: 'clickDamage', value: 10.0 },
                rewardText: '+10% Click Damage'
            },
            {
                id: 'click_2',
                category: 'Combat: Clicks',
                name: 'Dedication',
                description: 'Click 5,000 times.',
                check: (gs) => gs.stats && gs.stats.totalClicks >= 5000,
                reward: { type: 'clickDamage', value: 15.0 },
                rewardText: '+15% Click Damage'
            },
            {
                id: 'click_3',
                category: 'Combat: Clicks',
                name: 'Relentless',
                description: 'Click 10,000 times.',
                check: (gs) => gs.stats && gs.stats.totalClicks >= 10000,
                reward: { type: 'clickDamage', value: 20.0 },
                rewardText: '+20% Click Damage'
            },
            {
                id: 'click_4',
                category: 'Combat: Clicks',
                name: 'Iron Finger',
                description: 'Click 25,000 times.',
                check: (gs) => gs.stats && gs.stats.totalClicks >= 25000,
                reward: { type: 'clickDamage', value: 25.0 },
                rewardText: '+25% Click Damage'
            },
            {
                id: 'click_5',
                category: 'Combat: Clicks',
                name: 'Unstoppable',
                description: 'Click 50,000 times.',
                check: (gs) => gs.stats && gs.stats.totalClicks >= 50000,
                reward: { type: 'clickDamage', value: 30.0 },
                rewardText: '+30% Click Damage'
            },
            {
                id: 'click_6',
                category: 'Combat: Clicks',
                name: 'Click Master',
                description: 'Click 100,000 times.',
                check: (gs) => gs.stats && gs.stats.totalClicks >= 100000,
                reward: { type: 'clickDamage', value: 50.0 },
                rewardText: '+50% Click Damage'
            },

            // ==========================================
            // COMBAT: BOSSES
            // ==========================================
            {
                id: 'boss_1',
                category: 'Combat: Bosses',
                name: 'New Challenger',
                description: 'Kill 10 Bosses.',
                check: (gs) => gs.stats && gs.stats.totalBossKills >= 10,
                reward: { type: 'bossDamage', value: 0.02 },
                rewardText: '+2% Boss Damage'
            },
            {
                id: 'boss_2',
                category: 'Combat: Bosses',
                name: 'Boss Hunter',
                description: 'Kill 50 Bosses.',
                check: (gs) => gs.stats && gs.stats.totalBossKills >= 50,
                reward: { type: 'bossDamage', value: 0.05 },
                rewardText: '+5% Boss Damage'
            },
            {
                id: 'boss_3',
                category: 'Combat: Bosses',
                name: 'Elite Hunter',
                description: 'Kill 100 Bosses.',
                check: (gs) => gs.stats && gs.stats.totalBossKills >= 100,
                reward: { type: 'bossDamage', value: 0.08 },
                rewardText: '+8% Boss Damage'
            },
            {
                id: 'boss_4',
                category: 'Combat: Bosses',
                name: 'Boss Slayer',
                description: 'Kill 250 Bosses.',
                check: (gs) => gs.stats && gs.stats.totalBossKills >= 250,
                reward: { type: 'bossDamage', value: 0.10 },
                rewardText: '+10% Boss Damage'
            },
            {
                id: 'boss_5',
                category: 'Combat: Bosses',
                name: 'Boss Destroyer',
                description: 'Kill 500 Bosses.',
                check: (gs) => gs.stats && gs.stats.totalBossKills >= 500,
                reward: { type: 'bossDamage', value: 0.15 },
                rewardText: '+15% Boss Damage'
            },
            {
                id: 'boss_6',
                category: 'Combat: Bosses',
                name: 'King Slayer',
                description: 'Kill 1,000 Bosses.',
                check: (gs) => gs.stats && gs.stats.totalBossKills >= 1000,
                reward: { type: 'bossDamage', value: 0.20 },
                rewardText: '+20% Boss Damage'
            },
            {
                id: 'boss_7',
                category: 'Combat: Bosses',
                name: 'Emperor Slayer',
                description: 'Kill 2,500 Bosses.',
                check: (gs) => gs.stats && gs.stats.totalBossKills >= 2500,
                reward: { type: 'bossDamage', value: 0.30 },
                rewardText: '+30% Boss Damage'
            },
            {
                id: 'boss_8',
                category: 'Combat: Bosses',
                name: 'God Slayer',
                description: 'Kill 5,000 Bosses.',
                check: (gs) => gs.stats && gs.stats.totalBossKills >= 5000,
                reward: { type: 'bossDamage', value: 0.50 },
                rewardText: '+50% Boss Damage'
            },

            // ==========================================
            // PROGRESSION: STAGES
            // ==========================================
            {
                id: 'stage_50',
                category: 'Progression: Stages',
                name: 'Survivor',
                description: 'Reach Stage 50.',
                check: (gs) => gs.stage >= 50,
                reward: { type: 'critChance', value: 2 },
                rewardText: '+2% Crit Chance'
            },
            {
                id: 'stage_100',
                category: 'Progression: Stages',
                name: 'Explorer',
                description: 'Reach Stage 100.',
                check: (gs) => gs.stage >= 100,
                reward: { type: 'critDamage', value: 20 },
                rewardText: '+20% Crit Damage'
            },
            {
                id: 'stage_200',
                category: 'Progression: Stages',
                name: 'Conqueror',
                description: 'Reach Stage 200.',
                check: (gs) => gs.stage >= 200,
                reward: { type: 'doubleDamage', value: 5 },
                rewardText: '+5% Double Damage'
            },
            {
                id: 'stage_300',
                category: 'Progression: Stages',
                name: 'Veteran',
                description: 'Reach Stage 300.',
                check: (gs) => gs.stage >= 300,
                reward: { type: 'magicFind', value: 10 },
                rewardText: '+10% Magic Find'
            },
            {
                id: 'stage_500',
                category: 'Progression: Stages',
                name: 'Hero',
                description: 'Reach Stage 500.',
                check: (gs) => gs.stage >= 500,
                reward: { type: 'critDamage', value: 50 },
                rewardText: '+50% Crit Damage'
            },
            {
                id: 'stage_750',
                category: 'Progression: Stages',
                name: 'Legend',
                description: 'Reach Stage 750.',
                check: (gs) => gs.stage >= 750,
                reward: { type: 'doubleDamage', value: 10 },
                rewardText: '+10% Double Damage'
            },
            {
                id: 'stage_1000',
                category: 'Progression: Stages',
                name: 'Demigod',
                description: 'Reach Stage 1000.',
                check: (gs) => gs.stage >= 1000,
                reward: { type: 'damage', value: 1.0 }, // +100%
                rewardText: '+100% Global Damage'
            },

            // ==========================================
            // HEROES (Legion)
            // ==========================================
            {
                id: 'heroes_1',
                category: 'Heroes',
                name: 'Squad Leader',
                description: 'Total Hero Levels: 50',
                check: (gs) => gs.unitManager.getTotalLevels() >= 50,
                reward: { type: 'heroDamage', value: 0.05 },
                rewardText: '+5% Hero Damage'
            },
            {
                id: 'heroes_2',
                category: 'Heroes',
                name: 'Commander',
                description: 'Total Hero Levels: 100',
                check: (gs) => gs.unitManager.getTotalLevels() >= 100,
                reward: { type: 'heroDamage', value: 0.10 },
                rewardText: '+10% Hero Damage'
            },
            {
                id: 'heroes_3',
                category: 'Heroes',
                name: 'General',
                description: 'Total Hero Levels: 250',
                check: (gs) => gs.unitManager.getTotalLevels() >= 250,
                reward: { type: 'heroDamage', value: 0.15 },
                rewardText: '+15% Hero Damage'
            },
            {
                id: 'heroes_4',
                category: 'Heroes',
                name: 'Warlord',
                description: 'Total Hero Levels: 500',
                check: (gs) => gs.unitManager.getTotalLevels() >= 500,
                reward: { type: 'heroDamage', value: 0.25 },
                rewardText: '+25% Hero Damage'
            },
            {
                id: 'heroes_5',
                category: 'Heroes',
                name: 'Emperor',
                description: 'Total Hero Levels: 1000',
                check: (gs) => gs.unitManager.getTotalLevels() >= 1000,
                reward: { type: 'heroDamage', value: 0.50 },
                rewardText: '+50% Hero Damage'
            },
            {
                id: 'heroes_6',
                category: 'Heroes',
                name: 'Supreme Commander',
                description: 'Total Hero Levels: 2500',
                check: (gs) => gs.unitManager.getTotalLevels() >= 2500,
                reward: { type: 'heroDamage', value: 1.00 },
                rewardText: '+100% Hero Damage'
            },
            {
                id: 'heroes_7',
                category: 'Heroes',
                name: 'God of War',
                description: 'Total Hero Levels: 5000',
                check: (gs) => gs.unitManager.getTotalLevels() >= 5000,
                reward: { type: 'heroDamage', value: 1.00 },
                rewardText: '+100% Hero Damage'
            },

            // ==========================================
            // COLLECTION
            // ==========================================
            {
                id: 'item_leg_20',
                category: 'Collection',
                name: 'Hoarder',
                description: 'Find 20 Legendary Items.',
                check: (gs) => gs.stats && gs.stats.totalLegendariesFound >= 20,
                reward: { type: 'magicFind', value: 10 },
                rewardText: '+10% Magic Find'
            },
            {
                id: 'item_leg_50',
                category: 'Collection',
                name: 'Curator',
                description: 'Find 50 Legendary Items.',
                check: (gs) => gs.stats && gs.stats.totalLegendariesFound >= 50,
                reward: { type: 'magicFind', value: 20 },
                rewardText: '+20% Magic Find'
            },
            {
                id: 'item_leg_100',
                category: 'Collection',
                name: 'Museum Owner',
                description: 'Find 100 Legendary Items.',
                check: (gs) => gs.stats && gs.stats.totalLegendariesFound >= 100,
                reward: { type: 'magicFind', value: 30 },
                rewardText: '+30% Magic Find'
            },
            {
                id: 'item_leg_200',
                category: 'Collection',
                name: 'Antique Keeper',
                description: 'Find 200 Legendary Items.',
                check: (gs) => gs.stats && gs.stats.totalLegendariesFound >= 200,
                reward: { type: 'magicFind', value: 40 },
                rewardText: '+40% Magic Find'
            },
            {
                id: 'item_leg_500',
                category: 'Collection',
                name: 'Vault Keeper',
                description: 'Find 500 Legendary Items.',
                check: (gs) => gs.stats && gs.stats.totalLegendariesFound >= 500,
                reward: { type: 'magicFind', value: 50 },
                rewardText: '+50% Magic Find'
            },
            {
                id: 'item_leg_1000',
                category: 'Collection',
                name: 'Dragon',
                description: 'Find 1,000 Legendary Items.',
                check: (gs) => gs.stats && gs.stats.totalLegendariesFound >= 1000,
                reward: { type: 'magicFind', value: 100 },
                rewardText: '+100% Magic Find'
            },

            // SET ITEMS (Reward: Hero Damage)
            {
                id: 'item_set_20',
                category: 'Collection',
                name: 'Set Collector I',
                description: 'Find 20 Set Items.',
                check: (gs) => gs.stats && gs.stats.totalSetsFound >= 20,
                reward: { type: 'heroDamage', value: 0.10 },
                rewardText: '+10% Hero Damage'
            },
            {
                id: 'item_set_50',
                category: 'Collection',
                name: 'Set Collector II',
                description: 'Find 50 Set Items.',
                check: (gs) => gs.stats && gs.stats.totalSetsFound >= 50,
                reward: { type: 'heroDamage', value: 0.20 },
                rewardText: '+20% Hero Damage'
            },
            {
                id: 'item_set_100',
                category: 'Collection',
                name: 'Set Collector III',
                description: 'Find 100 Set Items.',
                check: (gs) => gs.stats && gs.stats.totalSetsFound >= 100,
                reward: { type: 'heroDamage', value: 0.30 },
                rewardText: '+30% Hero Damage'
            },
            {
                id: 'item_set_200',
                category: 'Collection',
                name: 'Set Collector IV',
                description: 'Find 200 Set Items.',
                check: (gs) => gs.stats && gs.stats.totalSetsFound >= 200,
                reward: { type: 'heroDamage', value: 0.40 },
                rewardText: '+40% Hero Damage'
            },
            {
                id: 'item_set_500',
                category: 'Collection',
                name: 'Set Collector V',
                description: 'Find 500 Set Items.',
                check: (gs) => gs.stats && gs.stats.totalSetsFound >= 500,
                reward: { type: 'heroDamage', value: 0.50 },
                rewardText: '+50% Hero Damage'
            },
            {
                id: 'item_set_1000',
                category: 'Collection',
                name: 'Set Master',
                description: 'Find 1,000 Set Items.',
                check: (gs) => gs.stats && gs.stats.totalSetsFound >= 1000,
                reward: { type: 'heroDamage', value: 1.00 },
                rewardText: '+100% Hero Damage'
            },

            // UNIQUE ITEMS (Reward: Global Damage)
            {
                id: 'item_unique_20',
                category: 'Collection',
                name: 'Mythic Hunter I',
                description: 'Find 20 Unique Items.',
                check: (gs) => gs.stats && gs.stats.totalUniquesFound >= 20,
                reward: { type: 'damage', value: 0.10 },
                rewardText: '+10% Damage'
            },
            {
                id: 'item_unique_50',
                category: 'Collection',
                name: 'Mythic Hunter II',
                description: 'Find 50 Unique Items.',
                check: (gs) => gs.stats && gs.stats.totalUniquesFound >= 50,
                reward: { type: 'damage', value: 0.20 },
                rewardText: '+20% Damage'
            },
            {
                id: 'item_unique_100',
                category: 'Collection',
                name: 'Mythic Hunter III',
                description: 'Find 100 Unique Items.',
                check: (gs) => gs.stats && gs.stats.totalUniquesFound >= 100,
                reward: { type: 'damage', value: 0.30 },
                rewardText: '+30% Damage'
            },
            {
                id: 'item_unique_200',
                category: 'Collection',
                name: 'Mythic Hunter IV',
                description: 'Find 200 Unique Items.',
                check: (gs) => gs.stats && gs.stats.totalUniquesFound >= 200,
                reward: { type: 'damage', value: 0.40 },
                rewardText: '+40% Damage'
            },
            {
                id: 'item_unique_500',
                category: 'Collection',
                name: 'Mythic Hunter V',
                description: 'Find 500 Unique Items.',
                check: (gs) => gs.stats && gs.stats.totalUniquesFound >= 500,
                reward: { type: 'damage', value: 0.50 },
                rewardText: '+50% Damage'
            },
            {
                id: 'item_unique_1000',
                category: 'Collection',
                name: 'Mythic Master',
                description: 'Find 1,000 Unique Items.',
                check: (gs) => gs.stats && gs.stats.totalUniquesFound >= 1000,
                reward: { type: 'damage', value: 1.00 },
                rewardText: '+100% Damage'
            }
        ];
    }

    checkAchievements() {
        let newUnlock = false;

        if (!this.gameState.stats) {
            this.gameState.stats = {};
        }

        this.achievements.forEach(ach => {
            // Check if condition met and NOT yet unlocked (ready to claim)
            if (!this.unlockedIds.has(ach.id)) {
                try {
                    if (ach.check(this.gameState)) {
                        this.unlockedIds.add(ach.id);
                        newUnlock = true;

                        // Notify User: "Achievement Ready!" instead of Unlocked
                        if (window.gameState && window.gameState.addToLog) {
                            window.gameState.addToLog(`<span style="color:#ffd700;">✨ Achievement Ready: ${ach.name}</span>`);
                        }
                    }
                } catch (e) {
                    console.error("Error checking achievement " + ach.id, e);
                }
            }
        });

        // No need to recalc stats here because bonus is only applied on CLAIM
        if (newUnlock) {
            // Potentially trigger UI refresh if modal open
            if (document.getElementById('achievement-modal').style.display !== 'none') {
                window.renderAchievements();
            }
        }
    }

    claimAchievement(id) {
        if (this.unlockedIds.has(id) && !this.claimedIds.has(id)) {
            this.claimedIds.add(id);
            this.gameState.recalculateStats();

            // Find def for log
            const def = this.achievements.find(a => a.id === id);
            if (def && window.gameState.addToLog) {
                window.gameState.addToLog(`<span style="color:#00ff00; font-weight:bold;">🏆 Reward Claimed: ${def.name}</span>`);
            }
            return true;
        }
        return false;
    }

    getMultipliers() {
        const multipliers = {
            damage: 0,
            gold: 0,
            cinders: 0,
            critChance: 0,
            critDamage: 0,
            doubleDamage: 0,
            bossDamage: 0,
            heroDamage: 0,
            magicFind: 0,
            clickDamage: 0
        };

        this.achievements.forEach(ach => {
            // ONLY apply if CLAIMED
            if (this.claimedIds.has(ach.id)) {
                const type = ach.reward.type;
                const value = ach.reward.value;
                if (multipliers[type] !== undefined) {
                    multipliers[type] += value;
                }
            }
        });

        return multipliers;
    }

    exportData() {
        return {
            unlocked: Array.from(this.unlockedIds),
            claimed: Array.from(this.claimedIds)
        };
    }

    importData(data) {
        if (!data) return;

        // Legacy Array Support (Treat all as claimed)
        if (Array.isArray(data)) {
            this.unlockedIds = new Set(data);
            this.claimedIds = new Set(data);
        }
        // New Object Format
        else {
            if (data.unlocked) this.unlockedIds = new Set(data.unlocked);
            if (data.claimed) this.claimedIds = new Set(data.claimed);
        }
    }
}

window.AchievementManager = AchievementManager;
