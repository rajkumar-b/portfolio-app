import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

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
scene.add(camera);


// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.2;
controls.rotateSpeed = 0.2;

// Add a space backgroud as the texture to the scene
// const spaceTexture = new THREE.TextureLoader().load(space_bg);
// scene.background = spaceTexture;



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

// Render the scene
const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);

  // Render the updated scene
  renderer.render(scene, camera);
  controls.update(); 
}

animate();
