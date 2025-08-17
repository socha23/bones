import { Bone } from "./gameModel"
import { FaceType } from "./faceTypes"
import { Player } from "./playerModel"

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

    applyBoneResult(p: Player, b: Bone): BoneEffect {
        const topFace = b.lastResult.type
        const result: BoneEffect = {
            label: '',
            attackChange: 0,
            defenceChange: 0,
        }
        if (topFace == FaceType.SWORD) {
            p.attack += 1
            result.attackChange += 1
            result.label = "+1"
        } else if (topFace == FaceType.SHIELD) {
            p.defence += 1
            result.defenceChange++
            result.label = "+1"
        }
        return result
    }
   
}

function remove(bones: Bone[], b: Bone) {
        const index = bones.indexOf(b, 0)
        if (index < 0) {
            throw "Can't find bone to keep in available bones"
        }
        bones.splice(index, 1)        
}

export interface BoneEffect {
    label: string
    attackChange: number
    defenceChange: number
}

