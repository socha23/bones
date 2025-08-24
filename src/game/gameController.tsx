import { RoundController } from './roundController';
import { goblin } from '../model/enemyModel';
import { log } from '../model/log';
import * as bones from '../model/bones'


log("Game started")
let roundController = new RoundController(
    () => {return [
        bones.startingBone(),
        bones.startingBone(),
        bones.upgradedBone(),
        bones.swordBone(),
        bones.shieldBone(),
    ]},
    () => {return goblin()}
)

export function currentRoundController() {
    return roundController
}

export function update() {
    roundController.update()
}
