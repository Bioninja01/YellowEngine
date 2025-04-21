import * as CANNON from 'cannon-es'

export function makeCapsuleCollider(radius, height) {
    const capsuleBody = new CANNON.Body({
        mass: 1,
    });
    const sphereTop = new CANNON.Sphere(radius);
    const sphereBottom = new CANNON.Sphere(radius);
    const cylinder = new CANNON.Cylinder(radius, radius, height, 8);

    

    const quat = new CANNON.Quaternion();
    quat.setFromEuler(Math.PI / 2, 0, 0); // Rotate around X to stand up
    const cylinderOffset = new CANNON.Vec3(0, 0, 0);
    // capsuleBody.addShape(cylinder, cylinderOffset, quat);

    // Add top sphere
    const topSphereOffset = new CANNON.Vec3(0, height+radius, 0);
    capsuleBody.addShape(sphereTop, topSphereOffset);
    // Add bottom sphere
    const bottomSphereOffset = new CANNON.Vec3(0, radius, 0);
    capsuleBody.addShape(sphereBottom, bottomSphereOffset);
    // capsuleBody.position.set(0, 5, 0);
    return capsuleBody;

}