import { FaceType } from "./faceTypes"

var boneIdx = 0

export interface BoneParams {
    size?: number,
    mass?: number,
    color?: string,
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
    color: string
    size: number
    mass: number
    faces: Face[]
    lastResult: Face = new Face(0)

    constructor(p: BoneParams) {
        this.size = p.size || 1
        this.color = p.color || "#888888"
        this.mass = 1

        this.faces = [
            new Face(0, FaceType.I1),
            new Face(1, FaceType.I2),
            new Face(2, FaceType.I3),
            new Face(3, FaceType.I4),
            new Face(4, FaceType.I5),
            new Face(5, FaceType.I6),
        ]
    }


}