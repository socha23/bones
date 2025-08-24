import { Bone } from '../model/gameModel'
import { Turn } from '../model/turnModel'
import * as view from '../view/diceTray'
import * as physics from '../model/physics'
import { Point3d, TRAY_HEIGHT_UNITS, TRAY_WIDTH_UNITS } from './trayConsts'
import { Round } from '../model/roundModel'
import { gsap } from "gsap"
import { FaceType } from '../model/faceTypes'
import { log } from '../model/log'
import { animateAttackEffect, spawnDecrease, spawnIncrease } from '../view/effects'
import { getEnemyAttackPosition, getEnemyDefencePosition, getEnemyHpPosition, getPlayerAttackPosition, getPlayerDefencePosition, getPlayerHpPosition } from '../view/domElements'
import { describeEnemyAttack, describeShieldUp, Enemy } from '../model/enemyModel'

export enum State {
    BEFORE_FIRST_ROLL,
    ROLL,
    BETWEEN_ROLLS,
    PLAYER_TURN_END,
    ENEMY_TURN,
}

const rolledBoneStates = new Map<string, physics.BoneState>()

export class RoundController {
    bonesCreator: () => Bone[]

    state: State = State.BEFORE_FIRST_ROLL
    round: Round
    turnNo: number = 0
    enemyCreator: () => Enemy

    constructor(bonesCreator: () => Bone[], enemyCreator: () => Enemy) {
        view.setController(this)
        this.bonesCreator = bonesCreator
        this.enemyCreator = enemyCreator
        this.round = new Round(bonesCreator(), enemyCreator())
        this.onResetRound()

    }

    get turn(): Turn {
        return this.round.turn
    }

    getTopBarText() {
        if (this.state == State.ENEMY_TURN) {
            return "Enemy turn"
        } else {
            return "Player turn"
        }
    }

    onResetRound() {
        this.turnNo = 0
        this.round = new Round(this.bonesCreator(), this.enemyCreator())
        log(`Wild ${this.round.enemy.name} appears!`)
        this.onResetTurn()
    }

    onResetTurn() {
        this.turnNo++
        this.turn.reset()
        this.state = State.BEFORE_FIRST_ROLL
        physics.resetBones(this.turn.allBones)
        view.resetBones(this.turn.allBones)
        this.round.player.defence = 0
        this.round.player.attack = 0
        log(`Turn #${this.turnNo} started`)
        setTimeout(() => { this._roll() }, 1)
    }


    interfaceLocked() {
        return this.state == State.ROLL || this.state == State.PLAYER_TURN_END || this.state == State.ENEMY_TURN
    }

    isClickable(b: Bone) {
        if (this.interfaceLocked()) {
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
            this.onTurnWon()
        } else {
            this.state = State.ENEMY_TURN
            new EnemyTurnSequencer(this, () => { this.onEnemyTurnComplete() }).execute()
        }
    }

    onTurnWon() {
        window.alert(`${this.round.enemy.name} is dead! Play again?`)
        this.onResetRound()
    }

    onTurnLost() {
        window.alert("Player is dead! Play again?")
        this.onResetRound()
    }

    onEnemyTurnComplete() {
        if (this.round.player.hp <= 0) {
            log(`Player is dead!`)
            this.onTurnLost()
        } else {
            this.onResetTurn()
        }
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
                            spawnIncrease(getPlayerAttackPosition(), "+" + boneEffect.attackChange)
                        }
                        if (boneEffect.defenceChange) {
                            spawnIncrease(getPlayerDefencePosition(), "+" + boneEffect.defenceChange)
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
            tl.add(animateAttackEffect(getPlayerAttackPosition(), getEnemyHpPosition()))
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
        if (inflicted.defenceLoss == 0 && inflicted.hpLoss == 0) {
            this._30_afterPlayerAttack()
        }
        const tl = gsap.timeline()
        if (inflicted.defenceLoss > 0) {
            tl.add(spawnDecrease(getEnemyDefencePosition(), "-" + inflicted.defenceLoss), 0)
        }
        if (inflicted.hpLoss > 0) {
            log(`Inflicted ${inflicted.hpLoss} damage`)
            tl.add(spawnDecrease(getEnemyHpPosition(), "-" + inflicted.hpLoss), 0)
        }
        tl.call(() => {this._30_afterPlayerAttack()})
    }

    _30_afterPlayerAttack() {
        this.round.player.attack = 0
        this.callback()
    }
}


class EnemyTurnSequencer {
    roundController: RoundController
    enemy: Enemy
    callback: () => void

    constructor(roundController: RoundController, onComplete: () => void) {
        this.roundController = roundController
        this.callback = onComplete
        this.enemy = roundController.round.enemy
    }

    get round(): Round {
        return this.roundController.round
    }

    get turn(): Turn {
        return this.round.turn
    }

    execute() {
        this._20_applyEnemyAttack()
    }

    _20_applyEnemyAttack() {
        if (this.enemy.attack > 0) {
            const tl = gsap.timeline()
            // flying sword
            tl.delay(0.5)
            tl.add(animateAttackEffect(getEnemyAttackPosition(), getPlayerHpPosition()))
            tl.call(() => {
                this._21_afterAttackAnimation()
            })
        } else {
            this._30_afterEnemyAttack()
        }
    }

    _21_afterAttackAnimation() {
        const inflicted = this.round.player.inflictDamage(
            this.enemy.attack)
        log(describeEnemyAttack(this.enemy, inflicted))
        this.enemy.attack = 0
        if (inflicted.defenceLoss == 0 && inflicted.hpLoss == 0) {
            this._30_afterEnemyAttack()
        }
        const tl = gsap.timeline()
        if (inflicted.defenceLoss > 0) {
            tl.add(spawnDecrease(getPlayerDefencePosition(), "-" + inflicted.defenceLoss), 0)
        }
        if (inflicted.hpLoss > 0) {
            tl.add(spawnDecrease(getPlayerHpPosition(), "-" + inflicted.hpLoss), 0)
        }
        tl.call(() => {this._30_afterEnemyAttack()})
    }

    _30_afterEnemyAttack() {
        gsap.timeline()
            .delay(0.5)
            .call(() => {this._40_executeNextAction()})
    }

    _40_executeNextAction() {
        const a = this.enemy.nextAction
        this.enemy.applyNextAction()
        const tl = gsap.timeline()
        if (a.attack > 0) {
            tl.add(spawnIncrease(getEnemyAttackPosition(), "+" + a.attack))
        }
        if (a.defence > 0) {
            log(describeShieldUp(this.enemy))
            tl.add(spawnIncrease(getEnemyDefencePosition(), "+" + a.defence))
        }
        tl.call(() => {this._50_afterExecuteNextAction()})
    }

    _50_afterExecuteNextAction() {
        this.enemy.planNextAction()
        this.callback()
    }
}
