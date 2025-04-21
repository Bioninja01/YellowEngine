import * as THREE from "three";
import Input from "../systems/Input";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { ObjectState } from "./EditorStates";

function moveForward() {
  return Input.GetKeyDown("w");
}
function moveBackward() {
  return Input.GetKeyDown("s");
}
function moveLeft() {
  return Input.GetKeyDown("a");
}
function moveRight() {
  return Input.GetKeyDown("d");
}
function moveUp() {
  return Input.GetKeyDown("q");
}
function moveDown() {
  return Input.GetKeyDown("e");
}

/** Class representing a EditorControls. */
export default class EditorControls {
  #camera = null;
  control = null;
  #velocity = new THREE.Vector3();
  #direction = new THREE.Vector3();
  #isLocked = false;
  currentState = new ObjectState();
  async load(webgl) {
    this.#camera = webgl.getCamera();
    this.control = new TransformControls(
      this.#camera,
      webgl.renderer.domElement
    );
    this.control.setMode("translate");
    this.control.addEventListener("change", () => {
      this.#isLocked = false;
    });
    this.control.addEventListener("dragging-changed", () => {
      this.#isLocked = false;
    });
  }
  update(detaTime) {
    const delta = detaTime; // convert to secs.
    this.#velocity.x -= this.#velocity.x * 10.0 * delta;
    this.#velocity.z -= this.#velocity.z * 10.0 * delta;
    this.#velocity.y -= this.#velocity.y * 10.0 * delta;
    this.#direction.z = Number(moveForward()) - Number(moveBackward());
    this.#direction.x = Number(moveRight()) - Number(moveLeft());
    this.#direction.y = Number(moveUp()) - Number(moveDown());
    this.#direction.normalize(); // this ensures consistent movements in all directions
    if (moveForward() || moveBackward())
      this.#velocity.z -= this.#direction.z * 100.0 * delta;
    if (moveLeft() || moveRight)
      this.#velocity.x -= this.#direction.x * 100.0 * delta;
    if (moveUp() || moveDown())
      this.#velocity.y -= this.#direction.y * 25.0 * delta;
    this.#camera.translateX(-this.#velocity.x * delta);
    this.#camera.translateY(-this.#velocity.y * delta);
    this.#camera.translateZ(this.#velocity.z * delta);
    if (Input.GetMouseDown('mouseRight') && !this.#isLocked) {
      this.#isLocked = true;
      document.body.requestPointerLock();
    }
    if (Input.GetMouseUp('mouseRight') && this.#isLocked) {
      this.#isLocked = false;
      document.exitPointerLock();
    }
    let event = Input.GetMousemove();
    if (event && this.#isLocked) {
      const _euler = new THREE.Euler(0, 0, 0, "YXZ");
      const _PI_2 = Math.PI / 2;
      _euler.setFromQuaternion(this.#camera.quaternion);
      _euler.y -= event.movementX * 0.005;
      _euler.x -= event.movementY * 0.005;
      _euler.x = Math.max(_PI_2 - Math.PI, Math.min(_PI_2 - 0, _euler.x));
      this.#camera.quaternion.setFromEuler(_euler);
    }
    if (Input.GetKeyUp("t")) {
      this.currentState.toogleState();
    }
    this.currentState.update(delta);
  }

}
