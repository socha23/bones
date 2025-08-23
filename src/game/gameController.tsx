import { RoundController } from './roundController';
import { Bone } from '../model/gameModel';
import { goblin } from '../model/enemyModel';
import { FaceType } from '../model/faceTypes';
import { log } from '../model/log';

const STARTING_FACES = [
    FaceType.SWORD,
    FaceType.SWORD,
    FaceType.BLANK,
    FaceType.BLANK,
    FaceType.SHIELD,
    FaceType.SHIELD,
]

log("Game started")
let roundController = new RoundController(
    () => {return [
        new Bone({faces: STARTING_FACES}),
        new Bone({faces: STARTING_FACES}),
        new Bone({faces: STARTING_FACES}),
        new Bone({faces: STARTING_FACES}),
        new Bone({faces: STARTING_FACES}),
    ]},
    () => {return goblin()}
)

export function currentRoundController() {
    return roundController
}

export function update() {
    roundController.update()
}
