import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { iShip } from './iShip'; 
import { shipMovement } from './shipMovement';
import { placeModel } from '../../utilities';

class USSEnterpriseTOSTWOK extends shipMovement implements iShip {
  uss_dae: string;
  loader: ColladaLoader;
  model: any;

  constructor() {
    super();
    this.uss_dae = '../../res/models/Ships/uss-enterprise-tos-twok/model.dae';
    this.loader = new ColladaLoader();
    this.model = null;
  }

  loadModel(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loader.load(this.uss_dae, (collada: { scene: any; }) => {
        this.model = collada.scene;
        this.model.traverse((child: any) => {
          if (child.type === 'LineSegments') {
            child.visible = false;
          }
        });
        placeModel(this.model, [0, 0, 0]);
        this.pivot.add(this.model);
        resolve(this.pivot);
      }, undefined, reject);
    });
  }
}

export { USSEnterpriseTOSTWOK};
