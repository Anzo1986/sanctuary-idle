const SkillData = {
    mage: [
        { id: 'mage_1', name: 'Fireball', icon: 'assets/skills/mage/fireball.png', description: 'Deals 500% Total DPS. Cooldown: 5s.', cost: 1, stats: { damageMult: 5.0, cooldown: 5000 } },
        { id: 'mage_2', name: 'Frost Nova', icon: 'assets/skills/mage/frost_nova.png', description: 'Freezes Boss Timer for 5s. Cooldown: 30s.', cost: 1, stats: { duration: 5000, cooldown: 30000 } },
        { id: 'mage_3', name: 'Arcane Intellect', icon: 'assets/skills/mage/arcane_intellect.png', description: 'Gain +100% Cinder Drops for 15s. Cooldown: 60s.', cost: 1, stats: { duration: 15000, cooldown: 60000, effect: 1.0 } },
        { id: 'mage_4', name: 'Teleport', icon: 'assets/skills/mage/teleport.png', description: 'Instantly gain Gold & Cinders (10x Monster Value). Cooldown: 180s.', cost: 1, stats: { cooldown: 180000, multiplier: 10 } }
    ],
    rogue: [
        { id: 'rogue_1', name: 'Backstab', icon: 'assets/skills/rogue/backstab.png', description: 'Deals 600% DPS (+50% if HP < 50%). Cooldown: 5s.', cost: 1, stats: { damageMult: 6.0, cooldown: 5000, bonusMult: 0.5, threshold: 0.5 } },
        { id: 'rogue_2', name: 'Pickpocket', icon: 'assets/skills/rogue/pickpocket.png', description: 'Steal Gold (20x Monster Value). Cooldown: 45s.', cost: 1, stats: { cooldown: 45000, multiplier: 20 } },
        { id: 'rogue_3', name: 'Fan of Knives', icon: 'assets/skills/rogue/fan_of_knives.png', description: 'Deals 300% DPS + Bleed (100% DPS/s) for 10s. Cooldown: 15s.', cost: 1, stats: { damageMult: 3.0, bleedMult: 1.0, duration: 10000, cooldown: 15000 } },
        { id: 'rogue_4', name: 'Shadow Cloak', icon: 'assets/skills/rogue/shadow_cloak.png', description: 'Resets Backstab. Next Backstab Crits with 2x Dmg. Cooldown: 45s.', cost: 1, stats: { cooldown: 45000, critMult: 2.0 } }
    ],
    paladin: [
        { id: 'paladin_1', name: 'Holy Light', icon: 'assets/skills/paladin/holy_light.png', description: 'Deals 500% DPS. Double Drops for 5s. Cooldown: 10s.', cost: 1, stats: { damageMult: 5.0, duration: 5000, cooldown: 10000 } },
        { id: 'paladin_2', name: 'Divine Aegis', icon: 'assets/skills/paladin/divine_shield.png', description: 'Doubles Critical Damage (x2) for 15s. Cooldown: 45s.', cost: 1, stats: { duration: 15000, cooldown: 45000, effect: 2.0 } },
        { id: 'paladin_3', name: 'Smite', icon: 'assets/skills/paladin/smite.png', description: 'Deals 800% DPS. Enemy takes +30% Damage for 8s. Cooldown: 15s.', cost: 1, stats: { damageMult: 8.0, duration: 8000, damageTaken: 0.3, cooldown: 15000 } },
        { id: 'paladin_4', name: 'Aura of Might', icon: 'assets/skills/paladin/aura_of_might.png', description: 'Clicks trigger Lightning (100% DPS) for 20s. Cooldown: 60s.', cost: 1, stats: { duration: 20000, clickProcMult: 1.0, cooldown: 60000 } }
    ],
    amazon: [
        { id: 'amazon_1', name: 'Multi-Shot', icon: 'assets/skills/amazon/multi_shot.png', description: 'Fires 10 arrows (60% DPS each). Cooldown: 8s.', cost: 1, stats: { count: 10, damageMult: 0.6, cooldown: 8000 } },
        { id: 'amazon_2', name: 'Valkyrie', icon: 'assets/skills/amazon/valkyrie.png', description: 'Summon Valkyrie (150% DPS) for 45s. Cooldown: 60s.', cost: 1, stats: { dpsMult: 1.5, duration: 45000, cooldown: 60000 } },
        { id: 'amazon_3', name: 'Strafe', icon: 'assets/skills/amazon/strafe.png', description: 'Gain +100% Attack Speed for 15s. Cooldown: 30s.', cost: 1, stats: { duration: 15000, speedMult: 1.0, cooldown: 30000 } },
        { id: 'amazon_4', name: 'Critical Strike', icon: 'assets/skills/amazon/critical_strike.png', description: 'Critical Hits deal Double Damage (2x) for 10s. Cooldown: 45s.', cost: 1, stats: { duration: 10000, critDmgMult: 2.0, cooldown: 45000 } }
    ],
    necromancer: [
        { id: 'necromancer_1', name: 'Raise Skeleton', icon: 'assets/skills/necromancer/raise_skeleton.png', description: 'Summon Skeleton (50% DPS) for 30s. Cooldown: 30s.', cost: 1, stats: { dpsMult: 0.5, duration: 30000, cooldown: 30000 } },
        { id: 'necromancer_2', name: 'Bone Spear', icon: 'assets/skills/necromancer/bone_spear.png', description: 'Deals 600% Total DPS (Physical). Cooldown: 5s.', cost: 1, stats: { damageMult: 6.0, cooldown: 5000 } },
        { id: 'necromancer_3', name: 'Curse', icon: 'assets/skills/necromancer/curse.png', description: 'Enemies take +50% Damage for 10s. Cooldown: 20s.', cost: 1, stats: { damageTaken: 0.5, duration: 10000, cooldown: 20000 } },
        { id: 'necromancer_4', name: 'Blood Golem', icon: 'assets/skills/necromancer/blood_golem.png', description: 'Summon Blood Golem (100% DPS) for 30s. Cooldown: 45s.', cost: 1, stats: { dpsMult: 1.0, duration: 30000, cooldown: 45000 } }
    ],
    barbarian: [
        { id: 'barbarian_1', name: 'Whirlwind', icon: 'assets/skills/barbarian/whirlwind.png', description: 'Deals 800% DPS. CD Reset on Kill. Cooldown: 10s.', cost: 1, stats: { damageMult: 8.0, cooldown: 10000 } },
        { id: 'barbarian_2', name: 'Battle Shout', icon: 'assets/skills/barbarian/shout.png', description: 'Gain +50% Global Damage for 20s. Cooldown: 45s.', cost: 1, stats: { damageBuff: 0.5, duration: 20000, cooldown: 45000 } },
        { id: 'barbarian_3', name: 'Bash', icon: 'assets/skills/barbarian/bash.png', description: 'Deals 600% DPS. +50% Click Dmg Taken for 10s. Cooldown: 15s.', cost: 1, stats: { damageMult: 6.0, debuffMult: 0.5, duration: 10000, cooldown: 15000 } },
        { id: 'barbarian_4', name: 'Iron Skin', icon: 'assets/skills/barbarian/iron_skin.png', description: 'Thorns: 500% Click Dmg/s for 20s. Cooldown: 60s.', cost: 1, stats: { thornsMult: 5.0, duration: 20000, cooldown: 60000 } }
    ],
    druid: [
        { id: 'druid_1', name: 'Shapeshift', icon: 'assets/skills/druid/shapeshift.png', description: 'Bear Form: +50% Click Damage for 20s. Cooldown: 40s.', cost: 1, stats: { clickDmgMult: 0.5, duration: 20000, cooldown: 40000 } },
        { id: 'druid_2', name: 'Entangling Roots', icon: 'assets/skills/druid/entangling_roots.png', description: 'Deals 200% DPS. Freezes Boss Timer for 5s. Cooldown: 60s.', cost: 1, stats: { damageMult: 2.0, freezeDuration: 5000, cooldown: 60000 } },
        { id: 'druid_3', name: 'Summon Wolf', icon: 'assets/skills/druid/summon_wolf.png', description: 'Summon Spirit Wolf (100% DPS) for 30s. Cooldown: 45s.', cost: 1, stats: { dpsMult: 1.0, duration: 30000, cooldown: 45000 } },
        { id: 'druid_4', name: 'Nature\'s Grace', icon: 'assets/skills/druid/natures_grace.png', description: 'Gain +50% Gold & Cinders for 20s. Cooldown: 60s.', cost: 1, stats: { resourceBuff: 0.5, duration: 20000, cooldown: 60000 } }
    ]
};

class SkillManager {
    constructor(gameState) {
        this.gameState = gameState;
        // Ensure initial state exists
        if (typeof this.gameState.skillPoints === 'undefined') {
            this.gameState.skillPoints = 0;
        }
        if (!this.gameState.purchasedSkills) {
            this.gameState.purchasedSkills = []; // List of skill IDs
        }
        // Active Skills Slots (Max 4)
        if (!this.gameState.equippedSkills) {
            this.gameState.equippedSkills = [null, null, null, null];
        }


        this.cooldowns = {};

        // Initial Render
        setTimeout(() => this.renderActiveSkills(), 100); // Small delay to ensure DOM is ready
    }

    addSkillPoint(amount) {
        this.gameState.skillPoints += amount;
        this.updateUI();
    }

    getSkillPoints() {
        return this.gameState.skillPoints;
    }

    hasSkill(skillId) {
        return this.gameState.purchasedSkills.includes(skillId);
    }

    // Check if skill is in a slot
    isEquipped(skillId) {
        return this.gameState.equippedSkills.includes(skillId);
    }

    // Equip logic: Find empty slot, or replace? For now, find empty or fail/swap.
    // Better UX: If full, tell user. Or auto-replace first slot?
    // Let's go with: Fill empty, else logic needed.
    // User Requirement: "4 skills max... activate with Q,W,E,R"
    // Equipping from menu:
    // If already equipped -> Unequip.
    // If not equipped -> Add to first empty slot.
    toggleEquip(skillId) {
        if (!this.hasSkill(skillId)) return false;

        const slotIndex = this.gameState.equippedSkills.indexOf(skillId);

        if (slotIndex !== -1) {
            // Unequip
            this.gameState.equippedSkills[slotIndex] = null;
            this.renderActiveSkills();
            return false; // Unequipped
        } else {
            // Equip
            const emptyIndex = this.gameState.equippedSkills.indexOf(null);
            if (emptyIndex !== -1) {
                this.gameState.equippedSkills[emptyIndex] = skillId;
                this.renderActiveSkills();
                return true; // Equipped
            } else {

                // Optionally: Replace slot 0? Or warn?
                window.gameState.addToLog(`<span style="color:red">Skill Slots Full! Unequip one first.</span>`);
                return false;
            }
        }
    }

    migrateSkillIds() {
        // --- Save Data Migration ---
        const migrationMap = {
            'mage_fireball': 'mage_1',
            'mage_frostnova': 'mage_2',
            'mage_arcaneintellect': 'mage_3',
            'mage_teleport': 'mage_4'
        };

        let migrated = false;

        // Fix equipped skills
        if (this.gameState.equippedSkills) {
            this.gameState.equippedSkills = this.gameState.equippedSkills.map(id => {
                if (migrationMap[id]) {
                    migrated = true;
                    return migrationMap[id];
                }
                return id;
            });
        }

        // Fix purchased skills
        if (this.gameState.purchasedSkills) {
            this.gameState.purchasedSkills = this.gameState.purchasedSkills.map(id => {
                if (migrationMap[id]) {
                    migrated = true;
                    return migrationMap[id];
                }
                return id;
            });
            // Deduplicate
            this.gameState.purchasedSkills = [...new Set(this.gameState.purchasedSkills)];
        }

        if (migrated) {

            this.renderActiveSkills();
        }
    }

    useSkill(slotIndex) {

        const skillId = this.gameState.equippedSkills[slotIndex];
        if (!skillId) {

            return;
        }

        // Check Cooldown
        if (this.cooldowns[skillId] && Date.now() < this.cooldowns[skillId]) {

            return;
        }

        // Find skill definition
        let skill = null;
        for (const classKey in SkillData) {
            const found = SkillData[classKey].find(s => s.id === skillId);
            if (found) {
                skill = found;
                break;
            }
        }

        if (skill) {
            let success = false;

            switch (skillId) {
                case 'mage_1': // Fireball
                    success = this.castFireball(slotIndex);
                    this.setCooldown(skillId, 5000);
                    break;
                case 'mage_2': // Frost Nova
                    success = this.castFrostNova();
                    this.setCooldown(skillId, 30000);
                    break;
                case 'mage_3': // Arcane Intellect
                    success = this.castArcaneIntellect();
                    this.setCooldown(skillId, 60000);
                    break;
                case 'mage_4': // Teleport
                    success = this.castTeleport();
                    this.setCooldown(skillId, 180000); // 3 min
                    break;

                // --- Paladin ---
                // --- Amazon ---
                case 'amazon_1': // Multi-Shot
                    success = this.castMultiShot(slotIndex);
                    this.setCooldown(skillId, 8000);
                    break;
                case 'amazon_2': // Valkyrie
                    success = this.castValkyrie();
                    this.setCooldown(skillId, 60000);
                    break;
                case 'amazon_3': // Strafe
                    success = this.castStrafe();
                    this.setCooldown(skillId, 30000);
                    break;
                case 'amazon_4': // Critical Strike
                    success = this.castCriticalStrike();
                    this.setCooldown(skillId, 45000);
                    break;
                // --- Paladin ---
                case 'paladin_1': // Holy Light
                    success = this.castHolyLight(slotIndex);
                    this.setCooldown(skillId, 10000);
                    break;
                case 'paladin_2': // Divine Aegis
                    success = this.castDivineShield();
                    this.setCooldown(skillId, 45000);
                    break;
                case 'paladin_3': // Smite
                    success = this.castSmite(slotIndex);
                    this.setCooldown(skillId, 15000);
                    break;
                case 'paladin_4': // Aura of Might
                    success = this.castAuraOfMight();
                    this.setCooldown(skillId, 60000);
                    break;

                case 'necromancer_1': // Raise Skeleton
                    success = this.castRaiseSkeleton();
                    this.setCooldown(skillId, 30000);
                    break;
                case 'necromancer_2': // Bone Spear
                    success = this.castBoneSpear(slotIndex);
                    this.setCooldown(skillId, 5000);
                    break;
                case 'necromancer_3': // Curse
                    success = this.castCurse();
                    this.setCooldown(skillId, 20000);
                    break;
                case 'necromancer_4': // Blood Golem
                    success = this.castBloodGolem();
                    this.setCooldown(skillId, 45000);
                    break;
                case 'druid_1': // Shapeshift
                    success = this.castShapeshift();
                    this.setCooldown(skillId, 40000);
                    break;
                case 'druid_2': // Entangling Roots
                    success = this.castEntanglingRoots();
                    this.setCooldown(skillId, 60000);
                    break;
                case 'druid_3': // Summon Wolf
                    success = this.castSummonWolf();
                    this.setCooldown(skillId, 45000);
                    break;
                case 'druid_4': // Nature's Grace
                    success = this.castNaturesGrace();
                    this.setCooldown(skillId, 60000); // Reduced from 120s to 60s
                    break;

                // --- Barbarian ---
                case 'barbarian_1': // Whirlwind
                    success = this.castWhirlwind(skillId);
                    this.setCooldown(skillId, 10000); // 10s base
                    break;
                case 'barbarian_2': // Battle Shout
                    success = this.castShout();
                    this.setCooldown(skillId, 45000);
                    break;
                case 'barbarian_3': // Bash
                    success = this.castBash();
                    this.setCooldown(skillId, 15000);
                    break;
                case 'barbarian_4': // Iron Skin
                    success = this.castIronSkin();
                    this.setCooldown(skillId, 60000);

                case 'rogue_1': // Backstab
                    success = this.castBackstab();
                    this.setCooldown(skillId, 1000); // Short cooldown, mainly controlled by Shadow Cloak combo or just low
                    // Wait, Plan said nothing about CD for Backstab. Let's assume standard spam or short.
                    // Actually, "Shadow Cloak resets it" implies it has a CD. Let's give it 5s.
                    this.setCooldown(skillId, 5000);
                    break;
                case 'rogue_2': // Pickpocket
                    success = this.castPickpocket();
                    this.setCooldown(skillId, 45000);
                    break;
                case 'rogue_3': // Fan of Knives
                    success = this.castFanOfKnives();
                    this.setCooldown(skillId, 15000);
                    break;
                case 'rogue_4': // Shadow Cloak
                    success = this.castShadowCloak();
                    this.setCooldown(skillId, 45000);
                    break;
                default:
                    window.gameState.addToLog(`<span style="color:#aaa">Skill ${skill.name} not implemented yet!</span>`);
                    success = true;
                    this.setCooldown(skillId, 1000);
                    break;
            }

            if (success) {
                const slotEl = document.querySelector(`.active-skill-slot[data-slot="${slotIndex}"]`);
                if (slotEl) {
                    slotEl.classList.add('skill-cooldown-anim');
                    setTimeout(() => slotEl.classList.remove('skill-cooldown-anim'), 200);
                }
                this.renderActiveSkills();
            }
        }
    }

    purchaseSkill(skillId) {
        // Find skill cost
        let skill = null;
        for (const classKey in SkillData) {
            const found = SkillData[classKey].find(s => s.id === skillId);
            if (found) {
                skill = found;
                break;
            }
        }

        if (!skill) {

            return false;
        }

        if (this.hasSkill(skillId)) {

            return false;
        }

        if (this.gameState.skillPoints >= skill.cost) {
            this.gameState.skillPoints -= skill.cost;
            this.gameState.purchasedSkills.push(skillId);
            this.updateUI(); // Updates currency display, etc.
            // Auto-equip if slot available?
            const emptyIndex = this.gameState.equippedSkills.indexOf(null);
            if (emptyIndex !== -1) {
                this.gameState.equippedSkills[emptyIndex] = skillId;
            }
            this.renderActiveSkills(); // Update the main game view
            return true;
        } else {

            return false;
        }
    }

    // Call this to update any skill-related UI elements that might be persistent
    updateUI() {
        // This relies on global UI update functions usually found in main.js
        // For now we can dispatch an event or just let main loop handle it, 
        // but explicit updates are better for UI feedback.
        if (typeof updateSkillUI === 'function') {
            updateSkillUI();
        }
        this.renderActiveSkills();
    }

    getSkillStats(skillId) {
        let skill = null;
        for (const classKey in SkillData) {
            const found = SkillData[classKey].find(s => s.id === skillId);
            if (found) {
                skill = found;
                break;
            }
        }
        if (!skill || !skill.stats) return null;

        // Clone stats to avoid modifying base data
        const stats = { ...skill.stats };

        // Apply Rune Bonuses (Skill Runes)
        if (this.gameState.skillBonuses && this.gameState.skillBonuses[skillId]) {
            const bonuses = this.gameState.skillBonuses[skillId];
            Object.entries(bonuses).forEach(([key, val]) => {
                // Additive Application
                stats[key] = (stats[key] || 0) + val;
            });
        }

        // Apply Modifiers
        if (this.gameState.ascensionManager && this.gameState.ascensionManager.getMultipliers) {
            const bonuses = this.gameState.ascensionManager.getMultipliers();

            // Example: Minion Duration (bonuses.minionDuration is in seconds, e.g. 30)
            const summonSkills = ['necromancer_1', 'necromancer_4', 'druid_3', 'amazon_2']; // Skeleton, Golem, Wolf, Valkyrie
            if (bonuses.minionDuration && summonSkills.includes(skillId)) {
                stats.duration = (stats.duration || 0) + (bonuses.minionDuration * 1000);
            }

            // Example: Cooldown Reduction (bonuses.cooldownReduction is in seconds, e.g. 2.0)
            if (bonuses.cooldownReduction) {
                stats.cooldown = Math.max(1000, (stats.cooldown || 0) - (bonuses.cooldownReduction * 1000));
            }

            // Primal Instinct (Druid)
            if (skillId === 'druid_1' && bonuses.abilities && bonuses.abilities.includes('primal_instinct')) {
                stats.clickDmgMult = 1.0; // 50% -> 100%
                stats.duration = 30000;   // 20s -> 30s
            }
        }

        return stats;
    }

    getSkillDescription(skillId) {
        const stats = this.getSkillStats(skillId);
        let desc = window.t(`skill.desc.${skillId}`);
        if (!stats) return desc;

        // Helper to replace {key} with value
        const replace = (key, val) => {
            desc = desc.replace(new RegExp(`{${key}}`, 'g'), val);
        };

        // Standard Replacements
        if (stats.damageMult) replace('damage', Math.round(stats.damageMult * 100)); // 5.0 -> 500
        if (stats.cooldown) replace('cooldown', Math.round(stats.cooldown / 1000));   // 5000 -> 5
        if (stats.duration) replace('duration', Math.round(stats.duration / 1000));   // 5000 -> 5
        if (stats.freezeDuration) replace('freezeDuration', Math.round(stats.freezeDuration / 1000));

        // Specifics
        if (stats.effect) replace('effect', stats.effect < 10 ? stats.effect : Math.round(stats.effect * 100)); // Context dependent? 
        // Mage 3: effect 1.0 -> 100%
        // Paladin 2: effect 2.0 -> x2
        if (skillId === 'mage_3' && stats.effect) replace('effect', Math.round(stats.effect * 100));
        if (skillId === 'paladin_2' && stats.effect) replace('effect', stats.effect);

        if (stats.multiplier) replace('multiplier', stats.multiplier);

        if (stats.bonusMult) replace('bonus', Math.round(stats.bonusMult * 100));
        if (stats.threshold) replace('threshold', Math.round(stats.threshold * 100));

        if (stats.bleedMult) replace('bleed', Math.round(stats.bleedMult * 100));
        if (stats.critDmgMult) replace('critDmg', stats.critDmgMult); // 2.0 -> 2x? usually
        if (stats.critMult) replace('critDmg', stats.critMult); // Shadow cloak uses critMult in my Logic, desc uses critDmg placeholder? let's check.
        // Shadow Cloak: {critDmg}x Dmg. Stats: critMult: 2.0.
        // Critical Strike: {critDmg}x. Stats: critDmgMult: 2.0.

        if (stats.damageTaken) replace('damageTaken', Math.round(stats.damageTaken * 100));
        if (stats.count) replace('count', stats.count);
        if (stats.speedMult) replace('speed', Math.round(stats.speedMult * 100));

        if (stats.dpsMult) replace('damage', Math.round(stats.dpsMult * 100)); // Summon stats often use dpsMult
        if (stats.damageBuff) replace('damageBuff', Math.round(stats.damageBuff * 100));
        if (stats.debuffMult) replace('debuff', Math.round(stats.debuffMult * 100));
        if (stats.thornsMult) replace('thorns', Math.round(stats.thornsMult * 100));

        if (stats.clickDmgMult) replace('clickDmg', Math.round(stats.clickDmgMult * 100));
        if (stats.resourceBuff) replace('resource', Math.round(stats.resourceBuff * 100));

        return desc;
    }

    renderActiveSkills() {
        const container = document.getElementById('active-skills-container');
        if (!container) return;

        // --- Save Data Migration (Runtime Fix) ---
        const migrationMap = {
            'mage_fireball': 'mage_1',
            'mage_frostnova': 'mage_2',
            'mage_arcaneintellect': 'mage_3',
            'mage_teleport': 'mage_4'
        };

        let migrated = false;
        this.gameState.equippedSkills = this.gameState.equippedSkills.map(id => {
            if (migrationMap[id]) {
                migrated = true;
                return migrationMap[id];
            }
            return id;
        });

        if (this.gameState.purchasedSkills) {
            this.gameState.purchasedSkills = this.gameState.purchasedSkills.map(id => migrationMap[id] || id);
        }

        if (migrated) {

        }
        // -----------------------------------------

        container.innerHTML = '';

        // Render 4 fixed slots
        const keys = ['Q', 'W', 'E', 'R'];

        for (let i = 0; i < 4; i++) {
            const skillId = this.gameState.equippedSkills[i];
            const key = keys[i];

            const slotEl = document.createElement('div');
            slotEl.className = 'active-skill-slot';
            slotEl.setAttribute('data-slot', i);

            // Label
            const keyLabel = document.createElement('div');
            keyLabel.className = 'skill-key-label';
            keyLabel.textContent = key;
            slotEl.appendChild(keyLabel);

            if (skillId) {
                // Find skill data
                let skill = null;
                for (const classKey in SkillData) {
                    const found = SkillData[classKey].find(s => s.id === skillId);
                    if (found) {
                        skill = found;
                        break;
                    }
                }

                if (skill) {
                    const iconEl = document.createElement('span');
                    iconEl.className = 'skill-icon';
                    if (skill.icon.includes('/')) {
                        iconEl.innerHTML = `<img src="${skill.icon}" style="width:100%;height:100%;object-fit:cover;">`;
                    } else {
                        iconEl.innerHTML = skill.icon;
                    }

                    slotEl.appendChild(iconEl);
                    const sName = window.t(`skill.name.${skill.id}`);
                    const sDesc = this.getSkillDescription(skillId);

                    slotEl.title = `${sName} [${key}]\n${sDesc}`;
                    slotEl.onclick = () => {

                        this.useSkill(i);
                    };

                    // Check Cooldown
                    const now = Date.now();
                    if (this.cooldowns[skillId] && this.cooldowns[skillId] > now) {
                        const remaining = this.cooldowns[skillId] - now;
                        const overlay = document.createElement('div');
                        overlay.className = 'skill-cooldown-overlay';
                        overlay.textContent = Math.ceil(remaining / 1000);
                        slotEl.appendChild(overlay);
                        slotEl.classList.add('on-cooldown');
                    }
                }
            } else {
                // Empty slot style?
                slotEl.classList.add('empty-slot');
            }

            container.appendChild(slotEl);
        }
    }

    setCooldown(skillId, ms) {
        // Mage T8: Time Warp (-2s Cooldown Reduction)
        let reduction = 0;
        if (this.gameState.ascensionManager && this.gameState.ascensionManager.getMultipliers) {
            reduction = (this.gameState.ascensionManager.getMultipliers().cooldownReduction || 0) * 1000;
        }

        // Ensure cooldown doesn't go below 1s (1000ms) or 0
        const finalCd = Math.max(1000, ms - reduction);
        this.cooldowns[skillId] = Date.now() + finalCd;
    }

    updateCooldownVis() {
        const container = document.getElementById('active-skills-container');
        if (!container) return;

        const now = Date.now();

        for (let i = 0; i < 4; i++) {
            const skillId = this.gameState.equippedSkills[i];
            const slotEl = container.children[i];

            if (!slotEl) continue;

            if (!skillId) {
                if (slotEl) {
                    slotEl.classList.remove('on-cooldown');
                    const ov = slotEl.querySelector('.skill-cooldown-overlay');
                    if (ov) ov.remove();
                    // Reset active
                    slotEl.style.boxShadow = 'none';
                    slotEl.style.borderColor = '#444';
                }
                continue;
            }

            const cdEnd = this.cooldowns[skillId] || 0;
            const remaining = cdEnd - now;

            let overlay = slotEl.querySelector('.skill-cooldown-overlay');

            if (remaining > 0) {
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'skill-cooldown-overlay';
                    slotEl.appendChild(overlay);
                    slotEl.classList.add('on-cooldown');
                }
                overlay.textContent = Math.ceil(remaining / 1000);
            } else {
                if (overlay) {
                    overlay.remove();
                    slotEl.classList.remove('on-cooldown');
                }
            }
        }

        this.updateActiveState();
    }

    updateActiveState() {
        const container = document.getElementById('active-skills-container');
        if (!container) return;
        const now = Date.now();
        const buffMap = {
            'mage_3': 'cinderBonusExpires',
            'mage_2': 'bossTimerFrozen',
            'paladin_2': 'divineAegisExpires',
            'paladin_3': 'smiteDebuffExpires', // Added Smite
            'paladin_4': 'auraOfMightExpires',
            'paladin_1': 'holyLightDebuffExpires',
            'amazon_3': 'strafeExpires',
            'amazon_4': 'criticalStrikeExpires',
            'barbarian_2': 'battleShoutExpires',
            'barbarian_3': 'bashDebuffExpires', // Added Bash
            'barbarian_4': 'ironSkinExpires',
            'druid_1': 'clickPowerExpires',
            'druid_4': 'naturesGraceExpires',
            'druid_2': 'bossTimerFrozen',
            'necromancer_3': 'curseExpires'
        };

        const minionMap = {
            'amazon_2': 'valkyrie',
            'druid_3': 'wolf',
            'necromancer_1': 'skeleton',
            'necromancer_4': 'golem'
        };

        for (let i = 0; i < 4; i++) {
            const skillId = this.gameState.equippedSkills[i];
            const slotEl = container.children[i];
            if (!slotEl || !skillId) continue;

            let isActive = false;

            if (buffMap[skillId]) {
                const prop = buffMap[skillId];
                let expiry = (this.gameState.buffs && this.gameState.buffs[prop]) ? this.gameState.buffs[prop] : 0;
                if (!expiry && this.gameState[prop]) expiry = this.gameState[prop];

                if (expiry && expiry > now) {
                    isActive = true;
                }
            }

            // Rogue: Shadow Cloak (Stealth)
            if (skillId === 'rogue_4') {
                if (this.gameState.hasBuff && this.gameState.hasBuff('stealth')) {
                    isActive = true;
                }
            }

            // Rogue: Fan of Knives (Bleed DoT)
            if (skillId === 'rogue_3') {
                if (this.gameState.activeDots && this.gameState.activeDots.some(d => d.type === 'bleed')) {
                    isActive = true;
                }
            }

            if (minionMap[skillId]) {
                if (this.gameState.activeClones && this.gameState.activeClones.some(c => c.type === minionMap[skillId])) {
                    isActive = true;
                }
            }

            if (isActive) {
                slotEl.style.boxShadow = '0 0 10px 2px #00ff00';
                slotEl.style.borderColor = '#00ff00';
                slotEl.style.transition = 'box-shadow 0.2s';
            } else {
                slotEl.style.boxShadow = 'none';
                slotEl.style.borderColor = '#444';
            }
        }
    }



    castWhirlwind(skillId) { // skillId needed for reset logic
        const stats = this.getSkillStats('barbarian_1');
        const dmgMult = stats ? stats.damageMult : 8.0;

        const dps = window.gameState.totalDps || 0;
        const clickDmg = window.gameState.totalClickDamage || 1;
        let baseDmg = dps > 0 ? dps : clickDmg;
        const dmg = baseDmg * dmgMult;

        // Check verification: damageMonster returns { isDead: boolean }
        const result = window.gameState.damageMonster(dmg, true, 'skill');

        window.gameState.addToLog(`<span style="color:#ff4400">Whirlwind! Deals ${window.formatNumber(dmg)}.</span>`);
        if (window.showCombatEffect) window.showCombatEffect(`🌪️ ${window.formatNumber(dmg)}`, '#ff4400');

        if (result && result.isDead) {
            // Reset Cooldown
            this.cooldowns[skillId] = 0;
            window.gameState.addToLog(`<span style="color:#ffff00">Whirlwind Kill! Cooldown Reset!</span>`);
        }
        return true;
    }

    castShout() {
        if (!window.gameState.buffs) window.gameState.buffs = {};
        const stats = this.getSkillStats('barbarian_2');
        const duration = stats ? stats.duration : 20000;
        const dmgBuff = stats ? (stats.damageBuff * 100) : 50;

        window.gameState.buffs.battleShoutExpires = Date.now() + duration;
        window.gameState.recalculateStats();
        window.gameState.addToLog(`<span style="color:#ffaa00">Battle Shout! +${dmgBuff}% Damage for ${duration / 1000}s.</span>`);
        if (window.showCombatEffect) window.showCombatEffect(`📢 ROAR`, '#ffaa00');
        return true;
    }

    castBash() {
        const stats = this.getSkillStats('barbarian_3');
        const dmgMult = stats ? stats.damageMult : 6.0;
        const duration = stats ? stats.duration : 10000;
        const debuff = stats ? (stats.debuffMult * 100) : 50;

        const dps = window.gameState.totalDps || 0;
        const clickDmg = window.gameState.totalClickDamage || 1;
        let baseDmg = dps > 0 ? dps : clickDmg;
        const dmg = baseDmg * dmgMult;

        window.gameState.damageMonster(dmg, true, 'skill');

        // Shatter Armor: +50% Click Dmg Taken
        if (!window.gameState.buffs) window.gameState.buffs = {};
        window.gameState.buffs.bashDebuffExpires = Date.now() + duration;

        window.gameState.addToLog(`<span style="color:#ff4400">Bash! Shatters Armor (+${debuff}% Click Dmg Taken).</span>`);
        if (window.showCombatEffect) window.showCombatEffect(`💥 ${window.formatNumber(dmg)}`, '#ff4400');
        return true;
    }

    castIronSkin() {
        if (!window.gameState.buffs) window.gameState.buffs = {};
        const stats = this.getSkillStats('barbarian_4');
        const duration = stats ? stats.duration : 20000;

        window.gameState.buffs.ironSkinExpires = Date.now() + duration;
        window.gameState.addToLog(`<span style="color:#aaaaaa">Iron Skin! Thorns active for ${duration / 1000}s.</span>`);
        if (window.showCombatEffect) window.showCombatEffect(`🛡️ IRON`, '#aaaaaa');
        return true;
    }


    castFireball(slotIndex) {
        // Visuals
        let startX = window.innerWidth / 2;
        let startY = window.innerHeight - 100;

        if (slotIndex !== undefined) {
            const skillSlot = document.querySelector(`.active-skill-slot[data-slot="${slotIndex}"]`);
            if (skillSlot) {
                const rect = skillSlot.getBoundingClientRect();
                startX = rect.left + rect.width / 2;
                startY = rect.top + rect.height / 2;
            }
        }

        const monsterEl = document.getElementById('monster-sprite');
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2 - 50;

        if (monsterEl) {
            const rect = monsterEl.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
        }

        // Spawn with Texture
        this.spawnProjectile(startX, startY, targetX, targetY, '🔥');

        const stats = this.getSkillStats('mage_1');
        const dmgMult = stats ? stats.damageMult : 5.0;

        // Delay Impact
        setTimeout(() => {
            const dps = window.gameState.totalDps || 0;
            const clickDmg = window.gameState.totalClickDamage || 1;
            let baseDmg = dps > 0 ? dps : clickDmg;
            const dmg = baseDmg * dmgMult;
            if (dmg > 0) {
                window.gameState.damageMonster(dmg, true, 'skill');
                window.gameState.addToLog(`<span style="color:#ff4400">Fireball deals ${window.formatNumber(dmg)}!</span>`);
                window.showCombatEffect(`🔥 ${window.formatNumber(dmg)}`, '#ff4400');
            }
        }, 300);

        return true;
    }

    castFrostNova() {
        const stats = this.getSkillStats('mage_2');
        const duration = stats ? stats.duration : 5000;

        // If there is no active Boss Timer, just deal damage
        if (window.gameState.bossTimer === null) {
            const dmg = window.gameState.totalDps;
            window.gameState.damageMonster(dmg);
            window.gameState.addToLog(`<span style="color:#00ffff">Frost Nova chills the target!</span>`);
            if (window.showCombatEffect) window.showCombatEffect(`❄️ ${window.formatNumber(dmg)}`, '#00ffff');
            return true;
        }

        // If Boss Timer exists, Freeze it
        window.gameState.bossTimerFrozen = Date.now() + duration;
        window.gameState.addToLog(`<span style="color:#00ffff">Frost Nova freezes the Boss Timer for ${duration / 1000}s!</span>`);
        window.showCombatEffect(`❄️ FREEZE`, '#00ffff');
        return true;
    }

    castArcaneIntellect() {
        if (!window.gameState.buffs) window.gameState.buffs = {}; // Safety
        const stats = this.getSkillStats('mage_3');
        const duration = stats ? stats.duration : 15000;
        const effect = stats ? (stats.effect * 100) : 100;

        window.gameState.buffs.cinderBonusExpires = Date.now() + duration;
        window.gameState.addToLog(`<span style="color:#bf40bf">Arcane Intellect: +${effect}% Cinders for ${duration / 1000}s!</span>`);
        return true;
    }

    castTeleport() {
        if (!window.gameState.currentMonster) return false;
        const stats = this.getSkillStats('mage_4');
        const multiplier = stats ? stats.multiplier : 10;

        const monster = window.gameState.currentMonster;
        const goldGain = window.gameState.getMonsterGold(monster.maxHp) * multiplier;
        const cinderGain = window.gameState.getMonsterCinders(monster.maxHp) * multiplier;

        window.gameState.addResource('gold', goldGain);
        window.gameState.addResource('cinders', cinderGain);

        // Debug Log


        window.gameState.addToLog(`<span style="color:#ffff00">Teleport! +${window.formatNumber(goldGain)} Gold, +${window.formatNumber(cinderGain)} Cinders (HP: ${window.formatNumber(monster.maxHp)})</span>`);
        return true;
    }

    castRaiseSkeleton() {
        if (!window.gameState.activeClones) window.gameState.activeClones = [];

        const stats = this.getSkillStats('necromancer_1');
        const duration = stats ? (stats.duration / 1000) : 30.0;

        const existing = window.gameState.activeClones.find(c => c.type === 'skeleton');
        if (existing) {
            existing.duration = duration; // Refresh
            existing.attackTimer = 0;
            window.gameState.addToLog(`<span style="color:#cccccc">Refreshed Skeleton Warrior!</span>`);
            if (window.showCombatEffect) window.showCombatEffect("💀 REFRESH!", "#cccccc");
            return true;
        }

        window.gameState.activeClones.push({ duration: duration, attackTimer: 0, type: 'skeleton' });
        window.gameState.addToLog(`<span style="color:#cccccc">Raised a Skeleton Warrior!</span>`);
        if (window.showCombatEffect) window.showCombatEffect("💀 RISE!", "#cccccc");
        return true;
    }

    castBloodGolem() {
        if (!window.gameState.activeClones) window.gameState.activeClones = [];

        const stats = this.getSkillStats('necromancer_4');
        const duration = stats ? (stats.duration / 1000) : 30.0;

        const existing = window.gameState.activeClones.find(c => c.type === 'golem');
        if (existing) {
            existing.duration = duration;
            existing.attackTimer = 0;
            window.gameState.addToLog(`<span style="color:#ff0000">Refreshed Blood Golem!</span>`);
            if (window.showCombatEffect) window.showCombatEffect("🩸 REFRESH!", "#ff0000");
            return true;
        }

        window.gameState.activeClones.push({ duration: duration, attackTimer: 0, type: 'golem' });
        window.gameState.addToLog(`<span style="color:#ff0000">Summoned a Blood Golem!</span>`);
        if (window.showCombatEffect) window.showCombatEffect("🩸 GOLEM!", "#ff0000");
        return true;
    }

    castBoneSpear(slotIndex) {
        // Visuals
        let startX = window.innerWidth / 2;
        let startY = window.innerHeight - 100;
        if (slotIndex !== undefined) {
            const skillSlot = document.querySelector(`.active-skill-slot[data-slot="${slotIndex}"]`);
            if (skillSlot) {
                const rect = skillSlot.getBoundingClientRect();
                startX = rect.left + rect.width / 2;
                startY = rect.top + rect.height / 2;
            }
        }
        const monsterEl = document.getElementById('monster-sprite');
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2 - 50;
        if (monsterEl) {
            const rect = monsterEl.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
        }

        // Projectile: Bone
        this.spawnProjectile(startX, startY, targetX, targetY, '🦴');

        const stats = this.getSkillStats('necromancer_2');
        const dmgMult = stats ? stats.damageMult : 6.0;

        setTimeout(() => {
            const dps = window.gameState.totalDps || 0;
            const boneSpearDmg = dps * dmgMult;
            window.gameState.damageMonster(boneSpearDmg, true, 'skill');
            window.gameState.addToLog(`<span style="color:#cccccc">Bone Spear deals ${window.formatNumber(boneSpearDmg)} damage.</span>`);
            if (window.showCombatEffect) window.showCombatEffect(`🦴 ${window.formatNumber(boneSpearDmg)}`, '#00ff00');
        }, 300);

        return true;
    }

    castCurse() {
        if (!window.gameState.buffs) window.gameState.buffs = {};
        const stats = this.getSkillStats('necromancer_3');
        const duration = stats ? stats.duration : 10000;
        const taken = stats ? (stats.damageTaken * 100) : 50;

        window.gameState.buffs.curseExpires = Date.now() + duration;
        window.gameState.addToLog(`<span style="color:#800080">Curse! Enemies take +${taken}% Damage for ${duration / 1000}s.</span>`);
        window.showCombatEffect(`🔮 CURSE`, '#800080');
        return true;
    }

    castShapeshift() {
        if (!window.gameState.buffs) window.gameState.buffs = {};

        const stats = this.getSkillStats('druid_1');
        const duration = stats ? stats.duration : 20000;
        // Primal check inside getSkillStats now affects duration and clickDmgMult directly

        window.gameState.buffs.clickPowerExpires = Date.now() + duration;
        window.showCombatEffect(`🐻 ROAR`, '#a52a2a');

        const clickMult = stats ? (stats.clickDmgMult * 100) : 50;
        const nameText = "Bear Form"; // Simplified, or check Primal flag if needed for name change specifically, but logic is handled.

        window.gameState.addToLog(`<span style="color:#a52a2a">${nameText}! +${clickMult}% Click Damage for ${duration / 1000}s.</span>`);
        return true;
    }

    castEntanglingRoots() {
        // Damage + Freeze
        const stats = this.getSkillStats('druid_2');
        const dmgMult = stats ? stats.damageMult : 2.0;
        const freezeDur = stats ? stats.freezeDuration : 5000;

        const dmg = (window.gameState.totalDps || 0) * dmgMult;
        window.gameState.damageMonster(dmg, true, 'skill');

        if (window.gameState.bossTimer !== null) {
            window.gameState.bossTimerFrozen = Date.now() + freezeDur;
            window.showCombatEffect(`🌿 ${window.formatNumber(dmg)}`, '#00ff00');
        } else {
            window.showCombatEffect(`🌿 ${window.formatNumber(dmg)}`, '#00ff00');
        }
        window.gameState.addToLog(`<span style="color:#00ff00">Entangling Roots!</span>`);
        return true;
    }

    castSummonWolf() {
        if (!window.gameState.activeClones) window.gameState.activeClones = [];

        const stats = this.getSkillStats('druid_3');
        const duration = stats ? (stats.duration / 1000) : 30.0;

        const existing = window.gameState.activeClones.find(c => c.type === 'wolf');
        if (existing) {
            existing.duration = duration;
            existing.attackTimer = 0;
            window.gameState.addToLog(`<span style="color:#00ff00">Refreshed Spirit Wolf!</span>`);
            if (window.showCombatEffect) window.showCombatEffect("🐺 REFRESH!", "#00ff00");
            return true;
        }

        window.gameState.activeClones.push({ duration: duration, attackTimer: 0, type: 'wolf' });
        window.gameState.addToLog(`<span style="color:#00ff00">Summoned a Spirit Wolf!</span>`);
        if (window.showCombatEffect) window.showCombatEffect("🐺 HOWL!", "#00ff00");
        return true;
    }

    castNaturesGrace() {
        if (!window.gameState.buffs) window.gameState.buffs = {};
        const stats = this.getSkillStats('druid_4');
        const duration = stats ? stats.duration : 20000;
        const effect = stats ? (stats.resourceBuff * 100) : 50;

        window.gameState.buffs.naturesGraceExpires = Date.now() + duration;
        window.gameState.addToLog(`<span style="color:#00ff00">Nature's Grace: +${effect}% Gold & Cinders for ${duration / 1000}s.</span>`);
        return true;
    }

    // --- Amazon Skills ---
    castMultiShot(slotIndex) {
        const stats = this.getSkillStats('amazon_1');
        const arrowCount = stats ? stats.count : 10;
        const arrowMult = stats ? stats.damageMult : 0.6;

        const dps = window.gameState.totalDps || 0;
        const arrowDmg = dps * arrowMult;

        // Visuals
        const skillSlot = document.querySelector(`.active-skill-slot[data-slot="${slotIndex}"]`);
        const monsterImg = document.getElementById('monster-image');

        let startX = window.innerWidth / 2;
        let startY = window.innerHeight - 100;
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2 - 50;

        if (skillSlot) {
            const rect = skillSlot.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top;
        }

        // Show Text
        if (window.showUIText) {
            window.showUIText("Multi-Shot!", startX, startY - 50, '#ffaa00');
        } else {
            window.gameState.addToLog(`<span style="color:#ffaa00">Multi-Shot!</span>`);
        }

        let hits = 0;
        const interval = setInterval(() => {
            if (hits >= arrowCount) { clearInterval(interval); return; }

            // Recalculate target slightly random to simulate spread
            if (monsterImg) {
                const rect = monsterImg.getBoundingClientRect();
                targetX = rect.left + rect.width / 2 + (Math.random() * 50 - 25);
                targetY = rect.top + rect.height / 2 + (Math.random() * 50 - 25);
            }

            // Spawn Projectile
            this.spawnProjectile(startX, startY, targetX, targetY);

            // Damage (synced with projectile arrival approx)
            setTimeout(() => {
                window.gameState.damageMonster(arrowDmg, true, 'skill');
            }, 300); // 300ms travel time

            hits++;
        }, 80); // Fast burst

        return true;
    }

    spawnProjectile(startX, startY, targetX, targetY, texture = null) {
        const el = document.createElement('div');
        el.className = 'skill-projectile';
        el.style.left = `${startX}px`;
        el.style.top = `${startY}px`;

        // Calculate rotation
        const dx = targetX - startX;
        const dy = targetY - startY;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        el.style.transform = `rotate(${angle}deg)`;

        // Texture Handling
        // Texture Handling
        if (texture) {
            // Check if it's an image path (contains / or .)
            if (texture.includes('/') || texture.includes('.')) {
                el.style.backgroundImage = `url('${texture}')`;
                el.style.backgroundSize = 'contain';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.width = '30px';
                el.style.height = '30px';
                el.style.backgroundColor = 'transparent';
                el.style.border = 'none';
            } else {
                // Emoji
                el.innerText = texture;
                el.style.fontSize = '24px';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                el.style.width = '30px';
                el.style.height = '30px';
                el.style.backgroundColor = 'transparent';
                el.style.border = 'none';
                el.style.textShadow = '0 0 5px #ff4400';
            }
        }

        document.body.appendChild(el);

        // Force reflow
        el.getBoundingClientRect();

        // Animate
        requestAnimationFrame(() => {
            el.style.left = `${targetX}px`;
            el.style.top = `${targetY}px`;
        });

        // Cleanup
        setTimeout(() => el.remove(), 300); // match transition duration
    }

    castValkyrie() {
        if (!window.gameState.activeClones) window.gameState.activeClones = [];

        const stats = this.getSkillStats('amazon_2');
        const duration = stats ? (stats.duration / 1000) : 45.0;

        const existing = window.gameState.activeClones.find(c => c.type === 'valkyrie');
        if (existing) {
            existing.duration = duration;
            existing.attackTimer = 0;
            window.gameState.addToLog(`<span style="color:#ffd700">Refreshed Valkyrie!</span>`);
            if (window.showCombatEffect) window.showCombatEffect("✨ REFRESH!", "#ffd700");
            return true;
        }

        // Reusing skeleton/golem logic but with 'valkyrie' type (gold color?)
        window.gameState.activeClones.push({ duration: duration, attackTimer: 0, type: 'valkyrie' });
        window.gameState.addToLog(`<span style="color:#ffd700">Valkyrie Summoned!</span>`);
        if (window.showCombatEffect) window.showCombatEffect("✨ VALKYRIE", "#ffd700");
        return true;
    }

    castStrafe() {
        if (!window.gameState.buffs) window.gameState.buffs = {};
        const stats = this.getSkillStats('amazon_3');
        const duration = stats ? stats.duration : 15000;
        const speed = stats ? (stats.speedMult * 100) : 100;

        window.gameState.buffs.strafeExpires = Date.now() + duration;
        window.gameState.recalculateStats();
        window.gameState.addToLog(`<span style="color:#00ffff">Strafe! +${speed}% Attack Speed for ${duration / 1000}s.</span>`);
        if (window.showCombatEffect) window.showCombatEffect("⏩ STRAFE", "#00ffff");
        return true;
    }

    castCriticalStrike() {
        if (!window.gameState.buffs) window.gameState.buffs = {};
        const stats = this.getSkillStats('amazon_4');
        const duration = stats ? stats.duration : 10000;
        const critDmg = stats ? stats.critDmgMult : 2.0;

        window.gameState.buffs.criticalStrikeExpires = Date.now() + duration;
        window.gameState.recalculateStats();
        window.gameState.addToLog(`<span style="color:#ff0000">Critical Strike! ${critDmg}x Crit Damage for ${duration / 1000}s.</span>`);
        if (window.showCombatEffect) window.showCombatEffect("🎯 CRIT", "#ff0000");
        return true;
    }

    // --- Paladin ---
    castHolyLight(slotIndex) {
        // Visuals
        let startX = window.innerWidth / 2;
        let startY = window.innerHeight - 100;
        if (slotIndex !== undefined) {
            const skillSlot = document.querySelector(`.active-skill-slot[data-slot="${slotIndex}"]`);
            if (skillSlot) {
                const rect = skillSlot.getBoundingClientRect();
                startX = rect.left + rect.width / 2;
                startY = rect.top + rect.height / 2;
            }
        }
        const monsterEl = document.getElementById('monster-sprite');
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2 - 50;
        if (monsterEl) {
            const rect = monsterEl.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
        }

        // Projectile: Sparkles
        this.spawnProjectile(startX, startY, targetX, targetY, '✨');

        setTimeout(() => {
            const stats = this.getSkillStats('paladin_1');
            const dps = window.gameState.totalDps || 0;
            const clickDmg = window.gameState.totalClickDamage || 1;
            let baseDmg = dps > 0 ? dps : clickDmg;
            const dmgMult = stats ? stats.damageMult : 5.0;
            const duration = stats ? stats.duration : 5000;
            const dmg = baseDmg * dmgMult;

            window.gameState.damageMonster(dmg, true, 'skill');

            // Illuminate: Double Drops for 5s
            if (!window.gameState.buffs) window.gameState.buffs = {};
            window.gameState.buffs.holyLightDebuffExpires = Date.now() + duration;

            window.gameState.addToLog(`<span style="color:#ffff00">Holy Light! Damages and Illuminates target (Double Loot) for ${duration / 1000}s.</span>`);
            if (window.showCombatEffect) window.showCombatEffect(`✨ ${window.formatNumber(dmg)}`, '#ffff00');
        }, 300);

        return true;
    }

    castDivineShield() {
        if (!window.gameState.buffs) window.gameState.buffs = {};
        const stats = this.getSkillStats('paladin_2');
        const duration = stats ? stats.duration : 15000;
        const effect = stats ? stats.effect : 2.0;

        window.gameState.buffs.divineAegisExpires = Date.now() + duration;
        window.gameState.recalculateStats(); // Trigger stat update immediately
        window.gameState.addToLog(`<span style="color:#ffff00">Divine Aegis! ${effect}x Crit Damage for ${duration / 1000}s.</span>`);
        if (window.showCombatEffect) window.showCombatEffect(`🛡️ AEGIS`, '#ffff00');
        return true;
    }

    castSmite(slotIndex) {
        // Visuals
        let startX = window.innerWidth / 2;
        let startY = window.innerHeight - 100;
        if (slotIndex !== undefined) {
            const skillSlot = document.querySelector(`.active-skill-slot[data-slot="${slotIndex}"]`);
            if (skillSlot) {
                const rect = skillSlot.getBoundingClientRect();
                startX = rect.left + rect.width / 2;
                startY = rect.top + rect.height / 2;
            }
        }
        const monsterEl = document.getElementById('monster-sprite');
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2 - 50;
        if (monsterEl) {
            const rect = monsterEl.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
        }

        this.spawnProjectile(startX, startY, targetX, targetY, 'assets/skills/paladin/smite.png');

        setTimeout(() => {
            const stats = this.getSkillStats('paladin_3');
            const dps = window.gameState.totalDps || 0;
            const clickDmg = window.gameState.totalClickDamage || 1;
            let baseDmg = dps > 0 ? dps : clickDmg;
            const dmgMult = stats ? stats.damageMult : 8.0;
            const duration = stats ? stats.duration : 8000;
            const taken = stats ? (stats.damageTaken * 100) : 30;
            const dmg = baseDmg * dmgMult;

            window.gameState.damageMonster(dmg, true, 'skill');

            // Judgement: +30% Dmg Taken
            if (!window.gameState.buffs) window.gameState.buffs = {};
            window.gameState.buffs.smiteDebuffExpires = Date.now() + duration;

            window.gameState.addToLog(`<span style="color:#ffff00">Smite! Stuns and Judges target (+${taken}% Dmg Taken) for ${duration / 1000}s.</span>`);
            if (window.showCombatEffect) window.showCombatEffect(`🔨 ${window.formatNumber(dmg)}`, '#ffff00');
        }, 300);

        return true;
    }

    castAuraOfMight() {
        if (!window.gameState.buffs) window.gameState.buffs = {};
        const stats = this.getSkillStats('paladin_4');
        const duration = stats ? stats.duration : 20000;

        window.gameState.buffs.auraOfMightExpires = Date.now() + duration;
        window.gameState.addToLog(`<span style="color:#ffff00">Aura of Might! Clicks trigger Lightning for ${duration / 1000}s.</span>`);
        if (window.showCombatEffect) window.showCombatEffect(`⚡ AURA`, '#ffff00');
        return true;
    }

    castBackstab() {
        const stats = this.getSkillStats('rogue_1');
        const dmgMult = stats ? stats.damageMult : 6.0;
        const bonusMult = stats ? stats.bonusMult : 0.5;
        const threshold = stats ? stats.threshold : 0.5;

        const dps = window.gameState.totalDps || 0;
        const clickDmg = window.gameState.totalClickDamage || 1;
        let baseDmg = dps > 0 ? dps : clickDmg; // Fallback
        baseDmg *= dmgMult; // 600%

        let isExecutor = false;
        let isStealth = false;

        // Execute Bonus
        if (window.gameState.currentMonster && window.gameState.currentMonster.currentHp / window.gameState.currentMonster.maxHp < threshold) {
            baseDmg *= (1 + bonusMult);
            isExecutor = true;
        }

        // Stealth Bonus
        if (window.gameState.hasBuff('stealth')) {
            // Use Shadow Cloak stats if available
            const scStats = this.getSkillStats('rogue_4');
            const scMult = scStats ? scStats.critMult : 2.0;

            baseDmg *= scMult;
            isStealth = true;
            window.gameState.removeBuff('stealth');
        }

        // Apply Damage (Force Crit if Stealth)
        // We can pass a flag to damageMonster or just rely on multiplier.
        // damageMonster(amount, allowCrit, source)
        // If we want Guaranteed Crit, we need to modify GameState or just hack it by multiplying more?
        // Or better: The description says "Guaranteed Crit". 
        // Let's rely on standard crit calc but maybe pass a "forceCrit" arg?
        // GameState.damageMonster(amount, allowCrit, source)
        // Let's just simulate crit by multipling by CritDamage?
        // No, visual feedback needs to show "Crit".
        // Current GameState doesn't support forced crit param. 
        // I will just deal the massive damage and let random crit happen on top? 
        // "Guaranteed Crit" implies it uses the Crit Multiplier.
        if (isStealth) {
            const critMult = (window.gameState.multipliers.critDamage || 150) / 100;
            baseDmg *= critMult;
            // Visual text will be high, good enough.
            window.showCombatEffect("🗡️ BACKSTAB!", "#ff0000");
        }

        window.gameState.damageMonster(baseDmg, true, 'skill');
        window.gameState.addToLog(`<span style="color:#ff0000">Backstab! ${window.formatNumber(baseDmg)} Dmg ${isStealth ? '(Ambush)' : ''} ${isExecutor ? '(Execute)' : ''}</span>`);

        // Ensure Visual Feedback
        const dmgText = window.formatNumber(baseDmg);

        // Show Damage Number with Icon
        if (window.showCombatEffect) window.showCombatEffect(`🗡️ ${dmgText}`, "#ff0000");

        return true;
    }

    castPickpocket() {
        if (!window.gameState.currentMonster) return false;
        const stats = this.getSkillStats('rogue_2');
        const multiplier = stats ? stats.multiplier : 20;

        const monsterGold = window.gameState.getMonsterGold(window.gameState.currentMonster.maxHp);
        const stealAmount = monsterGold * multiplier;

        window.gameState.addResource('gold', stealAmount);
        window.showCombatEffect(`💰 +${window.formatNumber(stealAmount)}`, "#ffd700");
        window.gameState.addToLog(`<span style="color:#ffd700">Pickpocket! Stole ${window.formatNumber(stealAmount)} Gold.</span>`);
        return true;
    }

    castFanOfKnives() {
        const dps = window.gameState.averageDps || window.gameState.totalDps || 0;
        const stats = this.getSkillStats('rogue_3');
        const dmgMult = stats ? stats.damageMult : 3.0;
        const bleedMult = stats ? stats.bleedMult : 1.0;
        const duration = stats ? stats.duration : 10000;

        const dmg = dps * dmgMult;

        window.gameState.damageMonster(dmg, true, 'skill');

        // Apply Bleed: 100% DPS for 10s
        const bleedDps = dps * bleedMult;
        if (window.gameState.applyDot) {
            window.gameState.applyDot(bleedDps, duration / 1000, 'bleed');
        } else {
            console.warn("GameState.applyDot missing!");
        }

        window.showCombatEffect("🔪 BLEED", "#cc0000");
        window.gameState.addToLog(`<span style="color:#cc0000">Fan of Knives! Bleeding target for ${window.formatNumber(bleedDps)}/s</span>`);
        return true;
    }

    castShadowCloak() {
        // Reset Backstab Cooldown
        this.cooldowns['rogue_1'] = 0;
        this.updateCooldownVis(); // Immediate visual update

        // Apply Stealth Buff
        if (window.gameState.addBuff) {
            window.gameState.addBuff('stealth', 9999, '🌑'); // Infinite until hit/used
        }

        window.showCombatEffect("🌑 VANISH", "#555");
        // No stats for Shadow Cloak mostly, logic is reset + stealth. Cooldown handles itself.
        // Maybe later we scale stealth duration if needed.
        window.gameState.addToLog(`<span style="color:#999">Shadow Cloak! Backstab reset. Entered Stealth.</span>`);
        return true;
    }
}

window.SkillManager = SkillManager;
window.SkillData = SkillData;
