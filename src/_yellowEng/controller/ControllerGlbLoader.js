import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { makePlaneCollider } from "../helpers/HelperCollider";
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
    addGltfRigidbody(gltf, webgl)
    return gltf;
}
export async function addGltfRigidbody(gltf, webgl) {
    for (let child of gltf.scene.children) {
        if (child.name.includes("Plane008")) {
            makePlaneCollider(child, webgl)
        }
    }

}