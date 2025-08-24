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
    [FaceType.SWORD_2]: 'faces/sword_2.png',
    [FaceType.SWORD_3]: 'faces/sword_3.png',
    [FaceType.SHIELD]: SHIELD_PATH,
    [FaceType.SHIELD_2]: 'faces/shield_2.png',
    [FaceType.SHIELD_3]: 'faces/shield_3.png',
    [FaceType.HOLD_SHIELD]: 'faces/hourglass_in_shield.png',
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
