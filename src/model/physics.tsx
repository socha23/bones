import * as CANNON from 'cannon-es';
import { Bone, getAllBones, traySize, type Point3d } from './gameModel';

const GRAVITY = -9.82 * 3

const world = new CANNON.World()
world.gravity.set(0, 0, GRAVITY)
world.broadphase = new CANNON.NaiveBroadphase()
;(world.solver as CANNON.GSSolver).iterations = 15
//world.allowSleep = true

const boneMaterial = new CANNON.Material('bone')
const planeMaterial = new CANNON.Material('plane')
const barrierMaterial = new CANNON.Material('barrier')
world.addContactMaterial(new CANNON.ContactMaterial(planeMaterial, boneMaterial, { friction: 0.01, restitution: 0.5 }))
world.addContactMaterial(new CANNON.ContactMaterial(barrierMaterial, boneMaterial, { friction: 0.0, restitution: 0.5 }))
world.addContactMaterial(new CANNON.ContactMaterial(boneMaterial, boneMaterial, { friction: 0.0, restitution: 0.5 }))

const planeShape = new CANNON.Box(new CANNON.Vec3(30, 30, 1))
const planeBody = new CANNON.Body({ mass: 0, shape: planeShape, material: planeMaterial})
//const planeShape = new CANNON.Plane()
planeBody.quaternion.setFromEuler(0, 0, 0)
planeBody.position.set(0, 0, -0.5)
world.addBody(planeBody)

const barrierLeft = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierLeft.quaternion.setFromEuler(0, Math.PI / 2, -Math.PI / 2)
world.addBody(barrierLeft);

const barrierRight = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierRight.quaternion.setFromEuler(Math.PI, -Math.PI / 2, -Math.PI / 2)
world.addBody(barrierRight);

const barrierTop = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierTop.quaternion.setFromEuler(-Math.PI / 2, -Math.PI, Math.PI / 2)
world.addBody(barrierTop);

const barrierBottom = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierBottom.quaternion.setFromEuler(Math.PI / 2, -Math.PI, Math.PI / 2)
world.addBody(barrierBottom);

updateBarrierPositions()

export function updateBarrierPositions() {
    const tray = traySize()
    barrierLeft.position.set(-tray.width / 2 * 0.93, 0, 0);
    barrierRight.position.set(tray.width / 2 * 0.93, 0, 0);
    barrierTop.position.set(0, tray.height / 2 * 0.93, 0);
    barrierBottom.position.set(0, -tray.height / 2 * 0.93, 0);
}

const boneBodies = new Map<string, CANNON.Body>() 

export function addBoneBody(b: Bone, position: Point3d, rotation: Point3d) {
    const shape = new CANNON.Box(new CANNON.Vec3(b.size / 2, b.size / 2, b.size / 2))
    const body = new CANNON.Body({ 
        mass: b.mass,
        shape: shape,
        material: boneMaterial,
        linearDamping: 0.1,
        angularDamping: 0.1,
    })
    body.position.set(position.x, position.y, position.z)
    body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z)  
    
    world.addBody(body)
    boneBodies.set(b.id, body)
}

function random(from: number, to: number) {
    return Math.random() * (to - from) + from
}

function randomAngle() {
    return random(0, 2 * Math.PI)
}

export function rollAllBones() {
    getAllBones().forEach(b => {roll(b)})    
}

export function roll(bone: Bone) {
    const body = boneBodies.get(bone.id)!!
    body.position.set(traySize().width / 2, 0, 2)

    body.velocity.set(random(-60, -40), random(-40, 40), random(-20, 0))
    body.quaternion.setFromEuler(randomAngle(), randomAngle(), randomAngle())  
}


export function getBoneBodyPosition(id: string) : Point3d {
    if (!boneBodies.has(id)) {
        throw `No such bone: ${id}`
    }
    const pos = boneBodies.get(id)!!.position
    return {x: pos.x, y: pos.y, z: pos.z } 
}

export function getBoneBodyRotation(id: string) : Point3d {
    const eulerRotation = new CANNON.Vec3()
    getBoneBodyRotationQuaternion(id).toEuler(eulerRotation)
    return eulerRotation
}


export function getBoneBodyRotationQuaternion(id: string) {
    if (!boneBodies.has(id)) {
        throw `No such bone: ${id}`
    }
    return boneBodies.get(id)!!.quaternion
}

export function updateWorld(deltaMs: number) {
    world.fixedStep()
    
    //world.step(Math.min(deltaMs, 100))
//    Array.from(boneBodies.values()).forEach(b => {
//        console.log("Pos: " + b.position)
//    })
}