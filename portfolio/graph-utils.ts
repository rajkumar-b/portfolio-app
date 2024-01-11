import * as THREE from 'three';
import { GraphData } from 'three-forcegraph';
import { ForceGraph3DInstance } from '3d-force-graph';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getJSONdoc } from './utilities';

const graph_images = '../res/images/graph/portfolio/';
const image3d_visible = new Set<THREE.Sprite>();
let node_on_focus = null;

function createEmptyGraph(): GraphData{
    return {
        nodes: [],
        links: []
    };
}

function addToGraph(graph_data: GraphData, json: JSON){
    graph_data.nodes = graph_data.nodes.concat(json['nodes']);
    graph_data.links = graph_data.links.concat(json['links']);
}

async function getGraphData(root:string, folders: string[]): Promise<GraphData>{
    const graph_data = createEmptyGraph();
    for (const folder of folders) {
        const location = `${root}/${folder}/data.json`;
        addToGraph(graph_data, await getJSONdoc(location));
    }
    return graph_data;
}

function createNodeObject(node: any): THREE.Object3D{
    const nodeEl = document.createElement('div');
    nodeEl.textContent = node.name;
    nodeEl.style.color = node.color;
    nodeEl.className = 'node-label';
    nodeEl.id = `node-${node.id}`;
    const nodeObj = new CSS2DObject(nodeEl);
    const offset = node.size? -node.size-2: -10;
    nodeObj.position.add(new THREE.Vector3(offset, offset));
    nodeObj.addEventListener('added', function () {
        this.parent.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
            const cssNode = this.children.find(a => a.isCSS2DObject);
            if (cssNode){
                cssNode.element.style.color = `#${this.material.color.getHexString()}`
            }
            const imgNode = this.children.find(a => a.isSprite);
            if (image3d_visible.has(imgNode)){
                material.opacity = 0;
            } else {
                material.opacity = 0.75;
            }
        }
    });
    return nodeObj;
}

function getImageSprite(size:number, image_loc: string, image_intensity: string = '#666666'): THREE.Sprite{
    const image_texture = new THREE.TextureLoader().load(image_loc);
    image_texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({ map: image_texture, color: image_intensity, transparent: false, alphaTest: 0.5 });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size, size, size);
    return sprite;
}

function hideClass(classname: string, hide:boolean = true, exceptions: string[] = []){
    const elts = Array.from(document.getElementsByClassName(classname) as HTMLCollectionOf<HTMLElement>); 
    elts.forEach(e => {
        e.style.visibility = hide? "hidden": "visible";
        if (exceptions.includes(e.id)){
            e.style.visibility = hide? "visible": "hidden";
        }
    });
}

function crossLinkObjects(graph_data: GraphData){
    graph_data.links.forEach((link: any) => {
        const a: any = graph_data.nodes.find(node => node.id === link.source);
        const b: any = graph_data.nodes.find(node => node.id === link.target);
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);
      
        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(link);
        b.links.push(link);
    });
}

function updateHighlight(graph: ForceGraph3DInstance) {
    graph
        .nodeColor(graph.nodeColor())
        .linkWidth(graph.linkWidth())
        .linkDirectionalParticles(graph.linkDirectionalParticles());
}

function highlightNodeOnHover(node: any, animation_controls: any, 
    highlight_nodes: Set<any>, highlight_links: Set<any>, graph: ForceGraph3DInstance){
        
        if ((!node && !highlight_nodes.size) || (node && animation_controls.hover_node === node)) return;

        highlight_nodes.clear();
        highlight_links.clear();
        if (node) {
            highlight_nodes.add(node);
            node.neighbors.forEach((neighbor: any) => {
                if (!(node_on_focus && node_on_focus == neighbor)) {
                    highlight_nodes.add(neighbor)
                }
            });
            node.links.forEach((link: any) => highlight_links.add(link));
        }

        animation_controls.hover_node = node || null;

        updateHighlight(graph);
}

function highlightLinkOnHover(link: any, highlight_nodes: Set<any>, highlight_links: Set<any>, graph: ForceGraph3DInstance){
    highlight_nodes.clear();
    highlight_links.clear();
  
    if (link) {
        highlight_links.add(link);
        highlight_nodes.add(link.source);
        highlight_nodes.add(link.target);
    }
  
    updateHighlight(graph);
}

function handleNodeColorChange(node: any, highlight_nodes: Set<any>, animation_controls: any): string{
    let colorToReturn: string = node.color? node.color: 'white';
    if (highlight_nodes.has(node)){ 
        if (node === animation_controls.hover_node) {
            colorToReturn = animation_controls.highlight_color_main_node;
        } else {
            colorToReturn = animation_controls.highlight_color_neighbor_node;
        }
    }
    return colorToReturn;
}

function detachVisibleImages(){
    if (image3d_visible.size) {
        image3d_visible.forEach((imgObj) => {imgObj.removeFromParent();})
    }
}

function getPositionAfterRotation(rot_distance:number, rot_angle:number){
    return {
        x: rot_distance * Math.sin(rot_angle),
        y: rot_distance * Math.sin(rot_angle),
        z: rot_distance * Math.cos(rot_angle)
    }
}

function animateLoop(graph: ForceGraph3DInstance, orbit_control: OrbitControls, animation_controls: any, 
    link_highlights: Set<any>, head_nodes: string[]){
    setInterval(() => {
        node_on_focus? showNodeNeighborTitle(node_on_focus): hideClass('node-label', true, head_nodes.map(id => `node-${id}`));
        if (animation_controls.is_rotation_active) {
            graph.enableNodeDrag(true);
            detachVisibleImages();
            orbit_control.enabled = false;
            if (!animation_controls.reset_needed){
                graph.cameraPosition(getPositionAfterRotation(animation_controls.rot_distance, animation_controls.rot_angle));
                animation_controls.rot_angle += animation_controls.rot_increment;
            } else {
                if (!animation_controls.node_unfocus_active){
                    graph.cameraPosition(getPositionAfterRotation(animation_controls.rot_distance, animation_controls.rot_angle), 
                        undefined, animation_controls.node_focus_time);
                    animation_controls.node_unfocus_active = true;
                    setTimeout(() => {
                        animation_controls.node_unfocus_active = false;
                        animation_controls.reset_needed = false;
                        node_on_focus = null;
                    }, animation_controls.node_focus_time);
                }
            }
        } else {
            graph.enableNodeDrag(false);
            orbit_control.enabled = true;    
        }
        if (animation_controls.hover_node) showNodeNeighborTitle(animation_controls.hover_node);
        if (link_highlights && link_highlights.size) {
            const show_nodes: string[] = [];
            link_highlights.forEach((link: any) => {
                show_nodes.push(`node-${link.source.id}`);
                show_nodes.push(`node-${link.target.id}`);
            });
            hideClass('node-label', true, show_nodes);
        }
    }, animation_controls.rot_update_ms);
}

function getNodeFocusPosition(node:any, focus_distance: number): {x:number , y: number, z: number}{
    const distRatio = 1 + focus_distance/Math.hypot(node.x, node.y, node.z);
    const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: focus_distance }; 
    return newPos;
}

function attachImage(node: any){
    if (node.type === 'img'){
        const image = getImageSprite(12, graph_images + node.img);
        const direction = new THREE.Vector3();
        node.__threeObj.getWorldDirection(direction);
        const offset = node.size? node.size/2: 5;
        image.position.addScaledVector(direction, -offset);
        node.__threeObj.add(image);
        image3d_visible.add(image);
    }
}

function showNodeNeighborTitle(node: any){
    let nodes_to_display = [`node-${node.id}`];
    node.neighbors.forEach((neighbor: any) => nodes_to_display.push(`node-${neighbor.id}`));
    hideClass('node-label', true, nodes_to_display);
}

function focusNodeOnClick(node: any, animation_controls: any, graph: ForceGraph3DInstance){
    if (!animation_controls.is_rotation_active){
        // focus onto node
        const focus_distance = animation_controls.node_focus_distance? animation_controls.node_focus_distance: 50;
        const focus_time_ms = animation_controls.node_focus_time? animation_controls.node_focus_time: 3000;
        graph.cameraPosition( getNodeFocusPosition(node, focus_distance), node, focus_time_ms );

        // take care of other world parameterson focus
        detachVisibleImages();
        attachImage(node);
        node_on_focus = node;
        animation_controls.reset_needed = true;
    }
}

export {createEmptyGraph, addToGraph, getGraphData, createNodeObject, crossLinkObjects,
    highlightNodeOnHover, highlightLinkOnHover, handleNodeColorChange, animateLoop, 
    focusNodeOnClick};