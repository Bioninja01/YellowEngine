import * as THREE from "three";

export function outLine(obj) {
  const vertices = [];
  const postionAttributes = obj.geometry.attributes.position;

  for (let i = 0; i < postionAttributes.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(postionAttributes, i);
    vertices.push(vertex);
  }
  debugger;
  const loader = new THREE.TextureLoader();
  const texture = loader.load("./disc.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x0080ff,
    map: texture,
    size: 0.25,
    alphaTest: 0.5,
  });

  // It is nice to know that BufferGeometry has a SetFromPoints method
  const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  points.position.copy(postion);
  points.position.floor().addScalar(0.5);
  return points;
}
