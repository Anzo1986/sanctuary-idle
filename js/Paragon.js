class ParagonManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.points = 0;
        this.spentPoints = 0;
        this.currentBoardId = 1;

        // Define board structure
        // 0: Center (Start)
        // 1-4: Inner Ring (Basic Stats)
        // 5-8: Outer Ring (Stronger Stats)
        this.nodes = [
            // --- CENTER ---
            { id: 0, gx: 0, gy: 0, type: 'start', name: 'Awakening', desc: 'The journey begins.', cost: 0, unlocked: true, icon: '✨' },

            // ================= CARDINAL BRANCHES =================
            // --- NORTH BRANCH (WARRIOR / CLICK DMG) ---
            { id: 101, gx: 0, gy: -1, type: 'stat', name: 'Strength', desc: '+5% Click Dmg', cost: 5, val: { clickDamage: 5 }, req: [0], icon: '💪' },
            { id: 102, gx: -1, gy: -2, type: 'stat', name: 'Strength', desc: '+5% Click Dmg', cost: 5, val: { clickDamage: 5 }, req: [101], icon: '💪' },
            { id: 103, gx: 1, gy: -2, type: 'stat', name: 'Strength', desc: '+5% Click Dmg', cost: 5, val: { clickDamage: 5 }, req: [101], icon: '💪' },
            { id: 104, gx: 0, gy: -3, type: 'rare', name: 'Warlord', desc: '+25% Click Dmg', cost: 25, val: { clickDamage: 25 }, req: [102, 103], icon: '🥊' },
            { id: 105, gx: 0, gy: -4, type: 'stat', name: 'Violence', desc: '+10% Crit Dmg', cost: 10, val: { critDamage: 10 }, req: [104, 505], icon: '💥' },
            { id: 106, gx: -1, gy: -5, type: 'rare', name: 'Rupture', desc: '+20% Crit Dmg', cost: 25, val: { critDamage: 20 }, req: [105, 512], icon: '🩸' },
            { id: 107, gx: 1, gy: -5, type: 'rare', name: 'Executioner', desc: '+25% Boss Dmg', cost: 25, val: { bossDamage: 25 }, req: [105], icon: '🪓' },
            { id: 108, gx: 0, gy: -6, type: 'gate', name: 'Gate to Beyond', desc: 'Travel to the next Paragon Board', cost: 0, targetBoard: 2, val: {}, req: [106, 107], icon: 'assets/ui/paragon_door.png?v=2' },

            // ... (Other nodes will be assigned board:1 dynamically or implicitly logic)
            // Actually, inserting board:1 here manually or via post-process is safer. 
            // I'll rely on a post-process loop I will add in constructor.

            // ... (Rest of Board 1 nodes kept as is) ...


            // --- EAST BRANCH (ROGUE / GOLD & LUCK) ---
            { id: 201, gx: 1, gy: 0, type: 'stat', name: 'Dexterity', desc: '+5% Gold Find', cost: 5, val: { gold: 5 }, req: [0], icon: '🦵' },
            { id: 202, gx: 2, gy: -1, type: 'stat', name: 'Dexterity', desc: '+5% Gold Find', cost: 5, val: { gold: 5 }, req: [201], icon: '🦵' },
            { id: 203, gx: 2, gy: 1, type: 'stat', name: 'Cunning', desc: '+1% Crit Chance', cost: 5, val: { critChance: 1 }, req: [201], icon: '🎯' },
            { id: 204, gx: 3, gy: 0, type: 'rare', name: 'Tycoon', desc: '+25% Gold Find', cost: 25, val: { gold: 25 }, req: [202, 203], icon: '💰' },
            { id: 205, gx: 4, gy: 0, type: 'stat', name: 'Greed', desc: '+10% Gold Find', cost: 10, val: { gold: 10 }, req: [204], icon: '🪙' },
            { id: 206, gx: 5, gy: -1, type: 'rare', name: 'Fortune', desc: '+15% Magic Find', cost: 25, val: { magicFind: 15 }, req: [205, 506], icon: '🔮' },
            { id: 207, gx: 5, gy: 1, type: 'rare', name: 'Lethality', desc: '+5% Crit Chance', cost: 25, val: { critChance: 5 }, req: [205, 507], icon: '🗡️' },
            { id: 208, gx: 6, gy: 0, type: 'legendary', name: 'Midas Touch', desc: '+100% Gold Find', cost: 50, val: { gold: 100 }, req: [206, 207], icon: '👑' },

            // --- SOUTH BRANCH (MAGE / GLOBAL POWER) ---
            { id: 301, gx: 0, gy: 1, type: 'stat', name: 'Intelligence', desc: '+2% Global Dmg', cost: 5, val: { damage: 2 }, req: [0], icon: '🧠' },
            { id: 302, gx: -1, gy: 2, type: 'stat', name: 'Focus', desc: '+5% Cinders', cost: 5, val: { cinderGain: 5 }, req: [301], icon: '🔥' },
            { id: 303, gx: 1, gy: 2, type: 'stat', name: 'Intelligence', desc: '+2% Global Dmg', cost: 5, val: { damage: 2 }, req: [301], icon: '🧠' },
            { id: 304, gx: 0, gy: 3, type: 'rare', name: 'Archmage', desc: '+10% Global Dmg', cost: 25, val: { damage: 10 }, req: [302, 303], icon: '🧙' },
            { id: 305, gx: 0, gy: 4, type: 'stat', name: 'Power', desc: '+5% Global Dmg', cost: 15, val: { damage: 5 }, req: [304, 508], icon: '⚡' },
            { id: 306, gx: -1, gy: 5, type: 'rare', name: 'Incinerate', desc: '+20% Cinder Gain', cost: 25, val: { cinderGain: 20 }, req: [305], icon: '🌋' },
            { id: 307, gx: 1, gy: 5, type: 'rare', name: 'Overcharge', desc: '+1% Double Dmg', cost: 25, val: { doubleDamage: 1 }, req: [305, 509], icon: '🔋' },
            { id: 308, gx: 0, gy: 6, type: 'legendary', name: 'Cataclysm', desc: '+25% Global Dmg', cost: 75, val: { damage: 25 }, req: [306, 307], icon: '🌌' },

            // --- WEST BRANCH (NECRO / MINION & UTILITY) ---
            { id: 401, gx: -1, gy: 0, type: 'stat', name: 'Willpower', desc: '+5% Hero Dmg', cost: 5, val: { heroDamage: 5 }, req: [0], icon: '💀' },
            { id: 402, gx: -2, gy: -1, type: 'stat', name: 'Willpower', desc: '+5% Hero Dmg', cost: 5, val: { heroDamage: 5 }, req: [401], icon: '💀' },
            { id: 403, gx: -2, gy: 1, type: 'stat', name: 'Command', desc: '+2% Global Dmg', cost: 5, val: { damage: 2 }, req: [401], icon: '🗣️' },
            { id: 404, gx: -3, gy: 0, type: 'rare', name: 'Commander', desc: '+25% Hero Dmg', cost: 25, val: { heroDamage: 25 }, req: [402, 403], icon: '🛡️' },
            { id: 405, gx: -4, gy: 0, type: 'stat', name: 'Horde', desc: '+10% Hero Dmg', cost: 10, val: { heroDamage: 10 }, req: [404], icon: '🧟' },
            { id: 406, gx: -5, gy: -1, type: 'rare', name: 'Swarm', desc: '+5% Cinder Gain', cost: 25, val: { cinderGain: 5 }, req: [405, 511], icon: '🐝' },
            { id: 407, gx: -5, gy: 1, type: 'rare', name: 'Sacrifice', desc: '+20% Boss Dmg', cost: 25, val: { bossDamage: 20 }, req: [405, 510], icon: '🩸' },
            { id: 408, gx: -6, gy: 0, type: 'legendary', name: 'Army of Dead', desc: '+50% Hero Dmg', cost: 50, val: { heroDamage: 50 }, req: [406, 407], icon: '🏴' },

            // ================= DIAGONAL BRANCHES =================
            // --- NE BRANCH (PALADIN / DEFENSE & BOSS) ---
            { id: 601, gx: 2, gy: -2, type: 'stat', name: 'Valor', desc: '+5% Boss Dmg', cost: 5, val: { bossDamage: 5 }, req: [103, 202], icon: '🛡️' },
            { id: 602, gx: 3, gy: -3, type: 'stat', name: 'Valor', desc: '+5% Boss Dmg', cost: 5, val: { bossDamage: 5 }, req: [601, 506], icon: '🛡️' },
            { id: 603, gx: 4, gy: -4, type: 'rare', name: 'Crusader', desc: '+25% Boss Dmg', cost: 25, val: { bossDamage: 25 }, req: [602], icon: '⛪' },
            { id: 604, gx: 5, gy: -5, type: 'stat', name: 'Justice', desc: '+0.5% Double Dmg', cost: 10, val: { doubleDamage: 0.5 }, req: [603, 505], icon: '⚖️' },
            { id: 605, gx: 6, gy: -6, type: 'legendary', name: 'Holy Wrath', desc: '+5% Double Dmg Chance', cost: 75, val: { doubleDamage: 5 }, req: [604], icon: '☀️' },

            // --- SE BRANCH (BARBARIAN / CRIT DMG) ---
            { id: 701, gx: 2, gy: 2, type: 'stat', name: 'Fury', desc: '+10% Crit Dmg', cost: 5, val: { critDamage: 10 }, req: [203, 303], icon: '💢' },
            { id: 702, gx: 3, gy: 3, type: 'stat', name: 'Fury', desc: '+10% Crit Dmg', cost: 5, val: { critDamage: 10 }, req: [701, 507], icon: '💢' },
            { id: 703, gx: 4, gy: 4, type: 'rare', name: 'Berserker', desc: '+50% Crit Dmg', cost: 25, val: { critDamage: 50 }, req: [702], icon: '👺' },
            { id: 704, gx: 5, gy: 5, type: 'stat', name: 'Rage', desc: '+5% Click Dmg', cost: 10, val: { clickDamage: 5 }, req: [703, 508], icon: '😤' },
            { id: 705, gx: 6, gy: 6, type: 'legendary', name: 'Massacre', desc: '+100% Crit Dmg', cost: 75, val: { critDamage: 100 }, req: [704], icon: '🩸' },

            // --- SW BRANCH (DRUID / HYBRID ECO) ---
            { id: 801, gx: -2, gy: 2, type: 'stat', name: 'Nature', desc: '+5% Magic Find', cost: 5, val: { magicFind: 5 }, req: [302, 403], icon: '🌿' },
            { id: 802, gx: -3, gy: 3, type: 'stat', name: 'Nature', desc: '+5% Gold Find', cost: 5, val: { gold: 5 }, req: [801, 510], icon: '🌿' },
            { id: 803, gx: -4, gy: 4, type: 'rare', name: 'Alchemist', desc: '+20% MF & Gold', cost: 30, val: { magicFind: 20, gold: 20 }, req: [802], icon: '⚗️' },
            { id: 804, gx: -5, gy: 5, type: 'stat', name: 'Growth', desc: '+5% Cinders', cost: 10, val: { cinderGain: 5 }, req: [803, 509], icon: '🌱' },
            { id: 805, gx: -6, gy: 6, type: 'legendary', name: 'Balance', desc: '+30% All Resources', cost: 75, val: { magicFind: 30, gold: 30, cinderGain: 30 }, req: [804], icon: '☯️' },

            // --- NW BRANCH (AMAZON / SPEED & DPS) ---
            { id: 901, gx: -2, gy: -2, type: 'stat', name: 'Agility', desc: '+2% Global Dmg', cost: 5, val: { damage: 2 }, req: [402, 102], icon: '🐆' },
            { id: 902, gx: -3, gy: -3, type: 'stat', name: 'Agility', desc: '+5% Cinders', cost: 5, val: { cinderGain: 5 }, req: [901, 511], icon: '🐆' },
            { id: 903, gx: -4, gy: -4, type: 'rare', name: 'Slayer', desc: '+15% Global Dmg', cost: 25, val: { damage: 15 }, req: [902], icon: '🏹' },
            { id: 904, gx: -5, gy: -5, type: 'stat', name: 'Hunt', desc: '+5% Boss Dmg', cost: 10, val: { bossDamage: 5 }, req: [903, 512], icon: '🐾' },
            { id: 905, gx: -6, gy: -6, type: 'legendary', name: 'Valkyrie', desc: '+50% Attack Speed', cost: 75, val: { attackSpeed: 50 }, req: [904], icon: '🧚‍♀️' },

            // --- OUTER RIM CONNECTIONS (THE WEB) ---
            { id: 501, gx: 1, gy: -1, type: 'normal', name: 'Bridge', desc: '+1% Crit Chance', cost: 10, val: { critChance: 1 }, req: [103, 202, 601], icon: '🔗' },
            { id: 502, gx: 1, gy: 1, type: 'normal', name: 'Bridge', desc: '+5% Cinders', cost: 10, val: { cinderGain: 5 }, req: [203, 303, 701], icon: '🔗' },
            { id: 503, gx: -1, gy: 1, type: 'normal', name: 'Bridge', desc: '+2% Global', cost: 10, val: { damage: 2 }, req: [302, 403, 801], icon: '🔗' },
            { id: 504, gx: -1, gy: -1, type: 'normal', name: 'Bridge', desc: '+5% Boss Dmg', cost: 10, val: { bossDamage: 5 }, req: [402, 102, 901], icon: '🔗' },

            // Connect Outer Rares for Loop
            { id: 505, gx: 3, gy: -4, type: 'normal', name: 'Void Link', desc: '+5% Boss Dmg', cost: 15, val: { bossDamage: 5 }, req: [604, 105], icon: '🌌' },
            { id: 506, gx: 4, gy: -2, type: 'normal', name: 'Void Link', desc: '+5% Gold', cost: 15, val: { gold: 5 }, req: [602, 206], icon: '🌌' },
            { id: 507, gx: 4, gy: 2, type: 'normal', name: 'Void Link', desc: '+5% Crit Chance', cost: 15, val: { critChance: 5 }, req: [207, 702], icon: '🌌' },
            { id: 508, gx: 3, gy: 4, type: 'normal', name: 'Void Link', desc: '+5% Dmg', cost: 15, val: { damage: 5 }, req: [704, 305], icon: '🌌' },
            { id: 509, gx: -3, gy: 4, type: 'normal', name: 'Void Link', desc: '+5% Hero Dmg', cost: 15, val: { heroDamage: 5 }, req: [307, 804], icon: '🌌' },
            { id: 510, gx: -4, gy: 2, type: 'normal', name: 'Void Link', desc: '+5% Cinder', cost: 15, val: { cinderGain: 5 }, req: [802, 407], icon: '🌌' },
            { id: 511, gx: -4, gy: -2, type: 'normal', name: 'Void Link', desc: '+5% Dmg', cost: 15, val: { damage: 5 }, req: [406, 902], icon: '🌌' },
            { id: 512, gx: -3, gy: -4, type: 'normal', name: 'Void Link', desc: '+5% Click', cost: 15, val: { clickDamage: 5 }, req: [904, 106], icon: '🌌' },

            // --- BOARD 2 ---
            { id: 2000, board: 2, gx: 0, gy: 0, type: 'gate', name: 'Return Gate', desc: 'Travel back to Board 1', cost: 0, targetBoard: 1, val: {}, req: [], unlocked: true, icon: 'assets/ui/paragon_door.png?v=2' }
        ];

        // Assign default board (1) to nodes missing it
        this.nodes.forEach(n => {
            if (!n.board) n.board = 1;
        });

        this.unlockedNodes = [0, 2000]; // Unlock Start and Gate 2 by default logic (Gate 2 accessible if unlocked? Gate logic handles travel)
    }

    switchBoard(boardId) {
        this.currentBoardId = boardId;
        // Trigger UI update
        if (typeof renderParagonBoard === 'function') {
            renderParagonBoard();
        } else if (window.updateUI) {
            window.updateUI();
        }
    }

    addPoints(amount) {
        this.points += amount;
    }

    unlockNode(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return false;
        if (this.unlockedNodes.includes(nodeId)) return false;

        // Check cost
        if (this.points < node.cost) return false;

        // Check requirements (must have at least one neighbor unlocked)
        const hasReq = node.req.some(reqId => this.unlockedNodes.includes(reqId));
        if (!hasReq) return false;

        this.points -= node.cost;
        this.spentPoints += node.cost;
        this.unlockedNodes.push(nodeId);

        this.gameState.recalculateStats();
        return true;
    }

    getMultipliers() {
        let mults = {
            clickDamage: 0,
            gold: 0,
            damage: 0,
            critChance: 0,
            critDamage: 0,
            heroDamage: 0,
            bossDamage: 0,
            magicFind: 0,
            cinderGain: 0,
            doubleDamage: 0,
            attackSpeed: 0
        };

        this.unlockedNodes.forEach(id => {
            const node = this.nodes.find(n => n.id === id);
            // Safety check for legacy/removed nodes
            if (!node) return;

            if (node.val) {
                if (node.val.clickDamage) mults.clickDamage += node.val.clickDamage;
                if (node.val.gold) mults.gold += node.val.gold;
                if (node.val.damage) mults.damage += node.val.damage;
                if (node.val.critChance) mults.critChance += node.val.critChance;

                // New Stats
                if (node.val.critDamage) mults.critDamage += node.val.critDamage;
                if (node.val.heroDamage) mults.heroDamage += node.val.heroDamage;
                if (node.val.bossDamage) mults.bossDamage += node.val.bossDamage;
                if (node.val.magicFind) mults.magicFind += node.val.magicFind;
                if (node.val.cinderGain) mults.cinderGain += node.val.cinderGain;
                if (node.val.doubleDamage) mults.doubleDamage += node.val.doubleDamage;
                if (node.val.attackSpeed) mults.attackSpeed += node.val.attackSpeed;
            }
        });

        return mults;
    }
}
window.ParagonManager = ParagonManager;
