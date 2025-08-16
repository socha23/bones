import { RoundController } from "../game/roundController"
import { Enemy } from "../model/enemyModel"

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

export const EnemyView = (p: EnemyViewParams) => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 10
}}>
    <EnemyName name={p.enemy.name}/>
    <div>HP: {p.enemy.hp} / {p.enemy.maxHp}</div>
</div>