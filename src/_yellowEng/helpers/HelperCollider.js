import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d';
import * as CANNON from 'cannon-es'

// RigidBody: 
// 1. Represents the physical object's dynamics and kinematics.
// 2. Affected by forces, gravity, and other kinematic factors.
// 3. Can be moved, rotated, and have mass properties.
// A RigidBody without colliders will not be affected by contacts. 

// Collider: 
// 1. Defines the geometric shape of the rigid-body for collision detection. 
// 2. Attaches to a rigid-body to allow the rigid-body to be affected by contact forces. 
// 3. Can be of various shapes, such as spheres, boxes, meshes, etc. 
// RigidBody Must have colliders attached to it to interact with the physics world through collisions.

export function makePlaneCollider(mesh) {
    const geometry = mesh.geometry;
    // Ensure bounding box is calculated
    geometry.computeBoundingBox();
    // Access bounding box
    const boundingBox = geometry.boundingBox;

    // Width and height from bounding box
    const width = boundingBox.max.x - boundingBox.min.x;
    const length = boundingBox.max.z - boundingBox.min.z;

    const rigidbody = new CANNON.Body({
        mass: 0, // Static
        shape: new CANNON.Box(new CANNON.Vec3(width / 2, .01, length / 2)),
    });
    rigidbody.quaternion.copy(mesh.quaternion);
    rigidbody.position.copy(mesh.position);
    return rigidbody
}

export function makeCapsuleCollider(webgl, radius, height) {
    const rigidBody = webgl.physics.createRigidBody(
        RAPIER.RigidBodyDesc
            .kinematicPositionBased()
            .setAdditionalMass(1)
            .setTranslation(4, 1, 0)
        // RAPIER.RigidBodyDesc
        //     .dynamic()
        //     .setAdditionalMass(1)
        //     .setTranslation(4, 1, 0)
    );
    // RAPIER.RigidBodyDesc.kinematicVelocityBased
    const colliderDesc = RAPIER.ColliderDesc.capsule(height / 2, radius)
        .setFriction(0.7)
        .setTranslation(0, height / 2 + radius, 0)
    const collider = webgl.physics.createCollider(colliderDesc, rigidBody);
    if (import.meta.env.VITE_PHYSIS_DEBUG == "true") {
        makeDebugMesh(webgl, collider)
    }
    return { rigidBody, collider }
}

function makeDebugMesh(webgl, collider) {
    const shape = collider.shape;
    let geo
    switch (collider.shapeType()) {
        case RAPIER.ShapeType.Cuboid: {
            const materal = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
            const halfExtents = shape.halfExtents;
            geo = new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2)
            const mesh = new THREE.Mesh(geo, materal)
            mesh.position.copy(collider.translation())
            webgl.addObject3D(mesh);
            webgl.add2Update(function (delta) {
                mesh.position.copy(collider.translation())
                mesh.quaternion.copy(collider.rotation())
            });
            break
        }
        case RAPIER.ShapeType.Capsule: {
            const materal = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
            geo = new THREE.CapsuleGeometry(shape.radius, shape.halfHeight * 2, 8, 16);
            const mesh = new THREE.Mesh(geo, materal)
            webgl.addObject3D(mesh);
            webgl.add2Update(function (delta) {
                mesh.position.copy(collider.translation())
                mesh.quaternion.copy(collider.rotation())
            });
            break
        }
    }
    // webgl.add2Update(function (delta) {
    //     mesh.position.copy(collider.translation())
    // });
}

export async function makeGround(webgl) {
    // Create a static floor body
    const floorBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const rigidBody = await webgl.physics.createRigidBody(floorBodyDesc);

    // Create a floor collider (big box)
    const floorColliderDesc = RAPIER.ColliderDesc.cuboid(10, 0.05, 10);
    const collider = webgl.physics.createCollider(floorColliderDesc, rigidBody)
    if (import.meta.env.VITE_PHYSIS_DEBUG == "true") {
        makeDebugMesh(webgl, collider)
    }

    const floorGeometry = new THREE.BoxGeometry(20, .1, 20); // Notice double size
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    webgl.addObject3D(floorMesh);
    return { rigidBody, collider }
}

export function makeBoxCollider(webgl, width, height = width, depth = width) {

    const platformDesc = RAPIER.RigidBodyDesc
        .dynamic()
        .setAdditionalMass(0)
        .setTranslation(0, height, 0.0);
    const rigidBody = webgl.physics.createRigidBody(platformDesc);
    const platformCollider = RAPIER.ColliderDesc.cuboid(width, height, depth);
    const collider = webgl.physics.createCollider(platformCollider, rigidBody);

    if (import.meta.env.VITE_PHYSIS_DEBUG == "true") {
        makeDebugMesh(webgl, collider)
    }
    return { rigidBody, collider }


    // const rigidBody = webgl.physics.createRigidBody(
    //     RAPIER.RigidBodyDesc.dynamic()
    // );
    // // Create a box collider (big box)
    // const colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, depth)
    //     // .setRestitution(0)
    //     // .setFriction(0.7)
    //     // // The collider rotation wrt. the body it is attached to, as a unit quaternion.
    //     // // Default: the identity rotation.
    //     // .setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 })
    //     // // The collider density. If non-zero the collider's mass and angular inertia will be added
    //     // // to the inertial properties of the body it is attached to.
    //     // // Default: 1.0
    //     // .setDensity(1.3);
    // const collider = webgl.physics.createCollider(colliderDesc, rigidBody);
    // if (import.meta.env.VITE_PHYSIS_DEBUG == "true") {
    //     makeDebugMesh(webgl, collider)
    // }
    // return { rigidBody, collider }
}
