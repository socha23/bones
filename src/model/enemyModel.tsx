export interface EnemyParams {
    name: string,
    hp: number
} 

export class Enemy {
    name: string 
    startingHp: number
    hp: number

    constructor(p: EnemyParams) {
        this.name = p.name
        this.startingHp = p.hp
        this.hp = p.hp

    }
}