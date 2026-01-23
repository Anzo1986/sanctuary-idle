
// --- Reincarnation UI Logic (Event Delegation) ---

function initReincarnationUI() {
    console.log("Reincarnation UI Initialized");

    // Bind Reincarnate Button
    const btn = document.getElementById('btn-reincarnate');
    if (btn) {
        btn.onclick = () => {
            if (window.gameState && window.gameState.reincarnationManager) {
                window.gameState.reincarnationManager.reincarnate();
            }
        };
    }

    // Bind Container Click (Event Delegation)
    const container = document.getElementById('blessings-list');
    if (container) {
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-buy-blessing');
            if (!btn) return;

            const id = btn.getAttribute('data-id');
            if (id) {
                console.log("Click detected on blessing:", id);
                handleBuyBlessing(id);
            }
        });
    }

    // Initial Render
    renderReincarnationBlessings();
}


function handleBuyBlessing(id) {
    if (!window.gameState || !window.gameState.reincarnationManager) {
        console.error("GameState missing");
        return;
    }

    const rm = window.gameState.reincarnationManager;

    // Check if maxed first
    if (rm.getBlessingCost(id) === Infinity) return;

    const cost = rm.getBlessingCost(id);

    if (rm.divinity < cost) {
        window.gameState.addToLog(`<span style="color:red">Not enough Divinity!</span>`);
        return;
    }

    if (rm.buyBlessing(id)) {
        // Force immediate update
        renderReincarnationBlessings();
        window.gameState.addToLog(`<span style="color:#00ff00">Blessing bought!</span>`);
    }
}

function renderReincarnationBlessings() {
    const container = document.getElementById('blessings-list');
    if (!container) return;

    if (!window.gameState || !window.gameState.reincarnationManager) {
        container.innerHTML = '<div style="color:red">Manager not loaded.</div>';
        return;
    }

    const rm = window.gameState.reincarnationManager;
    const defs = rm.BLESSING_DEFINITIONS;
    const blessings = rm.blessings;

    // Check for Legacy DOM (missing classes) and force rebuild if needed
    if (container.children.length > 0) {
        const firstItem = container.firstElementChild;
        if (!firstItem.querySelector('.blessing-name-text')) {
            container.innerHTML = '';
        }
    }

    // 1. Creation Phase: If container is empty, build the DOM structure
    // We check if we have the right number of children. If 0, we build.
    if (container.children.length === 0) {
        let html = '';
        Object.keys(defs).forEach(id => {
            // const def = defs[id]; // Don't use static def for text
            const name = window.t('blessing.name.' + id);
            const desc = window.t('blessing.desc.' + id);

            html += `
            <div class="blessing-item" data-id="${id}" style="border:1px solid #444; padding:10px; background:rgba(0,0,0,0.2); display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="assets/blessings/${id}.png" style="width:64px; height:64px; border-radius:8px; border:2px solid #cfb53b; background:rgba(0,0,0,0.5);">
                    <div>
                        <div style="color:#cfb53b; font-weight:bold; font-size:1.1rem;">
                            <span class="blessing-name-text">${name}</span> <span class="blessing-lvl" style="font-size:0.8em; color:#aaa;">(Lvl 0)</span>
                        </div>
                        <div class="blessing-desc" style="font-size:0.85rem; color:#ccc;">${desc}</div>
                        <div class="blessing-effect" style="font-size:0.85rem; color:#00ffff; margin-top:2px;">${window.t('lbl.current_effect')}: 0%</div>
                    </div>
                </div>
                <div>
                   <button class="sys-btn btn-buy-blessing" onclick="window.buyBlessing('${id}')" style="min-width:100px;">${window.t('lbl.buy')}</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    }

    // 2. Update Phase: Iterate and update text/state
    const items = container.querySelectorAll('.blessing-item');
    items.forEach(item => {
        const id = item.getAttribute('data-id');
        if (!defs[id]) return;

        const level = blessings[id] || 0;
        const cost = rm.getBlessingCost(id);
        const valStr = `${window.t('lbl.current_effect')}: ${rm.getEffectDisplay(id)}`;

        // Update Name/Desc dynamically
        const nameEl = item.querySelector('.blessing-name-text');
        if (nameEl) nameEl.textContent = window.t('blessing.name.' + id);

        const descEl = item.querySelector('.blessing-desc');
        if (descEl) descEl.textContent = window.t('blessing.desc.' + id);

        // Update Level Text
        const lvlEl = item.querySelector('.blessing-lvl');
        if (lvlEl) lvlEl.textContent = `(${window.t('lbl.level')} ${level})`; // Assuming lbl.level exists, or generic Lvl

        // Update Effect Text
        const effEl = item.querySelector('.blessing-effect');
        if (effEl) effEl.textContent = valStr;

        // Update Button
        const btn = item.querySelector('.btn-buy-blessing');
        if (btn) {
            if (cost === Infinity) {
                btn.textContent = window.t('lbl.max_upgraded');
                btn.disabled = true;
                btn.style.borderColor = "#555";
                btn.style.color = "#555";
                btn.style.cursor = "not-allowed";
            } else {
                btn.textContent = `${window.t('lbl.buy')} (${cost} ${window.t('lbl.divinity_short')})`;
                btn.disabled = false;
                btn.style.cursor = "pointer";

                // Affordability Check
                if (rm.divinity >= cost) {
                    btn.style.borderColor = "#00ff00";
                    btn.style.color = "#00ff00";
                } else {
                    btn.style.borderColor = "#ff0000";
                    btn.style.color = "#ff0000";
                }
            }
        }
    });

    // Update Divinity Displays
    const curDivEl = document.getElementById('current-divinity');
    if (curDivEl) curDivEl.textContent = Number(rm.divinity).toLocaleString(); // Use simple formatter here if formatNumber not avail in this scope (it is avail though)

    const pendDivEl = document.getElementById('pending-divinity');
    if (pendDivEl) {
        const gain = rm.calculateDivinityGain();
        pendDivEl.textContent = `+${Number(gain).toLocaleString()}`;
    }
}

// Hook into updateUI
const oldUpdateUI = window.updateUI;
window.updateUI = function () {
    if (typeof oldUpdateUI === 'function') oldUpdateUI();
    renderReincarnationBlessings();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReincarnationUI);
} else {
    initReincarnationUI();
}

// Ensure global access
window.buyBlessing = function (id) {
    handleBuyBlessing(id);
};

