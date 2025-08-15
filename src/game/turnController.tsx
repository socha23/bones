import { Bone } from '../model/gameModel'
import { Turn } from '../model/turnModel'
import * as view from '../view/diceTray'
import * as physics from '../model/physics'
import { Point3d, TRAY_HEIGHT_UNITS, TRAY_WIDTH_UNITS } from './trayConsts'

enum State {
    BEFORE_FIRST_ROLL,
    ROLL,
    BETWEEN_ROLLS,
}

const rolledBoneStates = new Map<string, physics.BoneState>()

export class TurnController {
    state: State = State.BEFORE_FIRST_ROLL
    turn: Turn

    constructor(bones: Bone[]) {
        this.turn = new Turn(bones)
        physics.resetBones(bones)
        view.resetBones(bones)
        view.setController(this)
    }

    isClickable(b: Bone) {
        if (this.state == State.ROLL) {
            return false
        }
        return this.turn.isAvailable(b) || this.turn.isInKeep(b)
    }

    roll() {
        if (this.state == State.ROLL) {
            return
        }
        this.moveKeepToHold()
        this.state = State.ROLL
        const bones = this.turn.availableBones
        physics.roll(bones, () => {
            view.updateResults()
            this.state = State.BETWEEN_ROLLS
        })
    }

    update() {
        physics.update()
    }

    onBoneClick(b: Bone) {
        if (this.state != State.BETWEEN_ROLLS) {
            return
        }
        if (this.turn.isAvailable(b)) {
            this.keepBone(b)
        } else if (this.turn.isInKeep(b)) {
            this.unkeepBone(b)
        }
    }

    boneHandPosition(b: Bone): Point3d {
        const BONE_GAP = 0.5
    
        let x = -TRAY_WIDTH_UNITS / 2 + 1

        function posWithX(x: number) {
            return {
                x: x, y: -TRAY_HEIGHT_UNITS / 2 + 1, z: b.size /2
            }
        }

        if (this.turn.hold.length > 0) {
            for (let i = 0; i < this.turn.hold.length; i++) {
                const bb = this.turn.hold[i]
                x += bb.size / 2
                if (b === bb) {
                    return posWithX(x)
                }
                x += bb.size / 2
                x += BONE_GAP
            }
            x += BONE_GAP * 4
        }

        for (let i = 0; i < this.turn.keep.length; i++) {
            const bb = this.turn.keep[i]
            x += bb.size / 2
            if (b === bb) {
                return posWithX(x)
            }
            x += bb.size / 2
            x += BONE_GAP
        }
        // bone not in hand
        throw "Bone not in hand!"
    }

    keepBone(b: Bone) {
        rolledBoneStates.set(b.id, physics.boneState(b.id))
        this.turn.keepBone(b)
        physics.moveBone(b.id, {
            position: this.boneHandPosition(b),
            // straighten bone up on keep
            quaternion: physics.FACE_UP_QUATERNION[b.lastResult.idx],
        })
    }

    unkeepBone(b: Bone) {        
        this.turn.unkeepBone(b)

        const state = rolledBoneStates.get(b.id)!!
        rolledBoneStates.delete(b.id)
        physics.moveBone(b.id, state)

        this.turn.keep.forEach(b => {
            physics.moveBone(b.id, {
                position: this.boneHandPosition(b), 
            })
        })
    }

    isRollEnabled() {
        return this.state != State.ROLL
    }

    moveKeepToHold() {
        this.turn.moveKeepToHold()
        this.turn.hold.forEach(b => {
            physics.moveBone(b.id, {
                position: this.boneHandPosition(b)
            })
        })
    }


}
