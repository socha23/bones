import React, { type MouseEvent, useState, useRef, useEffect } from "react";
import * as THREE from 'three';
import { Bone, Face } from "../model/gameModel";
import { onTrayResized, traySize } from "../game/trayController";
import { textureForFaceType } from "./textures";
import { RoundedBoxGeometry } from "./roundedBoxGeometry";

const FOV = 20
const CAMERA_HEIGHT = 28.5

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, CAMERA_HEIGHT)
camera.up.set(0, 1, 0); // top-down look  
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight)


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

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(traySize().width, traySize().height),
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
            color: 0x888888, //DICE_COLOR,
            shininess: 50,
            specular: 0x172022,
        })
        this.body = new THREE.Mesh(geometry, material);
        this.body.name = b.id
        this.body.castShadow = true;
    
        const faceDefs = [
            // x y z rotX rotY rotZ 
            [0, 0, b.size / 2, 0, 0, 0], // 1
            [0, 0, -b.size / 2, 0, 0, Math.PI / 2], // 6
            [b.size / 2, 0, 0, 0, Math.PI / 2, 0], // 2
            [-b.size / 2, 0, 0, 0, Math.PI / 2, Math.PI / 2], // 5
            [0, b.size / 2, 0, Math.PI / 2, 0, 0], // 3
            [0, -b.size / 2, 0, Math.PI / 2, 0, Math.PI / 2], // 4
        ]
        faceDefs.forEach((f, idx) => {
        const face = this._createFaceMesh(b, b.faces[idx])
        face.position.set(f[0], f[1], f[2])
        face.rotation.set(f[3], f[4], f[5])
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
        const pos = this.bone.position
        this.body.position.set(pos.x, pos.y, pos.z)
        const q = this.bone.quaternion
        this.body.quaternion.set(q.x, q.y, q.z, q.w)
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



export function addBoneMesh(b: Bone) {
    const mesh = new BoneMesh(b)
    scene.add(mesh.body)
    boneMeshes.set(b.id, mesh)
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

function resizeRenderer(width: number, height: number) {
    // trayHeight stays same, trayWidth gets
    const trayHeight = traySize().height
    const scale = height / trayHeight
    let trayWidth = width / scale
    onTrayResized(trayWidth, trayHeight)
    plane.geometry = new THREE.PlaneGeometry(trayWidth, trayHeight)
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    spotLight.position.set(trayWidth * 0.5, trayHeight * 0.5, CAMERA_HEIGHT * 0.75)

}

function onRendererClick(e: MouseEvent<HTMLDivElement>) {
    const boundingRect = renderer.domElement.getBoundingClientRect()
    const pickPosition = {
        x: ((e.clientX - boundingRect.x) / boundingRect.width) * 2 - 1,
        // not sure why reversing y is needed here
        y: -1 * (((e.clientY - boundingRect.y) / boundingRect.height) * 2 - 1),
    }
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(pickPosition, camera)
    // we disable recursive check to not catch faces
    const boneBodies = Array.from(boneMeshes.values()).map(bm => bm.body)
    const intersectedObjects = raycaster.intersectObjects(boneBodies, /*recursive=*/false)
    if (intersectedObjects.length) {
        const pickedObject = intersectedObjects[0].object
        const boneMesh = boneMeshes.get(pickedObject.name)!!
        console.log(`Clicked on ${boneMesh.getTopFace().type} `)
    }
}

export const DiceTray = () => {
    const ref = useRef<HTMLDivElement>(null)

    const [size, setSize] = useState({ width: 0, height: 0 })

    const [rendererMounted, setRendererMounted] = useState(false)

    function onSizeChanged() {
        if (ref.current) {
            const container = ref.current.getBoundingClientRect();
            if (container.height != size.height || container.width != size.width) {
                resizeRenderer(container.width, container.height)
                setSize({ width: container.width, height: container.height })
            }
        }
    }

    useEffect(() => {
        if (rendererMounted) {
            return
        }
        onSizeChanged()
        ref.current?.appendChild(renderer.domElement)
        window.addEventListener("resize", onSizeChanged);
        setRendererMounted(true)
    })

    return <div style={{
        width: "100%",
        height: "100%",
        border: "1px solid #ddd",
        borderRadius: 3,
    }}>
        <div ref={ref} style={{
            width: "100%",
            height: "100%",
        }}
            onClick={onRendererClick}
        />
    </div>
}