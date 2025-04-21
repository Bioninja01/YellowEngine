import YellowEngine from "../YellowEngine";
import * as THREE from "three";
import { InfiniteGridHelper } from "../helpers/InfiniteGridHelper";
import { Sky } from "three/addons/objects/Sky.js";
import { addCube, drawLine } from "../creation/add";
import EditorControls from "../entities/EditorControls";
import Entity_Character from "../systems/Entity/Entity_Character";
import Game_CharacterController from "../systems/Game_CharacterController";
import world1URL from "../../assets/models/world1.glb?url"
import { addGltf } from "../controller/ControllerGlbLoader";
import * as CANNON from 'cannon-es'

export default async function setUpGame() {
  const Snap2GridValue = 50;
  const webgl = YellowEngine.webgl;
  const grid = new InfiniteGridHelper(1, 1);
  grid.position.set(0, 0.01, 0);
  grid.renderOrder = -1;
  webgl.addObject3D(grid);

  let box1 = addCube(0, 0, 0, new THREE.Color("#d3fc03"));
  box1.position.set(0, 0.5, -3);
  box1.rotateY((30 * Math.PI) / 180);
  box1.name = "box1";
  webgl.addObject3D(box1);

  let box2 = addCube(0, 0, 0);
  box2.position.set(0, 0.5, -10);
  box2.name = "box2";
  box2.rotateY(THREE.MathUtils.degToRad(180));
  webgl.addObject3D(box2);

  const sky = new Sky();
  sky.scale.setScalar(450000);
  webgl.scene.add(sky);

  var effectController = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    inclination: 0.49, // elevation / inclination
    azimuth: 0.25, // Facing front,
    sun: !true,
  };
  var uniforms = sky.material.uniforms;

  uniforms["turbidity"].value = effectController.turbidity;
  uniforms["rayleigh"].value = effectController.rayleigh;
  uniforms["mieCoefficient"].value = effectController.mieCoefficient;
  uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;
  uniforms["sunPosition"].value.set(400000, 400000, 400000);

  // let editorControls = new EditorControls();
  // webgl.add2Entity(editorControls);
  const playerTemp = new Entity_Character();
  await webgl.add2Entity(playerTemp);
  let controller = new Game_CharacterController(playerTemp, webgl.getCamera(), webgl.renderer.domElement);
  webgl.add2Update(function (delta) {
    controller.update(delta);
  });
  webgl.physics.addBody(controller.rigidbody)
  let world1Obj = await addGltf(world1URL, webgl)
  world1Obj.scene.position.set(0, 0.2, 0);
  controller.setPostion(new THREE.Vector3(1, 0, 0))

  const planeBody = new CANNON.Body({ mass: 0 })
  planeBody.addShape(new CANNON.Box(new CANNON.Vec3(10, 10, 0.1))

)
  planeBody.position.set(0,-0.2,0)
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  webgl.physics.addBody(planeBody)




  return webgl;
}
