import { addBoneBody, getBoneBodyPosition, getBoneBodyRotation, getBoneBodyRotationQuaternion, roll } from "./physics"
import { addBoneMesh } from "../view/diceTray"
import { rollAllBones } from "./physics"
import { FaceType } from "./faceTypes"
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

export class Face {
    type: FaceType

    constructor(type: FaceType = FaceType.BLANK) {
        this.type = type
    }
}

export class Bone {
    id: string = "bone_" + boneIdx++ 
    size: number
    mass: number
    faces: Face[]

    constructor(p: BoneParams) {
        this.size = p.size || 1
        this.mass = 1

        this.faces = [
            new Face(FaceType.I1),
            new Face(FaceType.I2),
            new Face(FaceType.I3),
            new Face(FaceType.I4),
            new Face(FaceType.I5),
            new Face(FaceType.I6),
        ]
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
        p.rotation || {x: 0, y: 0, z: 0},
    )
    addBoneMesh(b)
    return b
}

export function getAllBones() {
    return bones
}

export function getBone(id: string): Bone {
    return bones.find(b => b.id == id)!!
}

export function onRoll() {
    rollAllBones()
}
