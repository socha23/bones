import { RoundController } from './roundController';
import { Bone } from '../model/gameModel';
import { Round } from '../model/roundModel';
import { Enemy } from '../model/enemyModel';
import { FaceType } from '../model/faceTypes';


const STARTING_FACES = [
    FaceType.SWORD,
    FaceType.SWORD,
    FaceType.BLANK,
    FaceType.BLANK,
    FaceType.SHIELD,
    FaceType.SHIELD,
]

const roundModel = new Round([
        new Bone({faces: STARTING_FACES}),
        new Bone({faces: STARTING_FACES}),
        new Bone({faces: STARTING_FACES}),
        new Bone({faces: STARTING_FACES}),
        new Bone({faces: STARTING_FACES}),
    ], new Enemy({
        name: "Goblin",
        hp: 10
    })

)

let roundController = new RoundController(roundModel)

export function currentRoundController() {
    return roundController
}

export function update() {
    roundController.update()
}
