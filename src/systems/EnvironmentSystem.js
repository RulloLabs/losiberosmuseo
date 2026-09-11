import * as THREE from 'three';
import gsap from 'gsap';
import { ROOMS } from '../data/rooms.js';

/**
 * EnvironmentSystem.js
 * Controls fog, lights, and visual environment per room.
 * Uses GSAP for cinematic smooth transitions.
 */
export class EnvironmentSystem {
  constructor(scene) {
    this.scene = scene;
    this.ambient = null;
    this.dirLight = null;
    this.currentRoom = null;
    this._buildLights();
    this._initFog();
  }

  _buildLights() {
    this.ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambient);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.dirLight.position.set(5, 10, 5);
    this.scene.add(this.dirLight);

    // Subtle hemisphere for atmospheric fill
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.15);
    this.scene.add(this.hemiLight);
  }

  _initFog() {
    this.scene.fog = new THREE.FogExp2(
      ROOMS.origen.environment.fogColor,
      ROOMS.origen.environment.fogDensity
    );
    this.scene.background = new THREE.Color(ROOMS.origen.environment.skyColor);
  }

  transitionTo(roomId, duration = 2.5) {
    if (this.currentRoom === roomId) return;
    const env = ROOMS[roomId].environment;

    const fogTarget = new THREE.Color(env.fogColor);
    const skyTarget = new THREE.Color(env.skyColor);
    const ambTarget = new THREE.Color(env.ambientColor);
    const dirTarget = new THREE.Color(env.dirLightColor);

    gsap.to(this.scene.fog.color, {
      r: fogTarget.r, g: fogTarget.g, b: fogTarget.b,
      duration, ease: 'power2.inOut'
    });
    gsap.to(this.scene.fog, {
      density: env.fogDensity,
      duration, ease: 'power2.inOut'
    });
    gsap.to(this.scene.background, {
      r: skyTarget.r, g: skyTarget.g, b: skyTarget.b,
      duration, ease: 'power2.inOut'
    });
    gsap.to(this.ambient.color, {
      r: ambTarget.r, g: ambTarget.g, b: ambTarget.b,
      duration, ease: 'power2.inOut'
    });
    gsap.to(this.ambient, {
      intensity: env.ambientIntensity,
      duration, ease: 'power2.inOut'
    });
    gsap.to(this.dirLight.color, {
      r: dirTarget.r, g: dirTarget.g, b: dirTarget.b,
      duration, ease: 'power2.inOut'
    });
    gsap.to(this.dirLight, {
      intensity: env.dirLightIntensity,
      duration, ease: 'power2.inOut'
    });

    this.currentRoom = roomId;
  }
}
