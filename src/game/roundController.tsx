import { Bone } from '../model/gameModel'
import { Turn } from '../model/turnModel'
import * as view from '../view/diceTray'
import * as physics from '../model/physics'
import { Point3d, TRAY_HEIGHT_UNITS, TRAY_WIDTH_UNITS } from './trayConsts'
import { Round } from '../model/roundModel'
import { gsap } from "gsap"
import { FaceType } from '../model/faceTypes'
import { log } from '../model/log'
import { animatePlayerAttackEffect, spawnDecrease, spawnIncrease } from '../view/effects'
import { getEnemyHpPosition, getPlayerAttackPosition, getPlayerDefencePosition } from '../view/domElements'
import { describeEnemyAction, Enemy } from '../model/enemyModel'
import { Player } from '../model/playerModel'

export enum State {
    BEFORE_FIRST_ROLL,
    ROLL,
    BETWEEN_ROLLS,
    PLAYER_TURN_END,
    ENEMY_TURN,
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
        setTimeout(() => { this._roll() }, 1)
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
                x: x, y: -TRAY_HEIGHT_UNITS / 2 + 1, z: b.size / 2
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

        this.state = State.PLAYER_TURN_END
        new PlayerTurnEndSequencer(this, () => { this.onPlayerEndTurnComplete() }).execute()
    }

    onPlayerEndTurnComplete() {
        if (this.round.enemy.isKilled()) {
            log(`${this.round.enemy.name} is killed!`)
            // todo eor callback`
        } else {
            this.enemyTurn()
        }
    }

    enemyTurn() {
        this.state = State.ENEMY_TURN

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

class PlayerTurnEndSequencer {
    roundController: RoundController
    callback: () => void

    constructor(roundController: RoundController, onComplete: () => void) {
        this.roundController = roundController
        this.callback = onComplete
    }

    get round(): Round {
        return this.roundController.round
    }

    get turn(): Turn {
        return this.round.turn
    }

    // all player bones should be in the hold
    execute() {
        this._00_moveBonesToCenter()
    }

    _00_moveBonesToCenter() {
        this.turn.hold.forEach(b => {
            physics.moveBone(b.id, {
                position: this.roundController.turnResultBonePosition(b),
                quaternion: physics.FACE_UP_QUATERNION[b.lastResult.idx]
            })
        })
        this._10_jumpingBones()
    }

    _10_jumpingBones() {
        const tl = gsap.timeline()
        const BONE_JUMP_DIST = 0.8
        const BONE_JUMP_DURATION = 0.5
        this.turn.hold
            .filter(b => b.lastResult.type != FaceType.BLANK)
            .forEach(b => {
                const bb = physics.boneBody(b.id)
                const startY = this.roundController.turnResultBonePosition(b).y
                tl
                    .delay(0.5)
                    .add(gsap.to(bb, { y: startY + BONE_JUMP_DIST, duration: BONE_JUMP_DURATION / 2 }))
                    .call(() => {
                        const boneEffect = this.turn.applyBoneResult(this.round.player, b)
                        if (boneEffect.attackChange) {
                            spawnIncrease(gsap.timeline(), getPlayerAttackPosition(), "+" + boneEffect.attackChange)
                        }
                        if (boneEffect.defenceChange) {
                            spawnIncrease(gsap.timeline(), getPlayerDefencePosition(), "+" + boneEffect.defenceChange)
                        }
                    })
                    .add(gsap.to(bb, { y: startY, duration: BONE_JUMP_DURATION / 2 }))
            })
        tl.delay(0.5)
        tl.call(() => { this._20_applyPlayerAttack() })
    }

    _20_applyPlayerAttack() {
        if (this.round.player.attack > 0) {
            const tl = gsap.timeline()
            // flying sword
            tl.delay(0.5)
            animatePlayerAttackEffect(tl, getPlayerAttackPosition(), getEnemyHpPosition())
            tl.call(() => {
                this._21_afterAttackAnimation()
            })
        } else {
            this._30_afterPlayerAttack()
        }
    }

    _21_afterAttackAnimation() {
        const inflicted = this.round.enemy.inflictDamage(
            this.round.player.attack)
        if (inflicted.hpLoss > 0) {
            const tl = gsap.timeline()
            log(`Inflicted ${inflicted.hpLoss} damage`)
            spawnDecrease(tl, getEnemyHpPosition(), "-" + inflicted.hpLoss)
            tl.call(() => {this._30_afterPlayerAttack()})
        } else {
            this._30_afterPlayerAttack()
        }

    }

    _30_afterPlayerAttack() {
        this.round.player.attack = 0
        this.callback()
    }
}

