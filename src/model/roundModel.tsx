import { Bone } from "./gameModel"
import { Enemy } from "./enemyModel"
import { Turn } from "./turnModel"

export class Round {
    enemy: Enemy
    turn: Turn

    constructor(bones: Bone[], enemy: Enemy) {
        this.turn = new Turn(bones)
        this.enemy = enemy
    }
}
