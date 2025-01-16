import * as THREE from "three";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { GamepadWrapper, XR_BUTTONS, AXES } from "gamepad-wrapper";

import * as Gw from "gamepad-wrapper";

export function setupVrControllers(xrManager, camera_dolly) {
  const controllerModelFactory = new XRControllerModelFactory();
  const controllers = {
    left: null,
    right: null,
  };
  for (let i = 0; i < 2; i++) {
    const raySpace = xrManager.getController(i);
    const gripSpace = xrManager.getControllerGrip(i);
    const mesh = controllerModelFactory.createControllerModel(gripSpace);
    gripSpace.add(mesh);
    camera_dolly.add(raySpace, gripSpace);
    raySpace.visible = false;
    gripSpace.visible = false;
    gripSpace.addEventListener("connected", (e) => {
      raySpace.visible = true;
      gripSpace.visible = true;
      const handedness = e.data.handedness;
      controllers[handedness] = {
        raySpace,
        gripSpace,
        mesh,
        gamepad: new GamepadWrapper(e.data.gamepad),
      };
    });
    gripSpace.addEventListener("disconnected", (e) => {
      raySpace.visible = false;
      gripSpace.visible = false;
      const handedness = e.data.handedness;
      controllers[handedness] = null;
    });
  }
  return controllers;
}

export function setupControllerActions(controllers) {
  return function () {
    if (controllers.right) {
      const { gamepad, raySpace, mesh } = controllers.right;
      if (gamepad.getButtonClick(XR_BUTTONS.TRIGGER)) {
        var material = new THREE.MeshPhongMaterial({
          color: 0xffffff * Math.random(),
        });
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

        var meshCube = new THREE.Mesh(geometry, material);
        meshCube.position.set(0, 0, -0.1).applyMatrix4(raySpace.matrixWorld);
        meshCube.quaternion.setFromRotationMatrix(raySpace.matrixWorld);
        self.addObject3D(meshCube);
      }
      if (gamepad.getAxis(AXES.XR_STANDARD.THUMBSTICK_Y)) {
        var material = new THREE.MeshPhongMaterial({
          color: 0xffffff * Math.random(),
        });
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

        var meshCube = new THREE.Mesh(geometry, material);
        meshCube.position.set(0, 0, -0.1).applyMatrix4(raySpace.matrixWorld);
        meshCube.quaternion.setFromRotationMatrix(raySpace.matrixWorld);
        self.addObject3D(meshCube);
      }
    }
  };
}

export function setupXrControllers(webgl) {
  const myAxisY = new THREE.Vector3(0, 1, 0);
  const myAxisX = new THREE.Vector3(1, 0, 0);
  let prevTime = performance.now();
  const velocity = new THREE.Vector3();
  const velocityV2 = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const directionV2 = new THREE.Vector3();
  let oldQuaternionDummyCam;
  let quaternion;
  let quaternion2;
  webgl.camera_dolly.add(webgl.getCamera());
  webgl.add2Update(function () {
    const time = performance.now();
    // var dummyCamQuaternion = new THREE.Quaternion();
    // webgl.dummyCam.getWorldQuaternion(dummyCamQuaternion);
    // webgl.camera_dolly.quaternion.copy(dummyCamQuaternion);
    try {
      if (webgl.controllers.right) {
        const { gamepad, raySpace, mesh } = webgl.controllers.right;
        if (gamepad.getButtonClick(XR_BUTTONS.TRIGGER)) {
          var material = new THREE.MeshPhongMaterial({
            color: 0xffffff * Math.random(),
          });
          const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          var meshCube = new THREE.Mesh(geometry, material);
          meshCube.position.set(0, 0, -0.1).applyMatrix4(raySpace.matrixWorld);
          meshCube.quaternion.setFromRotationMatrix(raySpace.matrixWorld);
          webgl.addObject3D(meshCube);
        }
  
        const thumbstickValueX = gamepad.getAxis(Gw.XR_AXES.THUMBSTICK_X);
        const thumbstickValueY = gamepad.getAxis(Gw.XR_AXES.THUMBSTICK_Y);
  
        const camera_dolly = webgl.camera_dolly;
        const delta = (time - prevTime) / 1000;
        velocityV2.x -= velocityV2.x * 10.0 * delta;
        velocityV2.z -= velocityV2.z * 10.0 * delta;
        directionV2.z = thumbstickValueY;
        directionV2.x = thumbstickValueX;
        directionV2.normalize(); // this ensures consistent movements in all directions
        if (thumbstickValueY) velocityV2.z -= directionV2.z * 15.0 * delta;
        if (thumbstickValueX) velocityV2.x -= directionV2.x * 15.0 * delta;
        if (Math.abs(directionV2.x) > Math.abs(directionV2.z)) {
          camera_dolly.rotateOnWorldAxis(myAxisY, velocityV2.x * delta);
        } 
        
        else if (Math.abs(directionV2.z) > 0) {
          // dummyCamQuaternion.y = 0;
          // var dummyCamQuaternion = new THREE.Quaternion();
          // webgl.dummyCam.getWorldQuaternion(dummyCamQuaternion);
          // dummyCamQuaternion.x = 0;
          // dummyCamQuaternion.y = 0;
          // camera_dolly.quaternion.copy(dummyCamQuaternion);
          // dummyCamQuaternion.z = 0;
          // console.log("-directionV2.z * 0.0001", -directionV2.z * 0.0001);
          var dummyCam_q = new THREE.Quaternion();
          webgl.debugBox.rotateX(-velocityV2.z * delta);
          // webgl.dummyCam.getWorldQuaternion(dummyCam_q);
          //   camera_dolly.quaternion.copy(dummyCam_q);

          // dummyCamQuaternion.x += -directionV2.z * 0.0001
          // camera_dolly.rotateX(velocityV2.z * delta);
          // camera_dolly.quaternion.copy(quaternion2);
          // camera_dolly.rotateOnWorldAxis(myAxisX,-velocityV2.z * delta);
        } 
        // else if (Math.abs(directionV2.z) == 0) {
        //   var dummyCam_q = new THREE.Quaternion();
        //   var dolly_q = new THREE.Quaternion();
        //   webgl.dummyCam.getWorldQuaternion(dummyCam_q);
        //   webgl.camera_dolly.getWorldQuaternion(dolly_q);
        //   if (
        //     oldQuaternionDummyCam == null ||
        //     !dummyCam_q.equals(oldQuaternionDummyCam)
        //   ){
        //     camera_dolly.quaternion.copy(dummyCam_q);
        //     webgl.dummyCam.getWorldQuaternion(dummyCam_q);
        //   }
        //   oldQuaternionDummyCam = dummyCam_q;
  
  
  
        //   // if (
        //   //   oldQuaternionDummyCam == null ||
        //   //   !dummyCam_q.equals(oldQuaternionDummyCam)
        //   // ) {
        //   //   console.log("dummyCamQuaternion", dummyCamQuaternion);
        //   //   camera_dolly.quaternion.copy(dummyCamQuaternion);
        //   //   webgl.dummyCam.getWorldQuaternion(dummyCamQuaternion);
        //   //   camera_dolly.getWorldQuaternion(dummyCamQuaternionV2);
        //   //   console.log();
  
        //   //   console.log("dummyCamQuaternionV2", dummyCamQuaternion);
        //   //   oldQuaternionDummyCam = dummyCamQuaternion;
        //   // }
        // }
  
        if (gamepad.getAxis(Gw.XR_AXES.THUMBSTICK_Y)) {
          console.log("right");
        }
      }
      if (webgl.controllers.left) {
        const { gamepad, raySpace, mesh } = webgl.controllers.left;
        const thumbstickValueX = gamepad.getAxis(Gw.XR_AXES.THUMBSTICK_X);
        const thumbstickValueY = gamepad.getAxis(Gw.XR_AXES.THUMBSTICK_Y);
        const camera_dolly = webgl.camera_dolly;
        const delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        direction.z = -thumbstickValueY;
        direction.x = thumbstickValueX;
        direction.normalize(); // this ensures consistent movements in all directions
        if (thumbstickValueY) velocity.z -= direction.z * 100.0 * delta;
        if (thumbstickValueX) velocity.x -= direction.x * 100.0 * delta;
        quaternion = camera_dolly.quaternion.clone();
        var dummyCamQuaternion = new THREE.Quaternion();
        webgl.dummyCam.getWorldQuaternion(dummyCamQuaternion);
        camera_dolly.quaternion.copy(dummyCamQuaternion);
        camera_dolly.translateX(-velocity.x * delta);
        camera_dolly.translateZ(velocity.z * delta);
        camera_dolly.quaternion.copy(quaternion);
      }
    } catch (err) {
      console.error(err);
    }

    prevTime = time;
  });
  // self.updates.push(function () {
  //   Object.values(controllers).forEach((controller) => {
  //     if (controller?.gamepad) {
  //       controller.gamepad.update();
  //     }
  //   });

  // });
}
