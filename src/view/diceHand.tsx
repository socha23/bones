import { Bone } from "../model/gameModel"
import { imageForFaceType } from "./textures"

interface DiceHandParams {
    bonesHeld: Bone[]
    bonesKept: Bone[]
    onKeptClick: (b: Bone) => void
}


const BONE_IN_TRAY = {
    size: 64,
    padding: 5,
    radius: 5,
    borderWidth: 1,
}

const BoneView = (p: { bone: Bone, onClick: () => void }) => <div
    onClick={p.onClick}
    style={{
        cursor: "pointer",
        width: BONE_IN_TRAY.size,
        height: BONE_IN_TRAY.size,
        border: `${BONE_IN_TRAY.borderWidth}px solid #666`,
        borderRadius: BONE_IN_TRAY.radius,
        padding: BONE_IN_TRAY.padding,
        backgroundColor: p.bone.color,
    }}>
        <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url(" + imageForFaceType(p.bone.lastResult.type) + ")",
            backgroundSize: "100%",
}}/>
</div>


const BoneRow = (p: { bones: Bone[], onBoneClick?: (b: Bone) => void }) => <div
    style={{
        display: "flex",
        gap: 10,
    }}>
    {
        p.bones.map(b => <BoneView 
            key={b.id} bone={b} 
            onClick={() => {
                if (p.onBoneClick) {
                    p.onBoneClick(b)
                }}
            }
            />)
    }

</div>


export const DiceHand = (p: DiceHandParams) => {
    return <div style={{
        height: 80,
        width: "100%",
        display: "flex",
        padding: 10,
        gap: 10,
    }}>
        <BoneRow bones={p.bonesHeld} />
        <BoneRow bones={p.bonesKept} onBoneClick={(b) => {p.onKeptClick(b)}}/>
    </div>
}