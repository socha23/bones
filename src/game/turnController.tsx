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
        view.setOnBoneClickHandler((b) => {this.onBoneClick(b)})
    }

    roll() {
        if (this.state == State.ROLL) {
            return
        }
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

    keepBone(b: Bone) {
        rolledBoneStates.set(b.id, physics.boneState(b.id))
        const newIdx = this.turn.keep.length
        this.turn.keepBone(b)
        physics.moveBone(b.id, {
            position: this.boneKeepPosition(b, newIdx),
            // straighten bone up on keep
            quaternion: physics.FACE_UP_QUATERNION[b.lastResult.idx],
        })
    }

    boneKeepPosition(b: Bone, idxInKeep: number): Point3d {
        const BONE_GAP = 0.5
    
        let x = -TRAY_WIDTH_UNITS / 2 + 1
        let y = -TRAY_HEIGHT_UNITS / 2 + 1 

        for (let i = 0; i < idxInKeep; i++) {
            x += this.turn.keep[i].size
            x += BONE_GAP
        }
        x += b.size / 2
        return {
            x: x,
            y: y,
            z: b.size / 2
        }
    }

    unkeepBone(b: Bone) {
        
        const keepIdx = this.turn.keep.indexOf(b)
        this.turn.unkeepBone(b)

        const state = rolledBoneStates.get(b.id)!!
        rolledBoneStates.delete(b.id)
        physics.moveBone(b.id, state)

        // move later bones back to close the gap
        for (let i = keepIdx; i < this.turn.keep.length; i++) {
            const b = this.turn.keep[i]
            const current = physics.boneState(b.id)
            physics.moveBone(b.id, {
                position: this.boneKeepPosition(b, i), 
                quaternion: current.quaternion
            })
        }
    }

    isRollEnabled() {
        return this.state != State.ROLL
    }
}
