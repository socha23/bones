import { RoundController } from "../game/roundController"
import { Icon } from "./accumulatedAttact"
import { SHIELD_PATH } from "./textures"

export interface PlayerViewParams {
    hp: number
    maxHp: number
    defence: number

}

export function getPlayerParams(c: RoundController): PlayerViewParams {
  const player = c.round.player  
  return {
        hp: player.hp,
        maxHp: player.maxHp,
        defence: player.defence,
    }
}

export const PLAYER_DEFENCE_DOM_ID = "playerDefence"

const PlayerDefence = (p: {defence: number}) => <div id={"defence"} style={{
  display: "flex",
  alignItems: "center",
  gap: 10,
}}>
  <Icon size={48} path={SHIELD_PATH}/>
  <div 
    id={PLAYER_DEFENCE_DOM_ID}
    style={{
    fontSize: 64
  }}>{p.defence}</div>
</div>

const PlayerName = (p: {name: string}) => <div style={{
    fontSize: 20,
    fontWeight: "bold",
}}>{p.name}</div>

export const PlayerView = (p: PlayerViewParams) => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 10
}}>
    <PlayerName name={"Player"}/>
    <div>HP: {p.hp} / {p.maxHp}</div>
    <PlayerDefence defence={p.defence}/>
</div>
