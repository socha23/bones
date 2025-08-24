import { useState } from "react"
import { Bone } from "../model/gameModel"
import { Position } from "./domElements"
import { getMouseX, getMouseY } from "./mouseCatcher"
import { withRefreshingProps } from "./common"

let currentlyHoveringBone: Bone | undefined
let currentTooltipPosition: Position | undefined

export function displayBoneTooltip(b: Bone | undefined) {
  if (b == undefined) {
    currentlyHoveringBone = undefined
  } else {
    currentlyHoveringBone = b
    currentTooltipPosition = {left: getMouseX(), top: getMouseY()}
  }
}

const BoneTooltip = (p: {bone: Bone}) => {

  return <div style={{
  position: "absolute",
  top: currentTooltipPosition?.top,
  left: currentTooltipPosition?.left
}}>
  BONE {p.bone.id}
</div>
}

const _TooltipOverlay = (p: {hoverBone: Bone | undefined}) => {
  return <div
    id="tooltipOverlay"
    style={{
      position: "absolute",
      top: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 20,
    }}>
      {p.hoverBone && <BoneTooltip bone={p.hoverBone}/>}
  </div>
}

export const TooltipOverlay = withRefreshingProps(_TooltipOverlay,
  () => ({hoverBone: currentlyHoveringBone}),
  (p1, p2) => p1.hoverBone == p2.hoverBone
) 

