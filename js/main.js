console.log('Sanctuary Idle Initializing...');

// Global Touch Tracker & Dismissal
window.lastTouchTime = 0;
window.addEventListener('touchstart', function (e) {
    window.lastTouchTime = Date.now();

    // Auto-dismiss tooltip if touching outside of an item slot
    // We check if the target is NOT inside a tooltip-triggering element
    if (!e.target.closest('[data-item-id]') && !e.target.closest('#tooltip')) {
        // Need to be careful not to hide if we just tapped a help icon or something else relevant
        // But generally, tapping "background" should close tooltip.
        const tooltip = document.getElementById('tooltip');
        if (tooltip && tooltip.style.display === 'block') {
            tooltip.style.display = 'none';
        }
    }
}, { passive: true });

// Offline Progress Popup (Defined early for load access)
window.showOfflinePopup = function (data) {
    // Remove existing if any
    const existing = document.getElementById('offline-popup');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = 'offline-popup';
    div.className = 'modal'; // Reuse modal class for overlay background (dimmed)
    div.style.display = 'block'; // Force show
    div.style.zIndex = '3000'; // Above everything else
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';

    // Localized Strings
    const titleText = window.t('ui.welcome_back'); // "Welcome Back"
    const timeText = window.t('ui.offline_time').replace('{time}', `<span style="color:#fff;">${data.time}</span>`);
    const resumeText = window.t('ui.resume_journey'); // "Resume Journey"

    // Resources
    const goldLabel = window.t('res.gold');
    const dustLabel = window.t('res.dust');
    const cindersLabel = window.t('res.cinders');

    div.innerHTML = `
        <div class="modal-content" style="
            max-width: 450px; 
            width: 90%;
            text-align: center; 
            border: 2px solid var(--accent-gold); 
            box-shadow: 0 0 30px rgba(0,0,0,0.9);
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('assets/ui/welcome_back_bg.png');
            background-size: cover;
            background-position: center;
            padding: 30px;
            border-radius: 8px;
            position: relative;
        ">
            <div style="
                font-size: 2rem; 
                color: var(--accent-gold); 
                margin-bottom: 20px; 
                font-family: 'Cinzel', serif;
                text-shadow: 0 0 10px rgba(0,0,0,0.8);
                letter-spacing: 1px;
            ">${titleText}</div>
            
            <div style="color: #ccc; margin-bottom: 25px; font-size: 1.1rem; text-shadow: 1px 1px 2px #000;">
                ${timeText}
            </div>
            
            <div style="
                display: flex; 
                flex-direction: column; 
                gap: 12px; 
                margin-bottom: 30px; 
                background: rgba(0,0,0,0.6); 
                padding: 20px; 
                border-radius: 6px;
                border: 1px solid #444;
            ">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                    <span style="color: #ddd;">${goldLabel}</span>
                    <span style="color: #ffd700; font-weight: bold;">+${data.gold}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                    <span style="color: #ddd;">${dustLabel}</span>
                    <span style="color: #d4a1d4; font-weight: bold;">+${data.dust}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #ddd;">${cindersLabel}</span>
                    <span style="color: #ff4400; font-weight: bold;">+${data.cinders}</span>
                </div>
            </div>

            <button class="sys-btn" style="
                width: auto; 
                min-width: 200px;
                padding: 10px 30px;
                border-color: var(--accent-gold); 
                color: var(--accent-gold);
                font-size: 1.1rem;
                background: rgba(0,0,0,0.8);
                transition: all 0.2s;
            " 
                onclick="document.getElementById('offline-popup').remove()"
                onmouseover="this.style.background='rgba(50,50,50,0.9)'"
                onmouseout="this.style.background='rgba(0,0,0,0.8)'"
            >
                ${resumeText}
            </button>
        </div>
    `;

    document.body.appendChild(div);
};

// Initialize GameState globally
try {
    window.gameState = new window.GameState();
} catch (err) {
    console.error("Critical Game Error:", err);
}

// Initialize Save System
window.saveManager = new window.SaveManager();
// Initialize Audio System
window.audioManager = new window.AudioManager();

// Initialize Localization
window.localizationManager = new window.LocalizationManager();


const savedData = window.saveManager.load();

if (savedData) {
    console.log("Loading saved game...", savedData);
    window.gameState.importState(savedData);

    // Fix Legacy Skill IDs immediately after load
    if (window.gameState.skillManager && typeof window.gameState.skillManager.migrateSkillIds === 'function') {
        window.gameState.skillManager.migrateSkillIds();
    }

    // Recalculate Stats to ensure DPS is up to date
    window.gameState.recalculateStats();
}

// Initial Localization Update
window.localizationManager.updateUI();

// Auto-Save every 30 seconds
setInterval(() => {
    window.saveManager.save(window.gameState);
}, 30000);

// Debug Overlay for Mobile Interaction
function createDebugOverlay() {
    if (document.getElementById('mobile-debug')) return;
    const div = document.createElement('div');
    div.id = 'mobile-debug';
    div.style.cssText = `
        position: fixed; bottom: 70px; left: 10px; right: 10px;
        background: rgba(0,0,0,0.8); color: lime; font-family: monospace;
        font-size: 10px; pointer-events: none; z-index: 9999;
        padding: 5px; border: 1px solid lime; max-height: 100px; overflow: hidden;
    `;
    document.body.appendChild(div);

    // Global Tap Inspector
    document.addEventListener('click', (e) => {
        let t = e.target;
        let info = t.tagName;
        if (t.className) info += '.' + t.className;
        if (t.id) info += '#' + t.id;
        debugLog(`TAP: ${info}`);
    });
}

function debugLog(msg) {
    const el = document.getElementById('mobile-debug');
    if (el) {
        el.innerHTML = `<div>${new Date().toLocaleTimeString().split(' ')[0]} ${msg}</div>` + el.innerHTML;
    }
    console.log("[MobileDebug]", msg);
}



// Global Game State
// window.gameState is already initialized above
window.buyAmount = 1;
window.lastSaveTime = Date.now();
window.reforgeMode = false;
window.upgradeMode = false;
window.salvageMode = false;

// Config
const SAVE_KEY = 'sanctuaryIdleSave_v1';
let currentRightTab = 'inventory';

// Core Game Loop
const FPS = 30;
let lastTime = Date.now();
let currentLeftTab = 'units';

let dpsAccumulator = 0;
let lastDpsTick = 0;

function gameLoop() {
    const now = Date.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // FIX: Catch-up Bug / "Machine Gun" Effect
    // If the tab was inactive (dt > 1.0s), treat it as pseudo-offline progress
    // instead of trying to simulate every frame which allows bursting bosses.
    if (dt > 1.0) {
        // Silent if short (< 60s), logged if long
        if (window.gameState && typeof window.gameState.calculateOfflineProgress === 'function') {
            window.gameState.calculateOfflineProgress(dt, dt < 60);
        }
        // Skip this frame's combat logic to prevent "speed hacking" bosses
        requestAnimationFrame(gameLoop);
        return;
    }

    // Attack Speed Logic
    const attackSpeed = window.gameState.baseAttackSpeed * window.gameState.multipliers.attackSpeed;
    const attackInterval = 1.0 / attackSpeed; // Seconds per attack

    // Increment Attack Timer
    if (!window.gameState.isPaused) {
        window.gameState.attackTimer += dt;

        // Attempt to start music on first user interaction if not playing
        if (window.audioManager && window.audioManager.bgm.paused && !window.audioManager.bgm.ended && window.audioManager.volume > 0 && !window.audioManager.isMuted) {
            // We can try to play, but browser might block.
            // Best to rely on a click listener, but we can check here cleanly.
        }
    }

    // Core GameState Update (Boss Timer, etc.)
    window.gameState.update(dt);

    // Check if ready to attack
    if (window.gameState.attackTimer >= attackInterval) {
        // Reset Timer (subtract interval to keep rhythm)
        window.gameState.attackTimer -= attackInterval;

        // Use GameState logic for Auto Attack (Handles regular damage + Thunder Echo)
        window.gameState.triggerAutoAttack();
    }

    // Update Clones
    if (window.gameState.activeClones && window.gameState.activeClones.length > 0) {
        window.gameState.updateClones(dt);
    }

    updateUI();
    requestAnimationFrame(gameLoop);
}

// --- Helper Functions ---
function formatNumber(num) {
    if (num < 1000) {
        return Math.floor(num).toLocaleString();
    }
    // format: 1.23E+15 -> 1.23E15
    return num.toExponential(2).replace('e+', 'E');
}

function renderLogs() {
    const logContainer = document.getElementById('game-logs');
    if (!logContainer) return;
    const firstLog = window.gameState.log[0];
    if (logContainer.dataset.lastLog !== firstLog) {
        logContainer.innerHTML = window.gameState.log.join('<br>');
        logContainer.dataset.lastLog = firstLog;
    }
}

function handleMonsterClick(e) {
    const dmg = (typeof window.gameState.calculateClickDamage === 'function')
        ? window.gameState.calculateClickDamage()
        : window.gameState.totalClickDamage;
    const result = window.gameState.damageMonster(dmg, true, 'manual_click');

    // Stat Tracking
    if (window.gameState.stats) {
        window.gameState.stats.totalClicks = (window.gameState.stats.totalClicks || 0) + 1;
    }

    const x = e.clientX;
    const y = e.clientY - 50;

    const displayDmg = result ? result.damage : dmg;
    const isCrit = result && result.isCrit;
    const tier = result && result.critTier ? result.critTier : (isCrit ? 1 : 0);
    const isDouble = result && result.isDouble;

    showFloatingText(displayDmg, x, y, isCrit, 'normal', tier, isDouble);
}

function showFloatingText(amount, x, y, isCrit, type = 'normal', tier = 1, isDouble = false) {
    // ... (unchanged setup) ...
    const el = document.createElement('div');
    const val = Math.floor(amount);
    if (val < 1 && type === 'hero') return;

    // Mobile check
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    el.textContent = formatNumber(val);
    el.className = 'floating-text';

    if (isMobile) {
        el.style.fontSize = '0.6rem'; // Reduced (~20% smaller)
    }

    if (type === 'hero') {
        el.classList.add('minion'); // Reuse minion class style for now
        // ... (unchanged positioning) ...
        const mobImg = document.getElementById('monster-image');
        if (mobImg) {
            const rect = mobImg.getBoundingClientRect();
            x = rect.right + 20 + window.scrollX;
            y = rect.top + (rect.height / 2) + ((Math.random() - 0.5) * 50) + window.scrollY;
        }
    }

    // (Shadow Clone Logic moved to end of function to prevent overwrites)

    // Double Damage Visual (Glow Frame)
    if (isDouble) {
        el.style.border = '2px solid #ffd700'; // Gold Border
        el.style.borderRadius = '4px';
        el.style.padding = '0 4px';
        el.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'; // Slight darken BG to pop
        el.style.boxShadow = '0 0 10px #ffd700, inset 0 0 5px #ffd700'; // Outer & Inner Glow
        // Append suffix or icon?
    }

    // Crit Logic (Text Suffix)
    if (isCrit) {
        let suffix = '';
        let scale = 1.5;

        // Base Crit Style
        el.classList.add('crit');

        // Mobile Scaling Hook
        if (isMobile) {
            // Base scale for mobile crit
            el.style.fontSize = '1.0rem'; // Reduced (~20% smaller)
        } else {
            el.style.fontSize = '2.5rem';
        }
        el.style.fontWeight = 'bold';

        // Color & Scale Progression by Tier
        if (tier <= 1) {
            suffix = ' 🎯';
        } else if (tier === 2) {
            el.style.color = '#ff8800'; // Orange
            el.style.textShadow = '0 0 10px #cc6600';
            scale = 2.0;
            suffix = ' 🎯2';
        } else if (tier === 3) {
            el.style.color = '#ff0000'; // Red
            el.style.textShadow = '0 0 10px #cc0000';
            scale = 2.5;
            suffix = ' 🎯3';
        } else if (tier >= 4) {
            el.style.color = '#aa00ff'; // Purple
            el.style.textShadow = '0 0 10px #8800cc';
            scale = 3.0;
            // Compact infinite scaling: "🎯[Tier]" (No 'x')
            suffix = ` 🎯${tier}`;
        }

        // Mobile Scale Adjustment for higher tiers
        if (isMobile) {
            // Reduce the massive scaling for mobile to keep it readable but not screen-blocking
            // e.g. instead of 3.0, maybe cap at 1.5x relative to base
            // But logic above sets fontSize directly. 
            // data-scale is used by CSS animation/transform logic usually?
            // If the CSS uses transform: scale(var(--scale)), we need to be careful.
            // Let's reduce the scale factor slightly for mobile or rely on the smaller base font size.
            // The earlier logic `el.style.fontSize` handles the base size. 
            // `scale` might be used for 'pop' animation.
        }

        // SAFELY Append Suffix
        el.innerHTML += `<span style="font-size:0.8em">${suffix}</span>`;
        el.dataset.scale = scale;
    }

    // Shadow Clone Logic (Inject Icon PREPEND)
    // We do this LAST so we don't get overwritten by textContent assignments above
    if (type === 'clone') {
        el.style.color = '#bf40bf'; // Purple
        el.style.textShadow = '0 0 5px #4b0082';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '4px';

        // Prepend the icon to existing content (which might have crit suffixes now)
        const currentContent = el.innerHTML;
        el.innerHTML = `<div style="
            width:30px; 
            height:30px; 
            background-image: url('assets/heroes/shadow_clone.png'); 
            background-size: contain; 
            background-repeat: no-repeat; 
            background-position: center; 
            display: inline-block;
            flex-shrink: 0;
            filter: drop-shadow(0 0 2px #bf40bf);
        "></div> <span style="font-size:0.75rem;">${currentContent}</span>`;
    }

    if (type === 'skeleton') {
        el.style.color = '#cccccc'; // Bone/White
        el.style.textShadow = '0 0 5px #000';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '4px';

        const currentContent = el.innerHTML;
        el.innerHTML = `<div style="
            width:30px; 
            height:30px; 
            background-image: url('assets/heroes/skeleton_warrior.png'); 
            background-size: contain; 
            background-repeat: no-repeat; 
            background-position: center; 
            display: inline-block;
            flex-shrink: 0;
            filter: drop-shadow(0 0 2px #000);
        "></div> <span style="font-size:0.75rem;">${currentContent}</span>`;
    }

    if (type === 'golem') {
        el.style.color = '#ff0000'; // Red
        el.style.textShadow = '0 0 5px #500';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '4px';

        const currentContent = el.innerHTML;
        el.innerHTML = `<div style="
            width:30px; 
            height:30px; 
            background-image: url('assets/heroes/blood_golem.png'); 
            background-size: contain; 
            background-repeat: no-repeat; 
            background-position: center; 
            display: inline-block;
            flex-shrink: 0;
            filter: drop-shadow(0 0 2px #500);
        "></div> <span style="font-size:0.75rem;">${currentContent}</span>`;
    }

    if (type === 'wolf') {
        el.style.color = '#00ff00'; // Green
        el.style.textShadow = '0 0 5px #050';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '4px';

        const currentContent = el.innerHTML;
        el.innerHTML = `<div style="
            width:30px; 
            height:30px; 
            background-image: url('assets/heroes/spirit_wolf.png'); 
            background-size: contain; 
            background-repeat: no-repeat; 
            background-position: center; 
            display: inline-block;
            flex-shrink: 0;
            filter: drop-shadow(0 0 2px #00ff00);
        "></div> <span style="font-size:0.75rem;">${currentContent}</span>`;
    }

    if (type === 'valkyrie') {
        el.style.color = '#ffd700'; // Gold
        el.style.textShadow = '0 0 5px #ffaa00';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '4px';

        const currentContent = el.innerHTML;
        el.innerHTML = `<div style="
            width:30px; 
            height:30px; 
            background-image: url('assets/skills/amazon/valkyrie_summon.png'); 
            background-size: contain; 
            background-repeat: no-repeat; 
            background-position: center; 
            display: inline-block;
            flex-shrink: 0;
            filter: drop-shadow(0 0 2px #ffd700);
        "></div> <span style="font-size:0.75rem;">${currentContent}</span>`;
    }

    if (type === 'bleed') {
        el.style.color = '#cc0000'; // Dark Red
        el.style.textShadow = '0 0 5px #500';
        el.style.fontWeight = 'bold';
        const currentContent = el.innerHTML;
        el.innerHTML = `🩸 ${currentContent}`;
    }

    const offsetX = (Math.random() - 0.5) * 40;
    el.style.left = `${x + offsetX}px`;
    el.style.top = `${y}px`;

    document.body.appendChild(el);

    requestAnimationFrame(() => {
        el.style.transform = `translateY(-100px) scale(${el.dataset.scale || (isCrit ? 1.5 : 1)})`;
        el.style.opacity = '0';
    });

    setTimeout(() => {
        el.remove();
    }, 1000);
}

// Dedicated function for UI feedback (not damage numbers)
window.showUIText = function (text, x, y, color = '#fff') {
    const el = document.createElement('div');
    el.textContent = text;
    el.className = 'floating-text'; // Reuse base class for animation
    el.style.color = color;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = '1rem';
    el.style.textShadow = '0 0 2px #000';
    el.style.zIndex = '2000';
    el.style.pointerEvents = 'none';

    document.body.appendChild(el);

    requestAnimationFrame(() => {
        el.style.transform = `translateY(-30px)`;
        el.style.opacity = '0';
        el.style.transition = 'all 1s ease-out';
    });

    setTimeout(() => {
        el.remove();
    }, 1000);
};





function updateUI() {
    const gs = window.gameState;

    // Reincarnation Button Visibility (Moved to top for visibility priority)
    const reincBtn = document.getElementById('btn-reincarnate');
    const rm = gs.reincarnationManager;

    // Debug Log (Throttled?)


    if (reincBtn && rm) {
        // Force display block if eligible
        if (rm.canReincarnate() || rm.divinity > 0) {
            reincBtn.style.display = 'block';
            reincBtn.style.visibility = 'visible'; // Ensure visibility
        } else {
            reincBtn.style.display = 'none';
        }
    }

    // Resources
    if (document.getElementById('cinders-display')) document.getElementById('cinders-display').textContent = formatNumber(gs.cinders);
    if (document.getElementById('gold-display')) document.getElementById('gold-display').textContent = formatNumber(gs.gold);
    if (document.getElementById('materials-display')) document.getElementById('materials-display').textContent = formatNumber(gs.materials);
    if (document.getElementById('cinders-val')) document.getElementById('cinders-val').textContent = formatNumber(gs.cinders);
    if (document.getElementById('gold-val')) document.getElementById('gold-val').textContent = formatNumber(gs.gold);
    if (document.getElementById('dust-val')) document.getElementById('dust-val').textContent = formatNumber(gs.materials);
    if (document.getElementById('essence-val')) document.getElementById('essence-val').textContent = formatNumber(gs.bossEssence);
    if (document.getElementById('modal-essence-val')) document.getElementById('modal-essence-val').textContent = formatNumber(gs.bossEssence);

    // Stats (Center)
    if (document.getElementById('current-dps')) document.getElementById('current-dps').textContent = formatNumber(gs.averageDps || gs.totalDps);
    if (document.getElementById('click-damage')) document.getElementById('click-damage').textContent = formatNumber(gs.totalClickDamage);

    // Minion Indicators
    const cloneInd = document.getElementById('clone-indicator');
    const skelInd = document.getElementById('skeleton-indicator');
    const golemInd = document.getElementById('golem-indicator');
    const wolfInd = document.getElementById('wolf-indicator');

    if (gs.activeClones) {
        const hasClone = gs.activeClones.some(c => !c.type || c.type === 'clone');
        // Ensure we check for properties safely
        const hasSkeleton = gs.activeClones.some(c => c.type === 'skeleton');
        const hasGolem = gs.activeClones.some(c => c.type === 'golem');
        const hasWolf = gs.activeClones.some(c => c.type === 'wolf');

        if (cloneInd) cloneInd.style.display = hasClone ? 'block' : 'none';
        if (skelInd) skelInd.style.display = hasSkeleton ? 'block' : 'none';
        if (golemInd) golemInd.style.display = hasGolem ? 'block' : 'none';
        if (wolfInd) wolfInd.style.display = hasWolf ? 'block' : 'none';
    } else {
        if (wolfInd) wolfInd.style.display = 'none';
    }

    // Valkyrie Indicator
    const valkInd = document.getElementById('valkyrie-indicator');
    if (gs.activeClones) {
        const hasValk = gs.activeClones.some(c => c.type === 'valkyrie');
        if (valkInd) valkInd.style.display = hasValk ? 'block' : 'none';
    } else {
        if (valkInd) valkInd.style.display = 'none';
    }

    // Update Main Affinity Display
    const mainAffinityEl = document.getElementById('affinity-display');
    if (mainAffinityEl && gs.inventoryManager.currentAffinityBonuses) {
        // Calculate counts active
        const counts = {};
        Object.values(gs.equipment).forEach(i => { if (i && i.classAffinity) counts[i.classAffinity] = (counts[i.classAffinity] || 0) + 1; });

        // 3-Piece Bonus Descriptions
        // 3-Piece Bonus Descriptions (Localized)
        const utilDesc = {
            mage: `+20% ${window.t('stat.cinderGain')}`,     // Cinder Gain
            rogue: `+5% ${window.t('stat.critChance')}`,     // Crit Chance
            paladin: `+30% ${window.t('stat.bossDamage')}`,  // Boss Damage
            amazon: `+20% ${window.t('stat.magicFind')}`,    // Magic Find
            necro: `+30% ${window.t('stat.heroDamage')}`,    // Hero Damage
            barbarian: `+20% ${window.t('stat.critDamage')}`,// Crit Damage
            druid: '+10% Unique Mult' // Unique Mult is rare, maybe no translation yet?
        };

        let html = '';
        Object.entries(counts).forEach(([cls, count]) => {
            if (count >= 2) { // Show only if at least 2 items (first bonus) are active
                const c2 = count >= 2 ? '#00ff00' : '#666';
                const c3 = count >= 3 ? '#00ff00' : '#666';
                const c4 = count >= 4 ? '#00ff00' : '#666';

                // Localized Strings
                const localizedClass = window.t(`unit.name.${cls}`); // e.g. "Magier"
                const lblGlobalDps = window.t('stat.globalDps'); // "Global DPS Mult" -> "Globaler SPS Mult"
                // const lblUtil = ... (This utilDesc map is dynamic and hardcoded in main.js?)
                // utilDesc usually has "+20% Crit Damage" which is english. 
                // We should probably try to localize it if possible, but let's fix the Header first.

                html += `<div style="
                    background: rgba(0,0,0,0.8); 
                    border: 1px solid #444; 
                    padding: 5px 8px; 
                    border-radius: 4px;
                    font-size: 0.75rem;
                    text-align: left;
                    min-width: 120px;
                ">
                    <div style="font-weight:bold; color:#fff; border-bottom:1px solid #333; margin-bottom:2px;">
                        ${localizedClass.toUpperCase()} (${count})
                    </div>
                    <div style="color:${c2}">2: +50% Global Dmg</div>
                    <div style="color:${c3}">3: ${utilDesc[cls]}</div>
                    <div style="color:${c4}">4: +100% Global Dmg</div>
                </div>`;
            }
        });
        mainAffinityEl.innerHTML = html;
    }

    // Also update Inventory Tab Display
    const invDps = document.getElementById('inv-dps');
    const invClick = document.getElementById('inv-click');
    if (invDps) invDps.textContent = formatNumber(gs.averageDps || gs.totalDps);
    if (invClick) {
        // Show Average Click Damage to account for Crits/Multipliers
        // This aligns better with the actual damage numbers users see floating
        invClick.textContent = formatNumber(gs.averageClickDamage);
        if (gs.averageClickDamage > gs.totalClickDamage * 2) {
            invClick.style.color = '#ffaa00'; // Orange if heavily Crit-dependant
        } else {
            invClick.style.color = '#fff';
        }
    }

    // Stats (Tab) - Only update if visible for performance? or always
    if (currentRightTab === 'stats') {
        document.getElementById('stat-dps-mult').textContent = Math.floor(gs.multipliers.damage * 100) + '%';
        document.getElementById('stat-crit-chance').textContent = gs.multipliers.critChance.toFixed(1) + '%';
        if (document.getElementById('stat-crit-damage')) document.getElementById('stat-crit-damage').textContent = Math.floor(gs.multipliers.critDamage) + '%';
        if (document.getElementById('stat-atk-speed')) document.getElementById('stat-atk-speed').textContent = Math.floor(gs.multipliers.attackSpeed * 100) + '%';
        document.getElementById('stat-gold-find').textContent = Math.floor(gs.multipliers.gold * 100) + '%';
        document.getElementById('stat-click-dmg').textContent = formatNumber(gs.totalClickDamage);
        if (document.getElementById('stat-click-dmg-pct')) document.getElementById('stat-click-dmg-pct').textContent = Math.floor(gs.multipliers.clickDamagePct || 0) + '%';

        // New Stats
        // New Stats
        if (document.getElementById('stat-hero-dmg')) document.getElementById('stat-hero-dmg').textContent = Math.floor((gs.multipliers.heroDamage - 1) * 100) + '%';
        if (document.getElementById('stat-boss-dmg')) document.getElementById('stat-boss-dmg').textContent = Math.floor((gs.multipliers.bossDamage - 1) * 100) + '%';

        // Magic Find Display
        // Tooltip logic handled centrally, just update text here
        if (document.getElementById('stat-magic-find')) {
            const rawMf = gs.multipliers.magicFind;
            let effMf = rawMf;
            if (effMf > 100) {
                effMf = 100 + Math.pow(effMf - 100, 0.6);
                // We keep the detailed text because it's useful to see Eff at a glance
                document.getElementById('stat-magic-find').innerHTML = `${Math.floor(rawMf)}% <span style="font-size:0.8em; color:#aaa;">(Eff: ${Math.floor(effMf)}%)</span>`;
            } else {
                document.getElementById('stat-magic-find').textContent = Math.floor(rawMf) + '%';
            }
            // Clear legacy attributes if they exist
            document.getElementById('stat-magic-find').removeAttribute('title');
            document.getElementById('stat-magic-find').style.cursor = '';
        }

        if (document.getElementById('stat-cinder-gain')) document.getElementById('stat-cinder-gain').textContent = Math.floor(gs.multipliers.cinders * 100) + '%';

        const ddEl = document.getElementById('stat-double-dmg');
        if (ddEl) {
            const rawDD = (gs.multipliers.rawDoubleDamage !== undefined) ? gs.multipliers.rawDoubleDamage : gs.multipliers.doubleDamageChance;
            const effDD = gs.multipliers.doubleDamageChance;

            if (Math.floor(rawDD) > Math.floor(effDD)) {
                // Show both like Magic Find
                ddEl.innerHTML = `<span style="color:#cfb53b">${Math.floor(rawDD)}%</span> <span style="font-size:0.8em; color:#aaa;">(Eff: ${Math.floor(effDD)}%)</span>`;
            } else {
                ddEl.textContent = Math.floor(effDD) + '%';
            }
            // Clear legacy
            ddEl.removeAttribute('title');
            ddEl.style.cursor = '';
        }

        // --- Attack Speed Update ---
        const asEl = document.getElementById('stat-atk-speed');
        if (asEl) {
            asEl.textContent = Math.floor(gs.multipliers.attackSpeed * 100) + '%';
        }

        // Update Drop Rates
        const dropList = document.getElementById('drop-rates-list');
        if (dropList) {
            // Get Chances using EFFECTIVE Magic Find for Display
            let effMf = gs.multipliers.magicFind;
            if (effMf > 100) {
                effMf = 100 + Math.pow(effMf - 100, 0.6);
            }
            const chances = window.Item.getDropChances(gs.stage, effMf, gs.multipliers.rareFind);

            let html = '';
            chances.forEach(c => {
                // Skip Normal if 0 chance (often implies 100% something else)
                if (c.val <= 0 && c.id === 'normal') return;

                // Format percentage
                const pct = c.val * 100;
                let pctStr = pct.toFixed(2) + '%';

                // Emphasize non-zero
                if (c.val > 0) {
                    html += `<div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                        <span style="color:${c.color}">${c.name}</span>
                        <span>${pctStr}</span>
                    </div>`;
                }
            });
            dropList.innerHTML = html;
        }
    }

    // Stage Info
    const monster = gs.currentMonster;
    document.getElementById('stage-number').textContent = gs.stage;
    document.getElementById('stage-text').textContent =
        monster.isBoss ? "BOSS FIGHT" : `${gs.monstersKilledInStage}/10`;

    // Update HP Bar
    const hpPercent = (gs.currentMonster.currentHp / gs.currentMonster.maxHp) * 100;
    document.getElementById('monster-hp-bar').style.width = `${hpPercent}%`;
    document.getElementById('monster-hp-text').textContent =
        `${formatNumber(Math.ceil(gs.currentMonster.currentHp))} / ${formatNumber(gs.currentMonster.maxHp)} HP`;

    // Update Percentage Text
    const hpPctEl = document.getElementById('monster-hp-percent');
    if (hpPctEl) {
        hpPctEl.textContent = `${Math.floor(hpPercent)}%`;
        hpPctEl.style.display = 'block';
    }

    // Update Boss Timer
    const timerWrapper = document.getElementById('boss-timer-wrapper');
    const timerFill = document.getElementById('boss-timer-fill');
    const timerText = document.getElementById('boss-timer-text');

    if (gs.bossTimer !== null) {
        if (timerWrapper) {
            timerWrapper.style.display = 'block';
        }

        const timerPercent = (gs.bossTimer / 60) * 100;

        if (timerFill) {
            timerFill.style.width = `${Math.max(0, timerPercent)}%`;
            if (gs.bossTimerFrozen && gs.bossTimerFrozen > Date.now()) {
                timerFill.style.backgroundColor = '#00ffff'; // Cyan for Frozen
                timerFill.style.boxShadow = '0 0 10px #00ffff';
            } else {
                timerFill.style.backgroundColor = '#ff4400'; // Default
                timerFill.style.boxShadow = 'none';
            }
        }

        if (timerText) {
            timerText.textContent = `${gs.bossTimer.toFixed(1)}s`;
        }

    } else {
        if (timerWrapper) timerWrapper.style.display = 'none';
    }

    // Monster UI
    if (monster) {
        const nameEl = document.getElementById('monster-name');
        if (nameEl.textContent !== monster.name) nameEl.textContent = monster.name;

        document.getElementById('monster-hp-text').textContent =
            `${formatNumber(Math.ceil(monster.currentHp))}/${formatNumber(monster.maxHp)}`;
        document.getElementById('monster-hp-bar').style.width = `${monster.hpPercent}%`;

        const imgEl = document.getElementById('monster-image');
        const frameEl = document.getElementById('monster-frame');

        if (imgEl) {
            if (imgEl.getAttribute('src') !== monster.image) imgEl.src = monster.image || '';
        }

        // Alpha Visuals (Applied to Frame)
        if (frameEl) {
            if (monster.isAlpha) {
                // Gold Glow on the Frame
                frameEl.style.filter = 'drop-shadow(0 0 25px #ffd700)';
            } else {
                frameEl.style.filter = 'none';
            }
        } else if (imgEl && monster.isAlpha) {
            // Fallback if no frame
            imgEl.style.boxShadow = '0 0 15px #ffd700';
        } else if (imgEl) {
            imgEl.style.boxShadow = 'none';
            imgEl.style.border = 'none';
        }
    }

    // Panels
    if (currentLeftTab === 'units') renderShop();
    else renderUpgrades();

    if (currentRightTab === 'inventory') renderInventory();

    if (currentRightTab === 'inventory') renderInventory();

    renderLogs();

    // Skill Cooldowns
    if (window.gameState.skillManager) {
        window.gameState.skillManager.updateCooldownVis();
    }
}

window.buyAmount = 1;

window.togglePause = function () {
    window.gameState.isPaused = !window.gameState.isPaused;
    const btn = document.getElementById('btn-pause');
    if (btn) {
        if (window.gameState.isPaused) {
            btn.setAttribute('data-i18n', 'btn.resume_auto');
            btn.textContent = window.t('btn.resume_auto');
            btn.style.borderColor = "#00ff00"; // Green for resume
            btn.style.color = "#00ff00";
        } else {
            btn.setAttribute('data-i18n', 'btn.pause_auto');
            btn.textContent = window.t('btn.pause_auto');
            btn.style.borderColor = "#777"; // Default
            btn.style.color = "#fff";
        }
    }
    // Optional: Log it
    // console.log(`Auto-Attack Paused: ${window.gameState.isPaused}`);
};


function renderShop() {
    const list = document.getElementById('unit-list');
    const units = window.gameState.unitManager.getAllUnits();

    // Create Shop Controls if needed (persistent UI)
    // We attach it to the list container. 
    // Ideally we'd move it out, but user wants it here. Use a specific ID.
    let controls = document.getElementById('shop-controls');

    // Check if we need to rebuild the list
    // (+1 for controls div)
    const expectedCount = units.length + 1;
    if (list.childElementCount !== expectedCount || !controls) {
        list.innerHTML = '';

        // 1. Controls
        if (!controls) { // Logic to create controls
            controls = document.createElement('div');
            controls.id = 'shop-controls';
            controls.style.cssText = "display:flex; gap:5px; margin-bottom:10px; justify-content:center;";

            ['1', '10', 'MAX'].forEach(amt => {
                const btn = document.createElement('button');
                btn.textContent = `x${amt}`;
                btn.className = 'sys-btn';
                btn.style.flex = '1';

                btn.onclick = (e) => {
                    e.stopPropagation();
                    window.buyAmount = (amt === 'MAX') ? 'max' : parseInt(amt);
                    renderShop(); // Trigger update immediately
                };
                controls.appendChild(btn);
            });
        }
        list.appendChild(controls);

        // 2. Unit Cards
        units.forEach(u => {
            const card = document.createElement('div');
            card.className = 'unit-card';
            card.dataset.id = u.id;
            // Click handler
            card.onclick = () => window.gameState.buyUnit(u.id, window.buyAmount);

            let imgHtml = '';
            if (u.image) {
                imgHtml = `<div class="unit-icon-container"><img src="${u.image}" class="unit-icon-img"></div>`;
            }

            // Localized Strings
            const uName = window.t(`unit.name.${u.id}`);
            const uDesc = window.t(`unit.desc.${u.id}`);
            const btnAscend = window.t('btn.ascend');

            card.innerHTML = `
                <div class="unit-left-col">
                    ${imgHtml}
                    <button class="ascend-btn" style="margin-top:5px; width:100%;" onclick="event.stopPropagation(); window.openAscensionModal('${u.id}')">${btnAscend}</button>
                </div>
                <div class="unit-info-col">
                    <div class="unit-header">
                        <div style="min-width:0;">
                            <div class="unit-name">${uName}</div>
                            <div class="unit-cost">${formatNumber(u.currentCost)} Cinders</div>
                        </div>
                        <div class="unit-dps-row">
                             <div class="unit-base-dps"></div>
                        </div>
                    </div>

                    <div class="unit-desc">${uDesc}</div>
                    <div class="unit-dps-row">
                        <div class="unit-total-dps"></div>
                    </div>

                </div>
            `;
            list.appendChild(card);
        });
    }

    // --- UPDATE UI (Every Frame) ---
    if (!controls) controls = document.getElementById('shop-controls'); // Safety

    // Update Controls Visuals
    Array.from(controls.children).forEach(btn => {
        const amt = btn.textContent.replace('x', '');
        const isMax = amt === 'MAX' && window.buyAmount === 'max';
        const isNum = parseInt(amt) === window.buyAmount;
        if (isMax || isNum) {
            btn.style.borderColor = '#00ffff';
            btn.style.color = '#00ffff';
        } else {
            btn.style.borderColor = '#444';
            btn.style.color = '#aaa';
        }
    });

    // Update Unit Cards
    Array.from(list.children).forEach((card, idx) => {
        if (card.id === 'shop-controls') return;

        // Index correction: card 1 is unit 0
        const u = units[idx - 1];
        if (!u) return;

        // Calculate Bulk Cost & Amount
        let buyCount = 1;
        let isAffordable = false;

        if (window.buyAmount === 'max') {
            const max = window.gameState.unitManager.getMaxBuyable(u.id);
            buyCount = max > 0 ? max : 1;
            isAffordable = max > 0;
        } else {
            buyCount = window.buyAmount;
        }

        const bulk = window.gameState.unitManager.getBulkCost(u.id, buyCount);
        const displayCost = bulk.cost;

        if (window.buyAmount !== 'max') {
            isAffordable = window.gameState.cinders >= displayCost;
        }

        // DPS Calculations
        const globalMinionMult = window.gameState.multipliers.heroDamage || 1;
        const ascBonuses = window.gameState.ascensionManager ? window.gameState.ascensionManager.getMultipliers() : {};
        const heroBonus = (ascBonuses.heroDamage && ascBonuses.heroDamage[u.id]) ? ascBonuses.heroDamage[u.id] : 0;

        let affinityBonus = 0;
        if (window.gameState.inventoryManager && window.gameState.inventoryManager.currentAffinityBonuses && window.gameState.inventoryManager.currentAffinityBonuses.heroDamage) {
            affinityBonus = window.gameState.inventoryManager.currentAffinityBonuses.heroDamage[u.id] || 0;
        }

        const heroMult = (1 + heroBonus) * (1 + affinityBonus);

        let milestoneMult = 1;
        if (window.gameState.unitManager && window.gameState.unitManager.getMilestoneMultiplier) {
            milestoneMult = window.gameState.unitManager.getMilestoneMultiplier(u.id);
        }

        const effectiveDpsPerUnit = u.baseDps * globalMinionMult * heroMult * milestoneMult;
        const totalUnitDps = effectiveDpsPerUnit * u.count;
        const dpsGain = effectiveDpsPerUnit * buyCount;

        // Text Updates
        const localizedName = window.t(`unit.name.${u.id}`);
        const lblLvl = window.t('lbl.level');
        const lblTotal = window.t('lbl.total');

        card.querySelector('.unit-name').textContent = `${localizedName} (${lblLvl} ${u.count})`;
        card.querySelector('.unit-cost').textContent = `🔥 ${formatNumber(displayCost)}`;
        // Display DPS gain for the specific buy amount
        card.querySelector('.unit-base-dps').textContent = `+${formatNumber(dpsGain)} DPS`;

        if (milestoneMult > 1) {
            card.querySelector('.unit-total-dps').innerHTML = `(${lblTotal}: ${formatNumber(totalUnitDps)}) <span style="color:#cfb53b; font-size:0.8em; margin-left:5px;">x${formatNumber(milestoneMult)}</span>`;
        } else {
            card.querySelector('.unit-total-dps').textContent = `(${lblTotal}: ${formatNumber(totalUnitDps)})`;
        }

        // Affordability Styling
        if (isAffordable) {
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
            card.style.borderColor = '#444';
        } else {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
            card.style.borderColor = '#333';
        }
    });
}

function renderUpgrades() {
    const list = document.getElementById('upgrade-list');
    const upgrades = window.gameState.upgradeManager.getAllUpgrades();

    // 1. Controls (Similar to Shop)
    let controls = document.getElementById('upgrade-controls');
    const expectedCount = upgrades.length + 1;

    if (list.childElementCount !== expectedCount || !controls) {
        list.innerHTML = '';

        // Create Controls
        controls = document.createElement('div');
        controls.id = 'upgrade-controls';
        controls.style.cssText = "display:flex; gap:5px; margin-bottom:10px; justify-content:center;";

        ['1', '10', 'MAX'].forEach(amt => {
            const btn = document.createElement('button');
            btn.textContent = `x${amt}`;
            btn.className = 'sys-btn';
            btn.style.flex = '1';

            btn.onclick = (e) => {
                e.stopPropagation();
                window.buyAmount = (amt === 'MAX') ? 'max' : parseInt(amt);
                renderUpgrades(); // Trigger update
                if (window.renderShop) window.renderShop(); // Keep synced
            };
            controls.appendChild(btn);
        });
        list.appendChild(controls);

        // Create Cards
        upgrades.forEach(u => {
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.dataset.id = u.id;
            // Updated OnClick for Bulk
            card.onclick = () => window.gameState.upgradeManager.buyUpgrade(u.id, window.buyAmount);

            let iconHtml = `<div class="upgrade-icon">${u.icon}</div>`;
            if (u.image) {
                const scale = u.imgScale || 1.0;
                iconHtml = `<div class="upgrade-icon" style="overflow:hidden;"><img src="${u.image}" style="width:100%; height:100%; object-fit:contain; border-radius:4px; transform: scale(${scale});"></div>`;
            }

            card.innerHTML = `
                ${iconHtml}
                <div class="upgrade-info">
                    <div class="upgrade-header">
                        <span class="u-name">${window.t(`upgrade.name.${u.id}`)}</span>
                        <span class="u-lvl">Lvl ${u.level}</span>
                    </div>
                    <div class="upgrade-desc">${u.desc}</div>
                    <div class="upgrade-total" style="font-size:0.8rem; color:#cfb53b; margin-bottom:2px;"></div>
                    <div class="upgrade-cost"></div> 
                </div>
            `;
            list.appendChild(card);
        });
    }

    // Safety check for controls
    if (!controls) controls = document.getElementById('upgrade-controls');

    // Update Controls Visuals
    if (controls) {
        Array.from(controls.children).forEach(btn => {
            const amt = btn.textContent.replace('x', '');
            const isMax = amt === 'MAX' && window.buyAmount === 'max';
            const isNum = parseInt(amt) === window.buyAmount;
            if (isMax || isNum) {
                btn.style.borderColor = '#00ffff';
                btn.style.color = '#00ffff';
            } else {
                btn.style.borderColor = '#444';
                btn.style.color = '#aaa';
            }
        });
    }

    // Update Cards
    Array.from(list.children).forEach((card, idx) => {
        if (card.id === 'upgrade-controls') return;
        const u = upgrades[idx - 1]; // Offset by 1 for controls
        if (!u) return;

        // Calculate Bulk Cost
        const bulk = window.gameState.upgradeManager.getBulkCost(u.id, window.buyAmount);
        const cost = bulk.cost;
        const count = bulk.count;
        const isAffordable = cost > 0 && window.gameState.gold >= cost && count > 0;

        card.querySelector('.u-name').textContent = window.t(`upgrade.name.${u.id}`);
        const lblLvl = window.t('lbl.level');
        const lblTotal = window.t('lbl.total');

        card.querySelector('.u-lvl').textContent = `${lblLvl} ${u.level}`;
        card.querySelector('.upgrade-cost').textContent = `💰 ${formatNumber(cost)}` + (count > 1 ? ` (+${count})` : '');

        // Update Description & Total (Same logic as before)
        // Use localized description template
        let desc = window.t(`upgrade.desc.${u.id}`);

        let totalText = "";

        if (u.id === 'sharpen') {
            const total = (u.level * (u.level + 1)) / 2;
            const statName = window.t('stat.clickDamage');
            totalText = `${lblTotal}: +${formatNumber(total * u.value)} ${statName}`;

            // Dynamic Description for next level gain
            const nextGain = (u.level + 1) * u.value;
            desc = `+${formatNumber(nextGain)} ${statName}`;
        } else {
            let val = u.value * u.level;
            let suffix = "%";
            if (u.type === 'globalMult' || u.type === 'goldMult') {
                val = (u.value * 100 * u.level);
            }
            if (val % 1 !== 0) val = val.toFixed(1);
            if (Math.floor(val) === val) val = Math.floor(val);
            totalText = `${lblTotal}: +${val}${suffix}`;
        }

        // TODO: Localize dynamic description logic more robustly if needed
        // For now, static description override if static, but sharpen is dynamic.
        if (u.id !== 'sharpen') {
            // For logic-only stats (like +10%), the translation is usually static e.g. "+10% Attack Speed"
            // But here we might want to show next level stats? 
            // The original code was: let desc = u.desc;
            // u.desc was string like "+10% Attack Speed".

            // If we use translation, we get localized string.
            // If we want to show dynamic numbers inside localized string, we need a replace mechanism.
            // But existing upgrades have static descriptions for 'next level' generally?
            // Actually, `upgrade.desc.sharpen` is "+100% Click Damage" in translations.js?
            // No, `upgrade.desc.sharpen` is "+100% Click Damage".
            // But the code overrides `desc` for sharpen dynamically.
        }

        card.querySelector('.upgrade-desc').textContent = desc;
        card.querySelector('.upgrade-total').textContent = totalText;

        if (isAffordable || (window.buyAmount === 'max' && count > 0)) {
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
            card.style.borderColor = '#444433';
        } else {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
            card.style.borderColor = '#333';
        }
    });
}


// Helper for Mobile Interaction (UI Unified Logic)
function checkMobileInteraction(e, uniqueId, item) {
    // v48: User requested Single Tap for action, Long Press for tooltip.
    // We bypass this legacy "Double Tap" logic entirely.
    return true;


}

// Global Click listener to clear selection
document.addEventListener('click', (e) => {
    // If we clicked something that isn't a slot, clear selection
    if (!e.target.closest('.equip-slot') && !e.target.closest('.inv-slot')) {
        if (window.mobileInteractionState) {
            window.mobileInteractionState.id = null;
        }
        const tt = document.getElementById('tooltip');
        if (tt) tt.style.display = 'none';
    }
});

function handleEquipSlotClick(e, slotName, item) {
    if (!checkMobileInteraction(e, slotName, item)) return;

    console.log("Equip Click:", slotName, item.id, "Reforge:", window.reforgeMode, "Upgrade:", window.upgradeMode);
    if (window.upgradeMode) {
        window.tryUpgradeItem(e, item);
    } else if (window.reforgeMode) {
        window.tryReforgeItem(e, item);
    } else if (window.salvageMode) {
        window.showUIText("Unequip first!", e.pageX, e.pageY, "#ff0000");
    } else {
        window.gameState.inventoryManager.unequipItem(slotName);
        renderInventory();
    }
}

// Helper to reuse tooltip rendering code
function updateTooltipContent(item) {
    if (typeof showTooltip === 'function') {
        showTooltip(null, item);
    } else {
        const tt = document.getElementById('tooltip');
        if (tt) tt.innerHTML = `<div class="tt-header">${item.name}</div><div class="tt-stats">Double-tap to interact</div>`;
    }
}

function handleInventoryClick(index, e) {
    e = e || window.event;
    const item = window.gameState.inventory[index];
    if (!item) return;

    // Check Mobile Logic
    const uniqueId = item.id || ('idx_' + index);

    // Bypass double-tap check for non-destructive, repetitive actions (Upgrade/Reforge)
    // Salvage still requires double-tap for safety.
    const isFastAction = window.upgradeMode || window.reforgeMode;

    if (!isFastAction) {
        if (!checkMobileInteraction(e, uniqueId, item)) return;
    }

    if (window.salvageMode) {
        let mats = item.getSalvageValue();
        window.gameState.inventory.splice(index, 1);
        window.gameState.addResource('materials', mats);
        window.showUIText(`+${mats} Dust`, (e ? e.pageX : 0), (e ? e.pageY : 0), '#b19cd9');

        const slot = document.getElementById('inventory-grid').children[index];
        if (slot) slot.dataset.itemId = 'deleted_' + Date.now();
    } else if (window.upgradeMode) {
        window.tryUpgradeItem(e, item.id);
    } else if (window.reforgeMode) {
        window.tryReforgeItem(e, item);
    } else {
        window.gameState.inventoryManager.equipItem(item);
    }
}

function renderInventory() {
    // Sync Checkboxes
    if (window.initAutoSalvageUI) window.initAutoSalvageUI();

    const slots = document.querySelectorAll('.equip-slot');
    slots.forEach(slotEl => {
        const slotName = slotEl.dataset.slot;
        const item = window.gameState.equipment[slotName];

        // Clone element to wipe old event listeners (pure crude reset)
        // Actually, just resetting onclick is fine.
        slotEl.onclick = null;

        if (item) {
            const levelHtml = item.upgradeLevel > 0 ? `<div class="item-level">+${item.upgradeLevel}</div>` : '';
            const imgSrc = window.SLOT_IMAGES[item.slot];
            let iconHtml = '';
            // Check if item.icon is an image path (custom set icon) overrides defaults
            if (item.icon && item.icon.includes('/')) {
                iconHtml = `<img src="${item.icon}" style="width:70%; height:70%; object-fit:contain; margin-bottom:5px; pointer-events:none;">`;
            } else if (imgSrc) {
                iconHtml = `<img src="${imgSrc}" style="width:70%; height:70%; object-fit:contain; margin-bottom:5px; pointer-events:none;">`;
            } else {
                iconHtml = `<div style="font-size:2.5rem; margin-bottom:5px; pointer-events:none;">${item.icon}</div>`;
            }

            slotEl.innerHTML = `
            ${iconHtml}
            <div class="item-name" style="font-size:0.7rem; color:${item.rarity.color}; pointer-events:none;">${item.name}</div>
            ${levelHtml}
        `;
            slotEl.style.border = `1px solid ${item.rarity.color}`;
            slotEl.style.cursor = "pointer";
            slotEl.dataset.itemId = item.id;

            // Direct binding
            slotEl.onclick = (e) => {
                // If tooltip is blocking, this might not fire. Tooltip is pointer-events:none.
                // We show a feedback text just to prove it fired.
                if (window.reforgeMode || window.upgradeMode) {
                    window.showUIText("Targeted!", e.pageX, e.pageY, "#ffff00");
                }

                // Fetch fresh item reference to be absolutely safe
                const freshItem = window.gameState.equipment[slotName];
                handleEquipSlotClick(e, slotName, freshItem);
            };

            attachTooltip(slotEl, item);
        } else {
            // Empty Slot
            const icon = window.SLOT_ICONS[slotName] || '';
            // Only update if needed to avoid flicker? 
            // Actually, this function is called infrequently enough.
            slotEl.innerHTML = `<div style="pointer-events:none;">${icon}</div><div style="pointer-events:none;">${slotName}</div>`;
            slotEl.style.border = '1px dashed #333344';
            slotEl.style.cursor = "default";
            slotEl.onmouseenter = null;
            slotEl.onmouseleave = null;
        }
    });

    const grid = document.getElementById('inventory-grid');
    const maxSize = window.gameState.inventoryManager.maxSize;
    // ... ensure grid exists ...
    if (grid.childElementCount === 0) {
        for (let i = 0; i < maxSize; i++) {
            const el = document.createElement('div');
            el.className = 'inv-slot';
            el.dataset.index = i;
            // This initial binding is technically redundant if we rebind below, but good for safety
            el.onclick = (e) => handleInventoryClick(i, e);
            grid.appendChild(el);
        }
    }

    const invSlots = grid.children;
    for (let i = 0; i < maxSize; i++) {
        const slotEl = invSlots[i];

        // CRITICAL UPDATE: Always ensure the click handler is fresh and passes 'e'
        // This fixes the issue where old handlers (v1 code) persisted on the div
        slotEl.onclick = (e) => handleInventoryClick(i, e);

        const item = window.gameState.inventory[i];

        const currentId = slotEl.dataset.itemId;
        // Also check if upgrade level changed? 
        // The timestamp ID trick 'date.now' usually handles deletions.
        // But upgrades update in place.
        // We might want to store UpgradeLevel in dataset to detect change.
        const currentLvl = slotEl.dataset.lvl;

        const targetId = item ? item.id : 'empty';
        const targetLvl = item ? item.upgradeLevel : 0;

        if (currentId !== targetId || (item && currentLvl != targetLvl)) {
            slotEl.dataset.itemId = targetId;
            if (item) {
                slotEl.dataset.lvl = targetLvl;
                const levelHtml = item.upgradeLevel > 0 ? `<div class="item-level">+${item.upgradeLevel}</div>` : '';

                slotEl.style.border = `1px solid ${item.rarity.color}`;
                slotEl.style.cursor = "pointer";

                // Use Image or Fallback Icon
                // Use Image or Fallback Icon
                const imgSrc = window.SLOT_IMAGES[item.slot];
                let iconHtml = '';
                if (item.icon && item.icon.includes('/')) {
                    iconHtml = `<img src="${item.icon}" style="width:100%; height:100%; object-fit:contain; padding:2px; display:block; pointer-events:none;">`;
                } else if (imgSrc) {
                    iconHtml = `<img src="${imgSrc}" style="width:100%; height:100%; object-fit:contain; padding:2px; display:block; pointer-events:none;">`;
                } else {
                    iconHtml = `<div style="font-size:1.5rem; pointer-events:none;">${item.icon}</div>`;
                }

                slotEl.innerHTML = `${iconHtml}${levelHtml}`;

                // Note: attachTooltip handles mouseenter/leave for desktop. 
                // We keep it for desktop/mouse users or hybrid devices.
                attachTooltip(slotEl, item);
            } else {
                delete slotEl.dataset.lvl;
                slotEl.style.border = '1px solid #333344';
                slotEl.style.cursor = "default";
                slotEl.innerHTML = '';
                // Clear ALL tooltip event listeners
                slotEl.onmouseenter = null;
                slotEl.onmouseleave = null;
                slotEl.onmousemove = null;
                slotEl.ontouchstart = null;
            }
        }
    }
}



const tooltipEl = document.getElementById('tooltip');

function attachTooltip(element, item) {
    element.onmouseenter = (e) => showTooltip(e, item);
    element.onmouseleave = () => hideTooltip();
    element.onmousemove = (e) => moveTooltip(e);

    // Long Press Logic for Mobile Tooltips
    let longPressTimer;
    let isLongPress = false;
    let startX, startY;

    element.ontouchstart = (e) => {
        isLongPress = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        longPressTimer = setTimeout(() => {
            isLongPress = true;
            // Show tooltip and stop partial propagation (allow internal logic but maybe block global hide?)
            // Actually, we WANT to stop propagation so the global "hide" listener doesn't trigger.
            e.stopPropagation();
            showTooltip(e, item);

            // Optional: Haptic feedback if available?
            if (navigator.vibrate) navigator.vibrate(50);
        }, 500); // 500ms threshold
    };

    element.ontouchend = (e) => {
        clearTimeout(longPressTimer);
        // If it WAS a long press, we might want to prevent the default 'click' behavior (equip/use)
        // so the user doesn't accidentally equip the item they just wanted to inspect.
        if (isLongPress) {
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
        }
    };

    element.ontouchmove = (e) => {
        // If moved significantly, cancel long press
        const moveX = e.touches[0].clientX;
        const moveY = e.touches[0].clientY;
        if (Math.abs(moveX - startX) > 10 || Math.abs(moveY - startY) > 10) {
            clearTimeout(longPressTimer);
        }
    };
}

// Mapping for Unique Ability Names
const UNIQUE_NAMES = {
    'overkill_explosion': 'Overkill',
    'executioner': 'The Executioner',
    'time_warp': 'Time Warp',
    'frenzy': 'Frenzy',
    'echo_thunder': 'Echoing Thunder',
    'shadow_clone': 'Shadow Clone'
};

function showTooltip(e, item) {
    // Ignore emulated mouse events if we just had a touch event
    if (e.type === 'mouseenter' && window.lastTouchTime && (Date.now() - window.lastTouchTime < 500)) {
        return;
    }

    tooltipEl.style.display = 'block';

    const isEquipped = Object.values(window.gameState.equipment).includes(item);
    // Find comparison item (what receives the diffs)
    // If hovering ONE item, we compare against EQUIPPED.
    // If hovering EQUIPPED item, there is no comparison (or compare against nothing).
    const equipped = window.gameState.equipment[item.slot];

    // Only compare if we are NOT hovering the equipped item itself
    const comparisonItem = (!isEquipped) ? equipped : null;

    // Simplified Tooltip (One Name Line)
    // Restored Item Level Display
    let html = `
    <div class="tt-header" style="border-bottom: 1px solid ${item.rarity.color}">
        <div class="tt-title" style="color:${item.rarity.color}">${item.name} <span style="font-size:0.7em; color:#888; font-weight:normal;">(${item.slot})</span></div>
        <div style="font-size:0.75rem; color:#888; margin-top:-2px; margin-bottom:2px;">Item Level ${item.stage || 1}</div>
        ${item.classAffinity ? `<div class="tt-affinity" style="color:#cfb53b; font-size:0.8rem; margin-top:2px;">${item.classAffinity.toUpperCase()} CLASS</div>` : ''}
    </div>
    <div class="tt-stats">
        ${formatItemStats(item, comparisonItem)}
    </div>
`;

    // Unique Effect
    if (item.effectDesc) {
        // Try to find name by ID, or infer from desc if legacy item missing effectId
        let abilityName = "Unique Property";

        if (item.effectId && UNIQUE_NAMES[item.effectId]) {
            abilityName = UNIQUE_NAMES[item.effectId];
        } else {
            // Legacy Fallback Check
            if (item.effectDesc.includes("Shadow Clone")) abilityName = "Shadow Clone";
            else if (item.effectDesc.includes("Instantly kill")) abilityName = "The Executioner";
            else if (item.effectDesc.includes("warp time")) abilityName = "Time Warp";
            else if (item.effectDesc.includes("Attack Speed")) abilityName = "Frenzy";
            else if (item.effectDesc.includes("Lightning Bolt")) abilityName = "Echoing Thunder";
            else if (item.effectDesc.includes("Overkill")) abilityName = "Overkill";
        }

        html += `
        <div class="tt-unique-effect" style="margin-top:8px; padding-top:8px; border-top:1px solid #444;">
            <div style="color:#cfb53b; font-weight:bold; margin-bottom:2px; font-size:0.8rem;">${abilityName}</div>
            <div style="color:#fff; font-size:0.85rem; line-height:1.3;">${item.effectDesc}</div>
            ${item.flavor ? `<div style="color:#aaa; font-style:italic; font-size:0.75rem; margin-top:5px;">"${item.flavor}"</div>` : ''}
        </div>
    `;
    }

    // Upgrade Section
    if (item.upgradeLevel < item.maxUpgrades) {
        const cost = Math.floor(10 * Math.pow(1.5, item.upgradeLevel || 0));
        html += `
        <div class="tt-upgrade">
            <div style="font-size:0.8rem; color:#aaa; margin-bottom:4px; padding-top:5px; border-top:1px solid #444;">${window.t('lbl.upgrade_cost')}: ${cost} ${window.t('res.dust')}</div>
            <div style="font-size:0.7rem; color:#666;">${window.t('lbl.enable_upgrade_mode')}</div>
        </div>
    `;
    } else {
        html += `<div class="tt-upgrade" style="color:#cfb53b; text-align:center; font-size:0.8rem; padding-top:5px; border-top:1px solid #444;">${window.t('lbl.max_upgraded')}</div>`;
    }

    // Reforge Info
    if ((item.stage || 1) < window.gameState.stage) {
        html += `
        <div class="tt-upgrade" style="border-top:1px solid #444; margin-top:5px;">
            <div style="font-size:0.8rem; color:#d4a1d4;">${window.t('lbl.reforge_available')} (5 ${window.t('res.essence')})</div>
            <div style="font-size:0.7rem; color:#666;">${window.t('lbl.enable_reforge_mode')}</div>
        </div>
    `;
    }

    // Set Bonuses
    if (item.set) {
        const setDef = window.ITEM_SETS[item.set];
        if (setDef) {
            const currentEquippedCount = Object.values(window.gameState.equipment)
                .filter(i => i && i.set === item.set).length;

            html += `<div class="tt-set">
            <div class="tt-set-name">${setDef.name} (${currentEquippedCount}/6)</div>
        `;

            Object.entries(setDef.bonuses).forEach(([req, bonus]) => {
                const isActive = currentEquippedCount >= parseInt(req);
                const color = isActive ? '#00ff00' : '#666';
                html += `<div style="color:${color}">(${req}) ${bonus.desc}</div>`;
            });
            html += `</div>`;
        }
    }

    // Show Equipped Item (Comparison Context)
    // Reuse isEquipped and equipped from top scope
    if (!isEquipped && equipped) {
        html += `
        <div class="tt-equipped">
            <div>Currently Equipped:</div>
            <div style="color:${equipped.rarity.color}">${equipped.name}</div>
            ${formatItemStats(equipped)}
        </div>
    `;
    }

    tooltipEl.innerHTML = html;
    if (e) moveTooltip(e);
}

// function moveTooltip(e) {
//     console.warn('Deprecated moveTooltip called. Using moveTooltipQuadrants instead.');
//     moveTooltipQuadrants(e);
// }

// Keeping an empty function just in case some event listener is still bound to it directly
function moveTooltip(e) {
    // Redirect to new logic if e exists
    if (e) moveTooltipQuadrants(e);
}

function hideTooltip() {
    tooltipEl.style.display = 'none';
}

function formatItemStats(item, comparisonItem = null) {
    let html = '';

    // Weapon Intrinsic
    if (item.clickDamageFlat) {
        let diffHtml = '';
        if (comparisonItem && comparisonItem.clickDamageFlat) {
            const diff = item.clickDamageFlat - comparisonItem.clickDamageFlat;
            if (diff !== 0) {
                const color = diff > 0 ? '#00ff00' : '#ff0000';
                const sign = diff > 0 ? '+' : '';
                diffHtml = ` <span style="color:${color}">(${sign}${formatNumber(diff)})</span>`;
            }
        } else if (comparisonItem) {
            // New stat entirely vs equipped
            diffHtml = ` <span style="color:#00ff00">(+${formatNumber(item.clickDamageFlat)})</span>`;
        }

        html += `<div class="tt-stat-row"><span style="color:#fff">${formatNumber(item.clickDamageFlat)}</span>${diffHtml} <span style="color:#aaa">Base Click Damage</span></div>`;
    }

    if (Object.keys(item.stats).length === 0 && !item.clickDamageFlat && (!comparisonItem || Object.keys(comparisonItem.stats).length === 0)) {
        return '<div style="color:#666; font-style:italic; padding-top:4px;">No magical properties</div>';
    }

    const getStatName = (id) => {
        // Localized lookup
        const key = `stat.${id}`;
        const translated = window.t(key);
        // If translation missing (returns key), fallback to type.name or id
        if (translated !== key) return translated;

        const type = window.STAT_TYPES.find(t => t.id === id);
        return type ? type.name : id;
    };

    const getStatSuffix = (id) => {
        const type = window.STAT_TYPES.find(t => t.id === id);
        return type ? (type.suffix || '') : '';
    };

    // Union of all stats to show comparisons
    const allStats = new Set([
        ...Object.keys(item.stats),
        ...(comparisonItem ? Object.keys(comparisonItem.stats) : [])
    ]);

    html += Array.from(allStats).map(k => {
        const val = item.stats[k] || 0;
        const oldVal = comparisonItem ? (comparisonItem.stats[k] || 0) : 0;
        const name = getStatName(k);
        const suffix = getStatSuffix(k);

        // If stat exists on item, show it normally with diff
        if (val > 0) {
            let diffHtml = '';
            if (comparisonItem) {
                const diff = val - oldVal;
                if (diff !== 0) {
                    const color = diff > 0 ? '#00ff00' : '#ff0000';
                    const sign = diff > 0 ? '+' : '';
                    diffHtml = ` <span style="color:${color}">&nbsp;(${sign}${formatNumber(diff)}${suffix})</span>`;
                }
            }
            // Greater Stat Icon
            const isGreater = (item.greaterStats && item.greaterStats[k]);
            const starHtml = isGreater ? '<span style="color:#ffd700; text-shadow:0 0 5px #ffd700;">⭐</span>' : '';

            // Use Grid for alignment: [Icon] [Name] [Value + Diff]
            // Icon gets fixed width (e.g. 20px)
            return `
            <div class="tt-stat-row" style="display:grid; grid-template-columns: 20px 1fr auto; align-items:center;">
                <div style="text-align:center;">${starHtml}</div>
                <div style="color:#aaa;">${name}</div>
                <div style="text-align:right;">
                    <span style="color:#fff">+${val}${suffix}</span>${diffHtml}
                </div>
            </div>`;
        }
        // If stat is missing on item but exists on comparison (Lost Stat)
        else if (oldVal > 0) {
            return `
            <div class="tt-stat-row" style="display:grid; grid-template-columns: 20px 1fr auto; align-items:center;">
                <div></div>
                <div style="text-decoration:line-through; color:#884444;">${name}</div>
                <div style="text-align:right; color:#ff4444;">-${oldVal}${suffix}</div>
            </div>`;
        }
        return '';
    }).join('');

    return html;
}

// Helper to format numbers cleanly (1K, 1M, 1B, etc.)
// (Assuming this exists or is unneeded here, placing drag helper)

// Helper for Drag Scrolling (Paragon Board etc)
function enableDragScroll(el) {
    if (!el) return;

    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    const start = (px, py) => {
        isDown = true;
        startX = px;
        startY = py;
        scrollLeft = el.scrollLeft;
        scrollTop = el.scrollTop;
        el.style.cursor = 'grabbing';
    };

    const end = () => {
        isDown = false;
        el.style.cursor = 'grab';
    };

    const move = (e, px, py) => {
        if (!isDown) return;
        e.preventDefault(); // Stop text selection / native scroll
        const x = px - startX;
        const y = py - startY;
        el.scrollLeft = scrollLeft - x;
        el.scrollTop = scrollTop - y;
    };

    // Mouse
    el.addEventListener('mousedown', (e) => start(e.pageX, e.pageY));
    el.addEventListener('mouseleave', end);
    el.addEventListener('mouseup', end);
    el.addEventListener('mousemove', (e) => move(e, e.pageX, e.pageY));

    // Touch
    el.addEventListener('touchstart', (e) => start(e.touches[0].pageX, e.touches[0].pageY));
    el.addEventListener('touchend', end);
    el.addEventListener('touchmove', (e) => move(e, e.touches[0].pageX, e.touches[0].pageY));
}



window.showCombatEffect = function (text, color = '#fff') {
    const container = document.getElementById('combat-effects');
    if (!container) return;

    // Create Element
    const el = document.createElement('div');
    el.className = 'combat-text';
    el.innerHTML = text;
    el.style.color = color;

    // Random Offset +/- 40px from center
    const rX = Math.floor(Math.random() * 80) - 40;
    const rY = Math.floor(Math.random() * 60) - 30;

    el.style.left = `calc(50% + ${rX}px)`;
    el.style.top = `calc(50% + ${rY}px)`;

    // Add to DOM
    container.appendChild(el);

    // Remove after animation (matches CSS 2s)
    setTimeout(() => el.remove(), 2000);
};


// Wrapper primarily to ensure DOM is ready
function init() {
    console.log("Initializing Game...");

    // Bind Monster Click
    const monsterSprite = document.getElementById('monster-sprite');
    if (monsterSprite) {
        monsterSprite.addEventListener('click', handleMonsterClick);
    }

    // Hide Splash Screen Logic
    const splash = document.getElementById('splash-overlay');

    // Auto-remove
    setTimeout(() => {
        if (splash && splash.parentNode) {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 1000);
        }
    }, 1500);

    // Manual/Mobile interaction fallback (Tap to Start)
    if (splash) {
        const dismissSplash = () => {
            splash.style.transition = "opacity 0.3s";
            splash.style.opacity = '0';
            setTimeout(() => {
                if (splash.parentNode) splash.remove();
            }, 300);
        };
        splash.addEventListener('click', dismissSplash);
        splash.addEventListener('touchstart', dismissSplash, { passive: true });
    }

    // Inventory Mode Buttons


    const updateModeUI = () => {
        const sBtn = document.getElementById('salvage-btn');
        const uBtn = document.getElementById('upgrade-mode-btn');
        const rBtn = document.getElementById('reforge-mode-btn');
        const app = document.getElementById('app');

        if (sBtn) sBtn.classList.toggle('active', window.salvageMode);
        if (uBtn) uBtn.classList.toggle('active', window.upgradeMode);
        if (rBtn) rBtn.classList.toggle('active', window.reforgeMode);

        if (app) {
            app.classList.toggle('salvage-active', window.salvageMode);
            app.classList.toggle('upgrade-active', window.upgradeMode);
            app.classList.toggle('reforge-active', window.reforgeMode);
        }

        const controls = document.getElementById('salvage-controls');
        if (controls) controls.style.display = window.salvageMode ? 'flex' : 'none';
    };

    // Mode Buttons - Direct Attachment
    // Use direct listeners instead of delegation to ensure clicks are caught
    const btnSalvage = document.getElementById('salvage-btn');
    const btnUpgrade = document.getElementById('upgrade-mode-btn');
    const btnReforge = document.getElementById('reforge-mode-btn');

    if (btnSalvage) {
        btnSalvage.onclick = (e) => {
            e.stopPropagation();
            window.salvageMode = !window.salvageMode;
            window.upgradeMode = false;
            window.reforgeMode = false;
            updateModeUI();
        };
    }

    if (btnUpgrade) {
        btnUpgrade.onclick = (e) => {
            e.stopPropagation();
            window.upgradeMode = !window.upgradeMode;
            window.salvageMode = false;
            window.reforgeMode = false;
            updateModeUI();
        };
    }

    if (btnReforge) {
        btnReforge.onclick = (e) => {
            e.stopPropagation();
            window.reforgeMode = !window.reforgeMode;
            window.salvageMode = false;
            window.upgradeMode = false;
            updateModeUI();
        };
    }

    // Initial UI Sync
    updateModeUI();

    // Bulk Salvage
    document.querySelectorAll('.bulk-btn').forEach(btn => {
        btn.onclick = () => {
            const rarity = btn.getAttribute('data-rarity');
            salvageAll(rarity);
        };
    });

    // ... rest of init ...


    // Global Tab Clicking Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        // NEW: Skip Merchant buttons (they have their own inline onclick logic)
        if (btn.closest('#merchant-modal')) return;

        btn.onclick = () => {
            const panel = btn.closest('.panel');

            // Fix: Ignore buttons not in a panel (e.g. Modal tabs which have their own handlers)
            if (!panel) return;

            const targetTab = btn.dataset.tab;

            btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active-content'));

            if (panel.id === 'panel-left') {
                currentLeftTab = targetTab;
                if (targetTab === 'units') document.getElementById('unit-list').classList.add('active-content');
                if (targetTab === 'upgrades') document.getElementById('upgrade-list').classList.add('active-content');
            } else if (panel.id === 'panel-right') {
                currentRightTab = targetTab;
                if (targetTab === 'inventory') document.getElementById('tab-inventory').classList.add('active-content');
                if (targetTab === 'stats') {
                    document.getElementById('tab-stats').style.display = 'block';
                    document.getElementById('tab-stats').classList.add('active-content');
                } else {
                    document.getElementById('tab-stats').style.display = 'none';
                }
            }
        };
    });

    // System Buttons
    const btnSave = document.getElementById('btn-save');
    if (btnSave) {
        btnSave.onclick = () => {
            const success = window.saveManager.save(window.gameState);
            const statusEl = document.getElementById('save-status');
            if (success && statusEl) {
                statusEl.textContent = "Saved!";
                setTimeout(() => statusEl.textContent = "", 2000);
            }
        };
    }

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.onclick = () => {
            if (confirm("Are you sure you want to wipe your save? This cannot be undone.")) {
                window.saveManager.reset();
            }
        };
    }

    // Paragon Modal
    const modal = document.getElementById('paragon-modal');
    const closeBtn = document.getElementById('close-paragon');
    const btnParagon = document.getElementById('btn-paragon');

    // Enable Drag Scroll for Paragon Board
    const paraContainer = document.getElementById('paragon-canvas-container');
    if (paraContainer) {
        enableDragScroll(paraContainer);
    }

    if (btnParagon && modal) {
        btnParagon.onclick = () => {
            modal.style.display = 'block';
            document.getElementById('menu-modal').style.display = 'none'; // Close menu
            renderParagonBoard();
        };

        closeBtn.onclick = () => modal.style.display = 'none';

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    }


    // Ascension Modal Logic
    const ascModal = document.getElementById('ascension-modal');
    if (ascModal) {
        document.getElementById('close-ascension').onclick = () => ascModal.style.display = 'none';
        window.onclick = (e) => {
            if (e.target === ascModal) ascModal.style.display = 'none';
            if (e.target === modal) modal.style.display = 'none';

            const reincModal = document.getElementById('reincarnation-modal');
            if (reincModal && e.target === reincModal) {
                reincModal.style.display = 'none';
            }

            const menuModal = document.getElementById('menu-modal');
            if (menuModal && e.target === menuModal) {
                menuModal.style.display = 'none';
            }

            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal && e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        };
    }

    // System Menu Logic
    const menuModal = document.getElementById('menu-modal');
    const btnMenu = document.getElementById('btn-menu');
    const closeMenu = document.getElementById('close-menu');
    const btnDev = document.getElementById('btn-dev'); // Existing button moved inside

    // Add extra listener to btn-dev to close menu
    if (btnDev) {
        btnDev.addEventListener('click', () => {
            if (menuModal) menuModal.style.display = 'none';
        });
    }

    if (btnMenu && menuModal) {
        btnMenu.onclick = () => {
            menuModal.style.display = 'flex'; // Use flex to center/layout
        };
        if (closeMenu) closeMenu.onclick = () => menuModal.style.display = 'none';
    }

    // Migration: Fix Set Icons (One-time check on load)
    // Migration: Fix Icons (Sets and Class Affinity) & Backfill Data
    if (window.gameState) {
        const classes = ['mage', 'rogue', 'paladin', 'amazon', 'necro', 'barbarian', 'druid'];

        const updateIcon = (i) => {
            if (!i) return;

            // Backfill Class Affinity if missing
            if (!i.classAffinity) {
                // If it's a Set Item, try to deduce from Set Name
                if (i.name.includes("Angelic")) i.classAffinity = 'paladin';
                else if (i.name.includes("Demonic")) i.classAffinity = 'necro';
                else if (i.name.includes("Spirit")) i.classAffinity = 'druid'; // Just in case
                else {
                    // Random legacy assignment
                    i.classAffinity = classes[Math.floor(Math.random() * classes.length)];
                }
            }

            // Fix Shadow Clone Description (Migration)
            if (i.effectId === 'shadow_clone' && i.effectDesc.includes("100%")) {
                i.effectDesc = "2% Chance on Click to spawn a Shadow Clone (10s Duration, 20s Cooldown).";
            }

            // Backfill Missing Effect IDs (Legacy Item Fix)
            if (!i.effectId && i.rarity && i.rarity.id === 'unique' && i.effectDesc) {
                if (i.effectDesc.includes("Shadow Clone")) i.effectId = "shadow_clone";
                else if (i.effectDesc.includes("Instantly kill")) i.effectId = "executioner";
                else if (i.effectDesc.includes("warp time")) i.effectId = "time_warp";
                else if (i.effectDesc.includes("Attack Speed")) i.effectId = "frenzy";
                else if (i.effectDesc.includes("Lightning Bolt")) i.effectId = "echo_thunder";
                else if (i.effectDesc.includes("Overkill")) i.effectId = "overkill_explosion";
            }

            // Set Icons priority (Explicit Mapping)
            if (window.SET_ICONS && window.SET_ICONS[i.name]) {
                i.icon = window.SET_ICONS[i.name];
            }
            // Class Icons fallback (Affinity based)
            else if (window.CLASS_ICONS && i.classAffinity && window.CLASS_ICONS[i.classAffinity] && window.CLASS_ICONS[i.classAffinity][i.slot]) {
                i.icon = window.CLASS_ICONS[i.classAffinity][i.slot];
            }
        };

        if (window.gameState.inventory) {
            window.gameState.inventory.forEach(i => {
                updateIcon(i);
                if (i.slot === 'mainhand') {
                    // Update to 1.16 Scaling
                    const baseDmg = 10 * Math.pow(1.16, i.stage - 1);
                    i.clickDamageFlat = Math.floor(baseDmg);
                }
            });
        }
        if (window.gameState.equipment) {
            Object.values(window.gameState.equipment).forEach(i => {
                if (i) {
                    updateIcon(i);
                    if (i.slot === 'mainhand') {
                        // Update to 1.16 Scaling
                        const baseDmg = 10 * Math.pow(1.16, i.stage - 1);
                        i.clickDamageFlat = Math.floor(baseDmg);
                    }
                }
            });
        }
    }

    renderInventory();
    window.gameState.recalculateStats();

    gameLoop();
}

// Global scope for HTML access
const app = document.getElementById('app');
if (app) {
    // ... (keeping existing listeners)
}

// Stats Tooltips Delegate
const statsTab = document.getElementById('tab-stats');
if (statsTab) {
    statsTab.addEventListener('mouseover', (e) => {
        const row = e.target.closest('.stat-row');
        if (!row) return;

        const statId = row.getAttribute('data-stat-id');
        if (!statId) return;

        const def = window.STAT_TYPES ? window.STAT_TYPES.find(s => s.id === statId) : null;
        const desc = def ? def.desc : '';
        if (!desc) return;

        let extraInfo = '';

        // Specific Overrides for Dynamic Info
        if (statId === 'magicFind') {
            const mfVal = window.gameState.multipliers.magicFind;
            if (mfVal > 100) {
                const effMf = 100 + Math.pow(mfVal - 100, 0.8);
                extraInfo = `<div style="margin-top:5px; color:#aaa; font-size:0.85em;">Diminishing Returns active above 100%.<br>Raw: <span style="color:#fff">${Math.floor(mfVal)}%</span> &rarr; Eff: <span style="color:#00ff00">${Math.floor(effMf)}%</span></div>`
            }
        }

        if (statId === 'doubleDamage') {
            const rawVal = (window.gameState.multipliers.rawDoubleDamage !== undefined) ? window.gameState.multipliers.rawDoubleDamage : window.gameState.multipliers.doubleDamageChance;
            const effVal = window.gameState.multipliers.doubleDamageChance;

            extraInfo = `<div style="margin-top:5px; color:#aaa; font-size:0.85em;">Diminishing Returns active (Hard Cap 80%).<br>Raw: <span style="color:#fff">${Math.floor(rawVal)}%</span> &rarr; Eff: <span style="color:${effVal >= 80 ? '#ff0000' : '#fff'}">${Math.floor(effVal)}%</span></div>`
        }

        // Show Tooltip
        const html = `
                <div class="tt-header" style="color:#fff; border-bottom:1px solid #555; padding-bottom:3px; margin-bottom:3px;">${def ? def.name : statId}</div>
                <div style="color:#ccc; font-size:0.9em;">${desc}</div>
                ${extraInfo}
            `;

        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'block';
        tooltip.innerHTML = html;
        moveTooltip(e);
    });

    statsTab.addEventListener('mousemove', (e) => {
        const row = e.target.closest('.stat-row');
        if (row) moveTooltip(e);
    });

    statsTab.addEventListener('mouseout', (e) => {
        // hideTooltip(); // This might flicker if moving between rows
        // Better: check if we left the row
        const row = e.target.closest('.stat-row');
        if (row) hideTooltip();
    });
}
window.openAscensionModal = function (heroId) {
    const modal = document.getElementById('ascension-modal');
    window.currentAscensionHero = heroId; // Store for refresh

    // Set Dynamic Background
    const heroDef = window.UNIT_TYPES[heroId.toUpperCase()];
    const modalContent = modal.querySelector('.modal-content');
    if (heroDef && heroDef.image && modalContent) {
        // Use a dark gradient overlay to ensure text readability
        modalContent.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('${heroDef.image}')`;
    }

    renderAscensionTree(heroId);
    modal.style.display = 'block';
};

function renderAscensionTree(heroId) {
    const treeContainer = document.getElementById('ascension-tree-container');
    const title = document.getElementById('ascension-title');
    const heroDef = window.UNIT_TYPES[heroId.toUpperCase()];
    const treeDef = window.ASCENSION_TREE[heroId];

    if (!treeDef) return;

    // Title Localization
    const lblAscension = window.t('lbl.ascension');
    const heroName = window.t(`unit.name.${heroId}`);
    title.textContent = `${lblAscension}: ${heroName}`;

    treeContainer.innerHTML = '';

    const currentLevel = window.gameState.ascensionManager.levels[heroId];

    // Helper to Localize Tier Description
    // Helper to Localize Tier Description
    const getLocalizedDesc = (tier, index) => {
        // 1. Try Specific Translation Key: ascension.desc.mage_t1
        const key = `ascension.desc.${heroId}_t${index + 1}`;
        const translated = window.t(key);
        if (translated !== key) return translated;

        // 2. Generic Stat Formatting
        if (tier.type === 'heroDamage') {
            const tName = window.t(`unit.name.${tier.target}`);
            const statName = window.t('stat.heroDamage');
            const lblDmg = window.t('lbl.damage');
            return `+${tier.val * 100}% ${tName} ${lblDmg}`;
        }
        if (tier.type === 'cinderGain') {
            return `+${tier.val * 100}% ${window.t('stat.cinderGain')}`;
        }
        if (tier.type === 'critChance') {
            return `+${tier.val}% ${window.t('stat.critChance')}`;
        }
        if (tier.type === 'globalMult') {
            return `+${tier.val * 100}% ${window.t('stat.globalDps')}`;
        }
        if (tier.type === 'magicFind') {
            return `+${tier.val}% ${window.t('stat.magicFind')}`;
        }
        if (tier.type === 'goldMult') return `+${tier.val * 100}% ${window.t('stat.goldFind')}`;
        if (tier.type === 'clickDamagePct') return `+${tier.val}% ${window.t('stat.clickDamagePct')}`;

        // New Stat Types Fallbacks (if no specific key found)
        if (tier.type === 'bossTimer') return `+${tier.val}s ${window.t('blessing.name.swiftness') ? 'Boss Timer' : 'Boss Timer'}`; // quick fallback

        return tier.desc;
    };

    treeDef.tiers.forEach((tier, index) => {
        const tierNum = index + 1;
        const isUnlocked = currentLevel >= tierNum;
        const isNext = currentLevel === index;
        const canAfford = window.gameState.bossEssence >= tier.cost;

        const el = document.createElement('div');
        el.className = 'ascension-tier';
        el.style.cssText = `
        display: flex; 
        align-items: center; 
        background: rgba(0, 0, 0, 0.5); 
        padding: 10px; 
        border-radius: 8px; 
        border: 1px solid rgba(255, 255, 255, 0.1); 
        opacity: ${isUnlocked ? '1' : (isNext ? '1' : '0.5')};
        position: relative;
    `;

        if (isUnlocked) el.style.borderColor = 'rgba(163, 53, 238, 0.5)';

        // Keys
        const lblUnlock = window.t('lbl.unlock');
        const lblLocked = window.t('lbl.locked');
        const lblUnlocked = window.t('lbl.unlocked');
        const lblReq = window.t('lbl.requires_tier');

        let btnHtml = '';
        if (!isUnlocked) {
            if (isNext) {
                btnHtml = `
                <button style="
                    background: ${canAfford ? '#a335ee' : '#555'}; 
                    color: white; 
                    border: none; 
                    padding: 6px 12px; 
                    border-radius: 4px; 
                    margin-left: auto;
                    cursor: ${canAfford ? 'pointer' : 'not-allowed'};
                "
                onclick="window.buyAscensionTier('${heroId}')">
                    ${lblUnlock} (${tier.cost} ${window.t('res.essence')})
                </button>
            `;
            } else {
                btnHtml = `<span style="margin-left:auto; color:#666;">${lblLocked}</span>`;
            }
        } else {
            btnHtml = `<span style="margin-left:auto; color:#a335ee; font-weight:bold;">${lblUnlocked}</span>`;
        }

        // For Description, we try to use localized construction
        let descText = getLocalizedDesc(tier, index);

        el.innerHTML = `
        <div style="font-weight:bold; font-size:1.2rem; color:#a335ee; width:30px;">T${tierNum}</div>
        <div style="margin-left:10px;">
            <div style="color:white; font-weight:bold;">${descText}</div>
            <div style="color:#aaa; font-size:0.8rem;">${lblReq} ${index}</div>
        </div>
        ${btnHtml}
    `;
        treeContainer.appendChild(el);
    });
}

// Reincarnation Logic
window.openReincarnationModal = function () {
    const modal = document.getElementById('reincarnation-modal');
    if (modal) {
        modal.display = 'block'; // Correcting logic if needed, but style.display is standard. 
        // Wait, main.js used modal.style.display. Maintaining consistency.
        modal.style.display = 'block';
        window.renderReincarnationModal();
        return;
    }
    // Fallback if modal missing (shouldn't happen now)
    if (confirm("Modal missing. Force Reincarnate?")) {
        window.gameState.reincarnationManager.reincarnate();
    }
};

window.renderReincarnationModal = function () {
    const rm = window.gameState.reincarnationManager;
    if (!rm) return;

    // 1. Status Panel
    document.getElementById('current-divinity').textContent = Math.floor(rm.divinity).toLocaleString();

    const gain = rm.calculateDivinityGain();
    const btn = document.getElementById('btn-reincarnate');
    const pending = document.getElementById('pending-divinity');

    pending.textContent = `+${gain.toLocaleString()}`;

    if (rm.canReincarnate() && gain > 0) {
        btn.onclick = () => {
            if (rm.reincarnate()) {
                document.getElementById('reincarnation-modal').style.display = 'none';
                // UI refresh happens in softReset
            }
        };
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    } else {
        btn.onclick = null;
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    }

    // 2. Blessings List
    const list = document.getElementById('blessings-list');
    list.innerHTML = '';

    const blessings = rm.BLESSING_DEFINITIONS;
    Object.keys(blessings).forEach(id => {
        const def = blessings[id];
        const lvl = rm.blessings[id];
        const cost = rm.getBlessingCost(id);
        const isMaxed = def.maxLevel && lvl >= def.maxLevel;

        const row = document.createElement('div');
        row.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:10px; border:1px solid #444; border-radius:4px; margin-bottom:5px;";

        const buyBtnHtml = isMaxed
            ? `<button disabled class="sys-btn" style="opacity:0.5; color:#cfb53b;">MAXED</button>`
            : `<button class="sys-btn" onclick="if(window.gameState.reincarnationManager.buyBlessing('${id}')) window.renderReincarnationModal()">Buy (${parseInt(cost).toLocaleString()})</button>`;

        row.innerHTML = `
        <div style="flex:1; display:flex; align-items:center; gap:15px;">
            <img src="assets/blessings/${id}.png" style="width:64px; height:64px; border-radius:8px; border:2px solid #cfb53b; background:rgba(0,0,0,0.5);">
            <div>
                <div style="font-weight:bold; color:#fff; font-size:1.1rem;">${def.name} <span style="font-size:0.8rem; color:#aaa;">(Lvl ${lvl})</span></div>
                <div style="font-size:0.8rem; color:#888;">${def.desc}</div>
                <div style="font-size:0.75rem; color:#00ffff; margin-top:2px;">Cur Effect: ${rm.getEffectDisplay(id)}</div>
            </div>
        </div>
        <div>${buyBtnHtml}</div>
    `;
        list.appendChild(row);
    });
};

// Global helper for GameState to show damage (auto-positioning near center)
// Global helper for GameState to show damage (auto-positioning near center)
window.showFloatingDamage = function (amount, isCrit, type = 'hero', tier = 0, isDouble = false) {
    const centerPanel = document.getElementById('panel-center');
    if (!centerPanel) return;

    const rect = centerPanel.getBoundingClientRect();
    // Random spread around center
    const x = rect.left + rect.width / 2 + (Math.random() * 80 - 40);
    const y = rect.top + rect.height / 2 - 50 + (Math.random() * 60 - 30);

    // Call existing function
    showFloatingText(amount, x, y, isCrit, type, tier, isDouble);
};


window.tryBuyBlessing = function (id) {
    const rm = window.gameState.reincarnationManager;
    if (rm.buyBlessing(id)) {
        window.renderReincarnationModal();
    }
};



window.buyAscensionTier = function (heroId) {
    if (window.gameState.ascensionManager.buyAscension(heroId)) {
        renderAscensionTree(heroId);
        updateUI();
    }
};

// Global selection state
// (Ideally this should be in GameState or ParagonManager, but UI state in main.js is acceptable here)
if (typeof window.selectedParagonNodeId === 'undefined') {
    window.selectedParagonNodeId = null;
}

function renderParagonBoard() {
    const canvas = document.getElementById('paragon-canvas');
    if (!canvas) return;

    const container = document.getElementById('paragon-canvas-container');

    // Dynamic Sizing: Force Huge Size based on Viewport (90% of screen height)
    // This pushes the modal open since it is set to fit-content
    const viewportSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    const BOARD_SIZE = Math.max(800, viewportSize); // Minimum 800px or 90% screen

    const wrapper = document.getElementById('paragon-board-wrapper');
    if (wrapper) {
        wrapper.style.width = BOARD_SIZE + 'px';
        wrapper.style.height = BOARD_SIZE + 'px';
    }

    // Canvas size (internal resolution)
    canvas.width = BOARD_SIZE;
    canvas.height = BOARD_SIZE;

    const ctx = canvas.getContext('2d');
    const layer = document.getElementById('paragon-nodes-layer');
    const pm = window.gameState.paragonManager;

    // Filter nodes for current board
    const currentBoardId = pm.currentBoardId || 1;
    const activeNodes = pm.nodes.filter(n => (n.board || 1) === currentBoardId);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layer.innerHTML = '';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Grid System Logic
    // Procedural 15x15 Checkerboard
    // No margins, full canvas usage.
    const GRID_DIMENSION = 15;
    const TILE_SIZE = BOARD_SIZE / GRID_DIMENSION;

    // Reset centering logic
    if (!container.dataset.centered) {
        container.dataset.centered = "true";
    }

    const pointsDisplay = document.getElementById('paragon-points-val');
    if (pointsDisplay) pointsDisplay.textContent = pm.points;

    // Helper: Get pixel center of a grid coordinate
    // (0,0) is the exact center of the board.
    const getGridPixel = (gx, gy) => {
        return {
            x: centerX + (gx * TILE_SIZE),
            y: centerY + (gy * TILE_SIZE)
        };
    };

    // Draw Connections
    ctx.strokeStyle = '#666'; // Slightly lighter for visibility over dark grid
    ctx.lineWidth = 3;

    activeNodes.forEach(node => {
        if (node.req) {
            node.req.forEach(reqId => {
                const reqNode = pm.nodes.find(n => n.id === reqId);
                // Safety check if reqNode exists
                if (reqNode) {
                    // Backwards Compatibility:
                    const nGx = node.gx !== undefined ? node.gx : 0;
                    const nGy = node.gy !== undefined ? node.gy : 0;
                    const rGx = reqNode.gx !== undefined ? reqNode.gx : 0;
                    const rGy = reqNode.gy !== undefined ? reqNode.gy : 0;

                    const isUnlocked = pm.unlockedNodes.includes(node.id) && pm.unlockedNodes.includes(reqNode.id);
                    ctx.beginPath();
                    // Highlight connection if both nodes unlocked
                    ctx.strokeStyle = isUnlocked ? '#cfb53b' : '#444';

                    const p1 = getGridPixel(nGx, nGy);
                    const p2 = getGridPixel(rGx, rGy);

                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        }
    });

    // Draw Nodes
    // Icon Mapper Helper
    const getIconPath = (node) => {
        if (node.icon && (node.icon.includes('/') || node.icon.includes('.'))) return node.icon;
        const val = node.val || {};
        const prefix = 'assets/icons/paragon/';

        if (node.id === 0) return prefix + 'icon_start.png';
        if (val.clickDamage) return prefix + 'icon_click.png';
        if (val.critDamage) return prefix + 'icon_crit_dmg.png';
        if (val.bossDamage) return prefix + 'icon_boss.png';
        if (val.gold) return prefix + 'icon_gold.png';
        if (val.magicFind) return prefix + 'icon_magic_find.png';
        if (val.damage) {
            if (node.desc && node.desc.includes('Speed')) return prefix + 'icon_attack_speed.png';
            return prefix + 'icon_global_dmg.png';
        }
        if (val.cinderGain) return prefix + 'icon_cinders.png';
        if (val.heroDamage) return prefix + 'icon_minion_dmg.png';
        if (val.critChance) return prefix + 'icon_crit_chance.png';
        if (val.doubleDamage) return prefix + 'icon_double_dmg.png';
        return prefix + 'icon_start.png';
    };

    activeNodes.forEach(node => {
        const el = document.createElement('div');
        el.className = 'paragon-node';

        const nGx = node.gx !== undefined ? node.gx : 0;
        const nGy = node.gy !== undefined ? node.gy : 0;
        const pos = getGridPixel(nGx, nGy);

        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';

        // Size: Fit comfortably within tile (e.g. 80%)
        const nodeSize = TILE_SIZE * 0.8;
        el.style.width = nodeSize + 'px';
        el.style.height = nodeSize + 'px';
        // el.style.fontSize = (nodeSize * 0.5) + 'px'; // Removed

        // Add Image Icon
        const img = document.createElement('img');
        img.src = getIconPath(node);
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '4px';
        img.style.objectFit = 'cover';

        const unlocked = pm.unlockedNodes.includes(node.id);
        const hasReq = node.req && node.req.some(r => pm.unlockedNodes.includes(r));
        const canAfford = pm.points >= node.cost;

        const purchasable = !unlocked && hasReq && canAfford;
        const visibleButExpensive = !unlocked && hasReq && !canAfford;

        const isSelected = (window.selectedParagonNodeId === node.id);

        if (!unlocked) {
            if (purchasable) {
                // Available to buy: Handled by CSS .purchasable
                img.style.filter = 'grayscale(100%) brightness(80%)'; // Keep icon dimmed until bought
            } else if (visibleButExpensive) {
                // Path open, but too expensive: Red Border hint
                img.style.filter = 'grayscale(100%) brightness(60%)';
                el.style.border = '1px solid #ff4400';
            } else {
                // Hard Locked (No Path)
                img.style.filter = 'grayscale(100%) brightness(30%)';
                el.style.opacity = '0.5';
            }
        } else {
            // Unlocked: Full color
            img.style.filter = 'none';
        }

        // Selection Visual
        if (isSelected) {
            // Strong Highlight
            el.style.boxShadow = '0 0 15px #00ffff, inset 0 0 10px #00ffff';
            el.style.border = '2px solid #00ffff';
            el.style.zIndex = '50'; // Bring to front
            img.style.filter = 'none'; // Show full color if selected to preview? Or keep it dimmed? Keep it dimmed to show unlocked state accurately.
        }

        el.appendChild(img);


        if (unlocked) el.classList.add('unlocked');
        if (purchasable) el.classList.add('purchasable');
        if (node.type === 'start') el.classList.add('start');
        if (node.type === 'major') el.classList.add('major');

        // Removed default title to use Custom Tooltip
        // el.title = `${node.name}\n${node.desc}\nCost: ${node.cost} Points`;

        el.onclick = (e) => {
            e.stopPropagation(); // Prevent modal or other clicks

            // 1. If Unlocked: Just show tooltip (Info mode)
            // 2. If Locked but NOT Purchasable: Just show tooltip
            // 3. If Purchasable:
            //    - First Click: Select + Tooltip
            //    - Second Click (same node): Buy + Deselect

            if (!purchasable) {
                // Gate Logic: Click to travel if unlocked
                if (node.type === 'gate' && unlocked) {
                    pm.switchBoard(node.targetBoard);
                    // Ensure UI updates
                    if (typeof renderParagonBoard === 'function') renderParagonBoard();
                    return;
                }

                // Just viewing info
                if (window.selectedParagonNodeId !== node.id) {
                    window.selectedParagonNodeId = node.id;
                    renderParagonBoard(); // Refresh for selection border
                    showParagonTooltip(node, e);
                } else {
                    // Clicking again on info node: Toggle off? Or just keep showing?
                    // Let's toggle off for cleanliness
                    window.selectedParagonNodeId = null;
                    renderParagonBoard();
                    window.hideTooltip();
                }
                return;
            }

            // It IS Purchasable
            if (window.selectedParagonNodeId !== node.id) {
                // First Click: Select
                window.selectedParagonNodeId = node.id;
                renderParagonBoard(); // Refresh visual
                showParagonTooltip(node, e, true); // true = show "Click again to buy"
            } else {
                // Second Click: Buy!
                if (pm.unlockNode(node.id)) {
                    // Success
                    window.selectedParagonNodeId = null; // Clear selection
                    window.hideTooltip();
                    renderParagonBoard();
                    window.gameState.recalculateStats();
                    updateUI();
                }
            }
        };

        layer.appendChild(el);
    });
}

window.renderParagonBoard = renderParagonBoard;

// Helper to show custom tooltip for Paragon Nodes
function showParagonTooltip(node, e, canBuy = false) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    // Localization Logic
    const nameKey = `paragon.node.${node.name.toLowerCase().replace(/ /g, '_')}`;
    let locName = window.t(nameKey);
    // Fallback
    if (locName === nameKey) locName = node.name;

    // Description
    let locDesc = node.desc;
    if (node.id === 0) {
        locDesc = window.t('paragon.desc.awakening');
    } else if (node.val) {
        // Construct description from stats
        const parts = [];
        Object.entries(node.val).forEach(([key, val]) => {
            // key is stat ID (e.g. clickDamage)
            // val is number (e.g. 5)
            // We assume it's %, except maybe some flats? But currently Paragon seems all %?
            // Wait, doubleDamage is 0.5%.
            // Stats keys in translations.js: 'stat.clickDamage' etc.

            // Format: "+5% Click Damage"
            // We need to know if it's flat or percent. Paragon.js desc says "+5% Click Dmg".
            // Some imply flat? "Titan Grip: +100% Click Dmg".
            // I'll assume % for consistency with Paragon.js descriptions.

            const statName = window.t(`stat.${key}`);
            parts.push(`+${val}% ${statName}`);
        });
        if (parts.length > 0) {
            locDesc = parts.join('<br>');
        }
    }

    const lblCost = window.t('lbl.cost');
    const lblPoints = window.t('lbl.points');
    const lblTap = window.t('lbl.tap_unlock');

    let html = `
    <div class="tt-header" style="color:#cfb53b; border-bottom:1px solid #555; padding-bottom:3px; margin-bottom:3px;">${locName}</div>
    <div style="color:#ccc; font-size:0.9em; margin-bottom:5px;">${locDesc}</div>
    <div style="font-size:0.85em; color:#aaa;">${lblCost}: <span style="color:#fff">${node.cost}</span> ${lblPoints}</div>
`;

    if (canBuy) {
        html += `<div style="margin-top:8px; color:#00ff00; font-weight:bold; font-size:0.9em; text-align:center; animation: pulse 1s infinite;">${lblTap}</div>`;
    }

    tooltip.innerHTML = html;
    tooltip.style.display = 'block';

    // Position near the element, but fixed to screen so it doesn't get lost in canvas scroll?
    // The event (e) gives valid clientX/Y.
    // Let's use a smarter positioning logic similar to moveTooltip but static for this tap.

    const x = e.clientX;
    const y = e.clientY;

    // Offset slightly so finger doesn't cover it
    let top = y - 100;
    let left = x - 100;

    // Clamp to screen
    if (top < 10) top = 10;
    if (left < 10) left = 10;

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// Global click to deselect if clicking empty space
document.addEventListener('click', (e) => {
    // If we clicked outside a paragon node, but inside the modal...
    if (window.selectedParagonNodeId !== null) {
        if (!e.target.closest('.paragon-node')) {
            window.selectedParagonNodeId = null;
            renderParagonBoard(); // Clear selection visual
            window.hideTooltip();
        }
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
    // Delay slightly to ensure GameState loaded? 
    // Init loads save.
    setTimeout(() => {
        if (window.initAutoSalvageUI) window.initAutoSalvageUI();
    }, 500);
}

// Global function to be accessible
window.salvageAll = function (rarityId) {
    if (!window.gameState) return;
    const inv = window.gameState.inventory;
    // Filter items match rarity
    const toSalvage = inv.filter(i => i.rarity.id === rarityId);

    if (toSalvage.length === 0) {
        window.gameState.addToLog("No items of that rarity.");
        return;
    }

    if (!confirm(`Salvage ${toSalvage.length} items?`)) return;

    let totalMats = 0;
    const kept = [];

    inv.forEach(item => {
        if (item.rarity.id === rarityId) {
            let mat = 1;
            if (item.rarity.id === 'magic') mat = 2;
            if (item.rarity.id === 'rare') mat = 5;
            if (item.rarity.id === 'epic') mat = 10;
            if (item.rarity.id === 'legendary') mat = 25;
            if (item.rarity.id === 'unique') mat = 100;

            mat += (item.upgradeLevel * 2);
            totalMats += mat;
        } else {
            kept.push(item);
        }
    });

    window.gameState.inventory = kept;
    window.gameState.materials += totalMats;
    window.gameState.addToLog(`Salvaged ${toSalvage.length} items for <span style="color:#aaa">${totalMats} Mats</span>`);

    renderInventory();
    window.gameState.recalculateStats();
    window.gameState.recalculateStats();
};

window.toggleAutoSalvage = function (rarity, isChecked) {
    if (window.gameState && window.gameState.autoSalvage) {
        window.gameState.autoSalvage[rarity] = isChecked;
        // Persist immediately
        const success = new window.SaveManager().save(window.gameState);
        if (success) console.log("Auto-Salvage setting saved.");
    }
};

// Hook into init to set checkboxes? 
// Ideally we do this in updateUI or a specific initUI function.
// Let's add it to the end of main.js init block or expose a function.
window.initAutoSalvageUI = function () {
    if (!window.gameState || !window.gameState.autoSalvage) return;
    if (document.getElementById('auto-normal')) document.getElementById('auto-normal').checked = window.gameState.autoSalvage.normal;
    if (document.getElementById('auto-magic')) document.getElementById('auto-magic').checked = window.gameState.autoSalvage.magic;
    if (document.getElementById('auto-rare')) document.getElementById('auto-rare').checked = window.gameState.autoSalvage.rare;
    if (document.getElementById('auto-epic')) document.getElementById('auto-epic').checked = window.gameState.autoSalvage.epic;
};

setInterval(() => {
    // Periodic UI Sync for Auto Salvage (lazy init)
    // Better to call it once on load.
}, 1000);

window.tryUpgradeItem = function (e, itemOrId) {
    if (e) e.stopPropagation();

    let item = itemOrId;
    if (typeof itemOrId === 'string') {
        item = window.gameState.inventory.find(i => i.id === itemOrId);
        if (!item) {
            item = Object.values(window.gameState.equipment).find(i => i && i.id === itemOrId);
        }
    }

    if (!item) {
        console.error("Upgrade: Item not found", itemOrId);
        return;
    }

    if (item.upgradeLevel >= item.maxUpgrades) {
        window.gameState.addToLog(`<span style="color:orange">Item already Max Level!</span>`);
        return;
    }

    // Cost: 10 * 1.5^level
    const cost = Math.floor(10 * Math.pow(1.5, item.upgradeLevel || 0));

    // Resource: Materials (Arcane Dust)
    if (window.gameState.materials >= cost) {
        window.gameState.materials -= cost;

        if (item.upgrade()) {
            window.gameState.recalculateStats();
            window.updateUI();

            // If we are looking at a specific tooltip, hide it to refresh or manual refresh?
            // Hiding is safer to avoid stale data
            window.hideTooltip();

            window.gameState.addToLog(`<span style="color:#00ff00">Upgraded ${item.name} to +${item.upgradeLevel}!</span>`);
        }
    } else {
        window.gameState.addToLog(`<span style="color:red">Not enough Dust! Need ${cost}</span>`);
    }
};

window.tryReforgeItem = function (e, itemOrId) {
    if (e) e.stopPropagation();

    let item = itemOrId;
    // If string, find it (Legacy fallback)
    if (typeof itemOrId === 'string') {
        item = window.gameState.inventory.find(i => i.id === itemOrId);
        if (!item) {
            item = Object.values(window.gameState.equipment).find(i => i && i.id === itemOrId);
        }
    }

    if (!item) {
        console.error("Reforge: Item not found", itemOrId);
        return;
    }

    const cost = 5;
    if (window.gameState.bossEssence >= cost) {
        if (item.stage >= window.gameState.stage) {
            window.gameState.addToLog(`<span style="color:orange">Item is already at (or above) current level.</span>`);
            return;
        }

        window.gameState.bossEssence -= cost;
        item.reforge(window.gameState.stage);
        window.gameState.recalculateStats();
        window.updateUI();
        window.hideTooltip();
        window.gameState.addToLog(`<span style="color:#cfb53b">Reforged ${item.name} to Level ${item.stage}!</span>`);
    } else {
        window.gameState.addToLog(`<span style="color:red">Not enough Boss Essence! (Need 5)</span>`);
    }
};

// Achievement UI Logic
window.openAchievementModal = function () {
    const modal = document.getElementById('achievement-modal');
    if (modal) {
        modal.style.display = 'block';
        if (window.renderAchievements) window.renderAchievements();

        // Close menu if open
        const menu = document.getElementById('menu-modal');
        if (menu) menu.style.display = 'none';

        // Also close System Menu modal if open (the one with the button)
        // Wait, menu-modal IS that menu.
    }
};

// Global function for button click
window.claimAchievement = function (id) {
    const mgr = window.gameState.achievementManager;
    if (mgr.claimAchievement(id)) {
        window.renderAchievements();
        // Maybe play sound or effect
    }
};

window.renderAchievements = function () {
    const list = document.getElementById('achievement-list');
    if (!list) return;

    list.innerHTML = '';

    const mgr = window.gameState.achievementManager;
    if (!mgr) return;

    // Check for updates first to ensure accurate state
    mgr.checkAchievements();

    const defs = mgr.getDefinitions();

    // Group by Category
    const categories = {};
    defs.forEach(ach => {
        const cat = ach.category || 'General';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(ach);
    });

    // Render Sections
    // Sort Categories Order: specific order
    const catOrder = [
        'Wealth: Gold',
        'Wealth: Cinders',
        'Combat: Power',
        'Combat: Clicks',
        'Combat: Bosses',
        'Progression: Stages',
        'Heroes',
        'Collection'
    ];

    const sortedCats = Object.keys(categories).sort((a, b) => {
        const idxA = catOrder.indexOf(a);
        const idxB = catOrder.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });

    sortedCats.forEach(catName => {
        // Section Header
        const header = document.createElement('h3');
        // Localize Category: "Wealth: Gold" -> "achievement.category.wealth_gold"
        const catKey = `achievement.category.${catName.toLowerCase().replace(/[: ]/g, '_').replace(/_+/g, '_')}`; // wealth_gold
        let locCat = window.t(catKey);
        if (locCat === catKey) locCat = catName; // Fallback

        header.textContent = locCat;
        header.style.cssText = "width: 100%; border-bottom: 1px solid #444; margin: 20px 0 10px 0; color: #cfb53b; padding-bottom: 5px; font-family: var(--font-heading);";
        list.appendChild(header);

        // Grid Container
        const grid = document.createElement('div');
        grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 8px;
    `;

        categories[catName].forEach(ach => {
            const isUnlocked = mgr.unlockedIds.has(ach.id); // Condition Met
            const isClaimed = mgr.claimedIds.has(ach.id);   // Rewarded

            // Localization
            const name = window.t(`achievement.name.${ach.id}`);
            const desc = window.t(`achievement.desc.${ach.id}`);

            // Dynamic Reward Text
            let rewardVal = ach.reward.value;
            // Handle decimal vs integer percentages
            // (gold, cinders, damage, bossDamage, heroDamage are decimal e.g. 0.1 for 10%)
            // (others are integer e.g. 10 for 10%)
            if (['gold', 'cinders', 'damage', 'bossDamage', 'heroDamage'].includes(ach.reward.type)) {
                rewardVal = Math.round(rewardVal * 100);
            }

            // Map reward type to stat translation key
            let statKey = `stat.${ach.reward.type}`;
            if (ach.reward.type === 'cinders') statKey = 'stat.cinderGain';
            // Note: 'stat.gold' is "Gold Find", 'stat.damage' is "Global Damage" -> Correct.

            const rewardText = `+${rewardVal}% ${window.t(statKey)}`;

            const el = document.createElement('div');
            el.className = 'achievement-card-grid';

            // Inline Styles for Grid Card
            // Base style
            let bg = '#151515';
            let border = '#333';
            let opacity = '0.5';
            let boxShadow = 'none';

            if (isClaimed) {
                bg = '#222';
                border = '#cfb53b';
                opacity = '1';
                boxShadow = '0 0 5px rgba(207, 181, 59, 0.2)';
            } else if (isUnlocked) {
                // Ready to claim
                bg = '#2a2a20'; // Slight Gold tint
                border = '#00ff00'; // Green border for action
                opacity = '1';
                boxShadow = '0 0 10px rgba(0, 255, 0, 0.2)';
            }

            el.style.cssText = `
            background: ${bg};
            border: 1px solid ${border};
            border-radius: 4px;
            padding: 8px;
            opacity: ${opacity};
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 90px;
            position: relative;
            transition: transform 0.2s, box-shadow 0.2s;
            overflow: hidden;
            box-shadow: ${boxShadow};
        `;

            // Hover
            el.onmouseenter = () => { if (isClaimed || isUnlocked) el.style.transform = 'translateY(-2px)'; };
            el.onmouseleave = () => { el.style.transform = 'none'; };

            // Icon & Text Logic
            let icon = '🔒';
            let titleColor = '#888';
            let rewardSection = '';

            if (isClaimed) {
                icon = '🏆';
                titleColor = '#fff';
                rewardSection = `
                <div style="color: #00ff00; font-weight: bold; font-size: 0.7rem;">
                    ${rewardText}
                </div>
            `;
            } else if (isUnlocked) {
                // READY TO CLAIM
                icon = '✨';
                titleColor = '#fff';
                rewardSection = `
                <button onclick="window.claimAchievement('${ach.id}')" style="
                    background: linear-gradient(to bottom, #4CAF50, #2E7D32);
                    color: white;
                    border: 1px solid #fff;
                    border-radius: 4px;
                    padding: 2px 6px;
                    cursor: pointer;
                    width: 100%;
                    font-weight: bold;
                    font-size: 0.7rem;
                    animation: pulse 1s infinite alternate;
                ">
                    ${window.t('lbl.claim_reward')}<br>
                    <span style="font-size:0.65rem; font-weight:normal">${rewardText}</span>
                </button>
                <style>@keyframes pulse { from { box-shadow: 0 0 2px #00ff00; } to { box-shadow: 0 0 8px #00ff00; } }</style>
            `;
            } else {
                // Locked
                rewardSection = `
                <div style="color: #555; font-size: 0.65rem;">
                    ${rewardText}
                </div>
            `;
            }

            el.innerHTML = `
            <div style="display:flex; align-items:flex-start; margin-bottom: 4px;">
                <div style="font-size:1.1rem; margin-right: 6px;">${icon}</div>
                <div>
                    <div style="font-weight:bold; color:${titleColor}; font-size:0.8rem; line-height:1.1;">${name}</div>
                    <div style="font-size:0.65rem; color:#888; margin-top:1px; line-height: 1;">${desc}</div>
                </div>
            </div>
            <div style="
                margin-top: auto; 
                padding-top: 6px; 
                border-top: 1px dashed #333; 
                text-align: right; 
            ">
                ${rewardSection}
            </div>
        `;
            grid.appendChild(el);
        });

        list.appendChild(grid);
    });
};

// Event Listeners for Achievement Modal
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-achievement');
    if (closeBtn) {
        closeBtn.onclick = function () {
            document.getElementById('achievement-modal').style.display = 'none';
        };
    }

    // Close on click outside (Generic for all modals)
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Make sure menu button works even if re-rendered
    const btnAch = document.getElementById('btn-achievements');
    if (btnAch) {
        btnAch.onclick = window.openAchievementModal;
    }
});

// --- Skill System Logic ---

window.openSkillModal = function () {
    const modal = document.getElementById('skill-modal');
    // Prepare initial state: Hide content to avoid "gray flash" / jump
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.opacity = '0';
        content.style.transition = 'none'; // Disable transition for initial setup
    }

    modal.style.display = 'block';
    // Hide Menu Modal if open
    document.getElementById('menu-modal').style.display = 'none';

    renderSkillHeroes();
    renderModalActiveSkills(); // Show Active Loadout
    // Default Select Mage
    selectSkillHero('mage', 'Mage', 'assets/heroes/mage.png');
};

window.renderSkillHeroes = function () {
    const list = document.getElementById('skill-hero-list');
    list.innerHTML = '';

    // Update Points
    document.getElementById('skill-points-val').textContent = window.gameState.skillManager.getSkillPoints();

    // Classes
    const heroes = [
        { id: 'mage', name: 'Mage', icon: 'assets/heroes/mage.png' },
        { id: 'rogue', name: 'Rogue', icon: 'assets/heroes/rogue.png' },
        { id: 'paladin', name: 'Paladin', icon: 'assets/heroes/paladin.png' },
        { id: 'barbarian', name: 'Barbarian', icon: 'assets/heroes/barbarian.png' },
        { id: 'necro', name: 'Necromancer', icon: 'assets/heroes/necro.png' },
        { id: 'amazon', name: 'Amazon', icon: 'assets/heroes/amazon.png' },
        { id: 'druid', name: 'Druid', icon: 'assets/heroes/druid.png' }
    ];

    heroes.forEach(h => {
        // Correct key for SkillData
        let dataId = h.id;
        if (h.id === 'necro') dataId = 'necromancer'; // Fix mapping if needed

        const localizedName = window.t(`unit.name.${h.id}`); // Re-using unit names which match classes

        const card = document.createElement('div');
        card.className = 'hero-select-card';
        card.onclick = () => selectSkillHero(dataId, localizedName, h.icon);

        card.innerHTML = `
        <div class="hero-select-icon"><img src="${h.icon}" alt="${localizedName}"></div>
        <div class="hero-select-name">${localizedName}</div>
    `;
        list.appendChild(card);
    });
};

window.selectSkillHero = function (heroId, heroName, heroIcon) {
    document.getElementById('selected-hero-name').textContent = heroName;

    // Highlight selection
    const list = document.getElementById('skill-hero-list');
    Array.from(list.children).forEach(c => {
        if (c.innerText.includes(heroName)) c.classList.add('selected');
        else c.classList.remove('selected');
    });

    // Update Background on Modal Content (covering header/body)
    const modalContent = document.querySelector('#skill-modal .modal-content');
    const modalHeader = document.querySelector('#skill-modal .modal-header');
    const modalBody = document.querySelector('#skill-modal .modal-body');

    if (modalContent && heroIcon) {
        // Apply to main container
        modalContent.style.background = `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('${heroIcon}') no-repeat center center`;
        modalContent.style.backgroundSize = 'cover';

        // Make children transparent
        if (modalHeader) {
            modalHeader.style.background = 'transparent';
            modalHeader.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
        if (modalBody) {
            modalBody.style.background = 'transparent';
        }

        // Adjust dimensions to fit image aspect ratio
        const img = new Image();
        img.src = heroIcon;
        img.onload = function () {
            const aspect = img.width / img.height;
            // Base max dimensions from viewport (90vw / 90vh)
            const maxW = window.innerWidth * 0.9;
            const maxH = window.innerHeight * 0.9;

            let newW = maxW;
            let newH = maxW / aspect;

            if (newH > maxH) {
                newH = maxH;
                newW = maxH * aspect;
            }

            // Enforce minimums for usability
            if (newW < 800) newW = 800;
            if (newH < 600) newH = 600;

            modalContent.style.width = `${newW}px`;
            modalContent.style.height = `${newH}px`;
            // Reset standard styles that might interfere
            modalContent.style.maxWidth = 'none';

            // Reveal content (fixes "gray flash" on open)
            setTimeout(() => {
                modalContent.style.opacity = '1';
                // RE-ENABLE transitions after initial snap
                modalContent.style.transition = 'background 0.3s ease-in-out, width 0.3s ease, height 0.3s ease';
            }, 50);
        };
    }

    renderHeroSkills(heroId);
};


window.renderHeroSkills = function (heroId) {
    const container = document.getElementById('skill-list');
    container.innerHTML = '';

    const skills = window.SkillData[heroId];
    if (!skills) {
        container.innerHTML = '<div style="color:#aaa;">No skills found.</div>';
        return;
    }

    const sm = window.gameState.skillManager;

    skills.forEach(skill => {
        const isOwned = sm.hasSkill(skill.id);
        const isEquipped = sm.isEquipped(skill.id);
        let cardClass = 'skill-card' + (isOwned ? ' owned' : '');
        if (isEquipped) cardClass += ' equipped';

        const card = document.createElement('div');
        card.className = cardClass;

        // Localization
        const locName = window.t(`skill.name.${skill.id}`);
        const dispName = (locName !== `skill.name.${skill.id}`) ? locName : skill.name;

        // Use centralized description logic
        const dispDesc = sm.getSkillDescription(skill.id);

        const lblBuy = window.t('btn.buy');
        const lblEquip = window.t('btn.equip');
        const lblUnequip = window.t('btn.unequip');
        const lblSP = window.t('lbl.points_short');

        let btnText = `${lblBuy} (1 ${lblSP})`;
        let btnClass = 'skill-buy-btn';
        let disabled = false;

        if (isOwned) {
            btnText = isEquipped ? lblUnequip.toUpperCase() : lblEquip.toUpperCase();
            btnClass += isEquipped ? ' unequip-btn' : ' equip-btn';
        } else {
            if (sm.getSkillPoints() < 1) disabled = true;
        }

        card.innerHTML = `
        <div class="skill-card-header">
            <div class="skill-card-icon">${skill.icon.includes('/') ? `<img src="${skill.icon}" style="width:100%;height:100%;object-fit:cover;">` : skill.icon}</div>
            <div class="skill-card-name">${dispName}</div>
        </div>
        <div class="skill-card-desc">${dispDesc}</div>
        <button class="${btnClass}" ${disabled ? 'disabled' : ''} 
            onclick="window.tryBuySkill('${skill.id}', '${heroId}')">${btnText}</button>
    `;

        container.appendChild(card);
    });
};

// --- Render Active Skills in Modal ---
window.renderModalActiveSkills = function () {
    const container = document.getElementById('modal-active-skills');
    if (!container) return;

    container.innerHTML = '';
    const sm = window.gameState.skillManager;
    const keys = ['Q', 'W', 'E', 'R'];

    for (let i = 0; i < 4; i++) {
        const skillId = window.gameState.equippedSkills[i];

        const slot = document.createElement('div');
        // Mirroring basic style of active slots but static
        slot.style.cssText = `
        width: 50px; 
        height: 50px; 
        border: 2px solid ${skillId ? '#cfb53b' : '#444'}; 
        background: #222;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    `;

        if (skillId) {
            // Find skill
            let skill = null;
            for (const classKey in window.SkillData) {
                const found = window.SkillData[classKey].find(s => s.id === skillId);
                if (found) {
                    skill = found;
                    break;
                }
            }
            if (skill) {
                const icon = document.createElement('div');
                if (skill.icon.includes('/')) {
                    icon.innerHTML = `<img src="${skill.icon}" style="width:100%;height:100%;object-fit:cover;">`;
                } else {
                    icon.textContent = skill.icon;
                    icon.style.fontSize = "24px";
                }
                icon.style.cssText = "width:100%; height:100%; display:flex; align-items:center; justify-content:center;";
                slot.appendChild(icon);

                // Detailed Tooltip
                const sName = window.t(`skill.name.${skill.id}`);
                const sDesc = sm.getSkillDescription(skill.id);
                slot.title = `${sName} (Equipped)\n${sDesc}`;
            }
        } else {
            slot.innerHTML = `<span style="color:#666; font-size: 0.8rem;">Empty</span>`;
        }

        // Key Label
        const label = document.createElement('div');
        label.textContent = keys[i];
        label.style.cssText = `
        position: absolute;
        bottom: -15px;
        width: 100%;
        text-align: center;
        font-size: 0.8rem;
        color: #aaa;
        font-weight: bold;
    `;
        slot.appendChild(label);

        container.appendChild(slot);
    }
};

window.tryBuySkill = function (skillId, heroId) {
    const sm = window.gameState.skillManager;

    if (sm.hasSkill(skillId)) {
        // Toggle Equip
        sm.toggleEquip(skillId);
        // Refresh UI only
        renderHeroSkills(heroId);
        renderModalActiveSkills(); // Update Modal Loadout
    } else {
        // Try Purchase
        if (sm.purchaseSkill(skillId)) {
            // Refresh UI
            document.getElementById('skill-points-val').textContent = sm.getSkillPoints();
            renderHeroSkills(heroId);
            renderModalActiveSkills(); // Display checks
        }
    }
};

// Key Bindings for Skills
document.addEventListener('keydown', (e) => {
    // Only if game is running and not in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (!window.gameState || !window.gameState.skillManager) return;

    const key = e.key.toUpperCase();
    if (key === 'Q') window.gameState.skillManager.useSkill(0);
    if (key === 'W') window.gameState.skillManager.useSkill(1);
    if (key === 'E') window.gameState.skillManager.useSkill(2);
    if (key === 'R') window.gameState.skillManager.useSkill(3);
});

// Hook up Close Button
document.getElementById('close-skill').onclick = function () {
    document.getElementById('skill-modal').style.display = 'none';
};

// Hook up Menu Button
document.getElementById('btn-skills').onclick = window.openSkillModal;

// Initial Render of Active Skills (Load)
setTimeout(() => {
    if (window.gameState && window.gameState.skillManager) {
        window.gameState.skillManager.renderActiveSkills();
    }
}, 1000);
// --- Audio Control Bindings ---
document.addEventListener('DOMContentLoaded', () => {
    // Volume Slider
    const volSlider = document.getElementById('bgm-volume');
    if (volSlider && window.audioManager) {
        volSlider.value = window.audioManager.volume;
        volSlider.addEventListener('input', (e) => {
            window.audioManager.setVolume(e.target.value);
        });
    }

    // Mute Checkbox
    const muteBox = document.getElementById('bgm-mute');
    if (muteBox && window.audioManager) {
        muteBox.checked = window.audioManager.isMuted;
        muteBox.addEventListener('change', (e) => {
            window.audioManager.toggleMute(e.target.checked);
        });
    }

    // Next Track Button
    const nextBtn = document.getElementById('bgm-next');
    if (nextBtn && window.audioManager) {
        nextBtn.onclick = () => window.audioManager.playNext();
    }

    // Attempt to play music on first click anywhere
    const startMusic = () => {
        if (window.audioManager) {
            window.audioManager.play();
        }
        document.removeEventListener('click', startMusic); // One time try
    };
    document.addEventListener('click', startMusic);
});

// --- Merchant System ---
// --- Merchant System ---
window.switchMerchantTab = (tabName) => {
    // Hide all tab content
    document.querySelectorAll('.merchant-tab').forEach(el => el.style.display = 'none');

    // Update sidebar buttons
    document.querySelectorAll('.merchant-nav-btn').forEach(el => {
        el.classList.remove('active');
        el.style.color = '#aaa';
        el.style.borderLeftColor = 'transparent'; // Remove border
        el.style.background = 'transparent'; // Transparent background
    });

    // Show specific tab
    const tab = document.getElementById(`merchant-tab-${tabName}`);
    if (tab) tab.style.display = 'block';

    // Activate button
    const btn = document.getElementById(`tab-btn-${tabName}`);
    if (btn) {
        btn.classList.add('active');
        btn.style.color = 'var(--accent-gold)';
        // btn.style.borderLeftColor = 'var(--accent-gold)'; // Optional: removed for clean look
        btn.style.background = 'linear-gradient(90deg, rgba(207, 181, 59, 0.2), transparent)';
    }

    // --- Background & Modal Resizing Logic (Copied from selectSkillHero) ---
    const modalContent = document.querySelector('#merchant-modal .modal-content');
    const modalHeader = document.querySelector('#merchant-modal .modal-header');
    const sidebar = document.getElementById('merchant-sidebar');

    let bgImage = "";
    if (tabName === 'alchemist') bgImage = "assets/merchant_alchemist_bg.png";
    else if (tabName === 'gambler') bgImage = "assets/merchant_gambler_bg.png";

    if (modalContent && bgImage) {
        // 1. Apply Background to the WHOLE content container
        // Less darkening (0.7) to see the art better, but enough for text readability
        modalContent.style.background = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('${bgImage}') no-repeat center center`;
        modalContent.style.backgroundSize = 'cover';
        modalContent.style.border = '1px solid var(--accent-gold)';

        // 2. Make inner containers transparent so BG shows through
        if (modalHeader) {
            modalHeader.style.background = 'transparent';
            modalHeader.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
        if (sidebar) {
            sidebar.style.background = 'rgba(0, 0, 0, 0.4)'; // Semi-transparent for readability
            sidebar.style.borderRight = '1px solid rgba(255, 255, 255, 0.1)';
        }

        // Remove the inner BG layer if it exists (cleanup)
        const oldBg = document.getElementById('merchant-bg-layer');
        if (oldBg) oldBg.style.display = 'none';

        // 3. Resize Modal to match Image Aspect Ratio
        const img = new Image();
        img.src = bgImage;
        img.onload = function () {
            const aspect = img.width / img.height;
            // Base max dimensions from viewport
            const maxW = window.innerWidth * 0.90;
            const maxH = window.innerHeight * 0.85;

            let newW = maxW;
            let newH = maxW / aspect;

            if (newH > maxH) {
                newH = maxH;
                newW = maxH * aspect;
            }

            // Enforce minimums to protect UI
            if (newW < 850) newW = 850;
            if (newH < 600) newH = 600; // Increased min-height to ensure sidebar fits

            modalContent.style.width = `${newW}px`;
            modalContent.style.height = `${newH}px`;
            modalContent.style.maxWidth = 'none'; // precise control
            modalContent.style.transition = 'width 0.3s ease, height 0.3s ease';
        };
    }

    // Refresh UI for that tab
    if (tabName === 'alchemist') {
        if (window.updateMerchantUI) window.updateMerchantUI();
    }
    if (tabName === 'gambler') {
        if (window.updateGamblePrices) window.updateGamblePrices();
    }
};

window.updateMerchantUI = () => {
    if (!window.gameState || !window.gameState.merchantManager) return;

    // Update Resource Display in Header
    const goldDisp = document.getElementById('merchant-gold-display');
    const dustDisp = document.getElementById('merchant-dust-display');
    const cindersDisp = document.getElementById('merchant-cinders-display');

    // We assume these elements exist if the modal is open, but check safely
    if (window.gameState) {
        if (goldDisp) goldDisp.textContent = window.formatNumber(window.gameState.gold);
        if (dustDisp) dustDisp.textContent = window.formatNumber(window.gameState.materials);
        if (cindersDisp) cindersDisp.textContent = window.formatNumber(window.gameState.cinders);
    }

    // Update Rates
    const mm = window.gameState.merchantManager;
    const dustToGold = mm.getDustToGoldRate();
    const dustToCinders = mm.getDustToCindersRate();

    const elGold = document.getElementById('rate-dust-gold');
    if (elGold) elGold.textContent = window.formatNumber(dustToGold);

    // Cinders: "10 Dust = X Cinders" -> Rate is X per 1 Dust * 10? 
    // MerchantManager says rate is per 1 Dust.
    // UI says "10 Dust = ...". So 10 * Rate.
    const elCinders = document.getElementById('rate-dust-cinders');
    if (elCinders) elCinders.textContent = window.formatNumber(dustToCinders * 10);
};

window.merchantConvert = (from, to, amount) => {
    if (!window.gameState.merchantManager) return;

    // Handle 'max'
    let val = amount;
    if (amount === 'max') {
        if (from === 'dust') val = window.gameState.materials;
    }

    let result = 0;
    let msg = "";

    if (from === 'dust' && to === 'gold') {
        result = window.gameState.merchantManager.convertDustToGold(val);
        msg = `Converted ${val} Dust to ${window.formatNumber(result)} Gold.`;
    } else if (from === 'dust' && to === 'cinders') {
        result = window.gameState.merchantManager.convertDustToCinders(val);
        msg = `Converted ${val} Dust to ${window.formatNumber(result)} Cinders.`;
    }

    const statEl = document.getElementById('merchant-status');
    if (result > 0) {
        if (statEl) {
            statEl.textContent = msg;
            statEl.style.color = '#00ff00';
        }
        if (window.updateUI) window.updateUI(); // Refresh top bar
        if (window.updateMerchantUI) window.updateMerchantUI();
    } else {
        if (statEl) {
            statEl.textContent = "Conversion failed (Not enough resources).";
            statEl.style.color = '#ff0000';
        }
    }
};

window.updateGamblePrices = () => {
    if (!window.gameState.merchantManager) return;
    const curEl = document.getElementById('gamble-currency');
    if (!curEl) return;
    const cur = curEl.value;

    document.querySelectorAll('.gamble-item').forEach(itemEl => {
        const slot = itemEl.getAttribute('data-slot') || 'random'; // Default to random if missing
        const costStr = window.gameState.merchantManager.getGambleCost(cur, slot);

        const costEl = itemEl.querySelector('.cost');
        if (costEl) {
            costEl.textContent = `${window.formatNumber(costStr)} ${cur === 'dust' ? 'Dust' : 'Gold'}`;
            costEl.style.color = (cur === 'dust' && window.gameState.materials >= costStr) || (cur === 'gold' && window.gameState.gold >= costStr) ? '#fff' : '#ff4444';
        }
    });
};

window.merchantGamble = (slot) => {
    if (!window.gameState.merchantManager) return;
    const curEl = document.getElementById('gamble-currency');
    if (!curEl) return;
    const cur = curEl.value;

    // Pass Slot to gamble function for correct cost deduction
    const result = window.gameState.merchantManager.gambleItem(slot, cur);
    const statEl = document.getElementById('merchant-status');

    if (!result) {
        if (statEl) {
            statEl.textContent = "Cannot afford this item.";
            statEl.style.color = '#ff0000';
        }
        return;
    }

    if (window.updateUI) window.updateUI();
    if (window.updateMerchantUI) window.updateMerchantUI(); // Update local resource display
    window.updateGamblePrices(); // Check affordability again

    if (result.salvaged) {
        const name = result.item ? result.item.name : 'Item';
        if (statEl) {
            statEl.innerHTML = `Gambled <span style="color:${result.item.rarity.color}">${name}</span>... Inventory Full! Auto-Salvaged for ${result.mats} Dust.`;
            statEl.style.color = '#aaa';
        }
    } else {
        // Success
        if (statEl) {
            statEl.innerHTML = `Gambled <span style="color:${result.rarity.color}">${result.name}</span>!`;
            statEl.style.color = '#00ff00';
        }
    }
};

// Initialize Merchant Button and Modal
document.addEventListener('DOMContentLoaded', () => {
    const btnMerchant = document.getElementById('btn-merchant');
    const merchantModal = document.getElementById('merchant-modal');
    const closeMerchant = document.getElementById('close-merchant');

    if (btnMerchant) {
        btnMerchant.onclick = () => {
            merchantModal.style.display = 'block';
            if (document.getElementById('menu-modal')) document.getElementById('menu-modal').style.display = 'none'; // Close menu
            window.updateMerchantUI();
            window.switchMerchantTab('alchemist'); // Default tab
        };
    }

    if (closeMerchant) {
        closeMerchant.onclick = () => {
            merchantModal.style.display = 'none';
        };
    }
});


// Wrapper primarily to ensure DOM is ready
init();

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registered:', reg))
            .catch(err => console.log('SW registration failed:', err));
    });
}

// Mobile Tab Switching Logic
window.switchMobileTab = function (tabName) {
    // 1. Update Navigation Buttons
    const navs = document.querySelectorAll('.nav-btn');
    // sanctum=0, combat=1, armory=2 (matches HTML order)
    navs.forEach(btn => btn.classList.remove('active'));

    if (tabName === 'sanctum' && navs[0]) navs[0].classList.add('active');
    if (tabName === 'combat' && navs[1]) navs[1].classList.add('active');
    if (tabName === 'armory' && navs[2]) navs[2].classList.add('active');

    // 2. Update Panel Visibility
    const pLeft = document.getElementById('panel-left');
    const pCenter = document.getElementById('panel-center');
    const pRight = document.getElementById('panel-right');

    const isMobile = window.innerWidth <= 850;
    if (!isMobile) return; // Don't hide panels on desktop if function called accidentally

    // Hide all
    if (pLeft) pLeft.style.display = 'none';
    if (pCenter) pCenter.style.display = 'none';
    if (pRight) pRight.style.display = 'none';

    // Show selected
    if (tabName === 'sanctum' && pLeft) pLeft.style.display = 'flex';
    if (tabName === 'combat' && pCenter) pCenter.style.display = 'flex';
    if (tabName === 'armory' && pRight) pRight.style.display = 'flex';
};

// Force Combat Tab on Mobile Load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on mobile (using same breakpoint as switchMobileTab: 850px)
    if (window.innerWidth <= 850) {
        window.switchMobileTab('combat');
    }
});

function moveTooltipQuadrants(e) {
    const gap = 15;
    const winWidth = document.documentElement.clientWidth;
    const winHeight = document.documentElement.clientHeight;

    // Ensure tooltip has width for calculation references if needed, 
    // but quadrant logic relies mostly on cursor position.

    let isTouch = false;
    let clientX, clientY;

    // Check Global Touch Tracker (Key Fix for "Competing Logic")
    // If a touch occurred recently (<1000ms), assume ALL events (including emulated mouse) are touch-related
    if (window.lastTouchTime && (Date.now() - window.lastTouchTime < 1000)) {
        isTouch = true;
    }

    if (e.touches && e.touches.length > 0) {
        isTouch = true;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    // Quadrant Logic
    const isRightHalf = clientX > winWidth / 2;
    const isBottomHalf = clientY > winHeight / 2;

    // Horizontal Anchor
    if (isRightHalf) {
        // Right side -> Grow LEFT
        tooltipEl.style.left = 'auto';
        tooltipEl.style.right = (winWidth - clientX + gap) + 'px';
    } else {
        // Left side -> Grow RIGHT
        tooltipEl.style.right = 'auto';
        tooltipEl.style.left = (clientX + gap) + 'px';
    }

    // Vertical Anchor
    if (isTouch) {
        // Mobile: Prefer ABOVE
        const touchGap = 40;
        if (clientY < 150) { // Top edge exception
            tooltipEl.style.bottom = 'auto';
            tooltipEl.style.top = (clientY + touchGap) + 'px';
        } else {
            tooltipEl.style.top = 'auto';
            tooltipEl.style.bottom = (winHeight - clientY + touchGap) + 'px';
        }
    } else {
        // Desktop: Prefer BELOW
        if (isBottomHalf) { // Bottom edge exception
            tooltipEl.style.top = 'auto';
            tooltipEl.style.bottom = (winHeight - clientY + gap) + 'px';
        } else {
            tooltipEl.style.bottom = 'auto';
            tooltipEl.style.top = (clientY + gap) + 'px';
        }
    }

    // --- Strict Clamping (Fix for "Partial Visibility") ---
    // We must ensure the tooltip didn't flow off-screen despite our best efforts.
    const rect = tooltipEl.getBoundingClientRect();

    // Horizontal Clamp
    if (rect.left < 5) {
        tooltipEl.style.right = 'auto';
        tooltipEl.style.left = '5px';
    } else if (rect.right > winWidth - 5) {
        tooltipEl.style.left = 'auto';
        tooltipEl.style.right = '5px';
    }

    // Vertical Clamp
    if (rect.top < 5) {
        tooltipEl.style.bottom = 'auto';
        tooltipEl.style.top = '5px';
    } else if (rect.bottom > winHeight - 5) {
        tooltipEl.style.top = 'auto';
        tooltipEl.style.bottom = '5px';
    }
}


// Global Scroll Listener to hide tooltips (Usability Fix)
window.addEventListener('scroll', function () {
    const tooltip = document.getElementById('tooltip');
    if (tooltip && tooltip.style.display === 'block') {
        tooltip.style.display = 'none';
    }
}, { passive: true, capture: true }); // Capture phase to detect scroll in sub-elements

