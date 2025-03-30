import * as THREE from "three";
import * as Controls from "./Controls";
import StateBase from "../systems/States/StateBase";
import YellowEngine from "../YellowEngine";
import Raycasting from "../systems/Raycast";
import { drawLine } from "../creation/add";
import { vertexPointMove, getVertex } from "../helpers/VertexHelper";
import Input from "../systems/Input";

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

function Interact() {
  return Input.GetKeyDown();
}


export class ObjectState extends StateBase {
  static STATE = {
    INIT: "INIT",
    ADD: "ADD",
    DELETE: "DELETE",
    VERTEX: "VERTEX",
  };
  handelState(state) {
    this.unload();
    switch (state) {
      case ObjectState.STATE.ADD: {
        YellowEngine.webgl.addGizmo(rollOverMesh);
        break;
      }
      case ObjectState.STATE.VERTEX:
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
    if(Input.GetMouseDown()){
      let intersects = Raycasting.cast();
      let intersect = intersects[0];
      console.log("intersect", intersect)
      if (intersect) {
        if (intersect.index) {
          console.log("intersect.index", intersect.index);
        }
      }
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
          case ObjectState.STATE.VERTEX: {
            line.geometry.setFromPoints([intersect.point, p1]);
            console.log("getVertex(intersect)", getVertex(intersect));
            break;
          }
        }
      }
    }
  }
}
