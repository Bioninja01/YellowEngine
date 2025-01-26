import * as THREE from "three";
import Input from "../systems/Input";
import { drawLine } from "../creation/add";
import Raycasting from "../systems/Raycast";
import { placeCube, removeCube,updateGeo } from "./Controls";
import { myLog } from "../systems/Logger";

const line = drawLine(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 2, 0),
  0x00ffff
);
const rollOverGeo = new THREE.BoxGeometry(1, 1, 1);
const rollOverMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  opacity: 0.5,
  transparent: true,
});
const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

/** Class representing a EditorControls. */
export default class EditorControls {
  #camera = null;
  #velocity = new THREE.Vector3();
  #direction = new THREE.Vector3();
  #isLocked = false;
  load(webgl) {
    this.#camera = webgl.getCamera();
    webgl.addGizmo(line);
    webgl.addGizmo(rollOverMesh);
  }
  update(detaTime) {
    const delta = detaTime / 1000; // convert to secs.
    this.#velocity.x -= this.#velocity.x * 10.0 * delta;
    this.#velocity.z -= this.#velocity.z * 10.0 * delta;
    this.#direction.z = Number(this.#moveForward) - Number(this.#moveBackward);
    this.#direction.x = Number(this.#moveRight) - Number(this.#moveLeft);
    this.#direction.normalize(); // this ensures consistent movements in all directions
    if (this.#moveForward || this.#moveBackward)
      this.#velocity.z -= this.#direction.z * 100.0 * delta;
    if (this.#moveLeft || this.#moveRight)
      this.#velocity.x -= this.#direction.x * 100.0 * delta;
    this.#camera.translateX(-this.#velocity.x * delta);
    this.#camera.translateZ(this.#velocity.z * delta);
    if (Input.GetMouseDown() && !this.#isLocked) {
      this.#isLocked = true;
      document.body.requestPointerLock();
    }
    if (Input.GetMouseUp() && this.#isLocked) {
      this.#isLocked = false;
      document.exitPointerLock();
    }
    let event = Input.GetMousemove();
    if (event && this.#isLocked) {
      const _euler = new THREE.Euler(0, 0, 0, "YXZ");
      const _PI_2 = Math.PI / 2;
      _euler.setFromQuaternion(this.#camera.quaternion);
      _euler.y -= event.movementX * 0.002;
      _euler.x -= event.movementY * 0.002;
      _euler.x = Math.max(_PI_2 - Math.PI, Math.min(_PI_2 - 0, _euler.x));
      this.#camera.quaternion.setFromEuler(_euler);
    }
    let intersect = this.raycast();
    if (intersect) {


      myLog(intersect.object.geometry.attributes,"attributes")
      // console.log("points",intersect.object.geometry.attributes.position.array);
      placeCube(intersect.point);
      removeCube(intersect.object);
      updateGeo(intersect.object) 
    }
  }
  get #moveForward() {
    return Input.GetKeyDown("w");
  }
  get #moveBackward() {
    return Input.GetKeyDown("s");
  }
  get #moveLeft() {
    return Input.GetKeyDown("a");
  }
  get #moveRight() {
    return Input.GetKeyDown("d");
  }
  raycast() {
    try {
      let intersects = Raycasting.cast();
      let intersect = intersects[0];
      if (intersect && intersect.face) {
        let normal = intersect.face.normal.clone();
        normal.transformDirection(intersect.object.matrixWorld);
        normal.multiplyScalar(0.5);
        let p1 = intersect.point.clone();
        p1.add(normal);
        line.geometry.setFromPoints([intersect.point, p1]);
        rollOverMesh.position.copy(p1);
        rollOverMesh.position.floor().addScalar(0.5);
        return intersect;
      }
    } catch (err) {
      console.error(err);
    }
  }
}
