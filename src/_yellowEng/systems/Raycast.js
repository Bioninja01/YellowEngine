import * as THREE from "three";

export default class Raycasting {
  // For Later when I do mouse movment
  // #pointer = new THREE.Vector2();
  static #raycaster = THREE.Raycaster();
  static #objectGrpah = THREE.Group();
  static setObjectGrpah(objectGrpah) {
    Raycasting.#objectGrpah = objectGrpah;
  }
  static cast(origin, direction) {
    Raycasting.#raycaster.set(origin, direction);
    const intersects = Raycasting.#raycaster.intersectObjects(
      Raycasting.#objectGrpah
    );
    return intersects;
  }
}
