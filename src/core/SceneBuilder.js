import * as THREE from 'three';

/**
 * SceneBuilder.js
 * Constructs the physical museum corridor geometry:
 * floor, walls, ceiling, decorative arches, and lighting per segment.
 */
export class SceneBuilder {
  constructor(scene) {
    this.scene = scene;
    this._build();
  }

  _build() {
    this._buildCorridor();
    this._buildArches();
    this._buildDecorativeDetails();
  }

  _buildCorridor() {
    const totalLength = 70;
    const width = 9;
    const height = 8;
    const zCenter = -30;

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x1a1510,
      roughness: 0.95,
      metalness: 0.02,
    });
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0e0c08,
      roughness: 1.0,
      metalness: 0.0,
    });
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x080808,
      roughness: 1.0,
    });

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(width, totalLength),
      floorMat
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, zCenter);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(totalLength, height),
      stoneMat
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-width / 2, height / 2, zCenter);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(totalLength, height),
      stoneMat
    );
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(width / 2, height / 2, zCenter);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(width, totalLength),
      ceilingMat
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, height, zCenter);
    this.scene.add(ceiling);

    // End wall (past ritual)
    const endWall = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      stoneMat
    );
    endWall.position.set(0, height / 2, -65);
    this.scene.add(endWall);
  }

  _buildArches() {
    // Archways between rooms at Z = -13 (origen→guerra) and Z = -37 (guerra→ritual)
    const archPositions = [-13, -37];
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x111008,
      roughness: 0.9,
    });

    archPositions.forEach(z => {
      // Left pillar
      const leftPillar = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 8, 0.6),
        archMat
      );
      leftPillar.position.set(-4.2, 4, z);
      this.scene.add(leftPillar);

      // Right pillar
      const rightPillar = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 8, 0.6),
        archMat
      );
      rightPillar.position.set(4.2, 4, z);
      this.scene.add(rightPillar);

      // Lintel top
      const lintel = new THREE.Mesh(
        new THREE.BoxGeometry(9, 1.0, 0.6),
        archMat
      );
      lintel.position.set(0, 7.5, z);
      this.scene.add(lintel);
    });
  }

  _buildDecorativeDetails() {
    // Wall torch sconces (glowing point lights)
    const torchPositions = [
      { x: -4, y: 3, z: -6 },
      { x:  4, y: 3, z: -6 },
      { x: -4, y: 3, z: -19 },
      { x:  4, y: 3, z: -19 },
      { x: -4, y: 3, z: -31 },
      { x:  4, y: 3, z: -31 },
      { x: -4, y: 3, z: -44 },
      { x:  4, y: 3, z: -44 },
    ];

    torchPositions.forEach(pos => {
      // Torch sconce geometry (tiny)
      const bracket = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.12, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x553310, roughness: 0.5, metalness: 0.6 })
      );
      bracket.position.set(pos.x, pos.y, pos.z);
      this.scene.add(bracket);

      // Flame glow
      const flame = new THREE.PointLight(0xff6611, 1.2, 6, 2);
      flame.position.set(pos.x, pos.y + 0.2, pos.z);
      this.scene.add(flame);

      // Subtle flicker animation
      this._flickerLight(flame);
    });
  }

  _flickerLight(light) {
    const baseIntensity = light.intensity;
    const tick = () => {
      if (!light.parent) return;
      light.intensity = baseIntensity + (Math.random() - 0.5) * 0.4;
      setTimeout(tick, 80 + Math.random() * 140);
    };
    tick();
  }
}
