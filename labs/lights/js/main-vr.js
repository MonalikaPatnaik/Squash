var camera, container, effect, lightHelper1, obj, renderer, scene, spotLight1, controls, element;
var spotlights, lightHelpers;
var hexNumbers = [];
var isLightHelperOn = true;
var isPickingColor = false;

var selectedSpotlightIndex;
var originalColor;
var selectedColor;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var controls;
var index = 0;
var nickCues = [];

function setup() {
  scene = new THREE.Scene();
  // set some camera attributes
    var VIEW_ANGLE = 45,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 10000;
   camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

    scene.add(camera);
    // create a WebGL renderer, camera
  // and a scene
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xf2f7ff, 1);
  renderer.shadowMap.enabled = true;
  element = renderer.domElement;
  container = $('#vr-sim');
  container.append(element);
  effect = new THREE.StereoEffect(renderer);

  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

   controls = new THREE.OrbitControls(camera, element);
  controls.target.set(
    camera.position.x + 0.15,
    camera.position.y,
    camera.position.z
  );
  controls.noZoom = true;
  controls.maxPolarAngle = Math.PI/2; 
  controls.maxDistance = 600;

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    renderer.domElement.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }

  window.addEventListener('deviceorientation', setOrientationControls, true);
  
   // create floor
  var textureLoader = new THREE.TextureLoader();
  var woodTexture = new THREE.TextureLoader().load("assets/wood-floor.jpg" );
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set( 128, 128 );

  var geoFloor = new THREE.BoxGeometry(2000, 1, 2000);
  var matFloor = new THREE.MeshPhongMaterial({
    color: 0XC0834A,
    map: woodTexture
  });
  var mshFloor = new THREE.Mesh( geoFloor, matFloor );
  mshFloor.receiveShadow = true;
  scene.add( mshFloor );

  // create back wall
  var geoBackwall = new THREE.BoxGeometry(2000, 2000, 1);
  var matBackwall = new THREE.MeshPhongMaterial({
    color: 0XC0834A,
    map: woodTexture
  });
  var mshBackwall= new THREE.Mesh(geoBackwall, matBackwall);
  mshBackwall.receiveShadow = true;
  mshBackwall.position.set(0, 0, 200);
  scene.add( mshBackwall );

  // test obj
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load("assets/hamilton_set.mtl", function( materials ) {
    materials.preload();
    
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.load("assets/hamilton_set.obj", function (object) {
      object.children[0].geometry.computeBoundingBox();
      object.rotation.set(0,Math.PI/2,0);
      object.scale.set(1.5,1.5,1.5);
      object.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; } } );
      obj = object;
      scene.add(obj);
    });
  });

  // create lights
 spotlights = [];
 lightHelpers = [];
 var spotlight_spacing = 180;
 var spotlight_height = 200;

 for (var i=0; i < 9; i++) {
  var spotlight = createSpotlight(0XFFFFFF);

  spotlight.position.set(
    -1 * (i%3*spotlight_spacing - spotlight_spacing), 
    spotlight_height, 
    parseInt(i/3) * spotlight_spacing - spotlight_spacing);

  spotlights.push(spotlight);
  scene.add(spotlights[i]);
 }

  var ambient = new THREE.AmbientLight(0x222, 0.5);
  scene.add(ambient);

  camera.position.set(1, 10, -130);
  camera.rotation.set(-3,0,0);

  $.getJSON("assets/cues.json", function( data ) { 
      nickCues = data;
      setupVoiceCommand();
      loadConfiguration();
  });

  animate();
}

function putSphere(pos) {
  var radius = 30,
      segments = 16,
      rings = 16;

  // create the sphere's material
  var sphereMaterial =
    new THREE.MeshLambertMaterial(
      {
        color: 0xFF3333
      });

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
      radius,
      segments,
      rings),
    sphereMaterial);

  // add the sphere to the scene
  sphere.position.set(pos.x, pos.y, pos.z);
  sphere.castShadow = true;
  scene.add(sphere);
}

function createSpotlight(color) {
  var newObj = new THREE.SpotLight(color, 0);
  newObj.castShadow = true;
  newObj.angle = 0.645; 
  newObj.penumbra = 0.1;
  newObj.distance = 400;
  return newObj;
}

function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}

function render() {
  effect.render(scene, camera);
}

function update() {
  onResize();
  camera.updateProjectionMatrix();
  controls.update();
}

function onResize() {
var WIDTH = window.innerWidth,
    HEIGHT =  window.innerHeight;
  camera.aspect = WIDTH/HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
  effect.setSize(WIDTH, HEIGHT);
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

function setupVoiceCommand(){
  if (annyang) {
    var commands = {
      'Q': function() {
        loadConfiguration();
      },
      'Next': function() {
        loadConfiguration();
      }
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}

function loadConfiguration() {
  if (index < nickCues.length) {
    var cueConfiguration = nickCues[index];
    camera.position.set(
      cueConfiguration.camera.position.x,
      cueConfiguration.camera.position.y,
      cueConfiguration.camera.position.z);
    camera.rotation.set(
      cueConfiguration.camera.rotation.x,
      cueConfiguration.camera.rotation.y,
      cueConfiguration.camera.rotation.z
    );

    console.log(cueConfiguration.spotlights);

    for (var j = 0; j < cueConfiguration.spotlights.length; j++) {
      spotlights[j].color.set(new THREE.Color("#" + cueConfiguration.spotlights[j].color));
      spotlights[j].intensity = cueConfiguration.spotlights[j].intensity;
    }

    index = (index+1)%nickCues.length;
    render();
  }
}