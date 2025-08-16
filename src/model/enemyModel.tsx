export interface EnemyParams {
    name: string,
    hp: number
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
}