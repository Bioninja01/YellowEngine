import * as THREE from "three";

export function outLine(obj) {
  const vertices = [];
  const postionAttributes = obj.geometry.attributes.position;

  for (let i = 0; i < postionAttributes.count; i++) {
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

  // It is nice to know that BufferGeometry has a SetFromPoints method
  const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  points.position.copy(postion);
  points.position.floor().addScalar(0.5);
  return points;
}

export function vertexPointMove(object, index, postion = new THREE.Vector3()) {
  let target_vertex = new THREE.Vector3();
  const positionAttribute = object.geometry.attributes.position;
  target_vertex.fromBufferAttribute(positionAttribute, index); // read vertex
  for (let i = 0; i < positionAttribute.count; i++) {
    let vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);
    if (vertex.equals(target_vertex)) {
      positionAttribute.setXYZ(
        i,
        vertex.x + postion.x,
        vertex.y + postion.y,
        vertex.z + postion.z
      ); // w
    }
  }
  object.geometry.computeVertexNormals();
  positionAttribute.needsUpdate = true;
}

export function getVertex(intersect) {
  var iFace = intersect.face;
  var iPoint = intersect.point;
  debugger
  var ab = iFace.a.distanceTo(iFace.b);
  var ac = iFace.a.distanceTo(iFace.c);
  var bc = iFace.b.distanceTo(iFace.c);
  var lambda = Math.min(ab, ac, bc) - 0.1;
  if (iFace.a.distanceTo(iPoint) <= lambda) {
    return iFace.a;
  }
  if (iFace.b.distanceTo(iPoint) <= lambda) {
    return iFace.b;
  }
  if (iFace.c.distanceTo(iPoint) <= lambda) {
    return iFace.c;
  }
}

function selectPoints() {
  selectedPoints = [];
  selectedForces = [];
  var pos = head.geometry.getAttribute("position");
  var v = new THREE.Vector3();

  for (var i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    var force = v.distanceTo(contact) / 0.5;
    if (force < 1) {
      selectedPoints.push(i);
      selectedForces.push((0.5 + 0.5 * Math.cos(Math.PI * force)) / 185);
    }
  }
}
function dragPoints(dx, dy) {
  var pos = head.geometry.getAttribute("position"),
    v = new THREE.Vector3();

  for (var j in selectedPoints) {
    var i = selectedPoints[j];
    pos.setX(i, pos.getX(i) + selectedForces[j] * dx);
    pos.setY(i, pos.getY(i) - selectedForces[j] * dy);
  }
  pos.needsUpdate = true;
}

window.vertexPointMove = vertexPointMove;
