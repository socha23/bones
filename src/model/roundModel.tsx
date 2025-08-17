import { Bone } from "./gameModel"
import { Enemy } from "./enemyModel"
import { Turn } from "./turnModel"
import { Player } from "./playerModel"

export class Round {
    bones: Bone[]    
    player: Player
    enemy: Enemy
    turn: Turn
    turnIdx: number = 0


    constructor(bones: Bone[], enemy: Enemy) {
        this.player = new Player(10)
        this.enemy = enemy
        this.bones = bones 
        this.turn = new Turn(bones)
    }

    nextTurn() {
        this.turnIdx++
        this.turn = new Turn(this.bones)
        this.enemy.planNextAction()
    }
}
