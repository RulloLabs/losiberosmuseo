import * as THREE from 'three';
// Fallback 3D geometry generators per type
const FALLBACKS = {
  vessel: () => {
    const g = new THREE.Group();
    // Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.16, 0.5, 24),
      new THREE.MeshStandardMaterial({ color: 0xc47a3a, roughness: 0.85, metalness: 0.05 })
    );
    body.position.y = 0.25;
    // Neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.20, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0xc47a3a, roughness: 0.85, metalness: 0.05 })
    );
    neck.position.y = 0.59;
    // Rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.02, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xa85a20 })
    );
    rim.position.y = 0.69;
    g.add(body, neck, rim);
    return g;
  },
  sword: () => {
    const g = new THREE.Group();
    // Blade
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.2, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xaabbcc, roughness: 0.2, metalness: 0.95 })
    );
    blade.position.y = 0.65;
    blade.rotation.z = 0.08; // slight curve implication
    // Guard
    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.05, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x886633, roughness: 0.4, metalness: 0.6 })
    );
    guard.position.y = 0.06;
    // Handle
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.25, 12),
      new THREE.MeshStandardMaterial({ color: 0x553311, roughness: 0.8 })
    );
    handle.position.y = -0.12;
    g.add(blade, guard, handle);
    g.rotation.z = Math.PI / 12; // leaned slightly for display
    return g;
  },
  urn: () => {
    const g = new THREE.Group();
    // Body (oblate)
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 24),
      new THREE.MeshStandardMaterial({ color: 0x2a2030, roughness: 0.9, metalness: 0 })
    );
    body.scale.y = 0.85;
    body.position.y = 0.3;
    // Base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.15, 0.06, 16),
      new THREE.MeshStandardMaterial({ color: 0x201828, roughness: 0.95 })
    );
    base.position.y = 0.04;
    // Lid
    const lid = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x1a101f, roughness: 0.95 })
    );
    lid.position.y = 0.555;
    // Knob
    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 10, 8),
      new THREE.MeshStandardMaterial({ color: 0x6633aa })
    );
    knob.position.y = 0.68;
    g.add(base, body, lid, knob);
    return g;
  }
};

/**
 * ExhibitSystem.js
 * Manages all exhibit objects: loading, interaction, highlights, and info panels.
 */
export class ExhibitSystem {
  constructor(scene, camera, uiPanel, gamification) {
    this.scene = scene;
    this.camera = camera;
    this.uiPanel = uiPanel;
    this.gamification = gamification;
    this.exhibits = [];
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 4.5;
    this.loader = null;
    this.activeExhibit = null;
    this._initLoader();
  }

  _initLoader() {
    // Dynamic import for lazy loading
    import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
      this.loader = new GLTFLoader();
    });
  }

  add(config) {
    const group = new THREE.Group();

    // --- Pedestal ---
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.38, 0.25, 24),
      new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.7,
        metalness: 0.15,
      })
    );
    pedestal.position.y = 0.125;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    // --- Spotlight ---
    const spot = new THREE.SpotLight(
      config.spotlight.color,
      config.spotlight.intensity,
      14,
      config.spotlight.angle,
      config.spotlight.penumbra,
      2
    );
    spot.position.set(config.position.x, 5.5, config.position.z);
    spot.castShadow = true;
    const target = new THREE.Object3D();
    target.position.set(config.position.x, 0.8, config.position.z);
    this.scene.add(target);
    spot.target = target;
    this.scene.add(spot);

    // --- Guide light (subtle hint pointing to exhibit) ---
    const guide = new THREE.PointLight(config.guideLight.color, 0, 8);
    guide.position.set(config.position.x, 1.5, config.position.z);
    this.scene.add(guide);

    group.position.set(config.position.x, 0, config.position.z);

    // --- Model container ---
    const modelContainer = new THREE.Group();
    modelContainer.position.y = 0.25;
    group.add(modelContainer);

    const exhibitData = {
      id: config.id,
      config,
      group,
      modelContainer,
      spot,
      guide,
      originalSpotIntensity: config.spotlight.intensity,
      meshes: [],
      originalEmissives: [],
      discovered: false,
    };

    this._loadModel(config, exhibitData);
    this.scene.add(group);
    this.exhibits.push(exhibitData);
    return exhibitData;
  }

  _loadModel(config, data) {
    const tryLoad = () => {
      if (!this.loader) { setTimeout(tryLoad, 200); return; }
      this.loader.load(
        config.modelPath,
        (gltf) => {
          const model = gltf.scene;
          // Normalize size
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) model.scale.setScalar((config.scale || 1.0) / maxDim);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center.multiplyScalar((config.scale || 1.0) / maxDim));
          model.position.y += size.y / (2 * maxDim);
          model.traverse(c => {
            if (c.isMesh) {
              data.meshes.push(c);
              data.originalEmissives.push(c.material.emissive?.clone() || new THREE.Color(0, 0, 0));
              c.castShadow = true;
            }
          });
          data.modelContainer.add(model);
        },
        undefined,
        () => this._useFallback(config, data)
      );
    };
    tryLoad();
  }

  _useFallback(config, data) {
    const fallbackFn = FALLBACKS[config.fallbackType] || FALLBACKS.vessel;
    const fallback = fallbackFn();
    fallback.traverse(c => {
      if (c.isMesh) {
        data.meshes.push(c);
        data.originalEmissives.push(new THREE.Color(0, 0, 0));
        c.castShadow = true;
      }
    });
    data.modelContainer.add(fallback);
  }

  update(controls) {
    if (!controls.isLocked) return;

    const center = new THREE.Vector2(0, 0);
    this.raycaster.setFromCamera(center, this.camera);

    let closest = null;
    let closestDist = Infinity;

    this.exhibits.forEach(ex => {
      if (ex.meshes.length === 0) return;
      const intersects = this.raycaster.intersectObjects(ex.meshes, true);
      if (intersects.length > 0) {
        const d = intersects[0].distance;
        if (d < closestDist) {
          closestDist = d;
          closest = ex;
        }
      }
    });

    if (closest !== this.activeExhibit) {
      if (this.activeExhibit) this._unhighlight(this.activeExhibit);
      if (closest) this._highlight(closest);
      this.activeExhibit = closest;
      this.uiPanel.setExhibit(closest ? closest.config.metadata : null);
      if (closest && !closest.discovered) {
        closest.discovered = true;
        this.gamification.onDiscover(closest.id);
      }
    }

    // Rotate all models slowly
    this.exhibits.forEach(ex => {
      ex.modelContainer.rotation.y += 0.003;
    });
  }

  _highlight(ex) {
    ex.meshes.forEach((m, i) => {
      if (m.material?.emissive) {
        m.material.emissive.set(0x333300);
        m.material.emissiveIntensity = 0.4;
      }
    });
    import('gsap').then(({ gsap }) => {
      gsap.to(ex.spot, { intensity: ex.originalSpotIntensity * 1.8, duration: 0.4 });
    });
  }

  _unhighlight(ex) {
    ex.meshes.forEach((m, i) => {
      if (m.material?.emissive) {
        m.material.emissive.set(ex.originalEmissives[i]);
        m.material.emissiveIntensity = 0;
      }
    });
    import('gsap').then(({ gsap }) => {
      gsap.to(ex.spot, { intensity: ex.originalSpotIntensity, duration: 0.4 });
    });
  }

  pulseGuide(roomId) {
    this.exhibits
      .filter(ex => ex.config.room === roomId && !ex.discovered)
      .forEach(ex => {
        import('gsap').then(({ gsap }) => {
          gsap.to(ex.guide, {
            intensity: ex.config.guideLight.intensity,
            duration: 1.2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
          });
        });
      });
  }

  stopGuide(exhibitId) {
    const ex = this.exhibits.find(e => e.id === exhibitId);
    if (ex) {
      import('gsap').then(({ gsap }) => {
        gsap.killTweensOf(ex.guide);
        gsap.to(ex.guide, { intensity: 0, duration: 0.5 });
      });
    }
  }
}
