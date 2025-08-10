import * as THREE from 'three';

const loader = new THREE.TextureLoader();


export const swordTexture = loader.load( 'faces/sword.png' );
swordTexture.colorSpace = THREE.SRGBColorSpace;
