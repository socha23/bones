export interface EnemyAction {
    attack: number
    defence: number
}

type ActionGenerator = (e: Enemy) => EnemyAction


export interface EnemyParams {
    name: string,
    hp: number,
    actionGenerator: ActionGenerator,
    attack: number,
    defence: number,
} 

export interface InfilctDamageResults {
    hpLoss: number
}

export function describeEnemyAction(e: Enemy, a: EnemyAction): string[] {
    const result = []
    
    if (a.attack > 0) {
        result.push(`${e.name} attacks for ${a.attack} damage`)
    } 
    if (a.defence > 0) {
        result.push(`${e.name} shields up for ${a.defence} defence`)
    }
    if (result.length == 0) {
        result.push(`${e.name} does nothing`)
    } 
    return result
}

export class Enemy {
    name: string 
    maxHp: number
    hp: number
    actionNo: number = 0
    actionGenerator: ActionGenerator
    nextAction: EnemyAction
    
    attack: number
    defence: number

    constructor(p: EnemyParams) {
        this.name = p.name
        this.maxHp = p.hp
        this.hp = p.hp
        this.attack = p.attack
        this.defence = p.defence
        this.actionGenerator = p.actionGenerator
        this.nextAction = this.actionGenerator(this)
        this.actionNo++
    }

    planNextAction() {
        this.nextAction = this.actionGenerator(this)
        this.actionNo++
    }

    applyNextAction() {
        this.attack = this.nextAction.attack
        this.defence = this.nextAction.defence
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

export function goblin(): Enemy {
    function goblinAction(e: Enemy): EnemyAction {
        if (e.actionNo % 2 == 0) {
            return {attack: 0, defence: 3}
        } else {
            return {attack: 3, defence: 0}
        }
    }
    return new Enemy({name: "Goblin", 
        attack: 3,
        defence: 0,
        hp: 10, 
        actionGenerator: goblinAction})
}
