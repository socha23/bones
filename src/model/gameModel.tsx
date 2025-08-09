var boneIdx = 0

interface Point3d {
    x: number,
    y: number,
    z: number,
}

interface BoneParams {
    position?: Point3d,
    rotation?: Point3d,
    size?: number,
}

export class Bone {
    id: string = "bone_" + boneIdx++ 
    position: Point3d
    rotation: Point3d
    size: number

    constructor(p: BoneParams) {
        this.size = p.size || 1
        this.position = p.position || {x: 0, y: 0, z: 0}
        this.rotation = p.rotation || {x: 0, y: 0, z: 0}
    }
}

const bones: Bone[] = []

export function addBone(p: BoneParams) {
    bones.push(new Bone(p))
}

export function getAllBones() {
    return bones
}

export function animate() {
    bones.forEach(b => {
        b.rotation.x += 0.01
        b.rotation.y += 0.01
    })
}
