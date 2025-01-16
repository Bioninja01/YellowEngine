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
  constructor(url) {
    this.url = url;
    this.obj3DGroup = null;
    this.animations = null;
  }
  async load() {
    if (this.url) {
      const gltfData = await modelLoader(this.url);
      this.obj3DGroup = gltfData.scene;
    }
  }
  async start() {}
  async update() {}
}
