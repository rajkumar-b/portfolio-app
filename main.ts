import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { USSEnterprise2009 } from './src/models/Ships/uss-enterprise-2009';
import { centerModel, attachMovements, includeJoystick } from './src/utilities';
const space_bg = './res/images/space.jpg';

// Create three main componenets: scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

// set renderer pixel ratio as device and fit window to full screen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// move camera position to Z axis and a bit top
camera.position.setZ(200);
camera.position.setX(0);
camera.position.setY(100);

const playerShip = new USSEnterprise2009();
playerShip.loadModel(scene)
.then((model) => {
  centerModel(model);
})
.catch((error) => {
  console.error('Error loading model:', error);
});

attachMovements(playerShip);
const staticJoystick = includeJoystick();
// staticJoystick.destroy(); // To remove joystick

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

// Render the scene
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();
