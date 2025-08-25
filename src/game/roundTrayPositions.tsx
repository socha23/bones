import { Bone } from '../model/gameModel'
import { Point3d, TRAY_HEIGHT_UNITS, TRAY_WIDTH_UNITS } from './trayConsts'
import { currentRoundController } from './gameController'
import { getScreenPosition, getScreenPositionOrUndefined } from '../view/diceTray'


function turn() {
    return currentRoundController().turn
}

const RESULT_START = {
    x: -TRAY_WIDTH_UNITS / 2 + 1,
    y: 0,
}

const HOLD_START = {
    x: -TRAY_WIDTH_UNITS / 2 + 1,
    y: -TRAY_HEIGHT_UNITS /2 + 1,
}

const BONE_GAP = 0.5

const KEEP_AND_HOLD_DISTANCE = 1

const KEEP_AND_HOLD_LABELS_Y = HOLD_START.y + 1.35

export function keepLabelPosition(): Point3d | undefined {
    if (turn().keep.length == 0) {
        return undefined
    }
    let x = holdWidth()
    if (x > 0) {
        x += KEEP_AND_HOLD_DISTANCE
    }
    return {x: HOLD_START.x + x, y: KEEP_AND_HOLD_LABELS_Y, z: 0}
}

export function holdLabelPosition(): Point3d | undefined {
    if (turn().hold.length == 0) {
        return undefined
    }
    return {x: HOLD_START.x, y: KEEP_AND_HOLD_LABELS_Y, z: 0}
}

export function keepWidth() {
    if (turn().keep.length == 0) {
        return 0
    }
    let width = 0
    turn().keep.forEach(bb => {width += bb.size + BONE_GAP})
    return width - BONE_GAP 
}

export function keepWidthPx() {
    const w = keepWidth()
    if (w == 0) {
        return 0
    }
    const labelPos = keepLabelPosition()
    if (!labelPos) {
        return 0
    }
    const p1 = getScreenPosition(labelPos)
    const p2 = getScreenPosition({x: labelPos.x + w, y: labelPos.y, z: labelPos.z})
    return p2.left - p1.left
}

export function holdWidthPx() {
    const w = holdWidth()
    if (w == 0) {
        return 0
    }
    const labelPos = holdLabelPosition()
    if (!labelPos) {
        return 0
    }
    const p1 = getScreenPosition(labelPos)
    const p2 = getScreenPosition({x: labelPos.x + w, y: labelPos.y, z: labelPos.z})
    return p2.left - p1.left
}


export function holdWidth() {
    if (turn().hold.length == 0) {
        return 0
    }
    let width = 0
    turn().hold.forEach(bb => {width += bb.size + BONE_GAP})
    return width - BONE_GAP
}

export function boneHandPosition(b: Bone): Point3d {
    let x = HOLD_START.x

    function posWithX(x: number) {
        return {
            x: x, y: HOLD_START.y, z: b.size / 2
        }
    }

    if (turn().hold.length > 0) {
        for (let i = 0; i < turn().hold.length; i++) {
            const bb = turn().hold[i]
            x += bb.size / 2
            if (b === bb) {
                return posWithX(x)
            }
            x += bb.size / 2
            x += BONE_GAP
        }
        x -= BONE_GAP // gap after last one
        // gap between hold and keep
        x += KEEP_AND_HOLD_DISTANCE
    }

    for (let i = 0; i < turn().keep.length; i++) {
        const bb = turn().keep[i]
        x += bb.size / 2
        if (b === bb) {
            return posWithX(x)
        }
        x += bb.size / 2
        x += BONE_GAP
    }
    // bone not in hand
    throw "Bone not in hand!"
}

export function turnResultBonePosition(b: Bone) {
    const BONE_GAP = 0.5
    let x = RESULT_START.x

    for (let i = 0; i < turn().result.length; i++) {
        const bb = turn().result[i]
        x += bb.size / 2
        if (b === bb) {
            return {
                x: x, y: RESULT_START.y, z: b.size / 2
            }
        }
        x += bb.size / 2
        x += BONE_GAP
    }
    throw "Bone not in hold!"
}

