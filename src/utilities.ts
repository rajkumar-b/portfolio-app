import * as THREE from 'three';
import { iShip } from './models/Ships/iShip';

function centerModel(model: any) {
  const bbox = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  bbox.getCenter(center);
  const offset = new THREE.Vector3(0, 0, 0).sub(center);
  model.position.add(offset);
}

function attachMovements(model: iShip) {
  const stepSize = 10;
  function handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        model.moveForward();
        break;
      case 'ArrowDown':
      case 's':
        model.moveBackward();
        break;
      case 'ArrowLeft':
      case 'a':
        model.moveLeft();
        break;
      case 'ArrowRight':
      case 'd':
        model.moveRight();
        break;
      default:
        break;
    }
  }
  document.addEventListener('keydown', handleKeyPress);
}

export { centerModel, attachMovements };
