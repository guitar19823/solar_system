class Inertia {
  constructor() {
    this.inretionFactor = 100;
    this.forwardSpeed = 0;
    this.backSpeed = 0;
    this.leftSpeed = 0;
    this.rightSpeed = 0;
    this.topSpeed = 0;
    this.bottomSpeed = 0;
    this.lastTimeForward = null;
    this.lastTimeBack = null;
    this.lastTimeLeft = null;
    this.lastTimeRight = null;
    this.lastTimeTop = null;
    this.lastTimeBottom = null;
  }

  _increaseSpeed(currentSpeed, maxSpeed, lastTime) {
    const currentTime = new Date().getTime();
    const returnData = {
      currentSpeed,
      lastTime,
    };

    if ((!lastTime || currentTime - lastTime > 100) && currentSpeed < maxSpeed) {
      returnData.currentSpeed += maxSpeed / 100;

      if (returnData.currentSpeed > maxSpeed) {
        returnData.currentSpeed = maxSpeed;
      }

      returnData.lastTime = currentTime;
    }

    return returnData;
  };

  _decreaseSpeed(currentSpeed, maxSpeed, lastTime) {
    const currentTime = new Date().getTime();
    const returnData = {
      currentSpeed,
      lastTime,
    };

    if ((!lastTime || currentTime - lastTime > 100) && currentSpeed > 0) {
      returnData.currentSpeed -= maxSpeed / 100;

      if (returnData.currentSpeed < 0) {
        returnData.currentSpeed = 0;
      }

      returnData.lastTime = currentTime;
    }

    return returnData;
  };

  forward(speed, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.forwardSpeed, speed, this.lastTimeForward)
      : this._decreaseSpeed(this.forwardSpeed, speed, this.lastTimeForward);

    this.forwardSpeed = currentSpeed;
    this.lastTimeForward = lastTime;

    return this.forwardSpeed;
  }

  back(speed, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.backSpeed, speed, this.lastTimeBack)
      : this._decreaseSpeed(this.backSpeed, speed, this.lastTimeBack);

    this.backSpeed = currentSpeed;
    this.lastTimeBack = lastTime;

    return this.backSpeed;
  }

  left(speed, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.leftSpeed, speed, this.lastTimeLeft)
      : this._decreaseSpeed(this.leftSpeed, speed, this.lastTimeLeft);

    this.leftSpeed = currentSpeed;
    this.lastTimeLeft = lastTime;

    return this.leftSpeed;
  }

  right(speed, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.rightSpeed, speed, this.lastTimeRight)
      : this._decreaseSpeed(this.rightSpeed, speed, this.lastTimeRight);

    this.rightSpeed = currentSpeed;
    this.lastTimeRight = lastTime;

    return this.rightSpeed;
  }

  top(speed, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.topSpeed, speed, this.lastTimeTop)
      : this._decreaseSpeed(this.topSpeed, speed, this.lastTimeTop);

    this.topSpeed = currentSpeed;
    this.lastTimeTop = lastTime;

    return this.topSpeed;
  }

  bottom(speed, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.bottomSpeed, speed, this.lastTimeBottom)
      : this._decreaseSpeed(this.bottomSpeed, speed, this.lastTimeBottom);

    this.bottomSpeed = currentSpeed;
    this.lastTimeBottom = lastTime;

    return this.bottomSpeed;
  }
}

module.exports = Inertia;