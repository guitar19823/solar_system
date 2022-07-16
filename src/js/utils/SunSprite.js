const THREE = require('three');

class SunSprite {
  constructor(scene, scaleX, scaleY, opacity, textureMap) {
    this.scene = scene;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.opacity = opacity;
    this.textureMap = textureMap;

    return this.init();
  }

  init() {
    const spriteMaterial = new THREE.SpriteMaterial({ map: this.textureMap, color: 0xffffff, transparent: true, opacity: this.opacity });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set(this.scaleX, this.scaleY, 1)
    this.scene.add(sprite);

    return sprite;
  }
}

module.exports = SunSprite;
