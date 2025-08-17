export enum EnemyActionType {
    ATTACK,
    DEFEND
}

interface EnemyAction {
    type: EnemyActionType
    value: number
}

type ActionGenerator = (e: Enemy) => EnemyAction


export interface EnemyParams {
    name: string,
    hp: number,
    actionGenerator: ActionGenerator,
} 

export interface InfilctDamageResults {
    hpLoss: number
}

export function describeEnemyAction(e: Enemy, a: EnemyAction) {
    if (a.type == EnemyActionType.ATTACK) {
        return `${e.name} attacks for ${a.value} damage`
    } else if (a.type == EnemyActionType.DEFEND) {
        return `${e.name} shields up for ${a.value} defence`
    } else {
        throw `Can't describe action of type ${a.type}`
    }
}

export class Enemy {
    name: string 
    maxHp: number
    hp: number
    actionNo: number = 0
    actionGenerator: ActionGenerator
    nextAction: EnemyAction
    
    attack: number = 0
    defence: number = 0

    constructor(p: EnemyParams) {
        this.name = p.name
        this.maxHp = p.hp
        this.hp = p.hp
        this.actionGenerator = p.actionGenerator
        this.nextAction = this.actionGenerator(this)
        this.actionNo++
    }

    planNextAction() {
        console.log("PLAN")
        this.nextAction = this.actionGenerator(this)
        this.actionNo++
    }

    applyNextAction() {
        if (this.nextAction.type == EnemyActionType.ATTACK) {
            this.attack += this.nextAction.value
        } else if (this.nextAction.type == EnemyActionType.DEFEND) {
            this.defence += this.nextAction.value
        } else {
            throw `Can't apply action of type ${this.nextAction.type}`
        }
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
    function goblinAction(e: Enemy) {
        console.log("Goblin action! ", e.actionNo)
            if (e.actionNo % 2 == 0) {
                return {
                    type: EnemyActionType.ATTACK,
                    value: 3
                }
            } else {
                return {
                    type: EnemyActionType.DEFEND,
                    value: 3
                }
            }
    }
    return new Enemy({name: "Goblin", hp: 10, actionGenerator: goblinAction})
}
