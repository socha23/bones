export interface InfilctDamageResults {
    hpLoss: number
}

export class Player {
    maxHp: number
    hp: number
    
    attack: number = 0
    defence: number = 0

    constructor(hp: number) {
        this.maxHp = hp
        this.hp = hp
    }

    isKilled() {
        return this.hp <= 0
    }

    inflictDamage(damage: number): InfilctDamageResults {
        const inflicted = Math.min(this.hp, damage)
        this.hp -= inflicted
        return {hpLoss: inflicted}
    }
}

