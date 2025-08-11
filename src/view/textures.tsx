import * as THREE from 'three';
import { FaceType } from '../model/faceTypes';

const loader = new THREE.TextureLoader();

const textures = {
    [FaceType.BLANK]: loader.load('faces/blank.png'),
    [FaceType.I1]: createTextTexture("1"),
    [FaceType.I2]: createTextTexture("2"),
    [FaceType.I3]: createTextTexture("3"),
    [FaceType.I4]: createTextTexture("4"),
    [FaceType.I5]: createTextTexture("5"),
    [FaceType.I6]: createTextTexture("6"),
    [FaceType.SWORD]: loader.load('faces/sword2.png'),
}


export function textureForFaceType(t: FaceType) {
    return textures[t]
}

function createTextTexture(text: string) {
    var canvas = document.createElement("canvas")
    var context = canvas.getContext("2d")!!
    const ts = 128
    canvas.width = canvas.height = ts;
    context.font = (ts * 0.8)  + "pt Arial";
//    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#000000";
    context.fillText(text, canvas.width / 2, canvas.height / 1.7);
    const t = new THREE.Texture(canvas)
    t.needsUpdate = true
    return t
}
