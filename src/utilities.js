import * as THREE from 'three';

function centerModel(model) {
  const bbox = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  bbox.getCenter(center);
  const offset = new THREE.Vector3(0, 0, 0).sub(center);
  model.position.add(offset);
}

function attachMovements(model) {
    const stepSize = 10;
    function handleKeyPress(event) {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          model.position.z -= stepSize;
          break;
        case 'ArrowDown':
        case 's':
          model.position.z += stepSize;
          break;
        case 'ArrowLeft':
        case 'a':
          model.position.x -= stepSize;
          break;
        case 'ArrowRight':
        case 'd':
          model.position.x += stepSize;
          break;
        default:
          break;
      }
    }
    document.addEventListener('keydown', handleKeyPress);
}
  
  
export { centerModel, attachMovements };
