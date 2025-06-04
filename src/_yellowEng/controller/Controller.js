import RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";

const order = ["top", "move", "bottom"]
const maxDistance = .1
const maxToi = .01;
const movmentUnit = 0.09;
const minHeight = 1;
const minWidth = 1;
const gravity = new THREE.Vector3(0, -0.9, 0)

function makeShapeCast(isMoving, obj, physics, collider, rigidbody) {
    let hit = null;
    const direction = new THREE.Vector3();
    obj.getWorldDirection(direction);
    direction.normalize();
    direction.multiply(1.5)
    const targetPos = new THREE.Vector3(obj.position);
    for (let state of order) {
        switch (state) {
            case "move": {
                targetPos.add(direction)
                break
            }
            case "bottom": {
                targetPos.add(gravity)
                break
            }
        }
        hit = physics.castShape(
            targetPos,
            quaternion,
            desiredMove,
            collider.shape,
            maxDistance,
            maxToi,
            false,
            null,
            null,
            collider,
            rigidbody);
    }
}