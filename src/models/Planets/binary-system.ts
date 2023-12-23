import * as THREE from 'three';
import { GLTFLoader  } from 'three/examples/jsm/loaders/GLTFLoader.js';


class BinarySystem {
    binsys_glb: string;
    loader: GLTFLoader;
    model: any;
    private _animations: any;

    constructor() {
        this.binsys_glb = '../../res/models/Planets/binary-system/binary_star_system.glb';
        this.loader = new GLTFLoader();
        this.model = null;
        this._animations = null;
    }

    loadModel(scene: THREE.Scene): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loader.load(this.binsys_glb, (glb: any) => {
                // store model and animation to class object
                this.model = glb.scene;
                this._animations = glb.animations;
                // Set options
                this.model.traverse((child: any) => {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.isMesh){
                        child.material.emissiveIntensity = 1;
                    }
                    if (child.name.includes('Trajector')){
                        child.visible = false;
                    }
                });
                console.log(this.model);
                // Add model to scene object and return the model
                scene.add(this.model);
                resolve(this.model);
            }, undefined, reject);
        });
    }
 
    loadAnimation(mixer: THREE.AnimationMixer[]){
        if (this.model == null || this._animations == null){
            console.error("Load model before loading animation");
        } else {
            // Get the animations in a mixer and add it to passed mixer container
            const model = this.model as THREE.Object3D
            let m = new THREE.AnimationMixer(model);
            m.timeScale = 0.1; // Set animation time scale
            mixer.push(m);

            // Play the default animation
            let clip = this._animations[0]; 
            let action = m.clipAction(clip);
            action.play();
        }
    }
} 


export { BinarySystem };