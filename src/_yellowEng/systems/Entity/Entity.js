import { addGltf } from "../../controller/ControllerGlbLoader";

export default class Entity {
  model = null;
  animations = null;
  constructor(url) {
    this.url = url;
  }
  async load(webgl) {
    if (this.url) {
      const gltf = await addGltf(this.url, webgl);
      this.model = gltf.scene
      return gltf;
    }
  }
  async start() { }
  async update(detaTime) { }
}
