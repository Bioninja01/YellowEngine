import * as THREE from "three";

export default class Raycasting {
  // For Later when I do mouse movment
  static #pointer = new THREE.Vector2();
  static #raycaster = new THREE.Raycaster();
  static #webgl = null;
  static setWebgl(webgl) {
    Raycasting.#webgl = webgl;
  }
  static cast() {
    if (!Raycasting.#webgl) {
      throw new Error(
        "No Webgl_Container set, please create a instance Webgl_Container"
      );
    }
    Raycasting.#raycaster.setFromCamera(
      Raycasting.#pointer,
      Raycasting.#webgl.getCamera()
    );
    // calculate objects intersecting the picking ray
    const intersects = Raycasting.#raycaster.intersectObjects(
      Raycasting.#webgl.main.children
    );
    return intersects;
  }
}
