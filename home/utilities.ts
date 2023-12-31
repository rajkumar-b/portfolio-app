import * as THREE from 'three';
import JoystickController from "joystick-controller";
import { iShip } from './models/Ships/iShip';

function placeModel(model: any, coords: [number, number, number]) {
  const bbox = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  bbox.getCenter(center);
  const offset = new THREE.Vector3(coords[0], coords[1], coords[2]).sub(center);
  model.position.add(offset);
}

function simulateKeyEvent(keyCode, type) {
  const event = new KeyboardEvent(type, {
    code: keyCode,
    key: keyCode,
  });

  document.dispatchEvent(event);
}

function includeJoystick(){
  return new JoystickController(
    {
      maxRange: 70,
      level: 1,
      radius: 50,
      joystickRadius: 30,
      opacity: 0.4,
      leftToRight: false,
      bottomToUp: true,
      containerClass: "joystick-container",
      controllerClass: "joystick-controller",
      joystickClass: "joystick",
      distortion: true,
      x: "10%",
      y: "10%",
      mouseClickButton: "ALL",
      hideContextMenu: false,
    },
    ({ x, y, leveledX, leveledY, distance, angle }) =>
      {
        if (leveledX === -1) {
          simulateKeyEvent('ArrowLeft', 'keydown');
        } else if (leveledX === 1) {
          simulateKeyEvent('ArrowRight', 'keydown');
        }
      
        if (leveledY === 1) {
          simulateKeyEvent('ArrowUp', 'keydown');
        } else if (leveledY === -1) {
          simulateKeyEvent('ArrowDown', 'keydown');
        }
      }
  );
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

export { placeModel, attachMovements, includeJoystick };
