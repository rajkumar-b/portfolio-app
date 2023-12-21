import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

class USSEnterprise2009 {
  constructor() {
    this.uss_dae = '../../res/models/uss-enterprise-2009/model.dae';
    this.loader = new ColladaLoader();
  }

  loadModel(scene) {
    return new Promise((resolve, reject) => {
    this.loader.load(this.uss_dae, (collada) => {
        const model = collada.scene; 
        model.traverse((child) => {
          if (child.type == 'LineSegments') {
            child.visible = false;
          }
        });
        scene.add(model);
        resolve(model);
      }, undefined, reject); 
    });
  }
}

export { USSEnterprise2009 };
