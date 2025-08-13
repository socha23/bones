import { Bone } from "../model/gameModel"

interface DiceHandParams {
    bonesHeld: Bone[]
    bonesKept: Bone[]
    onKeptClick: (b: Bone) => void
}


const BONE_SIZE = 40

const BoneView = (p: { bone: Bone, onClick: () => void }) => <div
    onClick={p.onClick}
    style={{
        cursor: "pointer",
        width: BONE_SIZE,
        height: BONE_SIZE

    }}>
        {p.bone.id}
        {p.bone.lastResult.type}

</div>


const BoneRow = (p: { bones: Bone[], onBoneClick?: (b: Bone) => void }) => <div
    style={{
        display: "flex",
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
        backgroundColor: "red",
        display: "flex",
    }}>
        <BoneRow bones={p.bonesHeld} />
        <BoneRow bones={p.bonesKept} onBoneClick={(b) => {p.onKeptClick(b)}}/>
    </div>
}