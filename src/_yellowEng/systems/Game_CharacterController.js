import * as THREE from "three";
import StateBase from "./States/StateBase";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { makeCapsuleCollider } from "../helpers/HelperCollider";
// import { Vector3 } from "@dimforge/rapier3d";
import * as RAPIER from '@dimforge/rapier3d';
import { makeHelperMesh } from "../helpers/HelperCollider";
import { directionPressed, directionOffset, calWalkDirection, calRotation } from "../helpers/HelperMovement";

export class CharacterState extends StateBase {
  static STATE = {
    IDLE: "idle",
    WALK: "walk",
    RUN: "run",
  };
}

const radius = .25
const height = 1.30
const fadeDuration = 0.2;
const maxDistance = .01
const maxToi = .01;


export default class Game_CharacterController {
  cameraTarget = new THREE.Vector3();
  runVelocity = 10;
  walkVelocity = 2;
  toggleRun = true;
  stateController = new CharacterState();
  currentAction = null;
  #orbitControls = null;
  constructor(webgl, entity_charactor) {
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
  }
  start() {
    this.updateCameraTarget(0, 0)
    this.#orbitControls.update()
  }
  update(delta) {
    const isMoving = directionPressed().length > 0;
    const position = this.rigidbody.translation();
    const quaternion = this.rigidbody.rotation();
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
      y: position.y - .09,
      z: position.z,
    };

    if (isMoving) {
      targetPos.x += moveX;
      targetPos.z += moveZ;
      this.updateCameraTarget(moveX, moveZ);
      this.rigidbody.setNextKinematicRotation(rotateQuaternion);
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
      const hitPosition = new THREE.Vector3(
        hit.witness1.x,
        position.y,
        hit.witness1.z
      )
      if (isMoving) this.rigidbody.setNextKinematicTranslation(hitPosition)
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

