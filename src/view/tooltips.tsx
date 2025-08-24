import { Bone, Face } from "../model/gameModel"
import { Position } from "./domElements"
import { getMouseX, getMouseY } from "./mouseCatcher"
import { Icon, withRefreshingProps } from "./common"
import { imageForFaceType } from "./textures"
import * as colors from './colors'
import { descriptionForFaceType } from "../model/faceTypes"

let currentlyHoveringBone: Bone | undefined
let currentTooltipPosition: Position | undefined

export function displayBoneTooltip(b: Bone | undefined) {
  if (b == undefined) {
    currentlyHoveringBone = undefined
  } else {
    currentlyHoveringBone = b
    currentTooltipPosition = {
      left: getMouseX() + 60, 
      top: getMouseY() - 40
    }
  }
}

const BONE_FACE_SIZE = 32

const BoneFace = (p: {bone: Bone, face: Face}) => <div style={{
  width: BONE_FACE_SIZE,
  height: BONE_FACE_SIZE,
  borderRadius: 4,
  backgroundColor: p.bone.color,
  padding: 4,
}}>
  <Icon size={BONE_FACE_SIZE - 8} path={imageForFaceType(p.face.type)}/>
</div>

const BoneFaceRow = (p: {bone: Bone, face: Face}) => <div style={{
  display: "flex",
  alignItems: "center",
  gap: 4,
}}>
  <BoneFace bone={p.bone} face={p.face}/>
  <div style={{
    flexGrow: 1,
    fontSize: 12,
    maxWidth: 140,
  }}>
    {descriptionForFaceType(p.face.type)}
  </div>
</div>

const BoneFaces = (p: {bone: Bone}) => <div style={{
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 4,
}}>
  {p.bone.faces.map((f, idx) => <BoneFaceRow key={idx} bone={p.bone} face={f}/>)}
</div>



const BoneTooltip = (p: {bone: Bone}) => <div style={{
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: colors.LIGHT_BORDERS,
  padding: 8,
  alignItems: "center",
  gap: 8,
  borderRadius: 3,
}}>
  <div style={{
    fontWeight: "bold",
    fontSize: 16,
    minWidth: 100,
  }}>
    {p.bone.name}
  </div>
  <BoneFaces bone={p.bone}/>
</div>


const BoneTooltipWithPositioning = (p: {bone: Bone}) => {

  return <div style={{
  position: "absolute",
  top: currentTooltipPosition?.top,
  left: currentTooltipPosition?.left
}}>
  <BoneTooltip bone={p.bone}/>
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
      {p.hoverBone && <BoneTooltipWithPositioning bone={p.hoverBone}/>}
  </div>
}

export const TooltipOverlay = withRefreshingProps(_TooltipOverlay,
  () => ({hoverBone: currentlyHoveringBone}),
  (p1, p2) => p1.hoverBone == p2.hoverBone
) 

