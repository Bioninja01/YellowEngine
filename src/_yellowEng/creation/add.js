
import * as THREE from "three"

export function addCube(x, y, z, color = new THREE.Color("#049ef4"), size=1) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: "#ffffff" });
  material.color = color;
  material.roughness = 0.5;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  return mesh;
}
export function drawLine(point1, point2, color = 0x0000ff) {
  const material = new THREE.LineBasicMaterial({
    color,
    linewidth: 5,
    linecap: "round", //ignored by WebGLRenderer
    linejoin: "round", //ignored by WebGLRenderer
  });
  const points = [];
  points.push(point1);
  points.push(point2);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  line.name = "LINE"; 
  line.frustumCulled = false;
  return line;
}