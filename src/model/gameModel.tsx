import { addBoneBody, updateWorld, getBoneBodyPosition, getBoneBodyRotation } from "./physics"

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
        this.size = p.size || 0.02
        this.mass = 0.005 // 5g
    }

    get position() {
        return getBoneBodyPosition(this.id)
    }

    get rotation() {
        return getBoneBodyRotation(this.id)
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
        p.position || {x: 0, y: 0, z: 0.3}, 
        p.rotation || {x: 0, y: 0, z: 0}
    )
}

export function getAllBones() {
    return bones
}

export function update(deltaMs: number) {
    updateWorld(deltaMs)
}
