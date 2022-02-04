var cube, sphere, cylinder;
var fbxObject;
var keyState = {};
var paused=true;
var step = 0;
var scalingStep = 0;
var renderer;
var camera;
var scene;
var controls;
var score = 0;
var speed = 1;
function initRenderer(additionalProperties) {

    var props = (typeof additionalProperties !== 'undefined' && additionalProperties) ? additionalProperties : {};
    var renderer = new THREE.WebGLRenderer(props);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    
    // renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    return renderer;
}
//camera
function initCamera(initialPosition) {
    var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-30, 40, 30);

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(position);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    return camera;
}
//Lighting
function initDefaultLighting(scene, initialPosition) {
    var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-10, 30, 40);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.copy(position);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.fov = 15;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.05;
    spotLight.name = "spotLight"

    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);

}
// create the ground plane
function addGroundPlane(scene) {
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(160, 60, 120, 120);
    
    var textureLoader = new THREE.TextureLoader();

    // load a texture
    var texture = textureLoader.load(
        'assets/stone.jpg',
    );

    var planeMaterial = new THREE.MeshStandardMaterial({ map: texture });
    
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
   
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 20;
    plane.position.y = 0;
    plane.position.z = -20;

    scene.add(plane);

    return plane;
}
function addGrassPlane(scene) {
    
    var textureLoader2 = new THREE.TextureLoader();
    // create the grass plane
    var grassGeometry = new THREE.PlaneGeometry(200, 300, 120, 120);
    var texture2 = textureLoader2.load(
        'assets/grasslight.jpg',
    );
    var grassMaterial = new THREE.MeshStandardMaterial({ map: texture2 });
    var grass = new THREE.Mesh(grassGeometry, grassMaterial);
    
    grass.receiveShadow = true;

    grass.rotation.x = -0.5 * Math.PI;
    grass.position.x = 0;
    grass.position.y = -1;
    grass.position.z = -60;

    scene.add(grass);

    return grass;
}
//key listener
function setEventListenerHandler() {
    window.addEventListener('keydown', function (e) {
        keyState[e.keyCode || e.which] = true;
    }, true);

    window.addEventListener('keyup', function (e) {
        keyState[e.keyCode || e.which] = false;
    }, true);

    
}

// change position of mouse using arrow keys
function setKeyboardControls() {

    if (keyState[39] && !paused) {
        if (fbxObject.position.z < 0) {
            fbxObject.position.z += 0.1;
            camera.position.z += 0.1;
        }
    }

    if (keyState[37] && !paused) {
        if (fbxObject.position.z > -40) {
            fbxObject.position.z -= 0.1;
            camera.position.z -= 0.1;
        }
    }
    if (keyState[13]) {
        paused = false;
        document.getElementById(
            "variable-content").style.visibility = "hidden";
    }
    if (keyState[32]) {
        paused = false;
        document.location.reload(true);
    }
    setTimeout(setKeyboardControls, 10);
}
function init() {
   
    renderer = initRenderer();
    camera = initCamera();
    

    setEventListenerHandler();
    setKeyboardControls();
    // position and point the camera to the center of the scene
    camera.position.set(-60, 30, 0);
    camera.lookAt(new THREE.Vector3(0, 20, -10));
    scene = new THREE.Scene();
    initDefaultLighting(scene);

    //Load background texture
    const loader2 = new THREE.TextureLoader();
    loader2.load('assets/night.jpg', function (texture) {
        scene.background = texture;
    });
    // create fog
    scene.fog = new THREE.Fog(0x363d3d, -1, 300);
    
    var textureLoader = new THREE.TextureLoader();

    // load a texture
    var texture = textureLoader.load(
        'assets/monitor.jpg',
    );
    //texture lav
    var textureLav = textureLoader.load(
        'assets/lava.png',
    );
    //texture mars
    var textureMars = textureLoader.load(
        'assets/mars.jpg',
    );
    var textureMetal = textureLoader.load(
        'assets/metal.jpg',
    );
    var groundPlane = addGroundPlane(scene)
    groundPlane.position.y = 0;
    var grassPlane = addGrassPlane(scene)
    
    
   
    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(6, 6, 6);
    var cubeMaterial = new THREE.MeshStandardMaterial({ map:texture });
     cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

     // create mouse object
    var loader = new THREE.FBXLoader();
    loader.load('assets/mouse.fbx', function (result) {

        mouse = result;
        // // correctly position the scene
        result.scale.set(0.1, 0.1, 0.1);
        result.translateY(0);
        result.translateX(0);
        result.translateZ(-10);
        result.name = 'new_fbx';
        
        result.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.color.setRGB(0, 0, 0)
            }

        });

       
        scene.add(result)    
    });

    var icoGeometry = new THREE.IcosahedronGeometry(4);
    var icoMaterial = new THREE.MeshStandardMaterial({ map: textureMetal });
    ico = new THREE.Mesh(icoGeometry, icoMaterial);
    // position the ico
    ico.position.x = 90;
    ico.position.y = 6;
    ico.position.z = -42;
    scene.add(ico);

    // position the cube
    cube.position.x = 60;
    cube.position.y = 6;
    cube.position.z = -30;

    // add the cube to the scene
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(3, 20, 20);
    var sphereMaterial = new THREE.MeshStandardMaterial({ map: textureLav });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    sphere.castShadow = true;
    // add the sphere to the scene
    scene.add(sphere);


    var cylinderGeometry = new THREE.CylinderGeometry(3, 2, 20);
    var cylinderMaterial = new THREE.MeshStandardMaterial({ map: textureMars});
    cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.castShadow = true;
    cylinder.position.set(100, 0, -15);

    scene.add(cylinder);


    

    // add subtle ambient lighting
    var ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);

    // add the output of the renderer to the html element
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // call the render function
    var step = 0;
    
    controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.scalingSpeed = 0.03;
    };

    
    
    
    
    renderScene();

    
}
function renderScene() {

    fbxObject = scene.getObjectByName('new_fbx');
    if (fbxObject) {
        fbxObject.rotation.y = -0.5 * Math.PI;
       

    }
        // render using requestAnimationFrame
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    gameLoop();
   
}
// collision control function
function collisionsDetected() {
    var cubeZ = cube.position.z;
    var cylinderZ = cylinder.position.z;
   
    var mouseZ = fbxObject.position.z;
    var cubeX = cube.position.x;
    var cylinderX = cylinder.position.x;
    var mouseX = fbxObject.position.x;
    var sphereX= sphere.position.x;
    var icoX = ico.position.x;

    var sphereY = sphere.position.y;
    if ((Math.abs(cubeZ - mouseZ) <= 2 && Math.abs(cubeX - mouseX) <= 3) ||
        (Math.abs(cylinderZ - mouseZ) <= 2 && Math.abs(cylinderX - mouseX) <= 3) ||
        (mouseZ >= -2 && Math.abs(sphereX - mouseX) <= 3 && sphereY<=5) || (mouseZ <= -40 && Math.abs(icoX - mouseX) <= 3)) {

        document.getElementById(
            "variable-content").style.visibility = "visible";
        document.getElementById(
            "variable-content").innerHTML =
            "Game over! Press Space to try again.";
        return true;
    }
    return false;
}
function gameLoop() {
    //collision cotrol
    if (!paused && !collisionsDetected()) {
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        ico.rotation.x += controls.rotationSpeed;
        ico.rotation.y += controls.rotationSpeed;
        ico.rotation.z += controls.rotationSpeed;

        if (cube.position.x > -30) {

            cube.position.x -= 0.1 * speed;
        }
        else {
            cube.position.x = 90;
            score = score + 1;
            speed = speed + 0.2;
            document.getElementById("scores").innerHTML = "Score:" + score;
            document.getElementById("speed").innerHTML = "Speed:" + speed.toFixed(2);
        }
        if (cylinder.position.x > -30) {
            cylinder.position.x -= 0.1 * speed;
        }
        else {
            cylinder.position.x = 90;
            score = score + 1;
            speed = speed + 0.2;
            document.getElementById("scores").innerHTML = "Score:" + score;
            document.getElementById("speed").innerHTML = "Speed:" + speed.toFixed(2);
        }
        if (ico.position.x > -30) {
            ico.position.x -= 0.1 * speed;
        }
        else {
            ico.position.x = 90;
            score = score + 1;
            speed = speed + 0.2;
            document.getElementById("scores").innerHTML = "Score:" + score;
            document.getElementById("speed").innerHTML = "Speed:" + speed.toFixed(2);
        }
        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 10 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        
        fbxObject = scene.getObjectByName('new_fbx');
        if (fbxObject) {
            fbxObject.rotation.y = -0.5 * Math.PI;

        }
        // scale the cylinder
        scalingStep += controls.scalingSpeed;
        var scaleX = Math.abs(Math.sin(scalingStep / 4));
        var scaleY = Math.abs(Math.cos(scalingStep / 5));
        var scaleZ = Math.abs(Math.sin(scalingStep / 7));
        cylinder.scale.set(scaleX, scaleY, scaleZ);
    }
    else {
        paused = true;
    }
}