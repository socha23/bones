import * as CANNON from 'cannon-es';
import { Bone } from './gameModel';
import {  Point3d, TRAY_HEIGHT_UNITS, TRAY_WIDTH_UNITS } from '../game/trayConsts';
import { gsap } from "gsap"

const GRAVITY = -9.82 * 5

const HAND_HEIGHT_UNITS = 2


const world = new CANNON.World()
world.gravity.set(0, 0, GRAVITY)
world.broadphase = new CANNON.NaiveBroadphase()
;(world.solver as CANNON.GSSolver).iterations = 15
//world.allowSleep = true

const boneMaterial = new CANNON.Material('bone')
const planeMaterial = new CANNON.Material('plane')
const barrierMaterial = new CANNON.Material('barrier')
world.addContactMaterial(new CANNON.ContactMaterial(planeMaterial, boneMaterial, { friction: 0.01, restitution: 0.5 }))
world.addContactMaterial(new CANNON.ContactMaterial(barrierMaterial, boneMaterial, { friction: 0.0, restitution: 0.6 }))
world.addContactMaterial(new CANNON.ContactMaterial(boneMaterial, boneMaterial, { friction: 0.0, restitution: 0.6 }))

//const planeShape = new CANNON.Box(new CANNON.Vec3(30, 30, 1))
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0, shape: planeShape, material: planeMaterial})
planeBody.quaternion.setFromEuler(0, 0, 0)
planeBody.position.set(0, 0, 0)
world.addBody(planeBody)

const barrierUp = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierUp.quaternion.setFromEuler(0, Math.PI, 0)
world.addBody(barrierUp);
barrierUp.position.set(0, 0, 5)

const barrierLeft = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: barrierMaterial});
barrierLeft.quaternion.setFromEuler(0, Math.PI / 2, -Math.PI / 2)
world.addBody(barrierLeft);

const barrierRight = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: barrierMaterial});
barrierRight.quaternion.setFromEuler(Math.PI, -Math.PI / 2, -Math.PI / 2)
world.addBody(barrierRight);

const barrierTop = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: barrierMaterial});
barrierTop.quaternion.setFromEuler(-Math.PI / 2, -Math.PI, Math.PI / 2)
world.addBody(barrierTop);

const barrierBottom = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: barrierMaterial});
barrierBottom.quaternion.setFromEuler(Math.PI / 2, -Math.PI, Math.PI / 2)
world.addBody(barrierBottom);

updateBarrierPositions()

var rollingBones: BoneAndBody[] = []

export function updateBarrierPositions() {
    barrierLeft.position.set(-TRAY_WIDTH_UNITS / 2 * 0.93, 0, 0);
    barrierRight.position.set(TRAY_WIDTH_UNITS / 2 * 0.93, 0, 0);
    barrierTop.position.set(0, TRAY_HEIGHT_UNITS / 2 * 0.93, 0);
    barrierBottom.position.set(0, -TRAY_HEIGHT_UNITS / 2 * 0.93 + HAND_HEIGHT_UNITS, 0);
}

export class BoneAndBody {
    bone: Bone
    body: CANNON.Body

    constructor(bone: Bone, body: CANNON.Body) {
        this.body = body
        this.bone = bone
    }

    freeze() {
        this.setMass(0)
    }

    unfreeze() {
        this.setMass(this.bone.mass)
    }

    straightenUp() {
        const euler = FACE_UP_EULER[this.bone.lastResult.idx]
        this.body.quaternion.setFromEuler(euler.x, euler.y, euler.z, "ZXY")
    }

    setMass(m: number) {
        const newBody = createBoneBody(this.bone, m)
        newBody.position = this.body.position
        newBody.quaternion = this.body.quaternion
        world.removeBody(this.body)
        world.addBody(newBody)
        this.body = newBody
    }

    get x() {
        return this.body.position.x
    }

    set x(val: number) {
        this.body.position.x = val
    }

    get y() {
        return this.body.position.y
    }

    set y(val: number) {
        this.body.position.y = val
    }

    get z() {
        return this.body.position.z
    }

    set z(val: number) {
        this.body.position.z = val
    }
}

export interface BoneState {
    position: Point3d,
    quaternion: CANNON.Quaternion,
}

const boneBodies = new Map<string, BoneAndBody>() 

function createBoneBody(b: Bone, mass: number) {
    const shape = new CANNON.Box(new CANNON.Vec3(b.size / 2, b.size / 2, b.size / 2))
    return new CANNON.Body({ 
        shape: shape,
        material: boneMaterial,
        mass: mass,
    })
}


function addBone(b: Bone, position: Point3d, rotation: CANNON.Quaternion) {
    const body = createBoneBody(b, 0)
    body.position.set(position.x, position.y, position.z)    
    body.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)  
    world.addBody(body)
    const bb = new BoneAndBody(b, body)
    boneBodies.set(b.id, bb)
}

function random(from: number, to: number) {
    return Math.random() * (to - from) + from
}

let duringRoll = false
let rollCallback = () => {}

export function roll(bones: Bone[], callback: () => void) {
    duringRoll = true
    rollingBones = []
    rollCallback = callback 
    bones.forEach((b, idx) => {
        const bb = boneBody(b.id)
        rollingBones.push(bb)
        bb.unfreeze()
        // set initial roll position
        bb.body.position.set(TRAY_WIDTH_UNITS / 2, -TRAY_HEIGHT_UNITS / 2 + HAND_HEIGHT_UNITS + idx, 2 + idx)
        // apply initial force        
        bb.body.applyImpulse(
            new CANNON.Vec3(random(-50, 0), random(-50, 0), random(3, 5)),
            new CANNON.Vec3(0, 0, .2) // point of application of force is shifted from the center of mass 
        )
        //bb.body.velocity.set(random(-60, -40), random(-40, 40), random(-20, 0))
        //bb.body.quaternion.setFromEuler(randomAngle(), randomAngle(), randomAngle())  
    })     
}

export function boneBody(id: string) {
    if (!boneBodies.has(id)) {
        throw `No such bone: ${id}`
    }
    return boneBodies.get(id)!!
}


export function boneState(id: string): BoneState {
    const body = boneBody(id).body
    return {
        position: body.position.clone(),
        quaternion: body.quaternion.clone(),
    }
}

export function setBoneState(id: string, state: BoneState) {
    const body = boneBody(id).body
    body.position = new CANNON.Vec3(state.position.x, state.position.y, state.position.z)
    body.quaternion = state.quaternion.clone()
}

function bonesStationary() {
    function small(n: number) {
        return Math.abs(n) < 0.01
    }
    const stillRolling = Array.from(boneBodies.values()).filter(b => 
        [
            b.body.velocity.x, b.body.velocity.y, b.body.velocity.z,
            b.body.angularVelocity.x, b.body.angularVelocity.y, b.body.angularVelocity.z
        ].find(v => !small(v))
    )
    return stillRolling.length === 0
}

const FACE_UP_EULER = [
    {x: 0, y: 0, z: 0},
    {x:  0, y: Math.PI / 2, z: Math.PI / 2}, // -0.5 0.5 0.5 0.5
    {x: Math.PI / 2, y: 0, z: Math.PI}, // 0 1 1 0
    {x: -Math.PI / 2, y: 0, z: -Math.PI / 2}, // -0.5 0.5 -0.5 0.5
    {x:  0, y: -Math.PI / 2, z: Math.PI / 2}, // 0.5 -0.5 0.5 0.5
    {x: 0, y: Math.PI, z: Math.PI}, // -1 0 0 0
]

export const FACE_UP_QUATERNION = FACE_UP_EULER.map(e => {
    const q = new CANNON.Quaternion()
    q.setFromEuler(e.x, e.y, e.z, "ZXY")
    return q
})

export function resetBones(bones: Bone[]) {
    clearBoneBodies()
    bones.forEach((b, idx) => {
        //q.setFromEuler(rot.x, rot.y, rot.z, "ZXY")
        addBone(b, {x: 100, y: idx * 10, z: b.size / 2}, new CANNON.Quaternion()) // out of board
    })
}

function clearBoneBodies() {
    Array.from(boneBodies.values()).forEach(bb => {
        world.removeBody(bb.body)
        boneBodies.delete(bb.bone.id)
    })
    duringRoll = false
}

export function update() {
    if (duringRoll) {
        world.fixedStep()
    }
    if (duringRoll && bonesStationary()) {
        duringRoll = false
        rollingBones.forEach(b => {
            b.freeze()
        })
        rollCallback()
        rollCallback = () => {}
    }
}

export function moveBone(bId: string, dest: {position: Point3d, quaternion?: CANNON.Quaternion}) {
    const bb = boneBody(bId)
    if (dest.quaternion != undefined) {
        bb.body.quaternion = dest.quaternion
    }
    gsap.to(bb, { 
        x: dest.position.x, y: dest.position.y, z: dest.position.z, 
        duration: 0.2 });
}


