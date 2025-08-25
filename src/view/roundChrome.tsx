import { withRefreshingProps } from "./common"
import { Position } from "./domElements"
import * as positions from '../game/roundTrayPositions'
import { getScreenPositionOrUndefined } from "./diceTray"
import * as colors from './colors'
import { PropsWithChildren } from "react"

interface RoundChromeParams {
  keepLabelPosition: Position | undefined
  keepWidth: number
  holdLabelPosition: Position | undefined
  holdWidth: number
}

const Label = (p: PropsWithChildren<{position: Position, width: number}>) => <div style={{
        position: "absolute",
        left: p.position.left,
        top: p.position.top,
        color: colors.KEEP_AND_HOLD_LABELS,
        width: p.width,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.KEEP_AND_HOLD_LABELS,
        borderBottomStyle: "solid",
}}>
  {p.children}
</div>


const _RoundChromeOverlay = (p: RoundChromeParams) => {
  return <div
    id="chromeOverlay"
    style={{
      position: "absolute",
      top: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 15,
    }}>
      {p.keepLabelPosition && <Label position={p.keepLabelPosition} width={p.keepWidth}>KEEP</Label>}
      {p.holdLabelPosition && <Label position={p.holdLabelPosition} width={p.holdWidth}>HOLD</Label>}
  </div>
}

export const RoundChromeOverlay = withRefreshingProps(_RoundChromeOverlay,
  () => ({
    keepLabelPosition: getScreenPositionOrUndefined(positions.keepLabelPosition()),
    keepWidth: positions.keepWidthPx(),
    holdLabelPosition: getScreenPositionOrUndefined(positions.holdLabelPosition()),
    holdWidth: positions.holdWidthPx(),
  }),
) 

