import * as THREE from "three";
// import xboxURL from "../../../assets/models/Xbot.glb?url";
import { addGltf } from "../controller/ControllerGlbLoader";
import xboxURL from "../../assets/models/Xbot.glb?url"
export default class Game_Entity {
  model = null;
  animations = null;
  mixer = null;
  animationmap = new Map();
  constructor(url = xboxURL) {
    this.url = url;
  }
  async load(webgl) {
    const self = this;
    if (this.url) {
      const gltf = await addGltf(this.url, webgl);
      this.model = gltf.scene
      if (gltf.animations) {
        self.mixer = new THREE.AnimationMixer(this.model); // will convert all animation clips into animation actions using mixer which helps into fading in or fading out animations for smooth animations transition
        gltf.animations.forEach(function (a) {
          self.animationmap.set(a.name, self.mixer.clipAction(a));
        });
      }
    }
  }
  async update(detaTime) {
    super.update(detaTime);
  }
  async start(webgl) {
    super.start(webgl);
  }
}
