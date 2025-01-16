import * as THREE from "three";

export default class SceneManager {
  static async saveScene(scene) {
    const json = scene.toJSON();
  }

  static async loadScene(jsonObj) {
    const loader = new THREE.ObjectLoader();
    const mesh = loader.parse(jsonObj);
    return mesh;
  }
}
