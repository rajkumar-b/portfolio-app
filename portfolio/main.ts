import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import { getJSONdoc } from './utilities';
import { createContactCard, createTimelineItem } from './timeline-utils';
import { getGraphData, createNodeObject, crossLinkObjects, addInvisibleNeighbors,
  highlightNodeOnHover, highlightLinkOnHover, handleNodeColorChange, animateLoop, 
  focusNodeOnClick } from './graph-utils';

const portfolio_content_json = "../res/data/portfolio-content.json";
const portfolio_graph_data_root = "../res/data/portfolio-graph" 
const data_folders_to_include: string[] = ["framework", "role"];
const data_folders_to_sublink: string[] = ["framework-role"];

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
const head_nodes = new Set<string>();


// Get HTML elements
const graph_view = document.getElementById('three-force-graph')!  as HTMLCanvasElement;
const timeline_view = document.getElementById('timeline')! as HTMLCanvasElement;
const contact_container = document.querySelector('.contact-container')! as HTMLCanvasElement;
const timeline_container = document.querySelector('.timeline-container')! as HTMLCanvasElement;

// Get data for 2d timeline
const portfolio_content_data: any = await getJSONdoc(portfolio_content_json);
contact_container.appendChild(createContactCard(portfolio_content_data.contact));
const timelineData = [
  {
      text: 'Wrote my first blog post ever on Medium',
      date: 'March 03 2017',
      category: {
          tag: 'medium',
          color: '#018f69'
      },
      link: {
          url:
              'https://example.com',
          text: ''
      }
  },
  {
    text: 'Wrote my second blog post on Medium',
    date: 'April 05 2018',
    category: {
        tag: 'medium',
        color: '#018f69'
    },
    link: {
        url:
            'https://example.com',
        text: 'Read more'
    }
  },
  {
    text: 'Wrote my second blog post on Medium',
    date: 'April 05 2018',
    category: {
        tag: 'medium',
        color: '#018f69'
    },
    link: {
        url:
            'https://example.com',
        text: 'Read more'
    }
  },
  {
    text: 'Wrote my second blog post on Medium',
    date: 'April 05 2018',
    category: {
        tag: 'medium',
        color: '#018f69'
    },
    link: {
        url:
            'https://example.com',
        text: 'Read more'
    }
  },
  {
    text: 'Wrote my second blog post on Medium',
    date: 'April 05 2018',
    category: {
        tag: 'medium',
        color: '#018f69'
    },
    link: {
        url:
            'https://example.com',
        text: 'Read more'
    }
  }
];
timelineData.map((data, idx) => {
  const timelineItem = createTimelineItem(data);
  timeline_container.appendChild(timelineItem);
});


// Get data for 3d graph
const portfolio_graph_data = await getGraphData(portfolio_graph_data_root, data_folders_to_include);
portfolio_graph_data.nodes.forEach(node => {if (node.id && (node.id as string).startsWith('head-')) head_nodes.add(`${node.id}`);});
crossLinkObjects(portfolio_graph_data);

// Construct 3d graph
const portfolio_graph:ForceGraph3DInstance = ForceGraph3D({
  extraRenderers: [new CSS2DRenderer() as any]
})(graph_view)
  .graphData(portfolio_graph_data)
  .backgroundColor('#000003').width(graph_view.clientWidth).height(graph_view.clientHeight).nodeLabel('').showNavInfo(false)
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

// load graph with invisible links
const sublink_data = await getGraphData(portfolio_graph_data_root, data_folders_to_sublink);
let loadCheck = setInterval(() => {
  const nodesLoaded = portfolio_graph_data.nodes.every(node => node.x? true: false);
  const linksLoaded = portfolio_graph_data.nodes.every((node: any) => node.neighbors? true: false);
  if ( nodesLoaded && linksLoaded ){
    addInvisibleNeighbors(portfolio_graph_data, sublink_data);
    clearInterval(loadCheck);
  }
}, 1);

// Pause orbit control during animation 
const control_beacon = portfolio_graph.controls() as OrbitControls;
control_beacon.addEventListener( 'change', () => {
  if (!animation_controls.is_rotation_active){
    animation_controls.reset_needed = true;
  }
});

// start animation
let loopFunc: number | undefined;
function startAnimation() {
  animation_controls.reset_needed = false;
  loopFunc = animateLoop(portfolio_graph, control_beacon, animation_controls, highlight_links, Array.from(head_nodes));
  portfolio_graph.resumeAnimation();
}
function stopAnimation() {
  clearInterval(loopFunc);
  portfolio_graph.pauseAnimation();
}
startAnimation();

// Button toggle
document.getElementById('rotation-toggle')!.addEventListener('click', event => {
  animation_controls.is_rotation_active = !animation_controls.is_rotation_active;
  (<HTMLElement> event.target!).innerHTML = `${(animation_controls.is_rotation_active ? 'Free Navigation' : 'Play Animation')}`;
});

// Postprocessing - Add Glow
const bloom_pass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth/2, window.innerHeight), 2, 1, 0 );
portfolio_graph.postProcessingComposer().addPass(bloom_pass);

// Update logic for view / container on resize
const main_container = document.querySelector('.main-container')! as HTMLCanvasElement;
const graph_support_element = document.getElementById('graph-addon')! as HTMLCanvasElement;
const split_buttons = document.querySelector('.split-buttons')! as HTMLCanvasElement;

function updateGraphWindow(width: number, height: number){
  graph_view.style.width = `${width}px`;
  graph_view.style.height = `${height}px`;
  portfolio_graph.width(width).height(height);
  bloom_pass.resolution.set(width, height);
}

function updateTimelineWindow(width: number, height: number){
  timeline_view.style.width = `${width}px`;
  timeline_view.style.height = `${height}px`;
}

function updateContainerWindow(width: number, height: number, flex: string = 'row'){
  main_container.style.width = `${width}px`;
  main_container.style.height = `${height}px`;
  main_container.style.flexDirection = flex;
}

function updateStyles() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (split_view_active){
    if ( width > height){
      updateTimelineWindow(width/2, height);
      updateGraphWindow(width/2, height);
      updateContainerWindow(width, height, 'row');
    } else {
      updateTimelineWindow(width, height/2);
      updateGraphWindow(width, height/2);
      updateContainerWindow(width, height, 'column');
    }
  } else {
    updateContainerWindow(width, height);
    updateGraphWindow(width, height);
    updateTimelineWindow(width, height);
  }
}

function enterFullscreen() {
  const fullscreenElement = document.documentElement as any;
  if (fullscreenElement.requestFullscreen) {
      fullscreenElement.requestFullscreen();
  } else if (fullscreenElement.webkitRequestFullscreen) {
    fullscreenElement.webkitRequestFullscreen();
  } else if (fullscreenElement.mozRequestFullScreen) {
      fullscreenElement.mozRequestFullScreen();
  } else if (fullscreenElement.msRequestFullscreen) {
      fullscreenElement.msRequestFullscreen();
  } else {
    alert("Fullscreen not supported in your device!");
  }
}

function exitFullscreen() {
  const fullscreenElement = document as any;
  if (fullscreenElement.exitFullscreen) {
    fullscreenElement.exitFullscreen();
  } else if (fullscreenElement.webkitExitFullscreen) {
    fullscreenElement.webkitExitFullscreen();
  } else if (fullscreenElement.mozCancelFullScreen) {
    fullscreenElement.mozCancelFullScreen();
  } else if (fullscreenElement.msExitFullscreen) {
    fullscreenElement.msExitFullscreen();
  } else {
    alert("Fullscreen not supported in your device!");
  }
}

// Handle view toggle
let split_view_active = true;
let fullscreen_active = false;
let graph_forced_pause = false;

function toggleView(buttonId: string) {
  if(buttonId === 'fullscreen-view'){
    if (!fullscreen_active){
      enterFullscreen();
      document.getElementById('go-fullscreen')!.style.display = "none";
      document.getElementById('exit-fullscreen')!.style.display = "block";
      fullscreen_active = true;
    } else {
      exitFullscreen();
      document.getElementById('go-fullscreen')!.style.display = "block";
      document.getElementById('exit-fullscreen')!.style.display = "none";
      fullscreen_active = false;
    }
  } else if(buttonId === 'timeline-view'){
    timeline_view.style.display = "block";
    graph_view.style.display = "none";
    graph_support_element.style.display = "none";
    split_view_active = false;
    if (animation_controls.is_rotation_active) {
      graph_forced_pause = true;
      animation_controls.is_rotation_active = false;
      stopAnimation();
    }
  } else if(buttonId === 'graph-view') {
    timeline_view.style.display = "none";
    graph_view.style.display = "block";
    graph_support_element.style.display = "block";
    split_view_active = false;
    if (graph_forced_pause) {
      graph_forced_pause = false;
      animation_controls.is_rotation_active = true;
      startAnimation();
    }
  } else {
    timeline_view.style.display = "block";
    graph_view.style.display = "block";
    graph_support_element.style.display = "block";
    split_view_active = true;
    if (graph_forced_pause) {
      graph_forced_pause = false;
      animation_controls.is_rotation_active = true;
      startAnimation();
    }
  }
  updateStyles();
}

// Add event listener to the container
split_buttons.addEventListener('click', (event) => {
  const clickedElement = event.target as HTMLElement;
  const buttonElement = clickedElement.closest('.button');
  if (buttonElement) toggleView(buttonElement.id);
});

// Update styles on resize & on start
window.addEventListener('resize', updateStyles);
updateStyles();
