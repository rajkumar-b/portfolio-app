import * as THREE from 'three';

interface iShip {
  loadModel: (scene: THREE.Scene) => Promise<any>;
  moveForward: () => void;
  moveBackward: () => void;
  moveLeft: () => void;
  moveRight: () => void;
}
  
export { iShip };
  