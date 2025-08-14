import * as THREE from 'three';
import { FaceType } from '../model/faceTypes';

const loader = new THREE.TextureLoader();

const faceImages = {
    [FaceType.BLANK]: 'faces/blank.png',
    [FaceType.I1]: 'faces/i1.png',
    [FaceType.I2]: 'faces/i2.png',
    [FaceType.I3]: 'faces/i3.png',
    [FaceType.I4]: 'faces/i4.png',
    [FaceType.I5]: 'faces/i5.png',
    [FaceType.I6]: 'faces/i6.png',
    [FaceType.SWORD]: 'faces/sword.png',
}

const faceTextures = new Map<FaceType, THREE.Texture>()

export function textureForFaceType(t: FaceType): THREE.Texture {
    if (!faceTextures.has(t)) {
        faceTextures.set(t, loader.load(faceImages[t]))
    }
    return faceTextures.get(t)!!
}

export function imageForFaceType(t: FaceType): string {
    return faceImages[t]
}
