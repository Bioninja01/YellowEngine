import * as THREE from "three";
import Input from "../systems/Input";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { ObjectState } from "./EditorStates";

/** Class representing a EditorControls. */
export default class EditorControls {
  #camera = null;
  control = null;
  #velocity = new THREE.Vector3();
  #direction = new THREE.Vector3();
  #isLocked = false;
  currentState = new ObjectState();
  load(webgl) {
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
    if (Input.GetKeyUp("t")) {
      this.currentState.toogleState();
    }
    this.currentState.update(delta);
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
}
