import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { getJSONdoc } from './utilities';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import { createEmptyGraph, addToGraph, createNodeObject, crossLinkObjects,
  highlightNodeOnHover, highlightLinkOnHover, handleNodeColorChange, animateLoop, 
  focusNodeOnClick } from './graph-utils';

// const portfolio_content_json = "../res/data/portfolio-content.json";
const portfolio_graph_framework = "../res/data/portfolio-graph/framework.json";

// Set control variables for decisive actions
let animation_controls = {
  is_rotation_active: true,
  reset_needed: false,
  node_unfocus_active: false,
  rot_angle: 0,
  rot_distance: 250,
  rot_increment: Math.PI / 1000,
  rot_update_ms: 10,
  hover_node: null,
  node_focus_distance: 100,
  node_focus_time: 3000,
  highlight_color_main_node: 'rgb(255,0,0)',
  highlight_color_neighbor_node: 'rgb(255,160,0)',
}
const highlight_nodes = new Set();
const highlight_links = new Set();


// Get data for 3d graph
const portfolio_graph_data = createEmptyGraph();
addToGraph(portfolio_graph_data, await getJSONdoc(portfolio_graph_framework));
// console.log(portfolio_graph_data);
crossLinkObjects(portfolio_graph_data);

// Construct 3d graph
const canvas_element = document.getElementById('3d-graph')!;
const portfolio_graph:ForceGraph3DInstance = ForceGraph3D({
  extraRenderers: [new CSS2DRenderer() as any]
})(canvas_element)
  .graphData(portfolio_graph_data)
  .backgroundColor('#000003')
  .nodeColor(node => handleNodeColorChange(node, highlight_nodes, animation_controls))
  .linkWidth(link => highlight_links.has(link) ? 4 : 1)
  .linkDirectionalParticles(link => highlight_links.has(link) ? 4 : 0)
  .linkDirectionalParticleWidth(4)
  .nodeThreeObject(node => createNodeObject(node))
  .nodeThreeObjectExtend(true)
  .onNodeClick(node => focusNodeOnClick(node, animation_controls, portfolio_graph))
  .onNodeHover(node => highlightNodeOnHover(node, animation_controls, highlight_nodes, highlight_links, portfolio_graph))
  .onNodeDragEnd((node: any) => { node.fx = node.x; node.fy = node.y; node.fz = node.z; })
  .onLinkHover(link => highlightLinkOnHover(link, highlight_nodes, highlight_links, portfolio_graph));

// Pause orbit control during animation 
const control_beacon = portfolio_graph.controls() as OrbitControls;
control_beacon.addEventListener( 'change', () => {
  if (!animation_controls.is_rotation_active){
    animation_controls.reset_needed = true;
  }
});

// start animaition
animateLoop(portfolio_graph, control_beacon, animation_controls);

// Button toggle
document.getElementById('rotation-toggle')!.addEventListener('click', event => {
  animation_controls.is_rotation_active = !animation_controls.is_rotation_active;
  (<HTMLElement> event.target!).innerHTML = `${(animation_controls.is_rotation_active ? 'Free Navigation' : 'Play Animation')}`;
});

// Postprocessing - Add Glow
const bloom_pass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 2, 1, 0 );
portfolio_graph.postProcessingComposer().addPass(bloom_pass);
