import * as THREE from 'three';
import gsap from 'gsap';
import { ROOMS, ROOM_ORDER } from '../data/rooms.js';

/**
 * NarrativeMode.js
 * Guided cinematic tour: auto-moves the camera through each room,
 * plays narration, and highlights each exhibit.
 */
export class NarrativeMode {
  constructor(camera, controls, audio, exhibits) {
    this.camera = camera;
    this.controls = controls;
    this.audio = audio;
    this.exhibits = exhibits;
    this.active = false;
    this.timeline = null;
  }

  start(onRoomChange, onComplete) {
    if (this.active) return;
    this.active = true;

    // Unlock controls before taking over
    if (this.controls.isLocked) this.controls.unlock();

    const tl = gsap.timeline({
      onComplete: () => {
        this.active = false;
        onComplete?.();
      }
    });

    const waypoints = [
      // Origins
      { x: 0, y: 1.6, z: 4,    room: 'origen',  delay: 0    },
      { x: 0, y: 1.6, z: 0,    room: 'origen',  delay: 4    },
      // Warriors
      { x: 0, y: 1.6, z: -18,  room: 'guerra',  delay: 10   },
      { x: 0, y: 1.6, z: -25,  room: 'guerra',  delay: 16   },
      // Ritual
      { x: 0, y: 1.6, z: -42,  room: 'ritual',  delay: 24   },
      { x: 0, y: 1.6, z: -50,  room: 'ritual',  delay: 30   },
      // Final pullback
      { x: 2, y: 3.5, z: -45,  room: 'ritual',  delay: 38   },
    ];

    let lastRoom = null;

    waypoints.forEach((wp, i) => {
      tl.to(this.camera.position, {
        x: wp.x, y: wp.y, z: wp.z,
        duration: i === 0 ? 2 : 7,
        ease: 'power1.inOut',
        onStart: () => {
          if (wp.room !== lastRoom) {
            onRoomChange?.(wp.room);
            lastRoom = wp.room;
          }
        }
      }, wp.delay);

      // Gently look toward each exhibit
      const exhibit = this.exhibits.find(e => e.config.room === wp.room);
      if (exhibit && i > 0) {
        const target = new THREE.Vector3(
          exhibit.config.position.x,
          1.0,
          exhibit.config.position.z
        );
        tl.to({}, {
          duration: 0.01,
          onStart: () => {
            const dir = target.clone().sub(this.camera.position).normalize();
            const euler = new THREE.Euler();
            euler.setFromQuaternion(
              new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, -1), dir
              )
            );
            gsap.to(this.camera.rotation, {
              x: euler.x, y: euler.y, z: euler.z,
              duration: 2, ease: 'power2.out'
            });
          }
        }, wp.delay + 1);
      }
    });

    this.timeline = tl;
  }

  stop() {
    if (this.timeline) this.timeline.kill();
    this.active = false;
  }
}
