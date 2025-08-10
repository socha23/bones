import { addBoneBody, updateWorld, getBoneBodyPosition, getBoneBodyRotation, getBoneBodyRotationQuaternion } from "./physics"
import { addBoneMesh } from "../view/DiceTray"
import { updateBarrierPositions } from "./physics"
var boneIdx = 0

export interface Point3d {
    x: number,
    y: number,
    z: number,
}

interface BoneParams {
    size?: number,
    mass?: number,
}

export class Bone {
    id: string = "bone_" + boneIdx++ 
    size: number
    mass: number

    constructor(p: BoneParams) {
        this.size = p.size || 1
        this.mass = 1
    }

    get position() {
        return getBoneBodyPosition(this.id)
    }

    get rotation() {
        return getBoneBodyRotation(this.id)
    }

    get quaternion() {
        return getBoneBodyRotationQuaternion(this.id)
    }

}

const bones: Bone[] = []

export function addBone(p: BoneParams & {    
    position?: Point3d,
    rotation?: Point3d,
}, ) {
    const b = new Bone(p)
    bones.push(b)
    addBoneBody(b, 
        p.position || {x: 0, y: 0, z: 5}, 
        p.rotation || {x: 0, y: 0, z: 0}
    )
    addBoneMesh(b)
}

export function getAllBones() {
    return bones
}

export function update(deltaMs: number) {
    updateWorld(deltaMs)
}

var trayWidth = 10
var trayHeight = 10

export function onTrayResized(width: number, height: number) {
    trayWidth = width
    trayHeight = height
    updateBarrierPositions()
}

export function traySize() {
    return {
        width: trayWidth,
        height: trayHeight,
    }
}

