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

  _increaseSpeed(currentSpeed, maxSpeed, boost, lastTime) {
    const currentTime = new Date().getTime();
    const returnData = {
      currentSpeed,
      lastTime,
    };

    if ((!lastTime || currentTime - lastTime > 100) && currentSpeed < maxSpeed) {
      returnData.currentSpeed += boost;

      if (returnData.currentSpeed > maxSpeed) {
        returnData.currentSpeed = maxSpeed;
      }

      returnData.lastTime = currentTime;
    }

    return returnData;
  };

  _decreaseSpeed(currentSpeed, boost, lastTime) {
    const currentTime = new Date().getTime();
    const returnData = {
      currentSpeed,
      lastTime,
    };

    if ((!lastTime || currentTime - lastTime > 100) && currentSpeed > 0) {
      returnData.currentSpeed -= boost;

      if (returnData.currentSpeed < 0) {
        returnData.currentSpeed = 0;
      }

      returnData.lastTime = currentTime;
    }

    return returnData;
  };

  forward(speed, boost, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.forwardSpeed, speed, boost, this.lastTimeForward)
      : this._decreaseSpeed(this.forwardSpeed, boost, this.lastTimeForward);

    this.forwardSpeed = currentSpeed;
    this.lastTimeForward = lastTime;

    return this.forwardSpeed;
  }

  back(speed, boost, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.backSpeed, speed, boost, this.lastTimeBack)
      : this._decreaseSpeed(this.backSpeed, boost, this.lastTimeBack);

    this.backSpeed = currentSpeed;
    this.lastTimeBack = lastTime;

    return this.backSpeed;
  }

  left(speed, boost, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.leftSpeed, speed, boost, this.lastTimeLeft)
      : this._decreaseSpeed(this.leftSpeed, boost, this.lastTimeLeft);

    this.leftSpeed = currentSpeed;
    this.lastTimeLeft = lastTime;

    return this.leftSpeed;
  }

  right(speed, boost, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.rightSpeed, speed, boost, this.lastTimeRight)
      : this._decreaseSpeed(this.rightSpeed, boost, this.lastTimeRight);

    this.rightSpeed = currentSpeed;
    this.lastTimeRight = lastTime;

    return this.rightSpeed;
  }

  top(speed, boost, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.topSpeed, speed, boost, this.lastTimeTop)
      : this._decreaseSpeed(this.topSpeed, boost, this.lastTimeTop);

    this.topSpeed = currentSpeed;
    this.lastTimeTop = lastTime;

    return this.topSpeed;
  }

  bottom(speed, boost, isActive) {
    const { currentSpeed, lastTime } = isActive
      ? this._increaseSpeed(this.bottomSpeed, speed, boost, this.lastTimeBottom)
      : this._decreaseSpeed(this.bottomSpeed, boost, this.lastTimeBottom);

    this.bottomSpeed = currentSpeed;
    this.lastTimeBottom = lastTime;

    return this.bottomSpeed;
  }
}

module.exports = Inertia;