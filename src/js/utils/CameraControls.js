const THREE = require('three');

class CameraControls {
  constructor(camera) {
    this.camera = camera;
    this.x = 0;
    this.y = 0;
    this.z = 1000;
    this.angle = 0;
    this.direction = Math.PI;
    this.distance = 1;

    this.updateCamera();
  }

  updateCamera() {
    const dir = this.direction + Math.PI;
    const zA = Math.cos(this.angle);
    const vx = -zA * Math.sin(dir);
    const vy = Math.sin(this.angle);
    const vz = zA * Math.cos(dir);

    this.camera.position.set(vx * this.distance + this.x, vy * this.distance + this.y, vz * this.distance + this.z);
    this.camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
    this.camera.updateProjectionMatrix();
  }
}

module.exports = CameraControls;
