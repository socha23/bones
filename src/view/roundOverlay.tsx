import { TRAY_HEIGHT_PX, TRAY_WIDTH_PX } from './diceTray'
import {RoundController, State} from '../game/roundController';
import { TurnResult } from '../model/turnModel';
import { SHIELD_PATH, SWORD_PATH } from './textures';

export interface RoundOverlayParams {
  endOfTurnResult: TurnResult
  showBigAppliedTurnResult: boolean
}

export function getRoundOverlayParams(controller: RoundController): RoundOverlayParams {
  return {
    endOfTurnResult: controller.endOfTurnResult,
    showBigAppliedTurnResult: controller.state == State.DURING_TURN_EFFECTS
  }
}

const ICON_SIZE = 64
const BigNumberWithIcon = (p: {n: number, iconPath: string}) => <div style={{
  display: "flex",
  alignItems: "center",
  gap: 10,
}}>
  <div style={{
    fontSize: 96
  }}>{p.n}</div>
  <div style={{
    width: ICON_SIZE,
    height: ICON_SIZE,
    backgroundImage: `url("${p.iconPath}")`,
    backgroundSize: ICON_SIZE,
  }}/>
</div>


const BigAppliedTurnResult = (p: {result: TurnResult}) => <div style={{
  position: "absolute",
  top: 75,
  left: 75,
  display: "flex",
  gap: 40,
}}>
  {p.result.shields > 0 && <BigNumberWithIcon n={p.result.shields} iconPath={SHIELD_PATH}/>}
  {p.result.swords > 0 && <BigNumberWithIcon n={p.result.swords} iconPath={SWORD_PATH}/>}
  
</div>

export const RoundOverlay = (p: RoundOverlayParams) => <div style={{
      position: "absolute",
      width: TRAY_WIDTH_PX,
      height: TRAY_HEIGHT_PX,
      pointerEvents: "none",
      zIndex: 10,
  }}>
    {p.showBigAppliedTurnResult && <BigAppliedTurnResult result={p.endOfTurnResult} />}
  </div>
