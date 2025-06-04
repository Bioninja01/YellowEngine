import * as THREE from "three"


export class DebugNoramlLine {
    constructor(webgl, origin = new THREE.Vector3(0, 0, 0), color = 0x0000ff) {
        const material = new THREE.LineBasicMaterial({
            color,
            linewidth: 5,
            linecap: "round", //ignored by WebGLRenderer
            linejoin: "round", //ignored by WebGLRenderer
        });
        const points = [origin.clone(), origin.multiplyScalar(5)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        line.name = "LINE";
        line.frustumCulled = false;
        webgl.addGizmo(line)
        this.line = line
    }
    update(point, offset = new THREE.Vector3(0, 0, 0)) {
        let origin = new THREE.Vector3(point.x + offset.x, point.y, point.z + offset.z)
        this.line.geometry.setFromPoints([origin.clone(), origin.add(new THREE.Vector3(0,5,0))]);
    }
}