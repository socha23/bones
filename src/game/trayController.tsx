import * as CANNON from 'cannon-es'

import { Bone, BoneParams } from '../model/gameModel';
import * as physics from '../model/physics'
import * as view from '../view/diceTray'

const bones: Bone[] = []

export function roll() {
    physics.roll(bones)
}

export interface Point3d {
    x: number,
    y: number,
    z: number,
}

export function addBone(p: BoneParams & {    
    position?: Point3d,
    rotation?: Point3d,
}, ) {
    const b = new Bone(p)
    bones.push(b)
    
    physics.addBoneBody(b, 
        p.position || {x: 0, y: 0, z: 5}, 
        p.rotation || {x: 0, y: 0, z: 0},
    )
    view.addBoneMesh(b)
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