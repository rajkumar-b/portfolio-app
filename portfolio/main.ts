import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { getJSONdoc, jsonToGraph } from '../home/utilities';
const portfolio_content_json = "../res/data/portfolio-content.json";

// Create three main componenets: scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')!
});
const mixers: THREE.AnimationMixer[] = [];

const portfolio_data = await getJSONdoc(portfolio_content_json);
jsonToGraph(portfolio_data);

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

// Add a light to the scene
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambientLight);

// Add a lighthelper to view pointlight position
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);


function animate(){
  requestAnimationFrame(animate);

  // Render the updated scene
  renderer.render(scene, camera);
  controls.update(); 
}

animate();
