import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

/**
 * PlayerControls.js
 * First-person FPS-style movement with smooth inertia.
 */
export class PlayerControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new PointerLockControls(camera, domElement);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.keys = {};
    this.prevTime = performance.now();

    // Boundaries (corridor limits)
    this.bounds = { minZ: -62, maxZ: 5, minX: -3.8, maxX: 3.8 };

    this._bindKeys();
  }

  _bindKeys() {
    document.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      // ESC handled by PointerLockControls automatically
    });
    document.addEventListener('keyup', e => {
      this.keys[e.code] = false;
    });
  }

  get isLocked() {
    return this.controls.isLocked;
  }

  lock() { this.controls.lock(); }
  unlock() { this.controls.unlock(); }

  onLock(cb) { this.controls.addEventListener('lock', cb); }
  onUnlock(cb) { this.controls.addEventListener('unlock', cb); }

  update() {
    if (!this.controls.isLocked) {
      this.prevTime = performance.now();
      return;
    }

    const now = performance.now();
    const delta = Math.min((now - this.prevTime) / 1000, 0.1);
    this.prevTime = now;

    // Inertia damping
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    const fwd = Number(this.keys['KeyW'] || this.keys['ArrowUp']);
    const bwd = Number(this.keys['KeyS'] || this.keys['ArrowDown']);
    const lft = Number(this.keys['KeyA'] || this.keys['ArrowLeft']);
    const rgt = Number(this.keys['KeyD'] || this.keys['ArrowRight']);

    this.direction.z = fwd - bwd;
    this.direction.x = rgt - lft;
    this.direction.normalize();

    const speed = 22.0;
    if (fwd || bwd) this.velocity.z -= this.direction.z * speed * delta;
    if (lft || rgt) this.velocity.x -= this.direction.x * speed * delta;

    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);

    // Clamp position
    const p = this.camera.position;
    p.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, p.x));
    p.z = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, p.z));
    p.y = 1.6; // fixed eye height
  }
}
