import { Bone } from '../model/gameModel'
import { Turn } from '../model/turnModel'
import * as tray from './trayController'

enum State {
    BEFORE_FIRST_ROLL,
    ROLL,
    BETWEEN_ROLLS,

}

export class TurnController {
    state: State = State.BEFORE_FIRST_ROLL
    turn: Turn


    constructor(bones: Bone[]) {
        this.turn = new Turn(bones)
        tray.resetBones(bones)
    }

    roll() {
        if (this.state == State.ROLL) {
            return
        }
        this.state = State.ROLL
        const bones = this.turn.availableBones
        tray.roll(bones, () => {this.onRollComplete()})
    }

    onRollComplete() {
        this.state = State.BETWEEN_ROLLS
    }

    update() {
        tray.update()
    }

    onBoneInTrayClick(b: Bone) {
        if (this.state == State.BETWEEN_ROLLS) {
            this.keepBone(b)
        }
    }

    onBoneInKeptClick(b: Bone) {
        if (this.state == State.BETWEEN_ROLLS) {
            this.unkeepBone(b)
        }
    }

    keepBone(b: Bone) {
        tray.keepBone(b)
        this.turn.keepBone(b)
    }

    unkeepBone(b: Bone) {
        tray.unkeepBone(b)
        this.turn.unkeepBone(b)
    }

    isRollEnabled() {
        return this.state != State.ROLL
    }
}
