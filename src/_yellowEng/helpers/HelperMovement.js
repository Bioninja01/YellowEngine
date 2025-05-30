import * as THREE from "three";
import Input from "../systems/Input";

const rotateAngle = new THREE.Vector3(0, 1, 0);
const keys = ["w", "s", "a", "d"];
const unitCircle = {
    "w": Math.PI,
    "wd": 3 * Math.PI / 4,
    "d": Math.PI / 2,
    "sd": Math.PI / 4,
    "s": 0,
    "sa": -Math.PI / 4,
    "a": -Math.PI / 2,
    "wa": -3 * Math.PI / 4,
}

export function directionPressed() {
    return keys.filter(function (key) {
        return Input.GetKeyDown(key);
    });
}
let pastValue = null
export function directionOffset() {
    pastValue = pastValue !== null ? pastValue : unitCircle["w"]
    let array = directionPressed()
    const key = array.join("");
    if (unitCircle[key] !== undefined) {
        pastValue = unitCircle[key]
    }
    return unitCircle[key] === undefined ? pastValue : unitCircle[key];
}
export function calWalkDirection(camera) {
    let walkDirection = new THREE.Vector3();
    const rotation = directionOffset();
    camera.getWorldDirection(walkDirection);
    walkDirection.y = 0
    walkDirection.normalize();
    walkDirection.applyAxisAngle(rotateAngle, rotation);
    return walkDirection;
}
export function calRotation(origin, position) {
    const rotateQuaternion = new THREE.Quaternion();
    // Calculate towards camera direction angle ( to make character face camera view )
    const anglebtwcamerachar = Math.atan2(
        origin.x - position.x,
        origin.z - position.z
    );
    rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        anglebtwcamerachar + directionOffset()
    );
    return rotateQuaternion;
}
