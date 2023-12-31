import * as THREE from 'three';
import { shipMovement } from './shipMovement';

interface iShip extends shipMovement {
  loadModel: () => Promise<THREE.Group>;
}

export { iShip };
