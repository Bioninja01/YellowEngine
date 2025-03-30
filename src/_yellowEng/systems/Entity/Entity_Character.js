import * as THREE from "three";
import Entity from "./Entity";
import xboxURL from "../../../assets/models/Xbot.glb?url";

export default class Entity_Character extends Entity {
  animationmap = new Map();
  mixer = null;
  constructor(url = xboxURL) {
    super(url);
    this.url = url;
  }
  async load(webgl) {
    const gltf = await super.load(webgl);
    const self = this;
    if (gltf.animations) {
      self.mixer = new THREE.AnimationMixer(this.model); // will convert all animation clips into animation actions using mixer which helps into fading in or fading out animations for smooth animations transition
      gltf.animations.forEach(function (a) {
        console.log("a.name",a.name)
        self.animationmap.set(a.name, self.mixer.clipAction(a));
      });
    }
  }
  async update(detaTime) {
    super.update(detaTime);
  }
  async start(webgl) {
    super.start(webgl);
  }
}
