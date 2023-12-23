import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { iShip } from './iShip'; 

class USSEnterpriseTOSTWOK implements iShip {
  uss_dae: string;
  loader: ColladaLoader;
  model: any;

  constructor() {
    this.uss_dae = '../../res/models/Ships/uss-enterprise-tos-twok/model.dae';
    this.loader = new ColladaLoader();
    this.model = null;
  }

  loadModel(scene: THREE.Scene): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loader.load(this.uss_dae, (collada: { scene: any; }) => {
        this.model = collada.scene;
        this.model.traverse((child: any) => {
          if (child.type === 'LineSegments') {
            child.visible = false;
          }
        });
        scene.add(this.model);
        resolve(this.model);
      }, undefined, reject);
    });
  }

  moveForward() {
    if (this.model) {
      this.model.position.z -= 10;
    }
  }

  moveBackward() {
    if (this.model) {
      this.model.position.z += 10;
    }
  }

  moveLeft() {
    if (this.model) {
      this.model.position.x -= 10;
    }
  }

  moveRight() {
    if (this.model) {
      this.model.position.x += 10;
    }
  }
}

export { USSEnterpriseTOSTWOK};
