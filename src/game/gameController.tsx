import { TurnController } from './turnController';
import { Bone } from '../model/gameModel';

let turnController = new TurnController([
        new Bone({}),
        new Bone({}),
        new Bone({}),
        new Bone({}),
        new Bone({}),
    ])

export function currentTurnController() {
    return turnController
}

export function update() {
    turnController.update()
}

export function onBoneInTrayClicked(b: Bone) {
    turnController.onBoneInTrayClicked(b)
}