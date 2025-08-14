import { Bone } from '../model/gameModel';
import * as physics from '../model/physics'
import { Turn } from '../model/turnModel';
import * as view from '../view/diceTray'
import * as game from './gameController'


export function roll(bones: Bone[], callback: () => void) {
    physics.roll(bones, () => {
        view.updateResults()
        callback()
    })
}

export function update() {
    physics.update()
}

export function resetBones(bones: Bone[]) {
    physics.resetBones(bones)
    view.resetBones(bones)
}

const rolledBoneStates = new Map<string, physics.BoneState>()

export function updateHand(t: Turn) {
    physics.layoutHand(t)
}


export function keepBone(b: Bone) {
    rolledBoneStates.set(b.id, physics.boneState(b.id))
}

export function unkeepBone(b: Bone) {
    const state = rolledBoneStates.get(b.id)!!
    physics.setBoneState(b.id, state)
    rolledBoneStates.delete(b.id)
}

export function onBoneClicked(b: Bone) {
    game.onBoneInTrayClicked(b)
}

view.setOnBoneClickHandler(onBoneClicked)