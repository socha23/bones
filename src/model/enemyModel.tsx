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
    defenceLoss: number
}

export function describeEnemyAttack(e: Enemy, result: InfilctDamageResults): string {
    if (result.hpLoss > 0) {
        return `${e.name} inflicts ${result.hpLoss} damage!`
    } else {
        return `${e.name} attacks, but it has no effect`
    }   
}

export function describeShieldUp(e: Enemy): string {
    return `${e.name} shields up`
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


    inflictDamage(damage: number): InfilctDamageResults {
        const defenceLoss = Math.min(this.defence, damage)
        this.defence -= defenceLoss
        damage -= defenceLoss
        
        const hpLoss = Math.min(this.hp, damage)
        this.hp -= hpLoss
        return {hpLoss: hpLoss, defenceLoss: defenceLoss}
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
