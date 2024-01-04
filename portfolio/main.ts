import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { getJSONdoc, jsonToGraph } from './utilities';
import ForceGraph3D from '3d-force-graph';
const portfolio_content_json = "../res/data/portfolio-content.json";

// Set control variables for decisive actions
let is_rotation_active = true;
let reset_needed = false;

// Get data for 3d graph
const portfolio_data = await getJSONdoc(portfolio_content_json);
const portfolio_graph_data = jsonToGraph(portfolio_data);

function hideClass(classname: string, hide:boolean = true, exceptions: string[] = []){
  const elts = Array.from(document.getElementsByClassName(classname) as HTMLCollectionOf<HTMLElement>); 
  elts.forEach(e => {
    e.style.visibility = hide? "hidden": "visible";
    if (exceptions.includes(e.id)){
      e.style.visibility = hide? "visible": "hidden";
    }
  });
}

// Construct 3d graph
const elem = document.getElementById('3d-graph')!;
const Graph = ForceGraph3D({
  extraRenderers: [new CSS2DRenderer() as any]
})(elem)
.jsonUrl('https://raw.githubusercontent.com/vasturiano/3d-force-graph/master/example/datasets/blocks.json')
//       .graphData(portfolio_graph_data)
.backgroundColor('#000003')
.nodeAutoColorBy('user')
.enableNodeDrag(false)
//       .nodeLabel(node => `${node.name}: ${node.id}`) // ${node['user']}: ${node['description']}
//       .onNodeClick(node => window.open(`https://bl.ocks.org/${node.name}/${node.id}`, '_blank'));
.nodeThreeObject((node: any) => {
  const nodeEl = document.createElement('div');
  if (node.id.startsWith('51')){
    nodeEl.textContent = node.id;
    nodeEl.style.color = node.color;
    nodeEl.className = 'node-label';
    nodeEl.id = `node-${node.id}`;
  }
  return new CSS2DObject(nodeEl);
})
.nodeThreeObjectExtend(true)
.onNodeClick( (node: any) => {
  if (!is_rotation_active){
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    const newPos = node.x || node.y || node.z
      ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
      : { x: 0, y: 0, z: distance }; 
    Graph.cameraPosition( newPos, node, 3000 );
    hideClass('node-label', true, [`node-${node.id}`]);
    reset_needed = true;
  }
});

const controlBeacon = Graph.controls() as OrbitControls;
controlBeacon.addEventListener( 'change', () => {
  if (!is_rotation_active){
    reset_needed = true;
  }
});

// Camera orbit (rotation and unfocus node)
let rot_angle = 0;
const rot_distance = 1200;
const rot_increment = Math.PI / 1000;
const rot_update_ms = 10;
let node_unfocus_active = false;
setInterval(() => {
  if (is_rotation_active) {
    controlBeacon.enabled = false;
    if (!reset_needed){
      Graph.cameraPosition({
        x: rot_distance * Math.sin(rot_angle),
        y: rot_distance * Math.sin(rot_angle),
        z: rot_distance * Math.cos(rot_angle)
      });
      rot_angle += rot_increment;
    } else {
      if (!node_unfocus_active){
        Graph.cameraPosition({
          x: rot_distance * Math.sin(rot_angle),
          y: rot_distance * Math.sin(rot_angle),
          z: rot_distance * Math.cos(rot_angle)
        }, undefined, 3000);
        node_unfocus_active = true;
        setTimeout(() => {
          node_unfocus_active = false;
          reset_needed = false;
          hideClass('node-label', false);
        }, 3000);
      }
      
    }
  } else {
    controlBeacon.enabled = true;    
  }
}, rot_update_ms);

// Button toggle
document.getElementById('rotation-toggle')!.addEventListener('click', event => {
  is_rotation_active = !is_rotation_active;
  (<HTMLElement> event.target!).innerHTML = `${(is_rotation_active ? 'Free Navigation' : 'Play Animation')}`;
});

// Postprocessing - Add Glow
const bloomPass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 2, 1, 0 );
Graph.postProcessingComposer().addPass(bloomPass);
