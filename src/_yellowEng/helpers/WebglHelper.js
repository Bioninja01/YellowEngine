import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import * as CANNON from 'cannon-es'

export function setupDefaultWorld() {
  const physics = new CANNON.World();
  physics.gravity.set(0, -9.82, 0)
  return physics
}
export function initializeRenderer() {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    // logarithmicDepthBuffer: true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.xr.enabled = true;
  return renderer;
}
export function initializeCSSRenderer() {
  const cssRenderer = new CSS2DRenderer();
  return cssRenderer;
}
export function initializeCamera() {
  let camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 1.6, 10);
  camera.name = "MyMain Camera";
  return camera;
}
export function setupOrbitControls(camera, element) {
  const orbitControls = new OrbitControls(camera, element);
  orbitControls.enableDamping = true; // For smoother controls
  orbitControls.dampingFactor = 0.25;
  return orbitControls;
}
export function setupPointerLockControls(camera, element) {
  const controls = new PointerLockControls(camera, element);
  return controls;
}
export function setupDefaultScene(gizmos, main, light) {
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xd7f8fe, 10, 90);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
  hemiLight.position.set(0, 20, 0);
  hemiLight.name = "hemiLight";
  light.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  dirLight.name = "dirLight";

  light.add(dirLight);

  // ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb })
  );
  mesh.rotateX(-Math.PI / 2);
  mesh.position.set(0, 0.00001, 0);
  mesh.receiveShadow = true;
  mesh.name = "floor";
  mesh.updateMatrix();
  // main.add(mesh);
  scene.add(gizmos, light, main);
  return scene;
}
export function setupDolly(camera, scene) {
  const dolly = new THREE.Object3D();
  dolly.add(camera);
  dolly.name = "dolly";
  scene.add(dolly);
  return dolly;
}
