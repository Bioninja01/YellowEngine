/** Class representing a EditorControls. */
import * as THREE from "three";
import Input from "../systems/Input";
import YellowEngine from "../YellowEngine";

export function placeCube(postion) {
  if (!postion) return;
  if (Input.GetKeyUp(" ")) {
    let box = makeBox();
    box.name = "makeBox";
    box.position.copy(postion);
    box.position.floor().addScalar(0.5);
    YellowEngine.webgl.addObject3D(box);

    const vertices = [];
    const postionAttributes = box.geometry.attributes.position;

    for (let i = 0; i < postionAttributes.count/postionAttributes.itemSize; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(postionAttributes, i);
      vertices.push(vertex);
    }

    const loader = new THREE.TextureLoader();
    const texture = loader.load("./disc.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x0080ff,
      map: texture,
      size: 0.25,
      alphaTest: 0.5,
    });
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    pointsGeometry.attributes.size = new THREE.Float32BufferAttribute([], 1);

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    points.position.copy(postion);
    points.position.floor().addScalar(0.5);
    YellowEngine.webgl.addObject3D(points);

    window.points = points;
  }
}
export function removeCube(obj) {
  if (!obj) return;
  if (Input.GetKeyUp("Backspace")) {
    YellowEngine.webgl.removeObject3D(obj);
  }
}
export function updateGeo(obj) {
  if (Input.GetKeyUp("m")) {
    // Access the x, y, and z coordinates of the first vertex
    const vertices = obj.geometry.attributes.position.array;

    const x = vertices[0];

    const y = vertices[1];

    const z = vertices[2];

    // Modify the position of a vertex

    vertices[0] = 10; // Change the x coordinate of the first vertex

    obj.geometry.attributes.position.needsUpdate = true;
  }
}
export function getVertices(obj) {
  const lookupTable = {};
  const vertices = [];
  const positionAttribute = obj.geometry.attributes.position;
  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i); // read vertex
    if (lookupTable[JSON.stringify(vertex)]) {
      lookupTable[JSON.stringify(vertex)] += `,${i}`;
    } else {
      lookupTable[JSON.stringify(vertex)] = `${i}`;
    }
    vertices.push(vertex);
  }

  return vertices;
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
