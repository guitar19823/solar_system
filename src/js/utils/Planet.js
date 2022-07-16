const THREE = require('three');

class Planet {
  constructor(scene, radius, segments, textureMap, halo = false, haloSize = 0) {
    this.scene = scene;
    this.radius = radius;
    this.segments = segments;
    this.textureMap = textureMap;
    this.halo = halo;
    this.haloSize = haloSize;

    return this.init();
  }

  init() {
    this.textureMap.anisotropy = 7;

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, this.segments, this.segments),
      new THREE.MeshPhongMaterial({ map: this.textureMap, color: 0xffffff })
    );

    // if (this.halo) {
    //   const halo = new THREE.Mesh(
    //     new THREE.SphereBufferGeometry(this.radius * this.haloSize, this.segments, this.segments),
    //     new THREE.ShaderMaterial({
    //       fragmentShader: fragmentShader,
    //       //side: THREE.BackSide,
    //       transparent: true
    //     })
    //   );

    //   scene.add(halo);

    //   planetHalo = halo;
    // }

    planet.castShadow = true;
    planet.receiveShadow = true;

    this.scene.add(planet);

    return planet;
  }
}

module.exports = Planet;
