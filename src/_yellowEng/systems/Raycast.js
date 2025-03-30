import * as THREE from "three";
import Input from "./Input";

function setupRaycat() {
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.05;
  return raycaster;
}

export default class Raycasting {
  // For Later when I do mouse movment
  // static #pointer = Input.MousePostion;
  static #raycaster = setupRaycat();
  static #webgl = null;
  static setWebgl(webgl) {
    Raycasting.#webgl = webgl;
  }
  static cast(group = Raycasting.#webgl.main.children) {
    if (!Raycasting.#webgl) {
      throw new Error(
        "No Webgl_Container set, please create a instance Webgl_Container"
      );
    }
    console.log("Input.MousePostion", Input.MousePostion)
    Raycasting.#raycaster.setFromCamera(
      Input.MousePostion,
      Raycasting.#webgl.getCamera()
    );
    // calculate objects intersecting the picking ray
    const intersects = Raycasting.#raycaster.intersectObjects(group);
    return intersects;
  }
}
