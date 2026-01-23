
// balance_sim.js
// Simulation to prove Balance Mismatch

// Formulas from Code
const getMonsterHp = (stage) => 10 * Math.pow(1.4, stage - 1);
const getGoldDrop = (stage) => 10 * Math.pow(1.5, stage - 1);

// Optimistic Player Scaling
// Assumptions:
// 1. Player spends ALL gold on the most efficient hero.
// 2. Player has reasonable "Stage-appropriate" multipliers from Ascension/Reincarnation.
//    (We will be generous and give them 1000% (10x) bonus every 50 stages).

function simulateStage(stage) {
    console.log(`\n--- SIMULATING STAGE ${stage} ---`);

    // 1. Enemy Stats
    const hp = getMonsterHp(stage);
    console.log(`Enemy HP: ${hp.toExponential(2)}`);

    // 2. Economy
    // Assume we farmed 1000 monsters at this stage
    const goldDrop = getGoldDrop(stage);
    const totalGold = goldDrop * 1000;
    console.log(`Total Gold (1k kills): ${totalGold.toExponential(2)}`);

    // 3. Hero Levels Purchaseable
    // Cost ~ Base * 1.15^Level
    // Max Level approx = log1.15(Gold)
    // Let's assume best hero (Druid, Base Cost 20M) or cheaper one for levels? 
    // Cheap heroes give low DPS. Expensive heroes give high DPS.
    // Let's use a "Gold to DPS" efficiency metric often found in idle games: Cost ~ 1.15^L. Dmg ~ Linear.
    // Actually, Dmg is linear * 4 every 25.

    // Let's compute 'Raw Power':
    // At level L, Cost is ~ 1.15^L.
    // Damage is ~ L * 4^(L/25).
    // Let's solve for L given Gold.

    // Simplified: BaseCost 10 (Mage). 
    // Gold = 10 * 1.15^L  => L = log1.15(Gold/10)
    const levelPossible = Math.log(totalGold / 10) / Math.log(1.15);
    console.log(`Est. Hero Levels Affordable: ${Math.floor(levelPossible)}`);

    // 4. Calculate DPS at this Level
    // Dmg = Level * 4^(Level/25) 
    const milestoneMult = Math.pow(4, Math.floor(levelPossible / 25));
    const baseDps = levelPossible * milestoneMult;

    // 5. Apply External Multipliers
    // Let's be SUPER GENEROUS.
    // Ascension: x10 per 50 stages? (x1 at 1, x10 at 50, x100 at 100...)
    const ascMult = Math.pow(10, stage / 50);

    // Reincarnation: x2 per 50 stages?
    const reincMult = Math.pow(2, stage / 50);

    // Items: 1.02^Stage
    const itemMult = Math.pow(1.02, stage);

    const totalDps = baseDps * ascMult * reincMult * itemMult;

    console.log(`Est. Player DPS (Optimized): ${totalDps.toExponential(2)}`);

    // 6. Time to Kill
    const ttk = hp / totalDps;
    console.log(`Time To Kill: ${ttk.toExponential(2)} seconds`);

    if (ttk > 300) console.log("RESULT: WALL (Impossible)");
    else if (ttk > 5) console.log("RESULT: Slow (Grindy)");
    else console.log("RESULT: OK");
}

simulateStage(10);
simulateStage(50);
simulateStage(100);
simulateStage(200);
simulateStage(500);

console.log("\n--- COST REDUCTION BUG CHECK ---");
// Reincarnation Wisdom: 45 * 0.02 = 0.90
// Necro Ascension: 0.50
// Code adds them: 0.90 + 0.50 = 1.40.
// Formula: cost * (1 - 1.40) = cost * -0.40.
const baseCost = 100;
const reduction = 0.90 + 0.50;
const finalCost = baseCost * (1 - reduction);
console.log(`Base Cost: ${baseCost}`);
console.log(`Reduction: ${reduction * 100}%`);
console.log(`Final Cost: ${finalCost}`);

if (finalCost < 0) console.log("CRITICAL: Negative Cost Bug confirmed.");
