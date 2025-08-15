import * as THREE from 'three';
import { FaceType } from '../model/faceTypes';

const loader = new THREE.TextureLoader();

export const SWORD_PATH = 'faces/sword.png'
export const SHIELD_PATH = 'faces/shield.png'

const faceImages = {
    [FaceType.BLANK]: 'faces/blank.png',
    [FaceType.I1]: 'faces/i1.png',
    [FaceType.I2]: 'faces/i2.png',
    [FaceType.I3]: 'faces/i3.png',
    [FaceType.I4]: 'faces/i4.png',
    [FaceType.I5]: 'faces/i5.png',
    [FaceType.I6]: 'faces/i6.png',
    [FaceType.SWORD]: SWORD_PATH,
    [FaceType.SHIELD]: SHIELD_PATH,
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
