import * as THREE from 'three';
import gsap from 'gsap';

/**
 * ParticleSystem.js
 * Mystical floating embers for the Ritual room.
 * On/off per room with smooth opacity transitions.
 */
export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = null;
    this.velocities = [];
    this.COUNT = 600;
    this._build();
  }

  _build() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.COUNT * 3);
    const colors = new Float32Array(this.COUNT * 3);

    for (let i = 0; i < this.COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 12;
      positions[i3 + 1] = Math.random() * 6;
      positions[i3 + 2] = -50 + (Math.random() - 0.5) * 18;

      // Ember colors: orange to purple gradient
      const t = Math.random();
      colors[i3]     = 0.8 + t * 0.2;   // r
      colors[i3 + 1] = t * 0.3;          // g
      colors[i3 + 2] = t * 0.9;          // b

      this.velocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: 0.005 + Math.random() * 0.008,
        z: (Math.random() - 0.5) * 0.003,
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
    this.positions = positions;
  }

  setVisible(visible, duration = 3.0) {
    gsap.to(this.particles.material, {
      opacity: visible ? 0.85 : 0,
      duration,
      ease: 'power2.inOut',
    });
  }

  update() {
    if (this.particles.material.opacity < 0.01) return;

    for (let i = 0; i < this.COUNT; i++) {
      const i3 = i * 3;
      const v = this.velocities[i];

      // Drift and float
      this.positions[i3]     += v.x + Math.sin(Date.now() * 0.0003 + i) * 0.001;
      this.positions[i3 + 1] += v.y;
      this.positions[i3 + 2] += v.z;

      // Reset if too high
      if (this.positions[i3 + 1] > 8) {
        this.positions[i3 + 1] = 0.1;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
