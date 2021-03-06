const THREE = require('three');
const Lensflare = require('./lensflare.js');

/* ************************************************ */
/* ****************** SOLAR SYSTEM **************** */
/* ************************************************ */

const solarSystem = (antialias = false, textures = 'high', graphics = 1) => {
    let width = window.innerWidth,
        height = window.innerHeight,
		scene, camera, controls, renderer, texture,
		space, sun, mercury, venus, earth, planetHalo, moon, mars, jupiter, saturn, uranus, neptune, pluto, charon,
		ringSaturn, ringUranus,
		stars1, stars2, stars3, stars4, stars5,
		time = new Date().getTime() / 1000,
        speed = 0.0017;

    const rotationalSpeed = 0.02;
	const speedPlanets = 1 / 10000000;
	const k = mobileDevice() ? 2 * graphics : 1 * graphics;
   	const sunFragmentShader = `
        void main() {
           gl_FragColor = vec4(255.0, 249.0, 23.0, 1.0);
        }
    `;
    const fragmentShader = `
        void main() {
           gl_FragColor = vec4(255, 255, 255, 0.01);
        }
    `;
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
    * getCookie
    * @name
    */
    function getCookie(name) {
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

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
    // CameraControls
	
    /**
    * initScene
    */
    function initScene() {
        // Renderer
		renderer = new THREE.WebGLRenderer({ antialias: antialias });
        renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(renderer.domElement);
        // Renderer
		
        // Scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);
        // Scene
		
        // Texture Loader
        const textureLoader = new THREE.TextureLoader();
        // Texture Loader

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

        const textureFlare0 = textureLoader.load('/img/lensflare.png');
        const textureFlare3 = textureLoader.load('/img/lensflare3.png');

        const lensflare = new THREE.Lensflare();

        lensflare.addElement( new THREE.LensflareElement( textureFlare3, 10, 0.3 ) );
        lensflare.addElement( new THREE.LensflareElement( textureFlare0, 30, 0.6 ) );
        lensflare.addElement( new THREE.LensflareElement( textureFlare3, 50, 1 ) );

        light.add(lensflare);
		
		const ambient = new THREE.AmbientLight(0x050505, 0.2);

		scene.add(ambient);
        // Lights
		
        // Camera
		camera = new THREE.PerspectiveCamera(65, width / height, 0.001, 50000000000);
        // Camera
		
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
		// Space
		
		// Sun
		//const sunShaderGeometry = new THREE.SphereBufferGeometry(4.638, 64 / k, 64 / k);
        //const sunShaderMaterial = new THREE.ShaderMaterial({ fragmentShader: sunFragmentShader });

		//sun = new THREE.Mesh(sunShaderGeometry, sunShaderMaterial);
		//scene.add(sun);

        class SunSprite {
            constructor(scaleX, scaleY, opacity, texture) {
                this.scaleX = scaleX;
                this.scaleY = scaleY;
                this.opacity = opacity;
                this.texture = texture;
                return this.init();
            }
            
            init() {
                const spriteMap = textureLoader.load(this.texture);
                const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff, transparent: true, opacity: this.opacity });
                const sprite = new THREE.Sprite(spriteMaterial);

                sprite.scale.set(this.scaleX, this.scaleY, 1)
                scene.add(sprite);
                return sprite;
            }
        }

        sun = new SunSprite(300, 300, 1, '../img/sol-min.png');
        new SunSprite(300, 300, 0.5, '../img/corona.png');
        new SunSprite(1500, 1500, 0.1, '../img/halo.png');
        new SunSprite(1200, 600, 0.1, '../img/flare.png');
		// Sun
        
        // Planets
		class Planet {
			constructor(radius, segments, texture, halo = false, haloSize = 0) {
				this.radius = radius, this.segments = segments, this.texture = texture, this.halo = halo, this.haloSize = haloSize;
                return this.init();
			}
			
			init() {
				const planetTexture = textureLoader.load(this.texture);
                const nightTexture = textureLoader.load('/img/night.png');

				planetTexture.anisotropy = 7;

				const planet = new THREE.Mesh(
                    new THREE.SphereGeometry(this.radius, this.segments, this.segments),
                    new THREE.MeshPhongMaterial({ map: planetTexture, color: 0xffffff })
                    //new THREE.ShaderMaterial({
                    //    uniforms: {
                    //        sunDirection: {type: "v3", value: sun.position},
                    //        dayTexture: { type: 't', value: planetTexture },
                    //        nightTexture: { type: 't', value: nightTexture }
                    //    },
                    //    vertexShader: planetVertexShader,
                    //    fragmentShader: planetFragmentShader
                    //})
                );
                
                if (this.halo) {
                    const halo = new THREE.Mesh(
                        new THREE.SphereBufferGeometry(this.radius * this.haloSize, this.segments, this.segments),
                        new THREE.ShaderMaterial({
                            fragmentShader: fragmentShader,
                            //side: THREE.BackSide,
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
		
		mercury = new Planet(0.0163, 44 / k, `/img/mercury${textures}-min.jpg`);
		venus = new Planet(0.0403, 60 / k, `/img/venus${textures}-min.jpg`);
		earth = new Planet(0.0425, 60 / k, `/img/earth${textures}-min.jpg`, true, 1.01 );//0.00425
		moon = new Planet(0.0116, 44 / k, `/img/moon${textures}-min.jpg`);
		mars = new Planet(0.0226, 60 / k, `/img/mars${textures}-min.jpg`);
		jupiter = new Planet(0.4611, 180 / k, `/img/jupiter${textures}-min.jpg`);
		saturn = new Planet(0.3821, 180 / k, `/img/saturn${textures}-min.jpg`);
		uranus = new Planet(0.1684, 180 / k, `/img/uranus${textures}-min.jpg`);
		neptune = new Planet(0.167, 180 / k, `/img/neptune${textures}-min.jpg`);
		pluto = new Planet(0.0079, 30 / k, `/img/pluto${textures}-min.jpg`);
		charon = new Planet(0.004, 30 / k, `/img/charon${textures}-min.jpg`);
        // Planets
		
        // Rings
        class Ring {
            constructor(radiusTop, radiusBottom, vheight, radialSegments, heightSegments, opacity, texture) {
                this.radiusTop = radiusTop,
                this.radiusBottom = radiusBottom,
                this.vheight = vheight,
                this.radialSegments = radialSegments,
                this.heightSegments = heightSegments,
                this.opacity = opacity,
                this.texture = texture;
                return this.init();
            }

            init() {
                const ringTexture = textureLoader.load(this.texture);
                const geometry = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.vheight, this.radialSegments, this.heightSegments, true);
                const material = new THREE.MeshBasicMaterial({ map: ringTexture, color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: this.opacity });
                const ring = new THREE.Mesh(geometry, material);

                scene.add(ring);
                ring.castShadow = true;
                ring.receiveShadow = true;
                return ring;
            }
        }      

        ringSaturn = new Ring(0.43, 0.9, 0.0001, 100, 10, 0.5, `/img/saturn_ring${textures}.png`);
        ringUranus = new Ring(0.26, 0.34, 0.0001, 100, 10, 0.2, `/img/uranus_ring${textures}.png`);
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
        const sensivity = getCookie('mouse_sensitivity') / 5;
        lookAtPlanet(null);
        flightCam = true;
        
        if (mobileDevice()) {
			const speedControl = document.getElementById('speedControl');
            const range = document.getElementById('range');
            
			range.addEventListener('input', function () {
                speed = range.value / 8922394.583;
                speedControl.innerHTML = 'speed: ' + range.value + ' km/s';
			});
            
            speed = range.value / 8922394.583;
			speedControl.innerHTML = 'speed: ' + range.value + ' km/s';
            
            controls = new CameraControls(camera);
            controls.direction = px < cx ? Math.atan((pz - cz) / (px - cx)) + Math.PI / 2 : Math.atan((pz - cz) / (px - cx)) - Math.PI / 2;
            controls.x = cx;
            controls.z = cz;
            controls.updateCamera();

			let startX,
                startY;

            const areaTouchMove = document.getElementById('areaTouchMove');
            const forward = document.getElementById('forward');
            const backward = document.getElementById('backward');
            const left = document.getElementById('left');
            const right = document.getElementById('right');
            
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
			const speedControl = document.getElementById('speedControl');
			document.addEventListener('wheel', function (event) {
				if (speed >= 0.0000005 && speed < 0.00001) speed -= event.deltaY / 1000000000;
                if (speed >= 0.00001 && speed < 0.0001) speed -= event.deltaY / 100000000;
                if (speed >= 0.0001 && speed < 0.001) speed -= event.deltaY / 7500000;
                if (speed >= 0.001 && speed < 0.01) speed -= event.deltaY / 500000;
                if (speed >= 0.01 && speed <= 0.0331) speed -= event.deltaY / 250000;
                if (speed > 0.0331) speed = 0.0331;
                if (speed < 0.0000005) speed = 0.0000005;
                speedControl.innerHTML = 'speed: ' + (speed * 8922394.583).toFixed(2) + ' km/s';
			});
			speedControl.innerHTML = 'speed: ' + (speed * 8922394.583).toFixed(2) + ' km/s';
            
            controls = new CameraControls(camera);
            controls.direction = px < cx ? Math.atan((pz - cz) / (px - cx)) + Math.PI / 2 : Math.atan((pz - cz) / (px - cx)) - Math.PI / 2;
            controls.x = cx;
            controls.z = cz;
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
            ['sounds', doNotFlyLookAtRandomPlanet],
            ['chat', doNotFlyLookAtRandomPlanet],
            ['contacts', doNotFlyLookAtEarth],
            ['settings', doNotFlyLookAtSelectedPlanet]
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
            case '/settings': doNotFlyLookAtSelectedPlanet(); break;
            default: doNotFlyLookAtRandomPlanet();
        }
    });
	
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
    
    function renderScene() {
        requestAnimationFrame(renderScene);

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
		
		ringSaturn.position.x = saturn.position.x;
		ringSaturn.position.z = saturn.position.z;
		ringSaturn.rotation.x = saturn.rotation.x;
		ringSaturn.rotation.y -= (speedPlanets * 0.1 * 365.25 / 10759) * (Math.PI * 24123.42) / 360;

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

        renderer.render(scene, camera);
    }
	
	initScene();
    renderScene();
};

export default solarSystem;
