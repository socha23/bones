import { FaceType } from "./faceTypes"

var boneIdx = 0

export interface BoneParams {
    name: string
    faces: FaceType[]
    size?: number
    mass?: number
    color: string

}

export class Face {
    idx: number
    type: FaceType

    constructor(idx: number, type: FaceType = FaceType.BLANK) {
        this.idx = idx
        this.type = type
    }
}

export class Bone {
    id: string = "bone_" + boneIdx++ 
    name: string
    color: string
    size: number
    mass: number
    faces: Face[]
    lastResult: Face = new Face(0)

    constructor(p: BoneParams) {
        this.name = p.name
        this.size = p.size || 1
        this.color = p.color
        this.mass = 1

        this.faces = p.faces.map((t, idx) => new Face(idx, t))
    }


}