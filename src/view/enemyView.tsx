import { Enemy, EnemyAction } from "../model/enemyModel"
import { HpBar, Stat } from "./common"
import { ENEMY_ATTACK_DOM_ID, ENEMY_DEFENCE_DOM_ID, ENEMY_HP_DOM_ID } from "./domElements"
import { SHIELD_PATH, SWORD_PATH } from "./textures"

const EnemyActionView = (p: {action: EnemyAction}) => <div style={{
    display: "flex",
    gap: 4,
}}>
    {
        p.action.attack > 0 && <Stat size={24} iconPath={SWORD_PATH}>{p.action.attack}</Stat>
    }
    {
        p.action.defence > 0 && <Stat size={24} iconPath={SHIELD_PATH}>{p.action.defence}</Stat>
    }
</div>

const EnemyName = (p: {name: string}) => <div style={{
    fontSize: 20,
    fontWeight: "bold",
}}>{p.name}</div>

export const EnemyView = (p: {enemy: Enemy}) => <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: 4,
}}>
    <EnemyName name={p.enemy.name}/>
    <HpBar id={ENEMY_HP_DOM_ID} hp={p.enemy.hp} maxHp={p.enemy.maxHp} reverse={false}/>
    <Stat iconPath={SWORD_PATH} domId={ENEMY_ATTACK_DOM_ID}>{p.enemy.attack}</Stat>
    <Stat iconPath={SHIELD_PATH} domId={ENEMY_DEFENCE_DOM_ID}>{p.enemy.defence}</Stat>
    <div style={{
        marginTop: 10,
        borderTop: "1px solid #ddd",
        paddingTop: 10,

    }}>
        <div style={{fontSize: 14}}>Next action:</div>
        <EnemyActionView action={p.enemy.nextAction}/>
    </div>
</div>