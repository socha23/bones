import { Bone } from '../model/gameModel';

import * as physics from '../model/physics'
import * as view from '../view/diceTray'

const currentBones: Bone[] = []

function roll(bones: Bone[]) {
    
}

export function update() {
    physics.update()
}

var trayWidth = 10
var trayHeight = 10

export function onTrayResized(width: number, height: number) {
    trayWidth = width
    trayHeight = height
    physics.updateBarrierPositions()
}

export function traySize() {
    return {
        width: trayWidth,
        height: trayHeight,
    }
}
