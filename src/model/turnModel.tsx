import { Bone } from "./gameModel"

export class Turn {
    allBones: Bone[]
    availableBones: Bone[] = []
    freshlyHeldBones: Bone[] = []
    heldBones: Bone[] = []

    constructor(bones: Bone[]) {
        this.allBones = bones
        this.availableBones = bones
    }

}