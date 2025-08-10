import React, { MouseEvent, useState, useRef, useEffect } from "react";
import * as THREE from 'three';
import { getAllBones, Bone, onTrayResized, traySize } from "../model/gameModel";

const SIZE_TO_PX_SCALE = 38.5 // experimentaly set to camera height

const DICE_COLOR = 0x202020

const FOV = 20
const CAMERA_HEIGHT = 28.5

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, CAMERA_HEIGHT)
camera.up.set(0, 1, 0); // top-down look  
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight)

    
scene.add(new THREE.AmbientLight(
    /*color=*/ 0xf0f5fb,
    /*intensity=*/ 1,
));


const spotLight = new THREE.SpotLight(0xffffff, /*intensity=*/ 5000.0);
scene.add(spotLight)
spotLight.position.set(5, 5, 20)
spotLight.target.position.set(0, 0, 0)
//spotLight.penumbra = 0.5
spotLight.distance = 50;
spotLight.castShadow = true;
//spotLight.shadowCameraNear = 0.001;
//spotLight.shadowCameraFar = 100;
//spotLight.shadowCameraFov = 75;
//spotLight.shadowBias = 100;
//spotLight.shadowDarkness = 1.1;
//spotLight.shadowMapWidth = 1024;
//spotLight.shadowMapHeight = 1024;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(traySize().width, traySize().height),
    //new THREE.MeshPhongMaterial({color: 0xff0000})
    new THREE.ShadowMaterial({opacity: 0.1})
)
plane.receiveShadow = true
scene.add(plane)

const boneMeshes = new Map<string, THREE.Mesh>()

export function addBoneMesh(b: Bone): THREE.Mesh {
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
    boneMeshes.set(b.id, mesh)
    return mesh
}

function updateBoneMesh(mesh: THREE.Mesh, bone: Bone) {
    mesh.position.set(bone.position.x, bone.position.y, bone.position.z)
    const q = bone.quaternion
    mesh.quaternion.set(q.x, q.y, q.z, q.w)
}

function updateScene() {
    getAllBones().forEach(bone => {
        updateBoneMesh(boneMeshes.get(bone.id), bone)
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
    let trayWidth = width  / scale
    onTrayResized(trayWidth, trayHeight)
    plane.geometry = new THREE.PlaneGeometry(trayWidth, trayHeight)
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
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