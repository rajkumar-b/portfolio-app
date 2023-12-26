import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { USSEnterpriseTOSTWOK } from './models/Ships/uss-enterprise-tos-twok';
import {BinarySystem } from './models/Planets/binary-system';
import { placeModel, attachMovements, includeJoystick } from './utilities';
const space_bg = './res/images/space.jpg';

// Create three main componenets: scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
const mixers: THREE.AnimationMixer[] = []

// set renderer pixel ratio as device and fit window to full screen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// move camera position to Z axis and a bit top
const camOffset = new THREE.Vector3(0, 100, 200);
camera.position.copy(camOffset);

// Get initial delta values for camera and orbit control
const currPlayerPos = new THREE.Vector3();
const camDelta = new THREE.Vector3();
camDelta.copy(camOffset);
const orbDelta = new THREE.Vector3();

// Create a player ship and add to scene
const playerShip = new USSEnterpriseTOSTWOK();
playerShip.loadModel(scene)
.then((model) => {
  placeModel(model, [0,0,0]);
  model.getWorldPosition(currPlayerPos);
  camDelta.sub(currPlayerPos);
  orbDelta.sub(currPlayerPos);
})
.catch((error) => {
  console.error('Error loading model:', error);
});

// Add movements to ship and display a virtual joystick
attachMovements(playerShip);
const staticJoystick = includeJoystick();
// staticJoystick.destroy(); // To remove joystick


// Add a binary star system to the scene
const binSystem = new BinarySystem();
binSystem.loadModel(scene)
.then((model) => {
  placeModel(model, [500,500,500]);
  binSystem.loadAnimation(mixers);
})
.catch((error) => {
  console.error('Error loading model:', error);
});


// Add a light to the scene
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambientLight);

// Add a lighthelper to view pointlight position
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// Add some stars to the scene
function addStar(){
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({color:0xFFFFFF});
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x,y,z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  
  scene.add(star);
}

// Populate stars on the scene
Array(200).fill(0).forEach(addStar);

// Add a space backgroud as the texture to the scene
const spaceTexture = new THREE.TextureLoader().load(space_bg);
scene.background = spaceTexture;

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
const movedPlayerPos = new THREE.Vector3();
// Render the scene
function animate(){
  requestAnimationFrame(animate);

  // On movement, update ship and camera
  if (playerShip.model){
    playerShip.model.getWorldPosition(movedPlayerPos);
    if (! currPlayerPos.equals(movedPlayerPos)){
      camera.position.copy(movedPlayerPos);
      camera.position.add(camDelta);
      controls.target.copy(movedPlayerPos);
      controls.target.add(orbDelta);
      currPlayerPos.copy(movedPlayerPos);
    }
  } 

  // Play the animation from mixer
  const delta = clock.getDelta();
  Object.values(mixers).forEach( mixer => {
    if (mixer) mixer.update(delta);
  } ); 

  // Render the updated scene
  renderer.render(scene, camera);
  controls.update(); 
}

animate();
