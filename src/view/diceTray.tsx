import { type MouseEvent, useState, useRef, useEffect } from "react";
import * as THREE from 'three';
import { Bone, Face } from "../model/gameModel";
import { textureForFaceType } from "./textures";
import { RoundedBoxGeometry } from "./roundedBoxGeometry";
import { TRAY_WIDTH_UNITS, TRAY_HEIGHT_UNITS } from "../game/trayConsts";
import * as physics from "../model/physics"

const FOV = 20
const CAMERA_HEIGHT = 23

const RENDERER_WIDTH_PX = 800
const RENDERER_HEIGHT_PX = RENDERER_WIDTH_PX / TRAY_WIDTH_UNITS * TRAY_HEIGHT_UNITS

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(FOV, RENDERER_WIDTH_PX / RENDERER_HEIGHT_PX, 0.1, 100)
camera.position.set(0, 0, CAMERA_HEIGHT)
camera.up.set(0, 1, 0); // top-down look  
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor(0xffffff, 1);
renderer.setSize(RENDERER_WIDTH_PX, RENDERER_HEIGHT_PX)

scene.add(new THREE.AmbientLight(
    /*color=*/ 0xf0f5fb,
    /*intensity=*/ 1,
));


const spotLight = new THREE.SpotLight(0xffffff, /*intensity=*/ 3000.0);
scene.add(spotLight)
spotLight.target.position.set(0, 0, 0)
//spotLight.penumbra = 0.5
spotLight.distance = CAMERA_HEIGHT * 2;
spotLight.castShadow = true;
spotLight.position.set(
    TRAY_WIDTH_UNITS * 0.5, 
    TRAY_HEIGHT_UNITS * 0.5,
     CAMERA_HEIGHT * 0.75)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(TRAY_WIDTH_UNITS, TRAY_HEIGHT_UNITS),
    //new THREE.MeshPhongMaterial({color: 0xff0000})
    new THREE.ShadowMaterial({ opacity: 0.1 })
)
plane.receiveShadow = true
scene.add(plane)


class BoneMesh {
    bone: Bone
    body: THREE.Mesh
    faces: THREE.Mesh[] = []

    constructor(b: Bone) {
        this.bone = b
        const geometry = new RoundedBoxGeometry(b.size, b.size, b.size, 3, b.size / 10)
        const material = new THREE.MeshPhongMaterial({
            color: b.color, //DICE_COLOR,
            shininess: 50,
            specular: 0x172022,
        })
        this.body = new THREE.Mesh(geometry, material);
        this.body.name = b.id
        this.body.castShadow = true;
    
        const faceDefs = [
            // x y z rotX rotY rotZ 
            [0, 0, b.size / 2, 0, 0, 0], // 1
            [-b.size / 2, 0, 0, 0, Math.PI / 2, Math.PI / 2], // 2
            [0, b.size / 2, 0, Math.PI / 2, 0, 0], // 3
            [0, -b.size / 2, 0, Math.PI / 2, 0, Math.PI / 2], // 4
            [b.size / 2, 0, 0, 0, -Math.PI / 2, Math.PI / 2], // 5
            [0, 0, -b.size / 2, 0, Math.PI, Math.PI], // 6
        ]
        faceDefs.forEach((f, idx) => {
        const face = this._createFaceMesh(b, b.faces[idx])
        face.position.set(f[0], f[1], f[2])
        face.rotation.set(f[3], f[4], f[5], "XYZ")
        this.faces.push(face)
        this.body.add(face)
    })

    }

    _createFaceMesh(b: Bone, f: Face) {
        const material = new THREE.MeshPhongMaterial({
            transparent: true,
            map: textureForFaceType(f.type),
//            bumpMap: textureForFaceType(f.type),
        })
        return new THREE.Mesh(
            new THREE.BoxGeometry(b.size * 0.75, b.size * 0.75, 0.01),
            material
        )
    }
    
    updateMesh() {
        const state = physics.boneState(this.bone.id)
        this.body.position.set(state.position.x, state.position.y, state.position.z)
        this.body.quaternion.set(state.quaternion.x, state.quaternion.y, state.quaternion.z, state.quaternion.w)
    }

    updateResult() {
        this.bone.lastResult = this.getTopFace()
    }

    getTopFace(): Face {
        let topZ = -Infinity
        let topFaceIdx = null
        const v = new THREE.Vector3

        this.faces.forEach((f, idx) => {
            f.getWorldPosition(v)
            if (v.z > topZ) {
                topFaceIdx = idx
                topZ = v.z
            }
        })
        if (topFaceIdx == null) {
            console.log("Can't determine top face")
            topFaceIdx = 0
        }
        return this.bone.faces[topFaceIdx]
    }

}

const boneMeshes = new Map<string, BoneMesh>()

export function resetBones(bones: Bone[]) {
    clearBoneMeshes()
    bones.forEach(addBoneMesh)
}

function addBoneMesh(b: Bone) {
    const mesh = new BoneMesh(b)
    scene.add(mesh.body)
    boneMeshes.set(b.id, mesh)
}

function clearBoneMeshes() {
    Array.from(boneMeshes.keys()).forEach(id => {
        scene.remove(boneMeshes.get(id)!!.body)
        boneMeshes.delete(id)
    })
}

function updateScene() {
    Array.from(boneMeshes.values()).forEach(bm => {
        bm.updateMesh()
    })
}

renderer.setAnimationLoop(() => {
    updateScene()
    renderer.render(scene, camera)
})

interface Point2d {
    x: number,
    y: number,
}

let currentMousePosition: Point2d | undefined 

function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const boundingRect = renderer.domElement.getBoundingClientRect()
    currentMousePosition = {x: e.clientX - boundingRect.x, y: e.clientY - boundingRect.y}
}

function onMouseOut() {
    currentMousePosition = undefined
}

var onClickHandler = (b: Bone) => {}

export function setOnBoneClickHandler(h: (b: Bone) => void) {
    onClickHandler = h
}

function onRendererClick() {
    const b = mouseOverBone()
    if (b) {
        onClickHandler(b)
    }
}

export function mouseOverBone() : Bone | undefined {
    if (!currentMousePosition) {
        return undefined
    }
    const boundingRect = renderer.domElement.getBoundingClientRect()
    const pickPosition = {
        x: (currentMousePosition!.x / boundingRect.width) * 2 - 1,
        // not sure why reversing y is needed here
        y: -1 * ((currentMousePosition!.y / boundingRect.height) * 2 - 1),
    }
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(
        new THREE.Vector2(pickPosition.x, pickPosition.y), 
        camera)
    // we disable recursive check to not catch faces
    const boneBodies = Array.from(boneMeshes.values()).map(bm => bm.body)
    const intersectedObjects = raycaster.intersectObjects(boneBodies, /*recursive=*/false)
    if (intersectedObjects.length) {
        const pickedObject = intersectedObjects[0].object
        const boneMesh = boneMeshes.get(pickedObject.name)!!
        return boneMesh.bone
    } else {
        return undefined
    }
}

export function updateResults() {
    Array.from(boneMeshes.values()).forEach(m => {
        m.updateResult()
    })
}

export const DiceTray = () => {
    const ref = useRef<HTMLDivElement>(null)

    const [cursorOverBone, setCursorOverBone] = useState(false)

    const [rendererMounted, setRendererMounted] = useState(false)

    useEffect(() => {
        if (rendererMounted) {
            return
        }
        ref.current?.appendChild(renderer.domElement)
        setRendererMounted(true)
        setInterval(() => {
            setCursorOverBone(mouseOverBone() != undefined)
        }, 0.02)
    })

    return <div style={{
        border: "1px solid #ddd",
        width: RENDERER_WIDTH_PX + 2,
        borderRadius: 3,
        cursor: cursorOverBone ? "pointer" : "default",
    }}>
        <div ref={ref} style={{
            width: RENDERER_WIDTH_PX,
            height: RENDERER_HEIGHT_PX,
        }}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
            onClick={onRendererClick}
        />
    </div>
}