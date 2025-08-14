import { Bone } from "./gameModel"

export class Turn {
    allBones: Bone[]
    availableBones: Bone[] = []
    keep: Bone[] = []
    hold: Bone[] = []

    constructor(bones: Bone[]) {
        this.allBones = bones
        this.availableBones = bones
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
}


function remove(bones: Bone[], b: Bone) {
        const index = bones.indexOf(b, 0)
        if (index < 0) {
            throw "Can't find bone to keep in available bones"
        }
        bones.splice(index, 1)        
}