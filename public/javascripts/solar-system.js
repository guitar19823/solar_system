/* ************************************************ */
/* ****************** SOLAR SYSTEM **************** */
/* ************************************************ */

const solarSystem = () => {
    let width = window.innerWidth,
        height = window.innerHeight,
		scene, camera, controls, renderer, texture,
		space, sun, mercury, venus, earth, planetHalo, moon, mars, jupiter, saturn, uranus, neptune, pluto, charon,
		ringSaturn1, ringSaturn2, ringUranus,
		stars1, stars2, stars3, stars4, stars5,
		time = new Date().getTime() / 1000,
        speed = 0.0002;

    const rotationalSpeed = 0.02;
	const speedPlanets = 1 / 10000000;
	const k = mobileDevice() ? 2 : 1;
   	const fragShader = `
        void main() {
           gl_FragColor = vec4(255.0, 249.0, 23.0, 1.0);
        }
    `;
   	const vertexShader = `
        varying vec3 vNormal;
        varying vec4 vector;
        void main() {
            vNormal = normalize( normalMatrix * normal );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;
   	const fragmentShader = `
        varying vec3 vNormal;
        varying vec4 vector;
        void main() {
        vec4 v = vec4( vNormal, 0.0 );
            float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 0.0 ) ), 4.0 );
            gl_FragColor = vec4( 1.0, 1.0, 1.0, 0.3 ) * intensity;
        }
    `;

    /**
    * mobileDevice
    */
    function mobileDevice() {
        return navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
    }
	
    // CameraControls
    class CameraControls {
        constructor( camera ) {
            this.camera = camera, this.x = 0, this.y = 0, this.z = 1000, this.angle = 0, this.direction = Math.PI, this.distance = 1, this.updateCamera();
        }
        
        updateCamera() {
            let dir = this.direction + Math.PI,
                zA = Math.cos(this.angle),
                vx = -zA * Math.sin(dir),
                vy = Math.sin(this.angle),
                vz = zA * Math.cos(dir);
            
            this.camera.position.set(vx * this.distance + this.x, vy * this.distance + this.y, vz * this.distance + this.z);
            this.camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
            this.camera.updateProjectionMatrix();
        }
    }
    // CameraControls
	
    /**
    * initScene
    */
    function initScene() {
        // Renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(renderer.domElement);
        // Renderer
		
        // Scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);
        // Scene
		
        // Lights
		let light = new THREE.PointLight(0xffffff, 1.5, 50000);
		light.position.set(0, 0, 0);
		light.castShadow = true;
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;
		light.shadow.camera.near = 0.001;
		light.shadow.camera.far = 50000;
		scene.add(light);
		
		let ambient = new THREE.AmbientLight(0x010101, 1);
		scene.add(ambient);
        // Lights
		
        // Camera
		camera = new THREE.PerspectiveCamera(50, width / height, 0.001, 50000000000);
        // Camera
		
        // Listener	
		class Sound {
			constructor(track, object) {
				this.track = track, this.object = object;
                this.init();
			}
			
			init() {
				let listener = new THREE.AudioListener();
				this.object.add(listener);
				let sound = new THREE.Audio(listener);
				let audioLoader = new THREE.AudioLoader();
				audioLoader.load(this.track, function(buffer) {
					sound.setBuffer(buffer);
					sound.setLoop(true);
					sound.setVolume(0.5);
					sound.play();
				} );
			}
		}
		//new Sound('/sounds/space3.mp3', camera);
        // Listener
		
		// Space
		let spaceGeometry = new THREE.SphereGeometry(5000000000, 30 / k, 30 / k),
            spaceTexture = mobileDevice() ? '/textures/spacetexturemobile.jpg' : '/textures/spacetexturedesctop.jpg';
		
		let textureLoader = new THREE.TextureLoader();
        spaceTexture = textureLoader.load(spaceTexture);
        textureLoader.manager.onLoad = function () {
            setTimeout(function () {
                //track && track.play();
                let preloader = document.getElementById('preloader');
                preloader.classList.contains('done') || (preloader.classList.add('done'), preloader.innerHTML = '');
            }, 2000);
        }
		spaceTexture.anisotropy = 10;
		let spaceMaterial = new THREE.MeshBasicMaterial({map: spaceTexture, side: THREE.BackSide});
		space = new THREE.Mesh(spaceGeometry, spaceMaterial);
		space.scale.x = -1;
		space.scale.y = -1;
		space.scale.z = -1;
		space.rotation.x = 23.5 * Math.PI / 180;
		space.rotation.y = 0;
		space.rotation.z = Math.PI;
		scene.add(space);
		// Space
		
		// Sun
		let sunShaderGeometry = new THREE.SphereBufferGeometry(4.638, 64 / k, 64 / k),
            shaderCode = fragShader,
            sunShaderMaterial = new THREE.ShaderMaterial({fragmentShader: shaderCode});
		sun = new THREE.Mesh(sunShaderGeometry, sunShaderMaterial);
		scene.add(sun);
		// Sun
        
        // Halo
        class Halo {
			constructor(radius, widthSegments = 64 / k, heightSegments = 64 / k) {
				this.radius = radius, this.widthSegments = widthSegments, this.heightSegments = heightSegments, this.init()
			}
			
			init() {
				scene.add(new THREE.Mesh(
                    new THREE.SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments),
                    new THREE.ShaderMaterial({
                        uniforms: {},
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader,
                        side: THREE.BackSide,
                        blending: THREE.AdditiveBlending,
                        transparent: true
                    })
                ))
			}
		}
        
        new Halo(50);
        new Halo(20);
        new Halo(7);
        // Halo
        
        
        // Planets
		class Planet {
			constructor(radius, segments, texture, halo = false, haloSize = 0) {
				this.radius = radius, this.segments = segments, this.texture = texture, this.halo = halo, this.haloSize = haloSize;
                return this.init();
			}
			
			init() {
				let planetTexture = new THREE.TextureLoader().load(this.texture);
				planetTexture.anisotropy = 7;
				let planet = new THREE.Mesh(
                    new THREE.SphereGeometry(this.radius, this.segments, this.segments),
                    new THREE.MeshPhongMaterial({map: planetTexture, color: 0xffffff})
                );
                
                if (this.halo) {
                    let halo = new THREE.Mesh(
                        new THREE.SphereBufferGeometry(this.radius * this.haloSize, this.segments, this.segments),
                        new THREE.ShaderMaterial({
                            uniforms: {},
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.BackSide,
                            blending: THREE.AdditiveBlending,
                            transparent: true
                        })
                    );
                    scene.add(halo);
                    planetHalo = halo;
                }
                
				planet.castShadow = true;
				planet.receiveShadow = true;
                scene.add(planet);
				return planet;
			}
		}
		
		mercury = new Planet(0.0163, 44 / k, '/textures/mercurytexture.jpg');
		venus = new Planet(0.0403, 60 / k, '/textures/venustexture.jpg');
		earth = new Planet(0.0425, 60 / k, '/textures/earthtexture.jpg', true, 1.01 );//0.00425
		moon = new Planet(0.0116, 44 / k, '/textures/moontexture.jpg');
		mars = new Planet(0.0226, 60 / k, '/textures/marstexture.jpg');
		jupiter = new Planet(0.4611, 180 / k, '/textures/jupitertexture.jpg');
		saturn = new Planet(0.3821, 180 / k, '/textures/saturntexture.jpg');
		uranus = new Planet(0.1684, 180 / k, '/textures/uranustexture.jpg');
		neptune = new Planet(0.167, 180 / k, '/textures/neptunetexture.jpg');
		pluto = new Planet(0.0079, 30 / k, '/textures/plutotexture.jpg');
		charon = new Planet(0.004, 30 / k, '/textures/charontexture.jpg');
        // Planets
		
        // Rings
		class Ring {
			constructor(count, innerRadius, deltaRadius, opacity) {
				this.count = count, this.innerRadius = innerRadius, this.deltaRadius = deltaRadius, this.opacity = opacity;
                return this.init();
			}
			
			init() {
				let geometry = new THREE.Geometry();
				for (let i = 0; i < this.count; i += Math.random()) {
					let vertex = new THREE.Vector3();
					vertex.x = Math.sin(Math.PI * i / 180) * (this.innerRadius + i / this.deltaRadius);
					vertex.y = Math.random() / 100;
					vertex.z = Math.cos(Math.PI * i / 180) * (this.innerRadius + i / this.deltaRadius);
					geometry.vertices.push(vertex);
				}
				let material = new THREE.PointsMaterial({color: 0xffffff, size: 0.0001, sizeAttenuation: true, opacity: this.opacity, transparent: true}),
                    ring = new THREE.Points(geometry, material);
				ring.castShadow = true;
				ring.receiveShadow = true;
                scene.add(ring);
				return ring;
			}
		}
		
		ringSaturn1 = new Ring(7000, 0.6, 40000, 0.4);
		ringSaturn2 = new Ring(13000, 0.8, 110000, 0.1);
		ringSaturn3 = new Ring(2000, 0.55, 50000, 0.05);
		ringUranus = new Ring(3000, 0.27, 100000, 0.1);
        // Rings
		
		window.addEventListener('resize', onWindowResize, false);
	}
	

	let forwardButtonState = false,
        backButtonState = false,
        leftButtonState = false,
        rightButtonState = false,
        flightCam = false,
        cam = false,
        cx, cz, cr, px, pz;
	
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
			//if (this.rp) this.planet.rotation.y += (this.s * 365.25 / this.yied) * (Math.PI * this.pdiy) / 360;
			//else this.planet.rotation.y -= (this.s * 365.25 / this.yied) * (Math.PI * this.pdiy) / 360;
            this.rp ? (
                this.planet.rotation.y += 365.25 * this.s / this.yied * (Math.PI * this.pdiy) / 360
            ) : (
                this.planet.rotation.y -= 365.25 * this.s / this.yied * (Math.PI * this.pdiy) / 360
            );
            
			this.planet.rotation.x = this.iop * Math.PI / 180;
			return this.planet;
		}
	}
	
	class CameraLook {
		constructor (planet, distanceToPlanet) {
			this.planet = planet, this.distanceToPlanet = distanceToPlanet;
            return this.init();
		}

		init () {
			camera.lookAt(this.planet.position);
			camera.position.x = this.planet.position.x + Math.cos(time * rotationalSpeed) * this.distanceToPlanet * Math.pow(3, 1 / 2) / 2;
			camera.position.y = this.planet.position.y + Math.cos(time * rotationalSpeed) * this.distanceToPlanet / 2;
			camera.position.z = this.planet.position.z + Math.sin(time * rotationalSpeed) * this.distanceToPlanet;
			cx = camera.position.x;
			cz = camera.position.z;
			px = this.planet.position.x;
			pz = this.planet.position.z;
		}
	}
                                                          
    // Flight controls
    function flightControl() {
        lookAtPlanet(null);
        flightCam = true;
        
        if (mobileDevice()) {
			let speedControl = document.getElementById('speedControl'),
                range = document.getElementById('range');
            
			range.addEventListener('input', function () {
                speed = range.value / 8922394.583;
                speedControl.innerHTML = 'скорость: ' + range.value + ' км/с';
			});
            
            speed = range.value / 8922394.583;
			speedControl.innerHTML = 'скорость: ' + range.value + ' км/с';
            
            controls = new CameraControls(camera);
            controls.direction = px < cx ? Math.atan((pz - cz) / (px - cx)) + Math.PI / 2 : Math.atan((pz - cz) / (px - cx)) - Math.PI / 2;
            controls.x = cx;
            controls.z = cz;
            controls.updateCamera();

			let startX,
                startY,
                areaTouchMove = document.getElementById('areaTouchMove'),
                forward = document.getElementById('forward'),
                backward = document.getElementById('backward'),
                left = document.getElementById('left'),
                right = document.getElementById('right');
            
			areaTouchMove.addEventListener('touchstart', touchStart, false);
			areaTouchMove.addEventListener('touchend', touchEnd, false);
            
            function touchStart(event) {
                event.preventDefault();
                event.stopPropagation();
			    startX = event.changedTouches[0].clientX;
			    startY = event.changedTouches[0].clientY;
                
                this.addEventListener('touchmove', touchMove, false);
			}
            
            function touchEnd() {
                event.preventDefault();
                event.stopPropagation();
                this.removeEventListener('touchmove', touchMove)
			}
            
            function touchMove(event) {
                event.preventDefault();
                event.stopPropagation();
                let touchXRel = event.changedTouches[0].clientX - startX;
                let touchYRel = event.changedTouches[0].clientY - startY;
                
                startX = event.changedTouches[0].clientX;
                startY = event.changedTouches[0].clientY;

				if (controls != null) {
                    controls.angle += touchYRel * 0.007;

                    if (controls.angle > Math.PI * 5 / 11) controls.angle = Math.PI * 5 / 11;
                    else if (controls.angle < -Math.PI * 5 / 11) controls.angle = -Math.PI * 5 / 11;

                    controls.direction += touchXRel * 0.007;
                    controls.updateCamera();
                }
			}
            
            window.addEventListener('touchstart', function (event) {
                switch (event.srcElement) {
                    case forward: forwardButtonState = true; break;
                    case backward: backButtonState = true; break;
                    case left: leftButtonState = true; break;
                    case right: rightButtonState = true; break;
                }
            });
            
            window.addEventListener('touchend', function (event) {
                switch (event.srcElement) {
                    case forward: forwardButtonState = false; break;
                    case backward: backButtonState = false; break;
                    case left: leftButtonState = false; break;
                    case right: rightButtonState = false; break;
                }
            });
		} else {
			let speedControl = document.getElementById('speedControl');
			document.addEventListener('wheel', function (event) {
				if (speed >= 0.0000005 && speed < 0.00001) speed -= event.deltaY / 1000000000;
                if (speed >= 0.00001 && speed < 0.0001) speed -= event.deltaY / 100000000;
                if (speed >= 0.0001 && speed < 0.001) speed -= event.deltaY / 7500000;
                if (speed >= 0.001 && speed < 0.01) speed -= event.deltaY / 500000;
                if (speed >= 0.01 && speed <= 0.0331) speed -= event.deltaY / 250000;
                if (speed > 0.0331) speed = 0.0331;
                if (speed < 0.0000005) speed = 0.0000005;
                speedControl.innerHTML = 'скорость: ' + (speed * 8922394.583).toFixed(2) + ' км/с';
			});
			speedControl.innerHTML = 'скорость: ' + (speed * 8922394.583).toFixed(2) + ' км/с';
            
            controls = new CameraControls(camera);
            controls.direction = px < cx ? Math.atan((pz - cz) / (px - cx)) + Math.PI / 2 : Math.atan((pz - cz) / (px - cx)) - Math.PI / 2;
            controls.x = cx;
            controls.z = cz;
            controls.updateCamera();

			document.addEventListener('mousedown', function () {
				if (controls != null) {
                    document.onmousemove = function (event) {
                        controls.angle -= event.movementY * 0.002;
                        
                        if (controls.angle > Math.PI * 5 / 11) controls.angle = Math.PI * 5 / 11;
                        else if (controls.angle < -Math.PI * 5 / 11) controls.angle = -Math.PI * 5 / 11;
                        
                        controls.direction += event.movementX * 0.002;
                        controls.updateCamera();
                    }
                }
			});

			document.addEventListener('mouseup', function () {
				document.onmousemove = null;
			});

			window.addEventListener('keydown', function(event) {
				if (event.repeat === false) {
					switch (event.keyCode) {
						case 87: forwardButtonState = true; break;
						case 83: backButtonState = true; break;
						case 65: leftButtonState = true; break;
						case 68: rightButtonState = true; break; 
					}
				}
			});

			window.addEventListener('keyup', function(event) {
                switch (event.keyCode) {
                    case 87: forwardButtonState = false; break;
                    case 83: backButtonState = false; break;
                    case 65: leftButtonState = false; break;
                    case 68: rightButtonState = false; break; 
                }
			});
		}
    }
    // Flight controls
    
	
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
        
        let objectsNames = document.getElementsByClassName('planet');
        
        for (let i = 0, l = objectsNames.length; i < l; i++) {
            objectsNames[i].addEventListener('click', function () {lookAtPlanet(i)})
        }
    }
    
    doNotFlyLookAtSelectedPlanet();
	
    (function () {
        let arr = [
            ['planets', doNotFlyLookAtSelectedPlanet],
            ['flight', flightControl],
            ['sounds', doNotFlyLookAtRandomPlanet],
            ['chat', doNotFlyLookAtRandomPlanet],
            ['contacts', doNotFlyLookAtEarth]
        ];
        
        arr.map(function (element) {
            document.getElementById(element[0]).addEventListener('click', element[1]);
        });
    } ());
    
    window.addEventListener('popstate', function(e) {
        switch(e.path[0].location.pathname) {
            case '/objects': doNotFlyLookAtSelectedPlanet(); break;
            case '/flight': flightControl(); break;
            case '/contacts': doNotFlyLookAtEarth(); break;
            default: doNotFlyLookAtRandomPlanet();
        }
    });
	
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
    
    function renderScene() {
		new Physics(mercury, 88, 2 / 3, 386.0667, 7, true, speedPlanets, time, -2.47);//-2.47
		new Physics(venus, 224.7, 1.081, 720, 3.4, false, speedPlanets, time, -0.9);//-0.9
		new Physics(earth, 365.25, 365.25, 1000, 23.5, true, speedPlanets, time, -0.7);//-0.7
		new Physics(planetHalo, 365.25, 365.25, 1000, 23.5, true, speedPlanets, time, -0.7);//-0.7
		new Physics(mars, 686.97, 668.6, 1520, 1.85, true, speedPlanets, time, -0.8);//-0.8
		new Physics(jupiter, 4331.865, 10476, 5190.4667, 1.3, true, speedPlanets, time, -1.4);
		new Physics(saturn, 10759, 24231.42, 9533.3333, 2.48, true, speedPlanets, time, 2);
		new Physics(uranus, 30681, 42711.57, 19133.3333, -97.77, true, speedPlanets, time, 0.9);
		new Physics(neptune, 60189.55, 89667.85, 30000, 23, true, speedPlanets, time, 0);
		new Physics(pluto, 90552.78, 14177.67, 40000, 5, false, speedPlanets, time, 3.13);
		
		charon.position.x = pluto.position.x + Math.cos(-time * 57.18 * speedPlanets) * 0.1308;
		charon.position.z = pluto.position.z + Math.sin(-time * 57.18 * speedPlanets) * 0.1308;
		
		moon.position.x = earth.position.x + Math.cos(-time * 12.175 * speedPlanets) * 2.5627;
		moon.position.z = earth.position.z + Math.sin(-time * 12.175 * speedPlanets) * 2.5627;
		
		ringSaturn1.position.x = saturn.position.x;
		ringSaturn1.position.z = saturn.position.z;
		ringSaturn1.rotation.x = saturn.rotation.x;
		ringSaturn1.rotation.y -= (speedPlanets * 0.1 * 365.25 / 10759) * (Math.PI * 24123.42) / 360;
		
		ringSaturn2.position.x = saturn.position.x;
		ringSaturn2.position.z = saturn.position.z;
		ringSaturn2.rotation.x = saturn.rotation.x;
		ringSaturn2.rotation.y -= (speedPlanets * 0.07 * 365.25 / 10759) * (Math.PI * 24231.42) / 360;
		
		ringSaturn3.position.x = saturn.position.x;
		ringSaturn3.position.z = saturn.position.z;
		ringSaturn3.rotation.x = saturn.rotation.x;
		ringSaturn3.rotation.y -= (speedPlanets * 0.12 * 365.25 / 10759) * (Math.PI * 24231.42) / 360;
		
		ringUranus.position.x = uranus.position.x;
		ringUranus.position.z = uranus.position.z;
		ringUranus.rotation.x = uranus.rotation.x;
		ringUranus.rotation.y -= (speedPlanets * 0.3 * 365.25 / 30681) * (Math.PI * 42711.57) / 360;
        
		if (objects[0]) new CameraLook(sun, 17);
		if (objects[1]) new CameraLook(mercury, 0.1);
		if (objects[2]) new CameraLook(venus, 0.2);
		if (objects[3]) new CameraLook(earth, 0.2);
		if (objects[4]) new CameraLook(moon, 0.1);
		if (objects[5]) new CameraLook(mars, 0.15);
		if (objects[6]) new CameraLook(jupiter, 1.5);
		if (objects[7]) new CameraLook(saturn, 1.5);
		if (objects[8]) new CameraLook(uranus, 1);
		if (objects[9]) new CameraLook(neptune, 1);
		if (objects[10]) new CameraLook(pluto, 0.1);
		if (objects[11]) new CameraLook(charon, 0.05);
		if (objects[12]) new CameraLook(space, 15000000000);
		
		if (flightCam) {
			if (forwardButtonState) {
				controls.z += Math.cos(controls.direction) * speed;
				controls.x -= Math.sin(controls.direction) * speed;
				controls.y -= Math.sin(controls.angle) * speed;
				controls.updateCamera();
			}
            
            if (backButtonState) {
				controls.z += Math.cos(controls.direction + Math.PI) * speed;
				controls.x -= Math.sin(controls.direction + Math.PI) * speed;
				controls.y -= Math.sin(controls.angle + Math.PI) * speed;
				controls.updateCamera();
			}

			if (leftButtonState) {
				controls.z += Math.sin(controls.direction) * speed;
				controls.x += Math.cos(controls.direction) * speed;
				controls.updateCamera();
			}
            
            if (rightButtonState) {
				controls.z += Math.sin(controls.direction + Math.PI) * speed;
				controls.x += Math.cos(controls.direction + Math.PI) * speed;
				controls.updateCamera();
			}

			camera.position.set(controls.x, controls.y, controls.z);
		}
        
        time = new Date().getTime() / 1000;
		
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
	
	initScene();
    renderScene();
};