import { FaceType } from "./faceTypes"
import { Bone } from "./gameModel"

export function startingBone() {
    return new Bone({
        name: "Starter Bone",
        faces: [
            FaceType.SWORD,
            FaceType.SWORD,
            FaceType.BLANK,
            FaceType.BLANK,
            FaceType.SHIELD,
            FaceType.SHIELD,
        ], color: "#888888"
    })
}

export function upgradedBone() {
    return new Bone({
        name: "Upgraded Bone",
        faces: [
            FaceType.SWORD_2,
            FaceType.SWORD,
            FaceType.SWORD,
            FaceType.SHIELD,
            FaceType.SHIELD,
            FaceType.SHIELD_2,
        ], color: "#888888"
    })
}

export function swordBone() {
    return new Bone({
        name: "Sword Bone",
        faces: [
            FaceType.SWORD_3,
            FaceType.SWORD_2,
            FaceType.SWORD_2,
            FaceType.SWORD,
            FaceType.BLANK,
            FaceType.SHIELD,
        ], color: "#006dcc"
    })
}

export function shieldBone() {
    return new Bone({
        name: "Shield Bone",
        faces: [
            FaceType.HOLD_SHIELD,
            FaceType.SHIELD_3,
            FaceType.SHIELD_2,
            FaceType.SHIELD,
            FaceType.SHIELD,
            FaceType.BLANK,
        ], color: "#7f3300"
    })
}
