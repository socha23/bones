import { PLAYER_DEFENCE_DOM_ID } from "./playerView"

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