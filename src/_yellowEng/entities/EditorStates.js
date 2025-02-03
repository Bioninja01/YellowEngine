import * as THREE from "three";
import YellowEngine from "../YellowEngine";
import * as Controls from "./Controls";
import { drawLine } from "../creation/add";
import Raycasting from "../systems/Raycast";

class StateObj {
  static STATE = {
    INIT: "INIT",
  };
  constructor() {
    this.currentState = this.constructor.STATE.INIT;
  }
  static getStates() {
    let arr = Object.values(this.STATE);
    return arr;
  }
  get state() {
    return this.currentState;
  }
  set state(value = this.constructor.STATE.INIT) {
    this.currentState = value;
    this.handelState(value);
  }
  handelState(value) {
    console.log(value);
  }
  toogleState() {
    let states = this.constructor.getStates();
    let firstState = states[0];
    while (states.length > 0) {
      const state = states.shift();
      if (state == this.currentState) {
        this.state = states.shift();
        return;
      }
    }
    this.currentState = firstState;
  }
}

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

export class ObjectState extends StateObj {
  static STATE = {
    INIT: "INIT",
    ADD: "ADD",
    DELETE: "DELETE",
  };
  handelState(state) {
    this.unload();
    switch (state) {
      case ObjectState.STATE.ADD: {
        YellowEngine.webgl.addGizmo(rollOverMesh);
        break;
      }
      case ObjectState.STATE.DELETE: {
        YellowEngine.webgl.addGizmo(line);
        break;
      }
    }
  }
  unload() {
    YellowEngine.webgl.removeGizmo(line);
    YellowEngine.webgl.removeGizmo(rollOverMesh);
  }
  update(detaTime) {
    let intersects = Raycasting.cast();
    let intersect = intersects[0];
    if (intersect && intersect.face) {
      let normal = intersect.face.normal.clone();
      normal.transformDirection(intersect.object.matrixWorld);
      normal.multiplyScalar(0.5);
      let p1 = intersect.point.clone();
      p1.add(normal);
      switch (this.currentState) {
        case ObjectState.STATE.ADD: {
          rollOverMesh.position.copy(p1);
          rollOverMesh.position.floor().addScalar(0.5);
          Controls.placeCube(intersect.point);
          break;
        }
        case ObjectState.STATE.DELETE: {
          line.geometry.setFromPoints([intersect.point, p1]);
          rollOverMesh.position.copy(p1);
          rollOverMesh.position.floor().addScalar(0.5);
          Controls.removeCube(intersect.object);
          break;
        }
      }
    }
  }
}
