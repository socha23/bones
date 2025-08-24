import { currentRoundController } from "../game/gameController"
import { HpBar, Stat, withRefreshingProps } from "./common"
import { SHIELD_PATH, SWORD_PATH } from "./textures"
import { PLAYER_ATTACK_DOM_ID, PLAYER_DEFENCE_DOM_ID, PLAYER_HP_DOM_ID } from "./domElements"

const PlayerName = (p: {name: string}) => <div style={{
    fontSize: 20,
    fontWeight: "bold",
}}>{p.name}</div>


interface PlayerProps {
  hp: number,
  maxHp: number,
  attack: number,
  defence: number,
}

function currentPlayerProps(): PlayerProps {
  const player = currentRoundController().round.player
  return {
    hp: player.hp,
    maxHp: player.maxHp,
    attack: player.attack,
    defence: player.defence,
  }
}

const _PlayerView = (p: PlayerProps) => <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    gap: 4,
}}>
    <PlayerName name={"Player"}/>
    <HpBar id={PLAYER_HP_DOM_ID} hp={p.hp} maxHp={p.maxHp} reverse={true}/>
    <Stat iconPath={SWORD_PATH} domId={PLAYER_ATTACK_DOM_ID}>{p.attack}</Stat>
    <Stat iconPath={SHIELD_PATH} domId={PLAYER_DEFENCE_DOM_ID}>{p.defence}</Stat>
</div>

export const PlayerView = withRefreshingProps(_PlayerView,
  () => {return currentPlayerProps()},
  )