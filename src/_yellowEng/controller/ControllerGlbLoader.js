import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
export function modelLoader(url) {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltfData) => {
                resolve(gltfData);
            },
            null,
            reject
        );
    });
}

export async function addGltf(url, webgl) {
    const gltf = await modelLoader(url);
    webgl.addObject3D(gltf.scene);
    return gltf;
}