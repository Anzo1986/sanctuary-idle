class Monster {
    constructor(stage, isBoss = false) {
        this.stage = stage;
        this.isBoss = isBoss;

        const baseHp = 50 * Math.pow(1.3, stage - 1);
        this.maxHp = Math.ceil(isBoss ? baseHp * 30 : baseHp);
        this.currentHp = this.maxHp;

        this.generateIdentity(); // Sets name and visual

        this.timeLimit = isBoss ? 30 : null;
        this.timeRemaining = this.timeLimit;
    }

    generateIdentity() {
        if (this.isBoss) {
            const bosses = [
                { name: "Boss: The Butcher", icon: "🥩", img: "assets/monsters/butcher.png" },
                { name: "Boss: Hydra", icon: "🐍", img: "assets/monsters/hydra.jpg" },
                { name: "Boss: Golem", icon: "🗿", img: "assets/monsters/golem.png" },
                { name: "Boss: Echo of Lilith", icon: "😈", img: "assets/monsters/lilith_boss.png" },
                { name: "Boss: Duriel", icon: "🦂", img: "assets/monsters/duriel.png" }
            ];
            const boss = bosses[Math.floor(Math.random() * bosses.length)];
            this.name = boss.name;
            this.visual = boss.icon;
            this.image = boss.img;
            return;
        }

        const types = [
            { name: "Fallen", icon: "👿", img: "assets/monsters/fallen.png" },
            { name: "Skeleton", icon: "💀", img: "assets/monsters/skeleton.png" },
            { name: "Drowned Wretch", icon: "🧟", img: "assets/monsters/wretch.png" },
            { name: "Goatman", icon: "🐐", img: "assets/monsters/goatman.png" },
            { name: "Spider", icon: "🕷️", img: "assets/monsters/spider.png" },
            { name: "Succubus", icon: "🧚‍♀️", img: "assets/monsters/succubus.png" },
            { name: "Cultist", icon: "🧙", img: "assets/monsters/cultist.png" },
            { name: "Werewolf", icon: "🐺", img: "assets/monsters/werewolf.png" },
            { name: "Slime", icon: "💧", img: "assets/monsters/slime.png" },
            { name: "Harpy", icon: "🦅", img: "assets/monsters/harpy.png" },
            { name: "Void Wraith", icon: "👻", img: "assets/monsters/wraith.png" },
            { name: "Vampire", icon: "🧛‍♂️", img: "assets/monsters/vampire.png" },
            { name: "Ghost", icon: "👻", img: "assets/monsters/ghost.png" },
            { name: "Snake", icon: "🐍", img: "assets/monsters/snake.png" },
            { name: "Zombie", icon: "🧟", img: "assets/monsters/zombie.png" },
            { name: "Bat", icon: "🦇", img: "assets/monsters/bat.png" }
        ];

        const type = types[Math.floor(Math.random() * types.length)];
        this.name = type.name;
        this.visual = type.icon;
        this.image = type.img;
    }

    takeDamage(amount) {
        this.currentHp -= amount;
        if (this.currentHp < 0) this.currentHp = 0;
        return this.currentHp <= 0;
    }

    get hpPercent() {
        return (this.currentHp / this.maxHp) * 100;
    }
}
window.Monster = Monster;
