import * as THREE from "three";
import StateBase from "./States/StateBase";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { makeCapsuleCollider } from "../helpers/HelperCollider";
// import { Vector3 } from "@dimforge/rapier3d";
import * as RAPIER from '@dimforge/rapier3d';
import { makeHelperMesh } from "../helpers/HelperCollider";
import { directionPressed, directionOffset, calWalkDirection, calRotation } from "../helpers/HelperMovement";
import { drawLine } from "../creation/add";
import { DebugNoramlLine } from "../controller/ControllerLine";


export class CharacterState extends StateBase {
  static STATE = {
    IDLE: "idle",
    WALK: "walk",
    RUN: "run",
  };
}
const deg90 = 90 * Math.PI / 180
const radius = .25
const height = 1.30
const fadeDuration = 0.2;
const maxDistance = .1
const maxToi = .01;
const line = drawLine(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 10, 0),
  0x00ffff
);
let debugline = null

export default class Game_CharacterController {
  cameraTarget = new THREE.Vector3();
  runVelocity = 10;
  walkVelocity = 2;
  toggleRun = true;
  stateController = new CharacterState();
  currentAction = null;
  #orbitControls = null;
  isGrounded = false;
  constructor(webgl, entity_charactor) {
    debugline = new DebugNoramlLine(webgl)
    const self = this;
    const { rigidBody, collider } = makeCapsuleCollider(webgl, radius, height)
    // this.helperMesh = makeHelperMesh(webgl, radius, height)
    this.rigidbody = rigidBody
    this.collider = collider
    this.model = entity_charactor.model;
    this.mixer = entity_charactor.mixer;
    this.animationmap = entity_charactor.animationmap;
    this.camera = webgl.getCamera();
    this.#orbitControls = new OrbitControls(this.camera, webgl.renderer.domElement);
    this.physics = webgl.physics;
    webgl.add2Update(function (delta) {
      self.update(delta);
    });
    webgl.addGizmo(line)
  }
  start() {
    this.updateCameraTarget(0, 0)
    this.#orbitControls.update()
  }
  update(delta) {
    const isMoving = directionPressed().length > 0;
    const p = this.rigidbody.translation();
    const q = this.rigidbody.rotation();
    const position = new THREE.Vector3(p.x, p.y, p.z)
    const quaternion = new THREE.Quaternion(q.x, q.y, q.z, q.w)
    // this.rigidbody.setRotation({w: 0.707, x: .707, y: 0.707, z: 0.0}, true); // 3D
    // rigidBody.setRotation({w: 0.707, x: 0.0, y: 0.707, z: 0.0}, true); // Rotate 90 degrees around the z-axis

    const walkDirection = calWalkDirection(this.camera);
    const rotateQuaternion = calRotation(this.camera.position, position);
    // Direction offset
    this.mixer.update(delta);
    updateModlePostion(this.model, position, quaternion)
    // TO DETERMINE WHETHER NEXT STATE MUST BE IDLE,WALK,
    const nextState = isMoving ? CharacterState.STATE.WALK : CharacterState.STATE.IDLE
    // Handle change in animation
    handleAnimation(this.animationmap, this.stateController, nextState)

    // Run/Walk Velocity
    const velocity =
      this.stateController.state == CharacterState.STATE.RUN ? this.runVelocity : this.walkVelocity;
    // this.model.quaternion.rotateTowards(rotateQuaternion, 0.2); // Rotating in step-wise to create a smooth rotate effect

    // move model
    const moveX = walkDirection.x * -velocity * delta * 2 * Number(isMoving);
    const moveZ = walkDirection.z * -velocity * delta * 2 * Number(isMoving);

    const targetPos = {
      x: position.x,
      y: position.y - 0.09,
      z: position.z,
    };

    if (isMoving) {
      targetPos.x += moveX;
      targetPos.z += moveZ;
      this.updateCameraTarget(moveX, moveZ);
      this.rigidbody.setNextKinematicRotation(rotateQuaternion);
    }
    else {
      // this.updateCameraTarget(0, 0);
    }

    const desiredMove = new THREE.Vector3(Math.round(walkDirection.x), -0.09, Math.round(walkDirection.z)); // e.g., from input

    const hit = this.physics.castShape(
      targetPos,
      quaternion,
      desiredMove,
      this.collider.shape,
      maxDistance,
      maxToi,
      true,
      null,
      null,
      this.collider,
      this.rigidbody);
    if (hit) {
      const normal = new THREE.Vector3(
        Number((hit.normal1.x).toFixed(2)),
        Number((hit.normal1.y).toFixed(2)),
        Number((hit.normal1.z).toFixed(2)))
      let test = new THREE.Vector3(position.x, 0, position.z)



      const angle = test.angleTo(normal);
      console.log("angle", angle * 180 / Math.PI)
      debugline.update(position, normal)

      const hitPosition = new THREE.Vector3(
        hit.witness1.x,
        hit.witness1.y + height / 2 + radius,
        hit.witness1.z
      )
      if (isMoving) {
        // const rotation = hit.collider.parent().rotation();
        this.rigidbody.setNextKinematicTranslation(hitPosition)

        const axis = new THREE.Vector3(1, 0, 0); // Z-axis
        const angleInRadians = deg90 - angle ; // 90 degrees
        const rotationQuaternion = new THREE.Quaternion();
        rotationQuaternion.setFromAxisAngle(axis, angleInRadians);
        console.log("quaternion", quaternion, rotationQuaternion,)
        rotateQuaternion.multiply(rotationQuaternion)

              this.rigidbody.setNextKinematicRotation(rotateQuaternion);

        // this.rigidbody.setRotation(quaternion, true)
      }
    }
    else {
      this.rigidbody.setNextKinematicTranslation(targetPos)
    }
    // Passing these values to updateCameraTarget
    this.#orbitControls.update();
  }
  updateCameraTarget(moveX, moveZ) {
    // move camera
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;
    // update camera target
    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 1;
    this.cameraTarget.z = this.model.position.z;
    this.#orbitControls.target = this.cameraTarget;
  }
  setPostion(position) {
    this.rigidbody.setNextKinematicTranslation(position)
  }
}

function handleAnimation(animationmap, stateController, nextState) {
  // Handle change in animation
  if (stateController.state == nextState) return
  const current = animationmap.get(stateController.state); // next animation
  const toPlay = animationmap.get(nextState); // current animation
  current.fadeOut(fadeDuration); // Tell the current animation to fade out    
  toPlay.reset().fadeIn(fadeDuration).play(); // Tell the next animation to fade in
  stateController.state = nextState
}
function updateModlePostion(model, position, quaternion) {
  // this.helperMesh.position.copy(this.collider.translation());
  model.position.copy(position)
  model.position.setY(position.y - height / 2 - radius - .05)
  model.quaternion.copy(quaternion)
}

