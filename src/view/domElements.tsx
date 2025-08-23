export const PLAYER_DEFENCE_DOM_ID = "playerDefence"
export const PLAYER_ATTACK_DOM_ID = "playerAttack"

export const ENEMY_HP_DOM_ID = "enemyHp"

export const ENEMY_DEFENCE_DOM_ID = "enemyDefence"
export const ENEMY_ATTACK_DOM_ID = "enemyAttack"

export interface Position {
    left: number
    top: number
}

function getPositionByDomId(domId: string): Position {
    const elem = document.getElementById(domId)
    if (!elem) {
        throw `Can't find element by ID: ${domId}`
    }
    return elem.getBoundingClientRect()
}

export function getAttackAccumulationPosition() {
    return {
        left: 300,
        top: 50
    }
}

export function getPlayerDefencePosition() {
    return getPositionByDomId(PLAYER_DEFENCE_DOM_ID)
}

export function getPlayerAttackPosition() {
    return getPositionByDomId(PLAYER_ATTACK_DOM_ID)
}

export function getEnemyDefencePosition() {
    return getPositionByDomId(ENEMY_DEFENCE_DOM_ID)
}

export function getEnemyAttackPosition() {
    return getPositionByDomId(ENEMY_ATTACK_DOM_ID)
}

export function getEnemyHpPosition() {
    return getPositionByDomId(ENEMY_HP_DOM_ID)
}