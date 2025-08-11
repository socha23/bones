import { Bone } from '../model/gameModel'
import { Turn } from '../model/turnModel'
import * as tray from './trayController'

export class TurnController {
    duringRoll = false
    turn: Turn

    constructor(bones: Bone[]) {
        this.turn = new Turn(bones)
    }

    roll() {
        if (this.duringRoll) {
            return
        }
        tray.reset()
        this.duringRoll = true
        const bones = this.turn.availableBones
        bones.forEach(b => {
            tray.addBone({bone: b})
        })
        tray.roll(bones, () => {this.onRollComplete()})
    }

    onRollComplete() {
        this.duringRoll = false
    }

    update() {
        tray.update()
    }
}
