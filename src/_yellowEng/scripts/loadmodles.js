import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function loadModle(path, scene) {
  const loader = new GLTFLoader();
  loader.load(
    path,
    function (gltf) {
      scene.add(gltf.scene);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );
}
