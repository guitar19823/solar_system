'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* ************************************************ */
/* ****************** SOLAR SYSTEM **************** */
/* ************************************************ */

var solarSystem = function solarSystem() {
    var antialias = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var textures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'high';
    var graphics = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var width = window.innerWidth,
        height = window.innerHeight,
        scene = void 0,
        camera = void 0,
        controls = void 0,
        renderer = void 0,
        texture = void 0,
        space = void 0,
        sun = void 0,
        mercury = void 0,
        venus = void 0,
        earth = void 0,
        planetHalo = void 0,
        moon = void 0,
        mars = void 0,
        jupiter = void 0,
        saturn = void 0,
        uranus = void 0,
        neptune = void 0,
        pluto = void 0,
        charon = void 0,
        ringSaturn = void 0,
        ringUranus = void 0,
        stars1 = void 0,
        stars2 = void 0,
        stars3 = void 0,
        stars4 = void 0,
        stars5 = void 0,
        time = new Date().getTime() / 1000,
        speed = 0.0002;

    var rotationalSpeed = 0.02;
    var speedPlanets = 1 / 10000000;
    var k = mobileDevice() ? 2 * graphics : 1 * graphics;
    var fragShader = '\n        void main() {\n           gl_FragColor = vec4(255.0, 249.0, 23.0, 1.0);\n        }\n    ';
    var vertexShader = '\n        varying vec3 vNormal;\n        varying vec4 vector;\n        void main() {\n            vNormal = normalize( normalMatrix * normal );\n            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n        }\n    ';
    var fragmentShader = '\n        varying vec3 vNormal;\n        varying vec4 vector;\n        void main() {\n        vec4 v = vec4( vNormal, 0.0 );\n            float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 0.0 ) ), 4.0 );\n            gl_FragColor = vec4( 1.0, 1.0, 1.0, 0.3 ) * intensity;\n        }\n    ';

    /**
    * getCookie
    * @name
    */
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    /**
    * mobileDevice
    */
    function mobileDevice() {
        return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i);
    }

    // CameraControls

    var CameraControls = function () {
        function CameraControls(camera) {
            _classCallCheck(this, CameraControls);

            this.camera = camera, this.x = 0, this.y = 0, this.z = 1000, this.angle = 0, this.direction = Math.PI, this.distance = 1, this.updateCamera();
        }

        _createClass(CameraControls, [{
            key: 'updateCamera',
            value: function updateCamera() {
                var dir = this.direction + Math.PI;
                var zA = Math.cos(this.angle);
                var vx = -zA * Math.sin(dir);
                var vy = Math.sin(this.angle);
                var vz = zA * Math.cos(dir);

                this.camera.position.set(vx * this.distance + this.x, vy * this.distance + this.y, vz * this.distance + this.z);
                this.camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
                this.camera.updateProjectionMatrix();
            }
        }]);

        return CameraControls;
    }();
    // CameraControls

    /**
    * initScene
    */


    function initScene() {
        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: antialias });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        document.body.appendChild(renderer.domElement);
        // Renderer

        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        // Scene
        // Lights

        // Camera
        camera = new THREE.PerspectiveCamera(65, width / height, 0.001, 50000000000);
        // Camera

        // Lights
        var pointLight = new THREE.PointLight(0xffffff, 1.5, 50000);

        pointLight.position.set(0, 0, 0);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;
        pointLight.shadow.camera.near = 0.5;
        pointLight.shadow.camera.far = 50000;
        scene.add(pointLight);

        //const pointLightHelper = new THREE.PointLightHelper( pointLight, 50000 );
        //scene.add( pointLightHelper );

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.02);

        scene.add(ambientLight);

        // Space
        var spaceGeometry = new THREE.SphereGeometry(5000000000, 30 / k, 30 / k);
        var textureLoader = new THREE.TextureLoader();
        var spaceTexture = textureLoader.load('/textures/space' + textures + '.jpg');

        spaceTexture.anisotropy = 10;

        textureLoader.manager.onLoad = function () {
            var preloader = document.getElementsByClassName('preloader')[0];

            setTimeout(function () {
                preloader.classList.add('done');

                setTimeout(function () {
                    preloader.remove();
                }, 2000);
            }, 1000);
        };

        var spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide });

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
        var sunShaderGeometry = new THREE.SphereBufferGeometry(4.638, 64 / k, 64 / k);
        var shaderCode = fragShader;
        var sunShaderMaterial = new THREE.ShaderMaterial({ fragmentShader: shaderCode });

        sun = new THREE.Mesh(sunShaderGeometry, sunShaderMaterial);
        scene.add(sun);
        // Sun

        // Halo

        var Halo = function () {
            function Halo(radius) {
                var widthSegments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64 / k;
                var heightSegments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 64 / k;

                _classCallCheck(this, Halo);

                this.radius = radius, this.widthSegments = widthSegments, this.heightSegments = heightSegments, this.init();
            }

            _createClass(Halo, [{
                key: 'init',
                value: function init() {
                    scene.add(new THREE.Mesh(new THREE.SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments), new THREE.ShaderMaterial({
                        uniforms: {},
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader,
                        side: THREE.BackSide,
                        blending: THREE.AdditiveBlending,
                        transparent: true
                    })));
                }
            }]);

            return Halo;
        }();

        new Halo(50);
        new Halo(20);
        new Halo(7);
        // Halo


        // Planets

        var Planet = function () {
            function Planet(radius, segments, texture) {
                var halo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                var haloSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

                _classCallCheck(this, Planet);

                this.radius = radius, this.segments = segments, this.texture = texture, this.halo = halo, this.haloSize = haloSize;
                return this.init();
            }

            _createClass(Planet, [{
                key: 'init',
                value: function init() {
                    var planetTexture = new THREE.TextureLoader().load(this.texture);

                    planetTexture.anisotropy = 7;

                    var planet = new THREE.Mesh(new THREE.SphereBufferGeometry(this.radius, this.segments, this.segments), new THREE.MeshPhongMaterial({ map: planetTexture, color: 0xffffff }));

                    if (this.halo) {
                        var halo = new THREE.Mesh(new THREE.SphereBufferGeometry(this.radius * this.haloSize, this.segments, this.segments), new THREE.ShaderMaterial({
                            uniforms: {},
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.BackSide,
                            blending: THREE.AdditiveBlending,
                            transparent: true
                        }));
                        scene.add(halo);
                        planetHalo = halo;
                    }

                    planet.castShadow = true;
                    planet.receiveShadow = true;
                    scene.add(planet);
                    return planet;
                }
            }]);

            return Planet;
        }();

        mercury = new Planet(0.0163, 44 / k, '/textures/mercury' + textures + '-min.jpg');
        venus = new Planet(0.0403, 60 / k, '/textures/venus' + textures + '-min.jpg');
        earth = new Planet(0.0425, 60 / k, '/textures/earth' + textures + '-min.jpg', true, 1.01); //0.00425
        moon = new Planet(0.0116, 44 / k, '/textures/moon' + textures + '-min.jpg');
        mars = new Planet(0.0226, 60 / k, '/textures/mars' + textures + '-min.jpg');
        jupiter = new Planet(0.4611, 180 / k, '/textures/jupiter' + textures + '-min.jpg');
        saturn = new Planet(0.3821, 180 / k, '/textures/saturn' + textures + '-min.jpg');
        uranus = new Planet(0.1684, 180 / k, '/textures/uranus' + textures + '-min.jpg');
        neptune = new Planet(0.167, 180 / k, '/textures/neptune' + textures + '-min.jpg');
        pluto = new Planet(0.0079, 30 / k, '/textures/pluto' + textures + '-min.jpg');
        charon = new Planet(0.004, 30 / k, '/textures/charon' + textures + '-min.jpg');
        // Planets

        // Rings

        var Ring = function () {
            function Ring(radiusTop, radiusBottom, vheight, radialSegments, heightSegments, opacity, texture) {
                _classCallCheck(this, Ring);

                this.radiusTop = radiusTop, this.radiusBottom = radiusBottom, this.vheight = vheight, this.radialSegments = radialSegments, this.heightSegments = heightSegments, this.opacity = opacity, this.texture = texture;
                return this.init();
            }

            _createClass(Ring, [{
                key: 'init',
                value: function init() {
                    var ringTexture = new THREE.TextureLoader().load(this.texture);
                    var geometry = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.vheight, this.radialSegments, this.heightSegments, true);
                    var material = new THREE.MeshBasicMaterial({ map: ringTexture, color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: this.opacity });
                    var ring = new THREE.Mesh(geometry, material);

                    ring.receiveShadow = true;
                    scene.add(ring);
                    return ring;
                }
            }]);

            return Ring;
        }();

        ringSaturn = new Ring(0.43, 0.9, 0.0001, 200, 10, 0.5, '/textures/saturn_ring' + textures + '.png');
        ringUranus = new Ring(0.26, 0.34, 0.0001, 200, 10, 0.2, '/textures/uranus_ring' + textures + '.png');
        // Rings

        window.addEventListener('resize', onWindowResize, false);
    }

    var forwardButtonState = false,
        backButtonState = false,
        leftButtonState = false,
        rightButtonState = false,
        flightCam = false,
        cam = false,
        cx = void 0,
        cz = void 0,
        cr = void 0,
        px = void 0,
        pz = void 0;

    var Physics = function () {
        function Physics(planet, yearInEarthDays, planetaryDaysInYear, distanceToSun, inclinationOfPlanet, rotationPlanet, speed, time, start) {
            _classCallCheck(this, Physics);

            this.planet = planet;
            this.yied = yearInEarthDays;
            this.pdiy = planetaryDaysInYear;
            this.dts = distanceToSun;
            this.iop = inclinationOfPlanet;
            this.rp = rotationPlanet;
            this.s = speed;
            this.t = time;
            this.start = start + new Date().getTime() / 86400000 % 365.25 * Math.PI / this.yied;
            return this.init();
        }

        _createClass(Physics, [{
            key: 'init',
            value: function init() {
                this.planet.position.x = Math.sin(this.t * this.s * 365.25 / this.yied + this.start) * this.dts;
                this.planet.position.z = Math.cos(this.t * this.s * 365.25 / this.yied + this.start) * this.dts;

                this.planet.rotation.y = new Date().getTime() / 86400000 % 24 * Math.PI * this.yied / 365.25;
                this.rp ? this.planet.rotation.y += 365.25 * this.s / this.yied * (Math.PI * this.pdiy) / 360 : this.planet.rotation.y -= 365.25 * this.s / this.yied * (Math.PI * this.pdiy) / 360;

                this.planet.rotation.x = this.iop * Math.PI / 180;
                return this.planet;
            }
        }]);

        return Physics;
    }();

    var CameraLook = function () {
        function CameraLook(planet, distanceToPlanet) {
            _classCallCheck(this, CameraLook);

            this.planet = planet, this.distanceToPlanet = distanceToPlanet;
            return this.init();
        }

        _createClass(CameraLook, [{
            key: 'init',
            value: function init() {
                camera.lookAt(this.planet.position);
                camera.position.x = this.planet.position.x + Math.cos(time * rotationalSpeed) * this.distanceToPlanet * Math.pow(3, 1 / 2) / 2;
                camera.position.y = this.planet.position.y + Math.cos(time * rotationalSpeed) * this.distanceToPlanet / 2;
                camera.position.z = this.planet.position.z + Math.sin(time * rotationalSpeed) * this.distanceToPlanet;
                cx = camera.position.x;
                cz = camera.position.z;
                px = this.planet.position.x;
                pz = this.planet.position.z;
            }
        }]);

        return CameraLook;
    }();

    // Flight controls


    function flightControl() {
        var sensivity = getCookie('mouse_sensitivity') / 5;
        lookAtPlanet(null);
        flightCam = true;

        if (mobileDevice()) {
            var touchStart = function touchStart(event) {
                event.preventDefault();
                event.stopPropagation();
                startX = event.changedTouches[0].clientX;
                startY = event.changedTouches[0].clientY;

                this.addEventListener('touchmove', touchMove, false);
            };

            var touchEnd = function touchEnd() {
                event.preventDefault();
                event.stopPropagation();
                this.removeEventListener('touchmove', touchMove);
            };

            var touchMove = function touchMove(event) {
                event.preventDefault();
                event.stopPropagation();
                var touchXRel = event.changedTouches[0].clientX - startX;
                var touchYRel = event.changedTouches[0].clientY - startY;

                startX = event.changedTouches[0].clientX;
                startY = event.changedTouches[0].clientY;

                if (controls != null) {
                    !!+getCookie('invert_y') ? controls.angle -= touchYRel * 0.007 * sensivity : controls.angle += touchYRel * 0.007 * sensivity;

                    if (controls.angle > Math.PI * 5 / 11) controls.angle = Math.PI * 5 / 11;else if (controls.angle < -Math.PI * 5 / 11) controls.angle = -Math.PI * 5 / 11;

                    controls.direction += touchXRel * 0.007 * sensivity;
                    controls.updateCamera();
                }
            };

            var speedControl = document.getElementById('speedControl');
            var range = document.getElementById('range');

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

            var startX = void 0,
                startY = void 0;

            var areaTouchMove = document.getElementById('areaTouchMove');
            var forward = document.getElementById('forward');
            var backward = document.getElementById('backward');
            var left = document.getElementById('left');
            var right = document.getElementById('right');

            areaTouchMove.addEventListener('touchstart', touchStart, false);
            areaTouchMove.addEventListener('touchend', touchEnd, false);

            window.addEventListener('touchstart', function (event) {
                switch (event.srcElement) {
                    case forward:
                        forwardButtonState = true;break;
                    case backward:
                        backButtonState = true;break;
                    case left:
                        leftButtonState = true;break;
                    case right:
                        rightButtonState = true;break;
                }
            });

            window.addEventListener('touchend', function (event) {
                switch (event.srcElement) {
                    case forward:
                        forwardButtonState = false;break;
                    case backward:
                        backButtonState = false;break;
                    case left:
                        leftButtonState = false;break;
                    case right:
                        rightButtonState = false;break;
                }
            });
        } else {
            var _speedControl = document.getElementById('speedControl');
            document.addEventListener('wheel', function (event) {
                if (speed >= 0.0000005 && speed < 0.00001) speed -= event.deltaY / 1000000000;
                if (speed >= 0.00001 && speed < 0.0001) speed -= event.deltaY / 100000000;
                if (speed >= 0.0001 && speed < 0.001) speed -= event.deltaY / 7500000;
                if (speed >= 0.001 && speed < 0.01) speed -= event.deltaY / 500000;
                if (speed >= 0.01 && speed <= 0.0331) speed -= event.deltaY / 250000;
                if (speed > 0.0331) speed = 0.0331;
                if (speed < 0.0000005) speed = 0.0000005;
                _speedControl.innerHTML = 'скорость: ' + (speed * 8922394.583).toFixed(2) + ' км/с';
            });
            _speedControl.innerHTML = 'скорость: ' + (speed * 8922394.583).toFixed(2) + ' км/с';

            controls = new CameraControls(camera);
            controls.direction = px < cx ? Math.atan((pz - cz) / (px - cx)) + Math.PI / 2 : Math.atan((pz - cz) / (px - cx)) - Math.PI / 2;
            controls.x = cx;
            controls.z = cz;
            controls.updateCamera();

            document.addEventListener('mousedown', function () {
                if (controls != null) {
                    document.onmousemove = function (event) {
                        !!+getCookie('invert_y') ? controls.angle -= event.movementY * 0.002 * sensivity : controls.angle += event.movementY * 0.002 * sensivity;

                        if (controls.angle > Math.PI * 5 / 11) controls.angle = Math.PI * 5 / 11;else if (controls.angle < -Math.PI * 5 / 11) controls.angle = -Math.PI * 5 / 11;

                        controls.direction += event.movementX * 0.002 * sensivity;
                        controls.updateCamera();
                    };
                }
            });

            document.addEventListener('mouseup', function () {
                document.onmousemove = null;
            });

            window.addEventListener('keydown', function (event) {
                if (event.repeat === false) {
                    switch (event.keyCode) {
                        case 87:
                            forwardButtonState = true;break;
                        case 83:
                            backButtonState = true;break;
                        case 65:
                            leftButtonState = true;break;
                        case 68:
                            rightButtonState = true;break;
                    }
                }
            });

            window.addEventListener('keyup', function (event) {
                switch (event.keyCode) {
                    case 87:
                        forwardButtonState = false;break;
                    case 83:
                        backButtonState = false;break;
                    case 65:
                        leftButtonState = false;break;
                    case 68:
                        rightButtonState = false;break;
                }
            });
        }
    }
    // Flight controls


    var objects = [];

    function lookAtPlanet(arrayIndex) {
        for (var i = 0; i <= 12; i++) {
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

        var objectsNames = document.getElementsByClassName('planet');

        var _loop = function _loop(i, l) {
            objectsNames[i].addEventListener('click', function () {
                return lookAtPlanet(i);
            });
        };

        for (var i = 0, l = objectsNames.length; i < l; i++) {
            _loop(i, l);
        }
    }

    doNotFlyLookAtSelectedPlanet();

    (function () {
        var arr = [['planets', doNotFlyLookAtSelectedPlanet], ['flight', flightControl], ['sounds', doNotFlyLookAtRandomPlanet], ['chat', doNotFlyLookAtRandomPlanet], ['contacts', doNotFlyLookAtEarth], ['settings', doNotFlyLookAtSelectedPlanet]];

        arr.map(function (element) {
            document.getElementById(element[0]).addEventListener('click', element[1]);
        });
    })();

    window.addEventListener('popstate', function (e) {
        switch (e.path[0].location.pathname) {
            case '/objects':
                doNotFlyLookAtSelectedPlanet();break;
            case '/flight':
                flightControl();break;
            case '/contacts':
                doNotFlyLookAtEarth();break;
            case '/settings':
                doNotFlyLookAtSelectedPlanet();break;
            default:
                doNotFlyLookAtRandomPlanet();
        }
    });

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function renderScene() {
        new Physics(mercury, 88, 2 / 3, 386.0667, 7, true, speedPlanets, time, -2.47); //-2.47
        new Physics(venus, 224.7, 1.081, 720, 3.4, false, speedPlanets, time, -0.9); //-0.9
        new Physics(earth, 365.25, 365.25, 1000, 23.5, true, speedPlanets, time, -0.7); //-0.7
        new Physics(planetHalo, 365.25, 365.25, 1000, 23.5, true, speedPlanets, time, -0.7); //-0.7
        new Physics(mars, 686.97, 668.6, 1520, 1.85, true, speedPlanets, time, -0.8); //-0.8
        new Physics(jupiter, 4331.865, 10476, 5190.4667, 1.3, true, speedPlanets, time, -1.4);
        new Physics(saturn, 10759, 24231.42, 9533.3333, 2.48, true, speedPlanets, time, 2);
        new Physics(uranus, 30681, 42711.57, 19133.3333, -97.77, true, speedPlanets, time, 0.9);
        new Physics(neptune, 60189.55, 89667.85, 30000, 23, true, speedPlanets, time, 0);
        new Physics(pluto, 90552.78, 14177.67, 40000, 5, false, speedPlanets, time, 3.13);

        charon.position.x = pluto.position.x + Math.cos(-time * 57.18 * speedPlanets) * 0.1308;
        charon.position.z = pluto.position.z + Math.sin(-time * 57.18 * speedPlanets) * 0.1308;

        moon.position.x = earth.position.x + Math.cos(-time * 12.175 * speedPlanets) * 2.5627; //2.5627;
        moon.position.z = earth.position.z + Math.sin(-time * 12.175 * speedPlanets) * 2.5627; //2.5627;

        ringSaturn.position.x = saturn.position.x;
        ringSaturn.position.z = saturn.position.z;
        ringSaturn.rotation.x = saturn.rotation.x;
        ringSaturn.rotation.y -= speedPlanets * 0.1 * 365.25 / 10759 * (Math.PI * 24123.42) / 360;

        ringUranus.position.x = uranus.position.x;
        ringUranus.position.z = uranus.position.z;
        ringUranus.rotation.x = uranus.rotation.x;
        ringUranus.rotation.y -= speedPlanets * 0.3 * 365.25 / 30681 * (Math.PI * 42711.57) / 360;

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