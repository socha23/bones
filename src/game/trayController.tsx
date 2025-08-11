import * as CANNON from 'cannon-es'

import { Bone } from '../model/gameModel';
import * as physics from '../model/physics'
import * as view from '../view/diceTray'

export function roll(bones: Bone[], callback: () => void) {
    physics.roll(bones, callback)
}

export interface Point3d {
    x: number,
    y: number,
    z: number,
}

export function addBone(p: {
    bone: Bone,    
    position?: Point3d,
    rotation?: Point3d,
}, ) {
    
    physics.addBoneBody(p.bone, 
        p.position || {x: 100, y: 100, z: 5}, 
        p.rotation || {x: 0, y: 0, z: 0},
    )
    view.addBoneMesh(p.bone)
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

export function boneBody(boneId: string): CANNON.Body  {
        return physics.boneBody(boneId)
}

export function reset() {
    physics.clearBoneBodies()
    view.clearBoneMeshes()
}