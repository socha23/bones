import { Bone } from '../model/gameModel'
import { Turn } from '../model/turnModel'
import * as view from '../view/diceTray'
import * as physics from '../model/physics'
import { Point3d, TRAY_HEIGHT_UNITS, TRAY_WIDTH_UNITS } from './trayConsts'
import { Round } from '../model/roundModel'
import { gsap } from "gsap"
import { FaceType } from '../model/faceTypes'
import { log } from '../model/log'
import { spawnIncrease } from '../view/effects'
import { getPlayerAttackPosition, getPlayerDefencePosition } from '../view/domElements'
import { describeEnemyAction } from '../model/enemyModel'

export enum State {
    BEFORE_FIRST_ROLL,
    ROLL,
    BETWEEN_ROLLS,
    DURING_TURN_EFFECTS,
    AFTER_TURN_EFFECTS,
}

const rolledBoneStates = new Map<string, physics.BoneState>()

export class RoundController {
    state: State = State.BEFORE_FIRST_ROLL
    round: Round

    constructor(round: Round) {
        view.setController(this)
        this.round = round
        log(`Wild ${round.enemy.name} appears!`)
        this.onResetTurn()
    }

    get turn(): Turn {
        return this.round.turn
    }

    onResetTurn() {
        this.turn.reset()
        this.state = State.BEFORE_FIRST_ROLL
        physics.resetBones(this.turn.allBones)
        view.resetBones(this.turn.allBones)
        setTimeout(() => {this._roll()}, 1)
    }

    isClickable(b: Bone) {
        if (this.state == State.ROLL) {
            return false
        }
        return this.turn.isAvailable(b) || this.turn.isInKeep(b)
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
            // gap between hold and keep
            //x += BONE_GAP * 4
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

    turnResultBonePosition(b: Bone) {
        const BONE_GAP = 0.5 
        let x = -TRAY_WIDTH_UNITS / 2 + 1

        for (let i = 0; i < this.turn.hold.length; i++) {
            const bb = this.turn.hold[i]
            x += bb.size / 2
            if (b === bb) {
                return {
                    x: x, y: 0, z: b.size / 2
                }
            }
            x += bb.size / 2
            x += BONE_GAP
        }
        throw "Bone not in hold!"
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

    isRerollEnabled() {
        return this.state == State.BETWEEN_ROLLS
            && this.turn.rerollsLeft > 0
    }

    onReroll() {
        this.moveKeepToHold()
        this.turn.rerollsLeft--
        this._roll()
    }

    isEndTurnEnabled() {
        return this.state == State.BETWEEN_ROLLS
    }

    onEndTurn() {
        this.turn.moveKeepToHold()
        this.turn.moveAvailableToHold()
        // move bones to end positions
        this.turn.hold.forEach(b => {
            physics.moveBone(b.id, {
                position: this.turnResultBonePosition(b),
                quaternion: physics.FACE_UP_QUATERNION[b.lastResult.idx]
            })
        })
        this.state = State.DURING_TURN_EFFECTS
        this.accumulateBoneResults(() => {this.applyResults()}) 
    }

    accumulateBoneResults(then: () => void) {
        const BONE_JUMP_DIST = 0.8
        const BONE_JUMP_DURATION = 0.5
        let tl = gsap.timeline()
        this.turn.hold.forEach(b => {
            if (b.lastResult.type != FaceType.BLANK) {
                const bb = physics.boneBody(b.id)
                const startY = this.turnResultBonePosition(b).y
                tl
                    .delay(0.5)
                    .add(gsap.to(bb, {y: startY + BONE_JUMP_DIST, duration: BONE_JUMP_DURATION / 2}))
                    .call(() => { this.accumulateBoneResult(b)})
                    .add(gsap.to(bb, {y: startY, duration: BONE_JUMP_DURATION / 2}))
            }
        })
        tl.call(then)
    }

    accumulateBoneResult(b: Bone) {
        const boneEffect = this.turn.applyBoneResult(this.round.player, b)
        if (boneEffect.attackChange) {
           spawnIncrease(getPlayerAttackPosition(), "+" + boneEffect.attackChange)
        }
        if (boneEffect.defenceChange) {
            spawnIncrease(getPlayerDefencePosition(), "+" + boneEffect.defenceChange)
        }
    }

    applyResults() {
        const turnDamage = this.round.player.attack
        if (turnDamage > 0) {
            const inflicted = this.round.enemy.inflictDamage(turnDamage)
            log(`Inflicted ${inflicted.hpLoss} damage`)
            this.round.player.attack = 0
            this.afterAttackApplied()
        } else {
            this.afterAttackApplied()
        }   
    }

    afterAttackApplied() {
        if (this.round.enemy.isKilled()) {
            log(`${this.round.enemy.name} is killed!`)
            // todo eor callback`
        } else {
            this.enemyTurn()
        }
    }

    enemyTurn() {
        const enemy = this.round.enemy
        enemy.defence = 0
        log(describeEnemyAction(enemy, enemy.nextAction))
        enemy.applyNextAction()
        if (enemy.attack > 0) {
            const inflicted = this.round.player.inflictDamage(enemy.attack)
        }
        enemy.attack = 0
        this.round.player.defence = 0
        enemy.planNextAction()
        this.onResetTurn()
    }

    _roll() {
        this.state = State.ROLL
        const bones = this.turn.availableBones
        physics.roll(bones, () => {
            view.updateResults()
            this.state = State.BETWEEN_ROLLS
        })
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
