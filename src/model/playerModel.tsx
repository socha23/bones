export interface InfilctDamageResults {
    defenceLoss: number
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
        const defenceLoss = Math.min(this.defence, damage)
        this.defence -= defenceLoss
        damage -= defenceLoss
        
        const hpLoss = Math.min(this.hp, damage)
        this.hp -= hpLoss
        return {hpLoss: hpLoss, defenceLoss: defenceLoss}
    }
}

