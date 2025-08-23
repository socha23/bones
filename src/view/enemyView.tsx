import { RoundController } from "../game/roundController"
import { Enemy, EnemyActionType } from "../model/enemyModel"
import { Icon } from "./common"
import { ENEMY_HP_DOM_ID } from "./domElements"
import { SHIELD_PATH, SWORD_PATH } from "./textures"

export interface EnemyViewParams {
    enemy: Enemy
}

export function getEnemyViewParams(c: RoundController): EnemyViewParams {
    return {
        enemy: c.round.enemy,
    }
}

const EnemyName = (p: {name: string}) => <div style={{
    fontSize: 20,
    fontWeight: "bold",
}}>{p.name}</div>



const EnemyAction_IconAndNumber = (p: {iconPath: string, number: number}) => <div style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
}}>
    <Icon path={p.iconPath} size={32}/>
    <div>{p.number}</div>
</div>

const EnemyAction_Attack = (p: {attack: number}) => <EnemyAction_IconAndNumber iconPath={SWORD_PATH} number={p.attack}/>
const EnemyAction_Defend = () => <Icon size={32} path={SHIELD_PATH}/>

const EnemyActionView = (p: {type: EnemyActionType, value: number}) =>  {
    if (p.type == EnemyActionType.ATTACK) {
        return <EnemyAction_Attack attack={p.value}/>
    } else if (p.type == EnemyActionType.DEFEND) {
        return <EnemyAction_Defend/> 
    } else {
        throw `Don't know view for enemy action ${p.type}`
    }
}

export const EnemyView = (p: EnemyViewParams) => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 10
}}>
    <EnemyName name={p.enemy.name}/>
    <div id={ENEMY_HP_DOM_ID}>HP: {p.enemy.hp} / {p.enemy.maxHp}</div>
    <div>Defence: {p.enemy.defence}</div>
    <div>Next action:</div>
    <EnemyActionView {...p.enemy.nextAction}/>
</div>