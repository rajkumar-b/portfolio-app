import * as THREE from 'three';

class shipMovement {
  pivot: THREE.Group;
  direction: THREE.Vector3;
  speed: number;

  constructor() {
    this.pivot = new THREE.Group();
    this.direction = new THREE.Vector3();
    this.speed = 10;
  }

  moveForward() {
    if (this.pivot && this.direction) {
      this.pivot.getWorldDirection(this.direction);
      this.pivot.position.addScaledVector(this.direction, -this.speed);
    }
  }

  moveBackward() {
    if (this.pivot && this.direction) {
      this.pivot.getWorldDirection(this.direction);
      this.pivot.position.addScaledVector(this.direction, this.speed);
    }
  }

  moveUp() {
    if (this.pivot) {
      this.pivot.rotation.x += Math.PI/100;
    }
  }

  moveDown() {
    if (this.pivot) {
      this.pivot.rotation.x -= Math.PI/100;
    }
  }

  moveLeft() {
    if (this.pivot) {
      this.pivot.rotation.y += Math.PI/100;
    }
  }

  moveRight() {
    if (this.pivot) {
      this.pivot.rotation.y -= Math.PI/100;
    }
  }
}

export { shipMovement };
