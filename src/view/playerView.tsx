import { RoundController } from "../game/roundController"
import { SHIELD_PATH } from "./textures"

export interface PlayerViewParams {
    hp: number
    maxHp: number
    defence: number

}

export function getPlayerParams(c: RoundController): PlayerViewParams {
    return {
        hp: 10,
        maxHp: 10,
        defence: c.turn.defence
    }
}

export const PLAYER_DEFENCE_DOM_ID = "playerDefence"

const DEFENCE_ICON_SIZE = 48
const PlayerDefence = (p: {defence: number}) => <div id={"defence"} style={{
  display: "flex",
  alignItems: "center",
  gap: 10,
}}>
  <div 
    id={PLAYER_DEFENCE_DOM_ID}
    style={{
    fontSize: 64
  }}>{p.defence}</div>
  <div style={{
    width: DEFENCE_ICON_SIZE,
    height: DEFENCE_ICON_SIZE,
    backgroundImage: `url("${SHIELD_PATH}")`,
    backgroundSize: DEFENCE_ICON_SIZE,
  }}/>
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
