import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
function modelLoader(url) {
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

export default class Entity {
  model = null;
  animations = null;
  constructor(url) {
    this.url = url;
  }
  async load(webgl) {
    if (this.url) {
      const gltf = await modelLoader(this.url);
      this.model = gltf.scene;
      webgl.addObject3D(this.model);
      return gltf;
    }
  }
  async start() {}
  async update(detaTime) {}
}
