import React, { MouseEvent, useState, useRef, useEffect } from "react";
import * as THREE from 'three';
import { getAllBones, Bone } from "../model/gameModel";
import { TRAY_HEIGHT, TRAY_WIDTH } from "../model/physConsts";

const DICE_COLOR = 0x202020

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 8)
camera.up.set(0, 1, 0); // top-down look  
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight)
const raycaster = new THREE.Raycaster()


scene.add(new THREE.AmbientLight(
    /*color=*/ 0xf0f5fb,
    /*intensity=*/ 1,
));


const spotLight = new THREE.DirectionalLight(0xffffff, /*intensity=*/ 1.0);
scene.add(spotLight)
scene.add(spotLight.target)
//spotLight.penumbra = 0.5
spotLight.position.set(3, 3, 50)
//spotLight.distance = 500;
spotLight.castShadow = true;
//spotLight.shadowCameraNear = 0.001;
//spotLight.shadowCameraFar = 100;
//spotLight.shadowCameraFov = 75;
//spotLight.shadowBias = 100;
//spotLight.shadowDarkness = 1.1;
//spotLight.shadowMapWidth = 1024;
//spotLight.shadowMapHeight = 1024;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(TRAY_WIDTH, TRAY_HEIGHT),
    new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
    })
)
plane.receiveShadow = true
scene.add(plane)

let boneMeshes = new Map<string, THREE.Mesh>()

function createMeshForBone(b: Bone): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(b.size, b.size, b.size)
    const material = new THREE.MeshPhongMaterial({ 
        color: DICE_COLOR,
        shininess: 200,
        specular: 0x172022,
        shading: THREE.FlatShading,
    })
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true
    scene.add(mesh)
    return mesh
}

function updateBoneMesh(mesh: THREE.Mesh, bone: Bone) {
    mesh.position.set(bone.position.x, bone.position.y, bone.position.z)
    const q = bone.quaternion
    mesh.quaternion.set(q.x, q.y, q.z, q.w)
}

function updateScene() {
    const newBoneMeshes = new Map<string, THREE.Mesh>()
    getAllBones().forEach(bone => {
        if (boneMeshes.has(bone.id)) {
            newBoneMeshes.set(bone.id, boneMeshes.get(bone.id))
        } else {
            newBoneMeshes.set(bone.id, createMeshForBone(bone))
        }
        updateBoneMesh(newBoneMeshes.get(bone.id), bone)
    })
    Array.from(boneMeshes.keys()).forEach(k => {
        if (!newBoneMeshes.has(k)) {
            scene.remove(boneMeshes.get(k))
        }
    })
    boneMeshes = newBoneMeshes
}

renderer.setAnimationLoop(() => {
    updateScene()
    renderer.render(scene, camera)
})

function resizeRenderer(width: number, height: number) {
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
}

function onRendererClick(e: MouseEvent<HTMLDivElement>) {
    const boundingRect = renderer.domElement.getBoundingClientRect()    
    const pickPosition = {
       x: ((e.clientX - boundingRect.x) / boundingRect.width) * 2 - 1,
       y: ((e.clientY - boundingRect.y) / boundingRect.height) * 2 - 1,
    }
    console.log("POSITION", pickPosition)
    raycaster.setFromCamera(pickPosition, camera)
    const intersectedObjects = raycaster.intersectObjects(Array.from(boneMeshes.values()))
    if (intersectedObjects.length) {
      const pickedObject = intersectedObjects[0].object
      window.alert("CLICK")
    }
  }

export const DiceTray = () => {
    const ref = useRef<HTMLDivElement>(null)

    const [size, setSize] = useState({width: 0, height: 0})

    const [rendererMounted, setRendererMounted] = useState(false)

    function onSizeChanged() {
        if (ref.current) {
            const container = ref.current.getBoundingClientRect();
            if (container.height != size.height || container.width != size.width) {
                resizeRenderer(container.width, container.height)
                setSize({width: container.width, height: container.height})
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

    return <div ref={ref} style={{
        width: "100%",
        height: "100%",
        border: "1px solid black",
    }}
        onClick={onRendererClick}
    >
    </div>
}