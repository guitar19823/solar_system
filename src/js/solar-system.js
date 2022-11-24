const THREE = require('three');
// const Lensflare = require('./utils/lensflare.js');
const isMobileDevice = require('./utils/isMobileDevice');
const SunSprite = require('./utils/SunSprite');
const Planet = require('./utils/Planet');
const Ring = require('./utils/Ring');
const CameraControls = require('./utils/CameraControls');
const Physics = require('./utils/Physics');
const CameraLook = require('./utils/CameraLook');
const Inertia = require('./utils/Inertia');

/* ************************************************ */
/* ****************** SOLAR SYSTEM **************** */
/* ************************************************ */

const solarSystem = async (getCookie) => {
	let width = window.innerWidth,
		height = window.innerHeight,
		scene, camera, controls, renderer, texture,
		space, sun, mercury, venus, earth, planetHalo, moon, mars, jupiter, saturn, uranus, neptune, pluto, charon,
		ringSaturn, ringUranus,
		stars1, stars2, stars3, stars4, stars5,
		time = new Date().getTime() / 1000,
		speed = 0.000113,
		boost = 0.00001;

	const ROTATIONAL_SPEED = 0.02;
	const PLANETS_SPEED = 1 / 10000000;
	const antialias = !!(+getCookie('antialias'));
	let graphics, textures;

	switch (getCookie('graphics')) {
		case '0': graphics = 2; break;
		case '1': graphics = 1; break;
		case '2': graphics = 1 / 2; break;
	}

	switch (getCookie('textures')) {
		case '0': textures = 'low'; break;
		case '1': textures = 'medium'; break;
		case '2': textures = 'high'; break;
	}

	const k = isMobileDevice() ? 2 * graphics : 1 * graphics;

	// const sunFragmentShader = `
	//       void main() {
	//          gl_FragColor = vec4(255.0, 249.0, 23.0, 1.0);
	//       }
	//   `;
	// const fragmentShader = `
	//       void main() {
	//          gl_FragColor = vec4(255, 255, 255, 0.01);
	//       }
	//   `;
	/*const planetVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;

void main()
{
		vUv = uv;
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		vNormal = normalMatrix * normal;
		gl_Position = projectionMatrix * mvPosition;
}
`;
const planetFragmentShader = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;

uniform mat3 normalMatrix;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;

void main( void ) {
		vec4 dayColor = texture2D(dayTexture, vUv);
		vec4 nightColor = texture2D(nightTexture, vUv);

		vec3 dir = normalize(normalMatrix * sunDirection);

		// compute cosine sun to normal so -1 is away from sun and +1 is toward sun.
		float cosineAngleSunToNormal = dot(normalize(vNormal), dir);

		// sharpen the edge between the transition
		cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 10.0, -1.0, 3.0);

		// convert to 0 to 1 for mixing
		float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;

		// Select day or night texture based on mix.
		vec4 color = mix(nightColor, dayColor, mixAmount);

		gl_FragColor = color;
} 
`;*/

	/**
	* initScene
	*/
	function initScene() {
		// Renderer
		renderer = new THREE.WebGLRenderer({ antialias });
		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(renderer.domElement);

		// Scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);

		// Texture Loader
		const textureLoader = new THREE.TextureLoader();

		// Lights
		const light = new THREE.PointLight(0xffffff, 1.5, 50000, 2);

		light.position.set(0, 0, 0);
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;
		light.shadow.camera.near = 0.001;
		light.shadow.camera.far = 50000;
		light.castShadow = true;

		scene.add(light);

		//let helper = new THREE.CameraHelper( light.shadow.camera );
		//scene.add(helper);

		// const textureFlare0 = textureLoader.load('/img/lensflare.png');
		// const textureFlare3 = textureLoader.load('/img/lensflare3.png');

		// const lensflare = new THREE.Lensflare();

		// lensflare.addElement(new THREE.LensflareElement(textureFlare3, 10, 0.3));
		// lensflare.addElement(new THREE.LensflareElement(textureFlare0, 30, 0.6));
		// lensflare.addElement(new THREE.LensflareElement(textureFlare3, 50, 1));

		// light.add(lensflare);

		const ambient = new THREE.AmbientLight(0x050505, 0.2);

		scene.add(ambient);

		// Camera
		camera = new THREE.PerspectiveCamera(65, width / height, 0.001, 50000000000);

		// Space
		const spaceGeometry = new THREE.SphereGeometry(5000000000, 30 / k, 30 / k);
		const spaceTexture = textureLoader.load(`/img/space${textures}.jpg`);

		spaceTexture.anisotropy = 10;

		textureLoader.manager.onLoad = function () {
			const preloader = document.getElementsByClassName('preloader')[0];

			setTimeout(function () {
				preloader.classList.add('done');

				setTimeout(function () {
					preloader.remove();
				}, 2000);
			}, 1000);
		}

		const spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });

		space = new THREE.Mesh(spaceGeometry, spaceMaterial);
		space.scale.x = -1;
		space.scale.y = -1;
		space.scale.z = -1;
		space.rotation.x = -Math.PI * 0.37;
		space.rotation.y = -Math.PI * 0.88;
		space.rotation.z = Math.PI * 0.58;

		scene.add(space);

		// Sun
		//const sunShaderGeometry = new THREE.SphereBufferGeometry(4.638, 64 / k, 64 / k);
		//const sunShaderMaterial = new THREE.ShaderMaterial({ fragmentShader: sunFragmentShader });

		//sun = new THREE.Mesh(sunShaderGeometry, sunShaderMaterial);
		//scene.add(sun);

		sun = new SunSprite(scene, 300, 300, 1, textureLoader.load('../img/sol-min.png'));
		new SunSprite(scene, 300, 300, 0.5, textureLoader.load('../img/corona.png'));
		new SunSprite(scene, 1500, 1500, 0.1, textureLoader.load('../img/halo.png'));
		new SunSprite(scene, 1200, 600, 0.1, textureLoader.load('../img/flare.png'));

		// Planets
		mercury = new Planet(scene, 0.0163, 44 / k, textureLoader.load(`/img/mercury${textures}-min.jpg`));
		venus = new Planet(scene, 0.0403, 60 / k, textureLoader.load(`/img/venus${textures}-min.jpg`));
		earth = new Planet(scene, 0.0425, 60 / k, textureLoader.load(`/img/earth${textures}-min.jpg`), true, 1.01); //0.00425
		moon = new Planet(scene, 0.0116, 44 / k, textureLoader.load(`/img/moon${textures}-min.jpg`));
		mars = new Planet(scene, 0.0226, 60 / k, textureLoader.load(`/img/mars${textures}-min.jpg`));
		jupiter = new Planet(scene, 0.4611, 180 / k, textureLoader.load(`/img/jupiter${textures}-min.jpg`));
		saturn = new Planet(scene, 0.3821, 180 / k, textureLoader.load(`/img/saturn${textures}-min.jpg`));
		uranus = new Planet(scene, 0.1684, 180 / k, textureLoader.load(`/img/uranus${textures}-min.jpg`));
		neptune = new Planet(scene, 0.167, 180 / k, textureLoader.load(`/img/neptune${textures}-min.jpg`));
		pluto = new Planet(scene, 0.0079, 30 / k, textureLoader.load(`/img/pluto${textures}-min.jpg`));
		charon = new Planet(scene, 0.004, 30 / k, textureLoader.load(`/img/charon${textures}-min.jpg`));

		// Rings
		ringSaturn = new Ring(scene, 0.43, 0.9, 0.0001, 100, 10, 0.5, textureLoader.load(`/img/saturn_ring${textures}.png`));
		ringUranus = new Ring(scene, 0.26, 0.34, 0.0001, 100, 10, 0.2, textureLoader.load(`/img/uranus_ring${textures}.png`));

		window.addEventListener('resize', onWindowResize, false);
	}

	let counterclockwiseRotationState = false,
		clockwiseRotationState = false,
		forwardButtonState = false,
		backButtonState = false,
		leftButtonState = false,
		rightButtonState = false,
		upButtonState = false,
		downButtonState = false,
		flightCam = false,
		cam = false;

	const positions = {
		cx: 0,
		cz: 0,
		px: 0,
		pz: 0,
	};

	// Flight controls
	function flightControl() {
		const sensivity = getCookie('mouse_sensitivity') / 5;

		lookAtPlanet(null);
		flightCam = true;

		if (isMobileDevice()) {
			const speedControl = document.getElementById('speedControl');
			const boostControl = document.getElementById('boostControl');
			const range = document.getElementById('range');

			range.addEventListener('input', function () {
				speed = range.value / 8922394.583;
				speedControl.innerHTML = 'скорость: ' + range.value + ' км/c';
			});

			speed = range.value / 8922394.583;
			speedControl.innerHTML = 'скорость: ' + range.value + ' км/c';
			boostControl.innerHTML = 'ускорение: ' + (boost * 8922394.583).toFixed(2) + ' км/с<sup>2</sup>';

			controls = new CameraControls(camera);
			controls.direction = positions.px < positions.cx
				? Math.atan((positions.pz - positions.cz) / (positions.px - positions.cx)) + Math.PI / 2
				: Math.atan((positions.pz - positions.cz) / (positions.px - positions.cx)) - Math.PI / 2;

			controls.x = positions.cx;
			controls.z = positions.cz;

			controls.updateCamera();

			let startX, startY;

			const areaTouchMove = document.getElementById('areaTouchMove');
			const forward = document.getElementById('forward');
			const backward = document.getElementById('backward');
			const left = document.getElementById('left');
			const right = document.getElementById('right');

			areaTouchMove.addEventListener('touchstart', touchStart, false);
			areaTouchMove.addEventListener('touchend', touchEnd, false);

			function touchStart(event) {
				event.preventDefault();

				const target = [...event.changedTouches].find(i => i.target === areaTouchMove);

				if (!target) return;

				startX = target.clientX;
				startY = target.clientY;

				this.addEventListener('touchmove', touchMove, false);
			}

			function touchEnd(event) {
				event.preventDefault();
				this.removeEventListener('touchmove', touchMove)
			}

			function touchMove(event) {
				event.preventDefault();

				const target = [...event.changedTouches].find(i => i.target === areaTouchMove);

				if (!target) return;

				let touchXRel = target.clientX - startX;
				let touchYRel = target.clientY - startY;

				startX = target.clientX;
				startY = target.clientY;

				if (controls != null) {
					!!(+getCookie('invert_y')) ? (
						controls.angle -= touchYRel * 0.007 * sensivity
					) : (
						controls.angle += touchYRel * 0.007 * sensivity
					);

					if (controls.angle > Math.PI * 5 / 11) controls.angle = Math.PI * 5 / 11;
					else if (controls.angle < -Math.PI * 5 / 11) controls.angle = -Math.PI * 5 / 11;

					controls.direction += touchXRel * 0.007 * sensivity;
					controls.updateCamera();
				}
			}

			window.addEventListener('touchstart', function (event) {
				switch (event.target) {
					case forward: forwardButtonState = true; break;
					case backward: backButtonState = true; break;
					case left: leftButtonState = true; break;
					case right: rightButtonState = true; break;
				}
			});

			window.addEventListener('touchend', function (event) {
				switch (event.target) {
					case forward: forwardButtonState = false; break;
					case backward: backButtonState = false; break;
					case left: leftButtonState = false; break;
					case right: rightButtonState = false; break;
				}
			});
		} else {
			const speedControl = document.getElementById('speedControl');
			const boostControl = document.getElementById('boostControl');

			document.addEventListener('wheel', function (event) {
				if (speed >= 0.0000005 && speed < 0.00001) speed -= event.deltaY / 1000000000;
				if (speed >= 0.00001 && speed < 0.0001) speed -= event.deltaY / 100000000;
				if (speed >= 0.0001 && speed < 0.001) speed -= event.deltaY / 7500000;
				if (speed >= 0.001 && speed < 0.01) speed -= event.deltaY / 500000;
				if (speed >= 0.01 && speed <= 0.0331) speed -= event.deltaY / 250000;
				if (speed > 0.0331) speed = 0.0331;
				if (speed < 0.0000005) speed = 0.0000005;

				speedControl.innerHTML = 'скорость: ' + (speed * 8922394.583).toFixed(2) + ' км/c';
			});

			speedControl.innerHTML = 'скорость: ' + (speed * 8922394.583).toFixed(2) + ' км/c';
			boostControl.innerHTML = 'ускорение: ' + (boost * 8922394.583).toFixed(2) + ' км/с<sup>2</sup>';

			controls = new CameraControls(camera);
			controls.direction = positions.px < positions.cx ? Math.atan((positions.pz - positions.cz) / (positions.px - positions.cx)) + Math.PI / 2 : Math.atan((positions.pz - positions.cz) / (positions.px - positions.cx)) - Math.PI / 2;
			controls.x = positions.cx;
			controls.z = positions.cz;
			controls.updateCamera();

			document.addEventListener('mousedown', function () {
				if (controls != null) {
					document.onmousemove = function (event) {
						!!(+getCookie('invert_y')) ? (
							controls.angle -= event.movementY * 0.002 * sensivity
						) : (
							controls.angle += event.movementY * 0.002 * sensivity
						);

						if (controls.angle > Math.PI * 5 / 11) controls.angle = Math.PI * 5 / 11;
						else if (controls.angle < -Math.PI * 5 / 11) controls.angle = -Math.PI * 5 / 11;

						controls.direction += event.movementX * 0.002 * sensivity;
						controls.updateCamera();
					}
				}
			});

			document.addEventListener('mouseup', function () {
				document.onmousemove = null;
			});

			window.addEventListener('keydown', function (event) {
				if (event.repeat === false) {
					switch (event.code) {
						case 'KeyQ': counterclockwiseRotationState = true; break;
						case 'KeyE': clockwiseRotationState = true; break;
						case 'KeyW': forwardButtonState = true; break;
						case 'KeyS': backButtonState = true; break;
						case 'KeyA': leftButtonState = true; break;
						case 'KeyD': rightButtonState = true; break;
						case 'Space': upButtonState = true; break;
						case 'ShiftLeft': downButtonState = true; break;
					}
				}
			});

			window.addEventListener('keyup', function (event) {
				switch (event.code) {
					case 'KeyQ': counterclockwiseRotationState = false; break;
					case 'KeyE': clockwiseRotationState = false; break;
					case 'KeyW': forwardButtonState = false; break;
					case 'KeyS': backButtonState = false; break;
					case 'KeyA': leftButtonState = false; break;
					case 'KeyD': rightButtonState = false; break;
					case 'Space': upButtonState = false; break;
					case 'ShiftLeft': downButtonState = false; break;
				}
			});
		}
	}

	let objects = [];

	function lookAtPlanet(arrayIndex) {
		for (let i = 0; i <= 12; i++) {
			objects[i] = !(i !== arrayIndex);
		}
	}

	lookAtPlanet(3);

	function doNotFlyLookAtEarth() {
		flightCam = false;
		controls = null;

		lookAtPlanet(3);
	}

	function doNotFlyLookAtRandomPlanet() {
		flightCam = false;
		controls = null;

		lookAtPlanet(parseInt(Math.random() * 12));
	}

	function doNotFlyLookAtSelectedPlanet() {
		flightCam = false;
		controls = null;

		const objectsNames = document.getElementsByClassName('planet');

		for (let i = 0, l = objectsNames.length; i < l; i++) {
			objectsNames[i].addEventListener('click', () => lookAtPlanet(i))
		}
	}

	doNotFlyLookAtSelectedPlanet();

	(function () {
		let arr = [
			['planets', doNotFlyLookAtSelectedPlanet],
			['flight', flightControl],
			['sounds', doNotFlyLookAtSelectedPlanet],
			['chat', doNotFlyLookAtRandomPlanet],
			['contacts', doNotFlyLookAtEarth],
			['settings', doNotFlyLookAtSelectedPlanet]
		];

		arr.map(function (element) {
			document.getElementById(element[0]).addEventListener('click', element[1]);
		});
	}());

	window.addEventListener('popstate', function (e) {
		switch (e.path[0].location.pathname) {
			case '/objects': doNotFlyLookAtSelectedPlanet(); break;
			case '/flight': flightControl(); break;
			case '/contacts': doNotFlyLookAtEarth(); break;
			case '/settings': doNotFlyLookAtSelectedPlanet(); break;
			default: doNotFlyLookAtRandomPlanet();
		}
	});

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	const inertia = new Inertia();

	function renderScene() {
		requestAnimationFrame(renderScene);

		new Physics(mercury, 88, 2 / 3, 386.0667, 7, true, PLANETS_SPEED, time, -2.47);//-2.47
		new Physics(venus, 224.7, 1.081, 720, 3.4, false, PLANETS_SPEED, time, -0.9);//-0.9
		new Physics(earth, 365.25, 365.25, 1000, 23.5, true, PLANETS_SPEED, time, -0.7);//-0.7
		// new Physics(planetHalo, 365.25, 365.25, 1000, 23.5, true, PLANETS_SPEED, time, -0.7);//-0.7
		new Physics(mars, 686.97, 668.6, 1520, 1.85, true, PLANETS_SPEED, time, -0.8);//-0.8
		new Physics(jupiter, 4331.865, 10476, 5190.4667, 1.3, true, PLANETS_SPEED, time, -1.4);
		new Physics(saturn, 10759, 24231.42, 9533.3333, 2.48, true, PLANETS_SPEED, time, 2);
		new Physics(uranus, 30681, 42711.57, 19133.3333, -97.77, true, PLANETS_SPEED, time, 0.9);
		new Physics(neptune, 60189.55, 89667.85, 30000, 23, true, PLANETS_SPEED, time, 0);
		new Physics(pluto, 90552.78, 14177.67, 40000, 5, false, PLANETS_SPEED, time, 3.13);

		charon.position.x = pluto.position.x + Math.cos(-time * 57.18 * PLANETS_SPEED) * 0.1308;
		charon.position.z = pluto.position.z + Math.sin(-time * 57.18 * PLANETS_SPEED) * 0.1308;

		moon.position.x = earth.position.x + Math.cos(-time * 12.175 * PLANETS_SPEED) * 2.5627;
		moon.position.z = earth.position.z + Math.sin(-time * 12.175 * PLANETS_SPEED) * 2.5627;

		ringSaturn.position.x = saturn.position.x;
		ringSaturn.position.z = saturn.position.z;
		ringSaturn.rotation.x = saturn.rotation.x;
		ringSaturn.rotation.y -= (PLANETS_SPEED * 0.1 * 365.25 / 10759) * (Math.PI * 24123.42) / 360;

		ringUranus.position.x = uranus.position.x;
		ringUranus.position.z = uranus.position.z;
		ringUranus.rotation.x = uranus.rotation.x;
		ringUranus.rotation.y -= (PLANETS_SPEED * 0.3 * 365.25 / 30681) * (Math.PI * 42711.57) / 360;

		if (objects[0]) new CameraLook(camera, sun, 17, ROTATIONAL_SPEED, positions, time);
		if (objects[1]) new CameraLook(camera, mercury, 0.1, ROTATIONAL_SPEED, positions, time);
		if (objects[2]) new CameraLook(camera, venus, 0.2, ROTATIONAL_SPEED, positions, time);
		if (objects[3]) new CameraLook(camera, earth, 0.2, ROTATIONAL_SPEED, positions, time);
		if (objects[4]) new CameraLook(camera, moon, 0.1, ROTATIONAL_SPEED, positions, time);
		if (objects[5]) new CameraLook(camera, mars, 0.15, ROTATIONAL_SPEED, positions, time);
		if (objects[6]) new CameraLook(camera, jupiter, 1.5, ROTATIONAL_SPEED, positions, time);
		if (objects[7]) new CameraLook(camera, saturn, 1.5, ROTATIONAL_SPEED, positions, time);
		if (objects[8]) new CameraLook(camera, uranus, 1, ROTATIONAL_SPEED, positions, time);
		if (objects[9]) new CameraLook(camera, neptune, 1, ROTATIONAL_SPEED, positions, time);
		if (objects[10]) new CameraLook(camera, pluto, 0.1, ROTATIONAL_SPEED, positions, time);
		if (objects[11]) new CameraLook(camera, charon, 0.05, ROTATIONAL_SPEED, positions, time);
		if (objects[12]) new CameraLook(camera, space, 15000000000, ROTATIONAL_SPEED, positions, time);

		if (flightCam) {
			if (forwardButtonState || inertia.forwardSpeed) {
				const forward = inertia.forward(speed, boost, forwardButtonState);

				controls.z += Math.cos(controls.direction) * forward;
				controls.x -= Math.sin(controls.direction) * forward;
				controls.y -= Math.sin(controls.angle) * forward;

				controls.updateCamera();
			}

			if (backButtonState || inertia.backSpeed) {
				const back = inertia.back(speed, boost, backButtonState);

				controls.z += Math.cos(controls.direction + Math.PI) * back;
				controls.x -= Math.sin(controls.direction + Math.PI) * back;
				controls.y -= Math.sin(controls.angle + Math.PI) * back;

				controls.updateCamera();
			}

			if (leftButtonState || inertia.leftSpeed) {
				const left = inertia.left(speed, boost, leftButtonState);

				controls.z += Math.sin(controls.direction) * left;
				controls.x += Math.cos(controls.direction) * left;

				controls.updateCamera();
			}

			if (rightButtonState || inertia.rightSpeed) {
				const right = inertia.right(speed, boost, rightButtonState);

				controls.z += Math.sin(controls.direction + Math.PI) * right;
				controls.x += Math.cos(controls.direction + Math.PI) * right;

				controls.updateCamera();
			}

			if (upButtonState || inertia.topSpeed) {
				if (Math.floor(controls.direction / Math.PI) % 2)
					controls.y -= Math.sin(controls.direction) * inertia.top(speed, boost, upButtonState);
				else
					controls.y += Math.sin(controls.direction) * inertia.top(speed, boost, upButtonState);

				controls.updateCamera();
			}

			if (downButtonState || inertia.bottomSpeed) {
				if (Math.floor(controls.direction / Math.PI) % 2)
					controls.y += Math.sin(controls.direction) * inertia.bottom(speed, boost, downButtonState);
				else
					controls.y -= Math.sin(controls.direction) * inertia.bottom(speed, boost, downButtonState);

				controls.updateCamera();
			}

			// if (counterclockwiseRotationState) {
			// 	scene.rotation.x += 0.01
			// }

			// if (clockwiseRotationState) {
			// 	scene.rotation.x -= 0.01
			// }

			camera.position.set(controls.x, controls.y, controls.z);
		}

		time = new Date().getTime() / 1000;

		renderer.render(scene, camera);
	}

	initScene();
	renderScene();
};

export default solarSystem;
