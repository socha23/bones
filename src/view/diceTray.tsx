import React, { MouseEvent, useState, useRef, useEffect } from "react";
import * as THREE from 'three';


const DICE_COLOR = 0x202020

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10)
camera.position.set(0, 0, 5)
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight)
const raycaster = new THREE.Raycaster()


scene.add(new THREE.AmbientLight(
    /*color=*/ 0xf0f5fb,
    /*intensity=*/ 2,
));


const spotLight = new THREE.PointLight(0xffffff, /*intensity=*/ 250.0);
scene.add(spotLight)
spotLight.position.set(2, 2, 5)
spotLight.distance = 10000;
spotLight.castShadow = true;
//spotLight.shadowCameraNear = 0.1;
//spotLight.shadowCameraFar = 100;
//spotLight.shadowCameraFov = 75;
//spotLight.shadowBias = 100;
spotLight.shadowDarkness = 1.1;
spotLight.shadowMapWidth = 1024;
spotLight.shadowMapHeight = 1024;


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
    })
)
plane.receiveShadow = true
scene.add(plane)



const geometry = new THREE.BoxGeometry( 1, 1, 1 )
const material = new THREE.MeshPhongMaterial({ 
    color: DICE_COLOR,
    shininess: 40,
    specular: 0x172022,
    shading: THREE.FlatShading,
} )
const cube = new THREE.Mesh( geometry, material );
cube.position.set(0, 0, 1)
cube.castShadow = true
scene.add( cube);


function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera );
}
renderer.setAnimationLoop( animate );

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
    raycaster.setFromCamera(pickPosition, camera)
    const intersectedObjects = raycaster.intersectObjects(scene.children)
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
    }}
        onClick={onRendererClick}
    >
    </div>
}