import * as THREE from "three";
import StateBase from "./States/StateBase";
import Input from "./Input";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { makeCapsuleCollider } from "../helpers/HelperCollider";
import { log } from "three/tsl";
export class CharacterState extends StateBase {
  static STATE = {
    INIT: "INIT",
    IDLE: "idle",
    WALK: "walk",
    RUN: "run",
  };
}

export default class Game_CharacterController {
  walkDirection = new THREE.Vector3();
  rotateAngle = new THREE.Vector3(0, 1, 0);
  rotateQuaternion = new THREE.Quaternion();
  cameraTarget = new THREE.Vector3();
  fadeDuration = 0.2;
  runVelocity = 10;
  walkVelocity = 3;
  toggleRun = true;
  stateController = new CharacterState();
  currentAction = null;
  #orbitControls = null;
  constructor(webgl, entity_charactor) {
    // Constructor function
    const self = this;
    const { rigidBody, collider } = makeCapsuleCollider(webgl, .25, 1.30)
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
    const position = this.rigidbody.translation();
    const quaternion = this.rigidbody.rotation();
    this.model.position.copy(position)
    this.model.quaternion.copy(quaternion)
    // TO DETERMINE WHETHER NEXT STATE MUST BE IDLE,WALK,
    const keysPressed = directionPressed();
    const isMoving = keysPressed.length > 0;
    // TODO: don't like this refactor, don't if,else if,else. messy
    if (isMoving && this.toggleRun) {
      this.stateController.state = CharacterState.STATE.RUN;
    } else if (isMoving) {
      this.stateController.state = CharacterState.STATE.WALK;
    } else {
      this.stateController.state = CharacterState.STATE.IDLE;
    }
    // Handle change in animation
    if (this.currentAction != this.stateController.state) {
      // To check if current state is same as that of the state just determined
      const toPlay = this.animationmap.get(this.stateController.currentState); // current animation
      const current = this.animationmap.get(this.currentAction); // next animation
      if (current) {
        current.fadeOut(this.fadeDuration); // Tell the current animation to fade out
      }
      toPlay.reset().fadeIn(this.fadeDuration).play(); // Tell the next animation to fade in
      this.currentAction = this.stateController.state; // Store my new State
    }

    this.mixer.update(delta);

    if (this.currentAction != CharacterState.STATE.IDLE) {
      // I know if the character is in run or walk state I must change the Direction
      // Calculate towards camera direction angle ( to make character face camera view )
      var anglebtwcamerachar = Math.atan2(
        this.camera.position.x - position.x,
        this.camera.position.z - position.z
      );

      // Direction offset
      var directionOffsetValue = directionoffset(keysPressed);

      // Rotate Model
      this.rotateQuaternion.setFromAxisAngle(
        this.rotateAngle,
        anglebtwcamerachar + directionOffsetValue
      );
      this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.2); // Rotating in step-wise to create a smooth rotate effect

      // Calculate Directions
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffsetValue);

      // Run/Walk Velocity
      const velocity =
        this.currentAction == "Run" ? this.runVelocity : this.walkVelocity;

      // move model
      const moveX = this.walkDirection.x * -velocity * delta * 2;
      const moveZ = this.walkDirection.z * -velocity * delta * 2;


      const targetPos = {
        x: moveX + position.x,
        y: position.y - .2,
        z: moveZ + position.z,
      };
      const maxDistance = 1
      const hit = this.physics.castShape(
        position,
        quaternion,
        targetPos,
        this.collider.shape,
        maxDistance,
        true
      );
      console.log('hit', hit)

      if (hit) {
        // Hit something, move only part of the distance
        // this.rigidbody.setNextKinematicTranslation(characterBody.translation().add(direction.scale(hit.toi)))
        // this.rigidbody.setNextKinematicRotation(this.rotateQuaternion);
      }
      else {
        this.rigidbody.setNextKinematicTranslation(targetPos)
      }

      // position.x += moveX;
      // position.z += moveZ;
      // Passing these values to updateCameraTarget
      this.updateCameraTarget(moveX, moveZ);
      this.#orbitControls.update();
      // this.rigidbody.setNextKinematicTranslation(targetPos)
      this.rigidbody.setNextKinematicRotation(this.rotateQuaternion);

      // this.rigidbody.setLinvel({ x: 0, y: 0, z: 1 }, true);
      // rigidBody.setAngvel({ x: 3.0, y: 0.0, z: 0.0 }, true);
    }
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
  // Method to toggle between run and walk
  switchRunToggle() {
    this.toggleRun = !this.toggleRun;
  }
  setPostion(position) {
    this.rigidbody.setNextKinematicTranslation(position)
  }
}

// Todo: messy and needs a refactore.
function directionoffset(keysPressed) {
  // Calculating Direction Offset logic for W,W+A,W+S,S+D,A+D
  var value = 0;
  if (keysPressed.includes("w")) {
    if (keysPressed.includes("a")) {
      return -3 * Math.PI / 4; // W+A 45%  
    }
    if (keysPressed.includes("d")) {
      return 3 * Math.PI / 4; // W+A 45%  
    }
    return Math.PI;
  }
  if (keysPressed.includes("s")) {
    if (keysPressed.includes("a")) {
      return -Math.PI / 4; // W+A 45%  
    }
    if (keysPressed.includes("d")) {
      return Math.PI / 4; // W+A 45%  
    }
    return 0; // S
  }
  if (keysPressed.includes("a")) {
    return -Math.PI / 2; // W+A 45%
  }
  if (keysPressed.includes("d")) {
    return Math.PI / 2; // W+D -45%
  }

  return value;
}
// Refacort To handle Events insead of Keys
function directionPressed() {
  let keys = ["w", "s", "a", "d"];
  return keys.filter(function (key) {
    return Input.GetKeyDown(key);
  });
}
