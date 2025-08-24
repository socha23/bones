import { currentRoundController } from "../game/gameController"
import { HpBar, Stat, withRefreshingProps } from "./common"
import { ENEMY_ATTACK_DOM_ID, ENEMY_DEFENCE_DOM_ID, ENEMY_HP_DOM_ID } from "./domElements"
import { SHIELD_PATH, SWORD_PATH } from "./textures"

const EnemyActionView = (p: {action:{ attack: number, defence: number }}) => <div style={{
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

const EnemyName = (p: { name: string }) => <div style={{
    fontSize: 20,
    fontWeight: "bold",
}}>{p.name}</div>

interface EnemyProps {
    name: string,
    hp: number,
    maxHp: number,
    attack: number,
    defence: number,
    nextAction: {
        attack: number,
        defence: number
    }
}

function currentEnemyProps(): EnemyProps {
  const e = currentRoundController().round.enemy
  return {
    name: e.name,
    hp: e.hp,
    maxHp: e.maxHp,
    attack: e.attack,
    defence: e.defence,
    nextAction: {
        attack: e.nextAction.attack,
        defence: e.nextAction.defence,
    }
  }
}

const _EnemyView = (p: EnemyProps) => <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: 4,
}}>
    <EnemyName name={p.name} />
    <HpBar id={ENEMY_HP_DOM_ID} hp={p.hp} maxHp={p.maxHp} reverse={false} />
    <Stat iconPath={SWORD_PATH} domId={ENEMY_ATTACK_DOM_ID}>{p.attack}</Stat>
    <Stat iconPath={SHIELD_PATH} domId={ENEMY_DEFENCE_DOM_ID}>{p.defence}</Stat>
    <div style={{
        marginTop: 10,
        borderTop: "1px solid #ddd",
        paddingTop: 10,

    }}>
        <div style={{ fontSize: 14 }}>Next action:</div>
        <EnemyActionView action={p.nextAction} />
    </div>
</div>

export const EnemyView = withRefreshingProps(_EnemyView,
    () => { return currentEnemyProps() },
)