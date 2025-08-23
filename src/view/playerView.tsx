import { PropsWithChildren } from "react"
import { RoundController } from "../game/roundController"
import { Icon } from "./common"
import { SHIELD_PATH, SWORD_PATH } from "./textures"
import { Player } from "../model/playerModel"
import { PLAYER_ATTACK_DOM_ID, PLAYER_DEFENCE_DOM_ID } from "./domElements"

export interface PlayerViewParams {
    player: Player
}

export function getPlayerParams(c: RoundController): PlayerViewParams {
  return {
        player: c.round.player
    }
}

let domIdAutoinc = 0

const Stat = (p: PropsWithChildren<{iconPath: string, domId?: string, size?: number}>) => {
  const domId = p.domId || "statValue" + domIdAutoinc++
  const size = p.size || 48
  return <div style={{
    display: "flex",
    alignItems: "center",
    gap: 4,
  }}>
    <Icon size={size * 0.75} path={p.iconPath}/>
    <div 
      id={domId}
      style={{
      fontSize: size,
    }}>{p.children}</div>
  </div>
  }

const PlayerName = (p: {name: string}) => <div style={{
    fontSize: 20,
    fontWeight: "bold",
}}>{p.name}</div>



export const PlayerView = (p: PlayerViewParams) => <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    gap: 4,
}}>
    <PlayerName name={"Player"}/>
    <div>HP: {p.player.hp} / {p.player.maxHp}</div>
    <Stat iconPath={SWORD_PATH} domId={PLAYER_ATTACK_DOM_ID}>{p.player.attack}</Stat>
    <Stat iconPath={SHIELD_PATH} domId={PLAYER_DEFENCE_DOM_ID}>{p.player.defence}</Stat>
</div>
