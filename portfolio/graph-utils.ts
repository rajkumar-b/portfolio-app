import { GraphData } from 'three-forcegraph';
import { ForceGraph3DInstance } from '3d-force-graph';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

function createNodeObject(node: any): CSS2DObject{
    const nodeEl = document.createElement('div');
    nodeEl.textContent = node.name;
    nodeEl.style.color = node.color;
    nodeEl.className = 'node-label';
    nodeEl.id = `node-${node.id}`;
    return new CSS2DObject(nodeEl);
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
    highlightNodes: Set<any>, highlightLinks: Set<any>, graph: ForceGraph3DInstance){
        
        if ((!node && !highlightNodes.size) || (node && animation_controls.hoverNode === node)) return;

        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
            highlightNodes.add(node);
            node.neighbors.forEach((neighbor: any) => highlightNodes.add(neighbor));
            node.links.forEach((link: any) => highlightLinks.add(link));
        }

        animation_controls.hoverNode = node || null;

        updateHighlight(graph);
}

function highlightLinkOnHover(link: any, highlightNodes: Set<any>, highlightLinks: Set<any>, graph: ForceGraph3DInstance){
    highlightNodes.clear();
    highlightLinks.clear();
  
    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }
  
    updateHighlight(graph);
}

function handleNodeColorChange(node: any, highlightNodes: Set<any>, animation_controls: any): string{
    let colorToReturn = node.color
    if (highlightNodes.has(node)){ 
        if (node === animation_controls.hoverNode) {
            colorToReturn = animation_controls.highlightNodeColor;
        } else {
            colorToReturn = animation_controls.neighborNodeColor;
        }
    } 
    return colorToReturn;
}

function animateLoop(graph: ForceGraph3DInstance, orbit_control: OrbitControls, animation_controls: any){
    setInterval(() => {
        if (animation_controls.is_rotation_active) {
            graph.enableNodeDrag(true);
            hideClass('node-label');
            orbit_control.enabled = false;
            if (!animation_controls.reset_needed){
                graph.cameraPosition({
                    x: animation_controls.rot_distance * Math.sin(animation_controls.rot_angle),
                    y: animation_controls.rot_distance * Math.sin(animation_controls.rot_angle),
                    z: animation_controls.rot_distance * Math.cos(animation_controls.rot_angle)
                });
                animation_controls.rot_angle += animation_controls.rot_increment;
            } else {
                if (!animation_controls.node_unfocus_active){
                    graph.cameraPosition({
                        x: animation_controls.rot_distance * Math.sin(animation_controls.rot_angle),
                        y: animation_controls.rot_distance * Math.sin(animation_controls.rot_angle),
                        z: animation_controls.rot_distance * Math.cos(animation_controls.rot_angle)
                    }, undefined, 3000);
                    animation_controls.node_unfocus_active = true;
                    setTimeout(() => {
                        animation_controls.node_unfocus_active = false;
                        animation_controls.reset_needed = false;
                        // hideClass('node-label', false);
                    }, 3000);
                }
            }
        } else {
            graph.enableNodeDrag(false);
            orbit_control.enabled = true;    
        }
    }, animation_controls.rot_update_ms);
}

function focusNodeOnClick(node: any, animation_controls: any, graph: ForceGraph3DInstance){
    if (!animation_controls.is_rotation_active){
        const distance = 40;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
        const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }; 
            graph.cameraPosition( newPos, node, 3000 );
        hideClass('node-label', true, [`node-${node.id}`]);
        animation_controls.reset_needed = true;
    }
}

export {createEmptyGraph, addToGraph, createNodeObject, hideClass, crossLinkObjects,
    highlightNodeOnHover, highlightLinkOnHover, handleNodeColorChange, animateLoop, 
    focusNodeOnClick};