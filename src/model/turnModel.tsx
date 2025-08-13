import { Bone } from "./gameModel"

export class Turn {
    allBones: Bone[]
    availableBones: Bone[] = []
    keep: Bone[] = []
    held: Bone[] = []

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
}


function remove(bones: Bone[], b: Bone) {
        const index = bones.indexOf(b, 0)
        if (index < 0) {
            throw "Can't find bone to keep in available bones"
        }
        bones.splice(index, 1)        
}