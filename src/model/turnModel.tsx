import { Bone } from "./gameModel"
import { FaceType } from "./faceTypes"

export class Turn {
    allBones: Bone[]
    availableBones: Bone[] = []
    keep: Bone[] = []
    hold: Bone[] = []
    rerollsLeft: number = 2

    constructor(bones: Bone[]) {
        this.allBones = bones
        this.availableBones = bones
    }

    reset() {
        this.availableBones = [...this.allBones]
        this.keep = []
        this.hold = []
        this.rerollsLeft = 2
    }

    keepBone(b: Bone) {
        remove(this.availableBones, b)
        this.keep.push(b)
    }

    unkeepBone(b: Bone) {
        remove(this.keep, b)
        this.availableBones.push(b)
    }

    isAvailable(b: Bone) {
        return this.availableBones.indexOf(b) > -1
    }

    isInKeep(b: Bone) {
        return this.keep.indexOf(b) > -1
    }

    isInHold(b: Bone) {
        return this.hold.indexOf(b) > -1
    }

    moveKeepToHold() {
        this.keep.forEach(b => {this.hold.push(b)})
        this.keep = []
    }

    moveAvailableToHold() {
        this.availableBones.forEach(b => {this.hold.push(b)})
        this.availableBones = []
    }

    getResults(): TurnResult {
        const r = emptyTurnResult()
        this.hold.forEach(b => {this.applyBoneResult(b, r)})
        return r
    }

    /** this doesnt actually change state */
    applyBoneResult(b: Bone, r: TurnResult) {
        const f = b.lastResult
        switch (f.type) {
            case FaceType.BLANK:
                break
            case FaceType.I1:
                r.numeric += 1
                break
            case FaceType.I2:
                r.numeric += 2
                break
            case FaceType.I3:
                r.numeric += 3
                break
            case FaceType.I4:
                r.numeric += 4
                break
            case FaceType.I5:
                r.numeric += 5
                break
            case FaceType.I6:
                r.numeric += 6
                break
            case FaceType.SWORD:
                r.swords += 1
                break
            case FaceType.SHIELD:
                r.shields += 1
                break
            default:
                throw `Unknown face type effect for ${f.type}`
        }
    }
}


function remove(bones: Bone[], b: Bone) {
        const index = bones.indexOf(b, 0)
        if (index < 0) {
            throw "Can't find bone to keep in available bones"
        }
        bones.splice(index, 1)        
}

export interface TurnResult {
    swords: number
    shields: number
    numeric: number
}

export function emptyTurnResult(): TurnResult {
    return {
        swords: 0,
        shields: 0,
        numeric: 0,
    }
}
 


