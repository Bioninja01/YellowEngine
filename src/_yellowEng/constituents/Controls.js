/** Class representing a EditorControls. */
import * as THREE from "three";
import Input from "../systems/Input";
import YellowEngine from "../YellowEngine";

export function placeCube(postion) {
  if(!postion) return
  if (Input.GetKeyUp(" ")) {
    let box = makeBox();
    YellowEngine.webgl.addObject3D(box);
    box.position.copy(postion);
    box.position.floor().addScalar(0.5);

  }
}

function makeBox() {
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    opacity: 1,
    transparent: true,
  });
  const box = new THREE.Mesh(boxGeo, boxMaterial);
  return box;
}

