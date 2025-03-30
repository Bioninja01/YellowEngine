import * as THREE from "three";
import * as Helper from "./helpers/WebglHelper.js";
import Input from "./systems/Input.js";
import Raycasting from "./systems/Raycast.js";

export default class Webgl_Container {
  static Group_Target = {
    GIZMOS: "gizmos",
    LIGHT: "light",
    MAIN: "main",
  };
  #camera;
  #updates = []; // this is where all the update functions get called at in the update loop.
  #entities = [];
  dummyCam = new THREE.Object3D();
  gizmos = new THREE.Group();
  light = new THREE.Group();
  main = new THREE.Group();
  isLocked = false;
  canvasElement;
  constructor() {
    this.#camera = Helper.initializeCamera();
    this.renderer = Helper.initializeRenderer();
    this.scene = Helper.setupDefaultScene(this.gizmos, this.main, this.light);
    this.camera_dolly = Helper.setupDolly(this.#camera, this.scene);
    this.#camera.add(this.dummyCam);
    Raycasting.setWebgl(this);
  }
  getCamera() {
    let camera = this.#camera;
    return camera;
  }
  addGizmo(obj3D) {
    this.addObject3D(obj3D, Webgl_Container.Group_Target.GIZMOS);
  }
  addObject3D(obj3D, group_target = Webgl_Container.Group_Target.MAIN) {
    switch (group_target) {
      case Webgl_Container.Group_Target.MAIN: {
        this.main.add(obj3D);
        break;
      }
      case Webgl_Container.Group_Target.LIGHT: {
        this.light.add(obj3D);
        break;
      }
      case Webgl_Container.Group_Target.GIZMOS: {
        this.gizmos.add(obj3D);
        break;
      }
    }
  }
  async add2Entity(entity) {
    this.#entities.push(entity);
    await entity.load(this);
    this.add2Update(function (detaTime) {
      entity.update(detaTime);
    });
  }
  add2Update(fun) {
    this.#updates.push(fun);
  }
  mount(element) {
    this.canvasElement = element;
    this.#camera.aspect = element.offsetWidth / element.offsetHeight;
    this.canvasElement.appendChild(this.renderer.domElement);
    this.renderer.setSize(element.clientWidth, element.clientHeight);
    this.resize();
    this.setUpEventListeners();
  }
  setUpEventListeners() {
    const self = this;
    Input.setUpEventListeners();
    window.addEventListener("resize", function () {
      self.resize();
    });
  }
  removeEventListeners() {
    Input.removeEventListeners();
    window.removeEventListener("resize", this.resize);
  }
  removeGizmo(obj3D) {
    this.removeObject3D(obj3D, Webgl_Container.Group_Target.GIZMOS);
  }
  removeObject3D(obj3D, group_target = Webgl_Container.Group_Target.MAIN) {
    switch (group_target) {
      case Webgl_Container.Group_Target.MAIN: {
        this.main.remove(obj3D);
        break;
      }
      case Webgl_Container.Group_Target.LIGHT: {
        this.light.remove(obj3D);
        break;
      }
      case Webgl_Container.Group_Target.GIZMOS: {
        this.gizmos.remove(obj3D);
        break;
      }
    }
  }
  reset() {
    let camera = this.getCamera();
    this.removeEventListeners();
    camera = Helper.initializeCamera();
    this.scene.remove(this.camera_dolly);
    this.camera_dolly = Helper.setupDolly(camera, this.scene);
    this.mount(this.canvasElement);
  }
  resize() {
    let camera = this.getCamera();
    camera.aspect =
      this.canvasElement.offsetWidth / this.canvasElement.offsetHeight;
    camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.canvasElement.offsetWidth,
      this.canvasElement.offsetHeight
    );
  }
  async load() {
    for (let entity of this.#entities) {
      await entity.load(this);
    }
  }
  update(detaTime) {
    for (let update of this.#updates) {
      update(detaTime);
    }
    Input.update(detaTime);
  }
  render() {
    if (!this.renderer || !this.#camera || !this.scene) {
      console.error(
        "Render function called before necessary components are initialized"
      );
      return;
    }
    this.renderer.render(this.scene, this.#camera);
  }
  play() {
    const self = this;
    const clock = new THREE.Clock();

    let prevTime = performance.now();
    self.renderer.setAnimationLoop(function () {
      const mixerUpdateDelta = clock.getDelta();
      const time = performance.now();
      const detaTime = time - prevTime;
      // console.log("mixerUpdateDelta",mixerUpdateDelta)
      // console.log("detaTime",detaTime)

      self.update(mixerUpdateDelta);
      self.render();
      prevTime = time;
    });
  }
  stop() {
    this.renderer.setAnimationLoop(null);
  }
}
