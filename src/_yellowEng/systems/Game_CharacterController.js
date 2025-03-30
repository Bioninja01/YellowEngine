import * as THREE from "three";
import StateBase from "./States/StateBase";
import Input from "./Input";

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

  constructor(entity_charactor, camera) {
    // Constructor function
    this.model = entity_charactor.model;
    this.mixer = entity_charactor.mixer;
    this.animationmap = entity_charactor.animationmap;
    this.camera = camera;
  }

  update(delta) {
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
        this.camera.position.x - this.model.position.x,
        this.camera.position.z - this.model.position.z
      );

      // Direction offset
      var directionOffsetValue = directionoffset(keysPressed);

      // Rotate Model
      this.rotateQuaternion.setFromAxisAngle(
        this.rotateAngle,
        // directionOffsetValue
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
      const moveX = this.walkDirection.x * -velocity * delta ;
      const moveZ = this.walkDirection.z * -velocity * delta ;

      this.model.position.x += moveX;
      this.model.position.z += moveZ;
      // Passing these values to updateCameraTarget
      // this.updateCameraTarget(moveX, moveZ);
    }
  }
  // updateCameraTarget(moveX, moveZ) {
  //   // move camera
  //   this.camera.position.x = moveX;
  //   this.camera.position.z = moveZ;
  //   // update camera target
  //   this.cameraTarget.x = this.model.position.x;
  //   this.cameraTarget.y = this.model.position.y + 1;
  //   this.cameraTarget.z = this.model.position.z;
  //   this.orbitControl.target = this.cameraTarget;
  // }
  // Method to toggle between run and walk
  switchRunToggle() {
    this.toggleRun = !this.toggleRun;
  }
}

function directionoffset(keysPressed) {
  // Calculating Direction Offset logic for W,W+A,W+S,S+D,A+D
  var value = 0;
  if (keysPressed.includes("ArrowUp")) {
    return Math.PI;
  }
  if (keysPressed.includes("ArrowLeft")) {
    return -Math.PI / 2; // W+A 45%
  }
  if (keysPressed.includes("ArrowRight")) {
    return Math.PI / 2; // W+D -45%
  }
  if (keysPressed.includes("ArrowDown")) {
    return 0; // S
  }
  return value;
}

// Refacort To handle Events insead of Keys
function directionPressed() {
  let keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  return keys.filter(function (key) {
    return Input.GetKeyDown(key);
  });
}
