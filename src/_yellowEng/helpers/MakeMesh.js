function makeBox() {
  // Define the box vertices (8 points for a cube)
  const vertices = [
    new THREE.Vector3(-0.5, -0.5, 0.5), // Front bottom left
    new THREE.Vector3(0.5, -0.5, 0.5), // Front bottom right
    new THREE.Vector3(0.5, 0.5, 0.5), // Front top right
    new THREE.Vector3(-0.5, 0.5, 0.5), // Front top left
    new THREE.Vector3(-0.5, -0.5, -0.5), // Back bottom left
    new THREE.Vector3(0.5, -0.5, -0.5), // Back bottom right
    new THREE.Vector3(0.5, 0.5, -0.5), // Back top right
    new THREE.Vector3(-0.5, 0.5, -0.5), // Back top left
  ];
  // Define the faces of the box (each face is made of two triangles)
  const faces = [
    // Front face
    [0, 1, 2],
    [2, 3, 0],

    // Back face
    [4, 5, 6],
    [6, 7, 4],

    // Left face
    [0, 3, 7],
    [7, 4, 0],

    // Right face
    [1, 5, 6],
    [6, 2, 1],

    // Top face
    [3, 2, 6],
    [6, 7, 3],

    // Bottom face
    [0, 4, 5],
    [5, 1, 0],
  ];

  // Create a geometry with the vertex data
  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints(vertices);

  // Set the face indices for the geometry
  const indexArray = faces.flat();
  geometry.setIndex(
    new THREE.DynamicBufferAttribute(new Uint16Array(indexArray), 1)
  );

  // Create a basic material
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // Create a mesh from the geometry and material
  const boxMesh = new THREE.Mesh(geometry, material);
  return boxMesh;
}
