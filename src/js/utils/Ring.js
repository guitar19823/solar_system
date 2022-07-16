const THREE = require('three');

class Ring {
  constructor(scene, radiusTop, radiusBottom, vheight, radialSegments, heightSegments, opacity, textureMap) {
    this.scene = scene;
    this.radiusTop = radiusTop;
    this.radiusBottom = radiusBottom;
    this.vheight = vheight;
    this.radialSegments = radialSegments;
    this.heightSegments = heightSegments;
    this.opacity = opacity;
    this.textureMap = textureMap;

    return this.init();
  }

  init() {
    const geometry = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.vheight, this.radialSegments, this.heightSegments, true);
    const material = new THREE.MeshBasicMaterial({ map: this.textureMap, color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: this.opacity });
    const ring = new THREE.Mesh(geometry, material);

    this.scene.add(ring);

    ring.castShadow = true;
    ring.receiveShadow = true;

    return ring;
  }
}

module.exports = Ring;
