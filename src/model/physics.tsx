import * as CANNON from 'cannon-es';
import { Bone, type Point3d } from './gameModel';
import { TRAY_WIDTH, TRAY_HEIGHT } from './physConsts';

const GRAVITY = -0.0000982

const SCALE = 100

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

const planeShape = new CANNON.Box(new CANNON.Vec3(SCALE * TRAY_WIDTH, SCALE * TRAY_HEIGHT, 1))
const planeBody = new CANNON.Body({ mass: 0, shape: planeShape, material: planeMaterial})
//const planeShape = new CANNON.Plane()
planeBody.quaternion.setFromEuler(0, 0, 0)
planeBody.position.set(0, 0, -0.5)
world.addBody(planeBody)

const barrierLeft = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierLeft.quaternion.setFromEuler(0, Math.PI / 2, -Math.PI / 2)
barrierLeft.position.set(SCALE * -TRAY_WIDTH / 2 * 0.93, 0, 0);
world.addBody(barrierLeft);

const barrierRight = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierRight.quaternion.setFromEuler(Math.PI, -Math.PI / 2, -Math.PI / 2)
barrierRight.position.set(SCALE * TRAY_WIDTH / 2 * 0.93, 0, 0);
world.addBody(barrierRight);

const barrierTop = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierTop.quaternion.setFromEuler(-Math.PI / 2, -Math.PI, Math.PI / 2)
barrierTop.position.set(0, SCALE * TRAY_HEIGHT / 2 * 0.93, 0);
world.addBody(barrierTop);

const barrierBottom = new CANNON.Body({mass: 0, shape: new CANNON.Plane(), material: planeMaterial});
barrierBottom.quaternion.setFromEuler(Math.PI / 2, -Math.PI, Math.PI / 2)
barrierBottom.position.set(0, SCALE * -TRAY_HEIGHT / 2 * 0.93, 0);
world.addBody(barrierBottom);


const boneBodies = new Map<string, CANNON.Body>() 

export function addBoneBody(b: Bone, position: Point3d, rotation: Point3d) {
    const shape = new CANNON.Box(new CANNON.Vec3(SCALE * b.size / 2, SCALE * b.size / 2, SCALE * b.size / 2))
    const body = new CANNON.Body({ 
        mass: b.mass,
        shape: shape,
        material: boneMaterial,
        linearDamping: 0.01,
        angularDamping: 0.01,
    })
    body.position.set(SCALE * position.x, SCALE * position.y, SCALE * position.z)
    body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z)  
    
    body.velocity.set(-0.7, -.1, 0)
    body.angularVelocity.set(0, 5, 5)

    world.addBody(body)
    boneBodies.set(b.id, body)
}

export function getBoneBodyPosition(id: string) : Point3d {
    if (!boneBodies.has(id)) {
        throw `No such bone: ${id}`
    }
    const pos = boneBodies.get(id)!!.position
    return {x: pos.x / SCALE, y: pos.y / SCALE, z: pos.z / SCALE } 
}

export function getBoneBodyRotation(id: string) : Point3d {
    if (!boneBodies.has(id)) {
        throw `No such bone: ${id}`
    }
    const eulerRotation = new CANNON.Vec3()
    boneBodies.get(id)!!.quaternion.toEuler(eulerRotation)
    return eulerRotation
}

export function updateWorld(deltaMs: number) {
    world.step(Math.min(deltaMs, 100))
//    Array.from(boneBodies.values()).forEach(b => {
//        console.log("Pos: " + b.position)
//    })
}