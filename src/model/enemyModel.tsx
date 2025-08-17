export interface EnemyParams {
    name: string,
    hp: number
} 

export interface InfilctDamageResults {
    hpLoss: number
}

export class Enemy {
    name: string 
    maxHp: number
    hp: number

    constructor(p: EnemyParams) {
        this.name = p.name
        this.maxHp = p.hp
        this.hp = p.hp

    }

    inflictDamage(hitDamage: number): InfilctDamageResults {
        const hpLoss = Math.min(this.hp, hitDamage)
        this.hp -= hpLoss
        return {
            hpLoss
        }
    }

    isKilled() {
        return this.hp <= 0
    }
}