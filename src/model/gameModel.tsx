import { FaceType } from "./faceTypes"

var boneIdx = 0

export interface BoneParams {
    size?: number,
    mass?: number,
    color?: string,
}

export class Face {
    type: FaceType

    constructor(type: FaceType = FaceType.BLANK) {
        this.type = type
    }
}

export class Bone {
    id: string = "bone_" + boneIdx++ 
    color: string
    size: number
    mass: number
    faces: Face[]
    lastResult: Face = new Face(FaceType.BLANK)

    constructor(p: BoneParams) {
        this.size = p.size || 1
        this.color = p.color || "#888888"
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

}