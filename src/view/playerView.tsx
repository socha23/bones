import { currentRoundController } from "../game/gameController"
import { HpBar, Stat, withRefreshingProps } from "./common"
import { SHIELD_PATH, SWORD_PATH } from "./textures"
import { Player } from "../model/playerModel"
import { PLAYER_ATTACK_DOM_ID, PLAYER_DEFENCE_DOM_ID, PLAYER_HP_DOM_ID } from "./domElements"

const PlayerName = (p: {name: string}) => <div style={{
    fontSize: 20,
    fontWeight: "bold",
}}>{p.name}</div>



const _PlayerView = (p: {player: Player}) => <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    gap: 4,
}}>
    <PlayerName name={"Player"}/>
    <HpBar id={PLAYER_HP_DOM_ID} hp={p.player.hp} maxHp={p.player.maxHp} reverse={true}/>
    <Stat iconPath={SWORD_PATH} domId={PLAYER_ATTACK_DOM_ID}>{p.player.attack}</Stat>
    <Stat iconPath={SHIELD_PATH} domId={PLAYER_DEFENCE_DOM_ID}>{p.player.defence}</Stat>
</div>

export const PlayerView = withRefreshingProps(_PlayerView,
  () => ({player: currentRoundController().round.player}),
)