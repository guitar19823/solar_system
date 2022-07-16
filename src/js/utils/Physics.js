class Physics {
  constructor(planet, yearInEarthDays, planetaryDaysInYear, distanceToSun, inclinationOfPlanet, rotationPlanet, speed, time, start) {
    this.planet = planet;
    this.yied = yearInEarthDays;
    this.pdiy = planetaryDaysInYear;
    this.dts = distanceToSun;
    this.iop = inclinationOfPlanet;
    this.rp = rotationPlanet;
    this.s = speed;
    this.t = time;
    this.start = start + ((new Date().getTime() / 86400000) % 365.25) * Math.PI / this.yied;

    return this.init();
  }

  init() {
    this.planet.position.x = Math.sin((this.t * this.s * 365.25 / this.yied) + this.start) * this.dts;
    this.planet.position.z = Math.cos((this.t * this.s * 365.25 / this.yied) + this.start) * this.dts;

    this.planet.rotation.y = ((new Date().getTime() / 86400000) % 24) * Math.PI * this.yied / 365.25;
    this.rp ? (
      this.planet.rotation.y += 365.25 * this.s / this.yied * (Math.PI * this.pdiy) / 360
    ) : (
      this.planet.rotation.y -= 365.25 * this.s / this.yied * (Math.PI * this.pdiy) / 360
    );

    this.planet.rotation.x = this.iop * Math.PI / 180;

    return this.planet;
  }
}

module.exports = Physics;
