class CameraLook {
  constructor(camera, planet, distanceToPlanet, rotationalSpeed, positions, time) {
    this.camera = camera;
    this.planet = planet;
    this.distanceToPlanet = distanceToPlanet;
    this.rotationalSpeed = rotationalSpeed;
    this.positions = positions;
    this.time = time;

    return this.init();
  }

  init() {
    this.camera.lookAt(this.planet.position);

    this.camera.position.x = this.planet.position.x + Math.cos(this.time * this.rotationalSpeed) * this.distanceToPlanet * Math.pow(3, 1 / 2) / 2;
    this.camera.position.y = this.planet.position.y + Math.cos(this.time * this.rotationalSpeed) * this.distanceToPlanet / 2;
    this.camera.position.z = this.planet.position.z + Math.sin(this.time * this.rotationalSpeed) * this.distanceToPlanet;

    this.positions.cx = this.camera.position.x;
    this.positions.cz = this.camera.position.z;

    this.positions.px = this.planet.position.x;
    this.positions.pz = this.planet.position.z;
  }
}

module.exports = CameraLook;
