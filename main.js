import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// Create three main componenets: scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

// set renderer pixel ratio as device and fit window to full screen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// move camera position to Z axis and a bit top
camera.position.setZ(30);

// Create three main components to add a figure: geometry, material and mesh
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

// Add this figure to the scene
scene.add(torus);

// Add a light to the scene
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambientLight);

// Add a lighthelper to view pointlight position
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// Add a gridhelper to view overall positions
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Add some stars to the scene
function addStar(){
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({color:0xFFFFFF});
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Render the scene
function animate(){
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  renderer.render(scene, camera);
  controls.update();
}

animate();
