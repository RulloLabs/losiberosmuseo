import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';

// ════════════════════════════════════════════════════════════
// RENDERER
// ════════════════════════════════════════════════════════════
const W = window.innerWidth, H = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// ════════════════════════════════════════════════════════════
// SCENE & CAMERA
// ════════════════════════════════════════════════════════════
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0a06);

const camera = new THREE.PerspectiveCamera(72, W / H, 0.05, 150);
camera.position.set(0, 1.6, 5);

// ════════════════════════════════════════════════════════════
// POSTPROCESSING
// ════════════════════════════════════════════════════════════
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(
  new THREE.Vector2(W, H), 0.6, 0.4, 0.75
);
composer.addPass(bloom);

// Vignette shader
const vignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 0.85 },
    darkness: { value: 0.6 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset, darkness;
    varying vec2 vUv;
    void main(){
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - 0.5) * 2.0;
      float vignette = 1.0 - smoothstep(offset, offset + 0.5, length(uv));
      color.rgb *= mix(1.0 - darkness, 1.0, vignette);
      gl_FragColor = color;
    }
  `,
};
const vignette = new ShaderPass(vignetteShader);
composer.addPass(vignette);

// ════════════════════════════════════════════════════════════
// ROOM DATA
// ════════════════════════════════════════════════════════════
const ROOMS = {
  origen: {
    name: 'El Origen', subtitle: 'La tierra que los forjó',
    zPos: 0, zThreshold: -13,
    fog: { color: 0x8a6a44, density: 0.018 },
    ambient: { color: 0xffcc88, intensity: 0.55 },
    dir: { color: 0xffa040, intensity: 0.7 },
    bg: 0x0d0a06,
    bloom: { strength: 0.45, radius: 0.3 },
    vignette: { darkness: 0.45 },
    narration: 'Antes de la guerra, antes del rito... existía la tierra.\nLos íberos emergieron de ella como el roble emerge de la roca.',
    audioType: 'wind',
  },
  guerra: {
    name: 'Los Guerreros', subtitle: 'El precio de la libertad',
    zPos: -28, zThreshold: -40,
    fog: { color: 0x1a0000, density: 0.032 },
    ambient: { color: 0x660000, intensity: 0.2 },
    dir: { color: 0xff2200, intensity: 0.5 },
    bg: 0x080000,
    bloom: { strength: 0.9, radius: 0.5 },
    vignette: { darkness: 0.7 },
    narration: 'El hierro cantaba.\nLos guerreros íberos eran temidos en todo el Mediterráneo.',
    audioType: 'tension',
  },
  ritual: {
    name: 'El Ritual', subtitle: 'Entre los vivos y los muertos',
    zPos: -56, zThreshold: null,
    fog: { color: 0x030108, density: 0.055 },
    ambient: { color: 0x1a0a3a, intensity: 0.07 },
    dir: { color: 0x5522ff, intensity: 0.4 },
    bg: 0x020104,
    bloom: { strength: 1.4, radius: 0.7 },
    vignette: { darkness: 0.85 },
    narration: 'En la oscuridad total, los íberos hablaban con sus ancestros.\nEl fuego, la urna, el silencio — eran el puente entre dos mundos.',
    audioType: 'cave',
  },
};
const ROOM_ORDER = ['origen', 'guerra', 'ritual'];

// ════════════════════════════════════════════════════════════
// LIGHTS
// ════════════════════════════════════════════════════════════
const ambientLight = new THREE.AmbientLight(0xffcc88, 0.55);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffa040, 0.7);
dirLight.position.set(3, 10, 5);
dirLight.castShadow = true;
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0x220d00, 0x000000, 0.2);
scene.add(hemiLight);

// ════════════════════════════════════════════════════════════
// FOG — set immediately
// ════════════════════════════════════════════════════════════
scene.fog = new THREE.FogExp2(0x8a6a44, 0.018);

// ════════════════════════════════════════════════════════════
// CORRIDOR GEOMETRY
// ════════════════════════════════════════════════════════════
function makeMat(color, roughness = 0.92, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

const corridorLen = 85;
const cz = -30;
const corridor = {
  floor: { geo: new THREE.PlaneGeometry(10, corridorLen), mat: makeMat(0x0c0906), ry: 0, pos: [0, 0, cz], rx: -Math.PI / 2 },
  left:  { geo: new THREE.PlaneGeometry(corridorLen, 9),  mat: makeMat(0x100d08), pos: [-5, 4.5, cz], ry: Math.PI / 2 },
  right: { geo: new THREE.PlaneGeometry(corridorLen, 9),  mat: makeMat(0x100d08), pos: [5,  4.5, cz], ry: -Math.PI / 2 },
  ceil:  { geo: new THREE.PlaneGeometry(10, corridorLen), mat: makeMat(0x080807), pos: [0, 9, cz], rx: Math.PI / 2 },
  end:   { geo: new THREE.PlaneGeometry(10, 9),           mat: makeMat(0x080604), pos: [0, 4.5, -73] },
};

Object.values(corridor).forEach(({ geo, mat, pos, rx = 0, ry = 0 }) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.x = rx; m.rotation.y = ry;
  m.receiveShadow = true;
  scene.add(m);
});

// Arch separators at room thresholds
[-14, -42].forEach(z => {
  const archMat = makeMat(0x0e0b06);
  [[-4.4, 4.5], [4.4, 4.5]].forEach(([x, y]) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(1.0, 9, 0.7), archMat);
    p.position.set(x, y, z); p.castShadow = true; scene.add(p);
  });
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(10, 0.9, 0.7), archMat);
  lintel.position.set(0, 8.55, z); scene.add(lintel);
});

// ════════════════════════════════════════════════════════════
// WALL TORCHES — flickering
// ════════════════════════════════════════════════════════════
const torchPositions = [
  [-4.5, 3.2, -4],  [4.5, 3.2, -4],
  [-4.5, 3.2, -20], [4.5, 3.2, -20],
  [-4.5, 3.2, -34], [4.5, 3.2, -34],
  [-4.5, 3.2, -48], [4.5, 3.2, -48],
];
const flames = [];

torchPositions.forEach(([x, y, z]) => {
  const bracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.2, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x443322, roughness: 0.5, metalness: 0.7 })
  );
  bracket.position.set(x, y, z);
  scene.add(bracket);

  const glowMat = new THREE.MeshBasicMaterial({ color: 0xff8822 });
  const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), glowMat);
  glowMesh.position.set(x, y + 0.18, z);
  scene.add(glowMesh);

  const fl = new THREE.PointLight(0xff6611, 1.4, 8, 2);
  fl.position.set(x, y + 0.2, z);
  scene.add(fl);
  flames.push(fl);
});

function flickerFlames(t) {
  flames.forEach((f, i) => {
    f.intensity = 1.2 + Math.sin(t * 4.1 + i * 1.3) * 0.35 + Math.sin(t * 7.7 + i) * 0.15;
  });
}

// ════════════════════════════════════════════════════════════
// EXHIBITS — Procedural 3D Objects (no GLBs needed)
// ════════════════════════════════════════════════════════════
function buildVessel() {
  // Iberian pottery: turn-thrown ceramic vessel
  const g = new THREE.Group();
  const terracottaStd = new THREE.MeshStandardMaterial({
    color: 0xb5632a, roughness: 0.78, metalness: 0.04,
  });
  const darkBand = new THREE.MeshStandardMaterial({ color: 0x4a2a10, roughness: 0.9 });

  // Body — lathed profile via lathe geometry
  const pts = [
    new THREE.Vector2(0, 0), new THREE.Vector2(0.18, 0.02),
    new THREE.Vector2(0.28, 0.12), new THREE.Vector2(0.30, 0.22),
    new THREE.Vector2(0.28, 0.34), new THREE.Vector2(0.22, 0.44),
    new THREE.Vector2(0.18, 0.52), new THREE.Vector2(0.14, 0.60),
    new THREE.Vector2(0.10, 0.68), new THREE.Vector2(0.085, 0.74),
    new THREE.Vector2(0.10, 0.80), new THREE.Vector2(0.12, 0.82),
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), terracottaStd);
  g.add(body);

  // Decorative bands (geometric motif)
  [0.18, 0.32, 0.46].forEach(y => {
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.27 - y * 0.05, 0.012, 8, 32),
      darkBand
    );
    band.position.y = y;
    g.add(band);
  });

  // Handle (torus arc)
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.10, 0.025, 8, 16, Math.PI),
    terracottaStd
  );
  handle.position.set(0.29, 0.35, 0);
  handle.rotation.y = Math.PI / 2;
  g.add(handle);

  g.scale.setScalar(0.9);
  return g;
}

function buildFalcata() {
  const g = new THREE.Group();

  // Blade — curved via CatmullRomCurve3 extruded
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xc8d8e8, roughness: 0.15, metalness: 0.92,
    envMapIntensity: 1.0,
  });
  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0xe8eef5, roughness: 0.08, metalness: 0.98,
  });

  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.bezierCurveTo( 0.04, 0.3,  0.06, 0.7,  0.02, 1.1);
  bladeShape.bezierCurveTo(-0.01, 1.15, -0.03, 1.1, -0.04, 1.0);
  bladeShape.bezierCurveTo(-0.06, 0.7,  -0.05, 0.3,  0,    0);

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.012, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.002, bevelSegments: 2,
  });
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.position.y = 0.22;
  blade.rotation.z = 0.05;
  g.add(blade);

  // Guard — ornate bronze cross-piece
  const guardMat = new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.35, metalness: 0.8 });
  const guard = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.055, 0.04), guardMat);
  guard.position.y = 0.19;
  g.add(guard);
  // Guard horns
  [-1, 1].forEach(s => {
    const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.02, 0.12, 8), guardMat);
    horn.position.set(s * 0.18, 0.19, 0);
    horn.rotation.z = s * 0.4;
    g.add(horn);
  });

  // Handle — wrapped leather grip
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x3a2010, roughness: 0.95 });
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.22, 12), gripMat);
  grip.position.y = 0.08;
  g.add(grip);
  // Grip wrapping rings
  for (let i = 0; i < 5; i++) {
    const wrap = new THREE.Mesh(
      new THREE.TorusGeometry(0.032, 0.005, 6, 16),
      guardMat
    );
    wrap.position.y = 0.01 + i * 0.04;
    g.add(wrap);
  }

  // Pommel
  const pommel = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 12, 8),
    guardMat
  );
  pommel.position.y = -0.04;
  pommel.scale.y = 0.7;
  g.add(pommel);

  g.scale.setScalar(0.95);
  g.rotation.z = -0.1;
  return g;
}

function buildUrn() {
  const g = new THREE.Group();
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x30233a, roughness: 0.88, metalness: 0.02,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x6633aa, roughness: 0.5, metalness: 0.2,
    emissive: 0x220044, emissiveIntensity: 0.4,
  });

  // Body — ovoid via lathe
  const pts = [
    new THREE.Vector2(0, -0.38), new THREE.Vector2(0.12, -0.36),
    new THREE.Vector2(0.24, -0.28), new THREE.Vector2(0.30, -0.12),
    new THREE.Vector2(0.30,  0.08), new THREE.Vector2(0.26,  0.24),
    new THREE.Vector2(0.18,  0.32), new THREE.Vector2(0.10,  0.36),
    new THREE.Vector2(0.05,  0.38),
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), stoneMat);
  g.add(body);

  // Base ring
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.06, 24), stoneMat);
  base.position.y = -0.41;
  g.add(base);

  // Lid — domed
  const lidPts = [
    new THREE.Vector2(0.005, 0), new THREE.Vector2(0.10, 0.01),
    new THREE.Vector2(0.18, 0.04), new THREE.Vector2(0.18, 0.12),
    new THREE.Vector2(0.12, 0.18), new THREE.Vector2(0.06, 0.21),
    new THREE.Vector2(0.01, 0.22),
  ];
  const lid = new THREE.Mesh(new THREE.LatheGeometry(lidPts, 28), stoneMat);
  lid.position.y = 0.38;
  g.add(lid);

  // Knob
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), accentMat);
  knob.position.y = 0.62;
  g.add(knob);

  // Carved symbol rings (glowing accent)
  [0.05, -0.12].forEach(y => {
    const sym = new THREE.Mesh(new THREE.TorusGeometry(0.28 + y * 0.05, 0.008, 6, 32), accentMat);
    sym.position.y = y;
    g.add(sym);
  });

  g.scale.setScalar(0.85);
  return g;
}

// ════════════════════════════════════════════════════════════
// EXHIBIT PLACEMENT
// ════════════════════════════════════════════════════════════
const EXHIBITS_DATA = [
  {
    id: 'vasija', factory: buildVessel, room: 'origen',
    pos: [0, 0, 0], spotColor: 0xffddaa, spotInt: 16,
    title: 'Vasija Cerámica', period: 'S. V–III a.C.',
    shortDesc: 'Cerámica con decoración geométrica íbera.',
    expertDesc: `Las vasijas íberas son testimonio de una cultura vibrante y comercial. Los motivos geométricos en bandas reflejan influencias griegas y fenicias, reinterpretadas con identidad propia inconfundible. Hallada en La Bastida (Murcia), fechada c. 350 a.C.`,
    location: 'Murcia, España', material: 'Arcilla cocida con engobe',
  },
  {
    id: 'falcata', factory: buildFalcata, room: 'guerra',
    pos: [0, 0.8, -28], spotColor: 0xff4400, spotInt: 20,
    title: 'Falcata Íbera', period: 'S. IV–II a.C.',
    shortDesc: 'La espada curva que aterrorizó a Roma.',
    expertDesc: `La falcata íbera es considerada una de las armas más letales de la Antigüedad. Su geometría curva concentra el peso en el filo, generando cortes devastadores. Polibio y Tito Livio la mencionan con respeto manifiesto. Ejemplares de Baza y Alcoy muestran damasquinado de plata.`,
    location: 'Baza, Granada', material: 'Hierro forjado, empuñadura de bronce',
  },
  {
    id: 'urna', factory: buildUrn, room: 'ritual',
    pos: [0, 0.5, -56], spotColor: 0x8833ff, spotInt: 22,
    title: 'Urna Funeraria', period: 'S. VI–IV a.C.',
    shortDesc: 'El recipiente del alma. Puente entre mundos.',
    expertDesc: `Las urnas cinerarias íberas son objetos de enorme carga simbólica. Tras la cremación del guerrero, sus cenizas eran depositadas junto a armas y ofrendas. La urna era la nueva morada del espíritu. Los rituales íberos combinaban creencias locales con el imaginario mediterráneo sobre la vida después de la muerte.`,
    location: 'Chinchilla, Albacete', material: 'Piedra caliza labrada',
  },
];

const exhibitObjects = []; // { id, mesh, spot, discovered, config, rotGroup }

EXHIBITS_DATA.forEach(cfg => {
  const [x, y, z] = cfg.pos;

  // Pedestal
  const pedMat = new THREE.MeshStandardMaterial({ color: 0x1a1510, roughness: 0.8 });
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.28, 24), pedMat);
  ped.position.set(x, 0.14, z);
  ped.receiveShadow = true;
  scene.add(ped);

  // Exhibit model
  const rotGroup = new THREE.Group();
  rotGroup.position.set(x, y, z);
  const model = cfg.factory();
  rotGroup.add(model);
  scene.add(rotGroup);

  // Spotlight
  const spot = new THREE.SpotLight(cfg.spotColor, cfg.spotInt, 16, Math.PI / 7, 0.7, 2);
  spot.position.set(x, 6.5, z);
  spot.castShadow = true;
  const tgt  = new THREE.Object3D();
  tgt.position.set(x, 0.8, z);
  scene.add(tgt);
  spot.target = tgt;
  scene.add(spot);

  // Guide halo ring (pulsing ring to hint at interact)
  const haloGeo = new THREE.TorusGeometry(0.52, 0.015, 8, 48);
  const haloMat = new THREE.MeshBasicMaterial({
    color: cfg.spotColor, transparent: true, opacity: 0,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.set(x, 0.01, z);
  halo.rotation.x = -Math.PI / 2;
  scene.add(halo);

  exhibitObjects.push({
    id: cfg.id, rotGroup, spot, model,
    halo, haloMat,
    baseSpotInt: cfg.spotInt,
    discovered: false,
    config: cfg,
  });
});

// ════════════════════════════════════════════════════════════
// PARTICLES — Ritual room only
// ════════════════════════════════════════════════════════════
const PARTICLE_COUNT = 700;
const pPositions = new Float32Array(PARTICLE_COUNT * 3);
const pColors = new Float32Array(PARTICLE_COUNT * 3);
const pVels = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const i3 = i * 3;
  pPositions[i3]     = (Math.random() - 0.5) * 11;
  pPositions[i3 + 1] = Math.random() * 7;
  pPositions[i3 + 2] = -56 + (Math.random() - 0.5) * 17;

  const t = Math.random();
  pColors[i3]     = 0.6 + t * 0.4;
  pColors[i3 + 1] = t * 0.2;
  pColors[i3 + 2] = 0.4 + t * 0.6;

  pVels.push({
    x: (Math.random() - 0.5) * 0.004,
    y: 0.004 + Math.random() * 0.008,
    z: (Math.random() - 0.5) * 0.003,
  });
}

const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors, 3));

const pMat = new THREE.PointsMaterial({
  size: 0.065, vertexColors: true,
  transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, depthWrite: false,
});
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

// ════════════════════════════════════════════════════════════
// AUDIO — Synthetic via Web Audio API (soft, cinematic)
// ════════════════════════════════════════════════════════════
let audioCtx = null;
let masterGainNode = null;
let isMuted = false;
const audioGains = {};

function makePinkNoise(ctx, seconds) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
    b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
    b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980;
    d[i] = (b0+b1+b2+b3+b4+b5) * 0.11;
  }
  return buf;
}

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGainNode = audioCtx.createGain();
  masterGainNode.gain.value = 0.85;
  masterGainNode.connect(audioCtx.destination);

  // ─── ORIGEN: Gentle open-air wind (pink noise, very soft) ───
  const windSrc = audioCtx.createBufferSource();
  windSrc.buffer = makePinkNoise(audioCtx, 4);
  windSrc.loop = true;
  const wf1 = audioCtx.createBiquadFilter(); wf1.type='bandpass'; wf1.frequency.value=300; wf1.Q.value=0.5;
  const wf2 = audioCtx.createBiquadFilter(); wf2.type='highshelf'; wf2.frequency.value=2000; wf2.gain.value=-18;
  const wg = audioCtx.createGain(); wg.gain.value = 0;
  windSrc.connect(wf1).connect(wf2).connect(wg).connect(masterGainNode);
  windSrc.start();
  audioGains['origen'] = { node: wg, targetVol: 0.22 };

  // ─── GUERRA: Deep rumble — filtered noise + very low sine (NO sawtooth) ───
  // Use pink noise through a very low bandpass = distant thunder / forge
  const rumbSrc = audioCtx.createBufferSource();
  rumbSrc.buffer = makePinkNoise(audioCtx, 5);
  rumbSrc.loop = true;
  const rf = audioCtx.createBiquadFilter(); rf.type='lowpass'; rf.frequency.value=90; rf.Q.value=1.8;
  // Slow LFO on filter for pulsing sensation
  const rLfo = audioCtx.createOscillator(); rLfo.type='sine'; rLfo.frequency.value=0.18;
  const rLfg = audioCtx.createGain(); rLfg.gain.value=35;
  rLfo.connect(rLfg).connect(rf.frequency); rLfo.start();
  // Sub sine drone (very low, barely heard — just felt)
  const sub = audioCtx.createOscillator(); sub.type='sine'; sub.frequency.value=48;
  const subG = audioCtx.createGain(); subG.gain.value=0.12;
  sub.connect(subG);
  const tg = audioCtx.createGain(); tg.gain.value = 0;
  rumbSrc.connect(rf); rf.connect(tg); subG.connect(tg);
  tg.connect(masterGainNode);
  rumbSrc.start(); sub.start();
  audioGains['guerra'] = { node: tg, targetVol: 0.28 };

  // ─── RITUAL: Cave drone with deep reverb feedback ───
  const co = audioCtx.createOscillator(); co.type='sine'; co.frequency.value=36;
  const co2 = audioCtx.createOscillator(); co2.type='triangle'; co2.frequency.value=54;
  // Slow vibrato on second osc
  const vib = audioCtx.createOscillator(); vib.type='sine'; vib.frequency.value=0.08;
  const vibG = audioCtx.createGain(); vibG.gain.value=0.6;
  vib.connect(vibG).connect(co2.frequency); vib.start();
  // Cave reverb via feedback delay
  const d1 = audioCtx.createDelay(3); d1.delayTime.value=1.1;
  const d2 = audioCtx.createDelay(3); d2.delayTime.value=1.9;
  const fb = audioCtx.createGain(); fb.gain.value=0.45;
  d1.connect(fb).connect(d2).connect(fb);
  const cf = audioCtx.createBiquadFilter(); cf.type='lowpass'; cf.frequency.value=220;
  const cg = audioCtx.createGain(); cg.gain.value = 0;
  co.connect(cf); co2.connect(cf); cf.connect(d1); cf.connect(cg); d2.connect(cg);
  cg.connect(masterGainNode); co.start(); co2.start();
  audioGains['ritual'] = { node: cg, targetVol: 0.45 };
}

function audioTransition(roomId, dur = 2.5) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  Object.entries(audioGains).forEach(([id, g]) => {
    const target = id === roomId ? g.targetVol : 0;
    g.node.gain.cancelScheduledValues(now);
    g.node.gain.setValueAtTime(g.node.gain.value, now);
    g.node.gain.linearRampToValueAtTime(target, now + dur);
  });
}

function toggleMute() {
  isMuted = !isMuted;
  if (masterGainNode) {
    gsap.to(masterGainNode.gain, { value: isMuted ? 0 : 0.85, duration: 0.4 });
  }
  const btn = document.getElementById('btn-mute');
  if (btn) btn.textContent = isMuted ? '🔇' : '🔊';
}

// ════════════════════════════════════════════════════════════
// CONTROLS & PLAYER
// ════════════════════════════════════════════════════════════
const controls = new PointerLockControls(camera, document.body);
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const keys = {};
let prevTime = performance.now();

document.addEventListener('keydown', e => { keys[e.code] = true; });
document.addEventListener('keyup',   e => { keys[e.code] = false; });

function movePlayer() {
  if (!controls.isLocked) { prevTime = performance.now(); return; }
  const now = performance.now();
  const dt = Math.min((now - prevTime) / 1000, 0.1);
  prevTime = now;

  velocity.x -= velocity.x * 11 * dt;
  velocity.z -= velocity.z * 11 * dt;

  const fwd = Number(keys['KeyW'] || keys['ArrowUp']);
  const bwd = Number(keys['KeyS'] || keys['ArrowDown']);
  const lft = Number(keys['KeyA'] || keys['ArrowLeft']);
  const rgt = Number(keys['KeyD'] || keys['ArrowRight']);

  direction.z = fwd - bwd;
  direction.x = rgt - lft;
  direction.normalize();

  const speed = 24;
  if (fwd || bwd) velocity.z -= direction.z * speed * dt;
  if (lft || rgt) velocity.x -= direction.x * speed * dt;

  controls.moveRight(-velocity.x * dt);
  controls.moveForward(-velocity.z * dt);

  // Clamp
  camera.position.x = Math.max(-4.2, Math.min(4.2, camera.position.x));
  camera.position.z = Math.max(-70, Math.min(6, camera.position.z));
  camera.position.y = 1.6;
}

// ════════════════════════════════════════════════════════════
// ROOM SYSTEM
// ════════════════════════════════════════════════════════════
let currentRoom = null;
const narrated = new Set();

function detectAndTransition() {
  const z = camera.position.z;
  let detected = 'ritual';
  for (let i = 0; i < ROOM_ORDER.length - 1; i++) {
    const r = ROOMS[ROOM_ORDER[i]];
    if (z > r.zThreshold) { detected = ROOM_ORDER[i]; break; }
  }
  if (detected === currentRoom) return;
  currentRoom = detected;
  applyRoom(detected);
}

// ────────────────────────────────────────────
// PAUSE MENU — shown on ESC, NOT the main overlay
// ────────────────────────────────────────────
function showPauseMenu() {
  const pm = document.getElementById('pause-menu');
  if (pm) {
    pm.style.display = 'flex';
    gsap.fromTo(pm, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  }
}
function hidePauseMenu() {
  const pm = document.getElementById('pause-menu');
  if (pm) gsap.to(pm, { opacity: 0, duration: 0.2, onComplete: () => pm.style.display='none' });
}

function applyRoom(roomId, immediate = false) {
  const r = ROOMS[roomId];
  const dur = immediate ? 0 : 2.5;

  // Fog
  const fc = new THREE.Color(r.fog.color);
  gsap.to(scene.fog, { density: r.fog.density, duration: dur, ease: 'power2.inOut' });
  gsap.to(scene.fog.color, { r: fc.r, g: fc.g, b: fc.b, duration: dur });

  // Background
  const bc = new THREE.Color(r.bg);
  gsap.to(scene.background, { r: bc.r, g: bc.g, b: bc.b, duration: dur });

  // Ambient
  const ac = new THREE.Color(r.ambient.color);
  gsap.to(ambientLight.color, { r: ac.r, g: ac.g, b: ac.b, duration: dur });
  gsap.to(ambientLight, { intensity: r.ambient.intensity, duration: dur });

  // Dir light
  const dc = new THREE.Color(r.dir.color);
  gsap.to(dirLight.color, { r: dc.r, g: dc.g, b: dc.b, duration: dur });
  gsap.to(dirLight, { intensity: r.dir.intensity, duration: dur });

  // Bloom
  gsap.to(bloom, { strength: r.bloom.strength, radius: r.bloom.radius, duration: dur });

  // Vignette
  gsap.to(vignette.uniforms.darkness, { value: r.vignette.darkness, duration: dur });

  // Particles
  gsap.to(pMat, { opacity: roomId === 'ritual' ? 0.9 : 0, duration: 3 });

  // Audio
  audioTransition(roomId, dur);

  // Pulse guide halos for undiscovered exhibits in this room
  exhibitObjects
    .filter(e => e.config.room === roomId && !e.discovered)
    .forEach(e => {
      gsap.to(e.haloMat, {
        opacity: 0.55, duration: 1, yoyo: true, repeat: -1, ease: 'sine.inOut',
      });
    });

  // HUD
  updateHUDRoom(roomId);

  // Narrate once per room
  if (!narrated.has(roomId)) {
    narrated.add(roomId);
    setTimeout(() => showNarrator(r.narration), 800);
  }
}

// ════════════════════════════════════════════════════════════
// RAYCASTER — Exhibit Interaction
// ════════════════════════════════════════════════════════════
const raycaster = new THREE.Raycaster();
raycaster.far = 5;
let activeExhibit = null;
const discoveredIds = new Set();

function checkInteraction() {
  if (!controls.isLocked) return;
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

  let found = null;
  let minDist = Infinity;

  exhibitObjects.forEach(ex => {
    const hits = raycaster.intersectObject(ex.rotGroup, true);
    if (hits.length > 0 && hits[0].distance < minDist) {
      minDist = hits[0].distance;
      found = ex;
    }
  });

  if (found !== activeExhibit) {
    if (activeExhibit) dehighlight(activeExhibit);
    activeExhibit = found;
    if (found) {
      highlight(found);
      showInfoPanel(found.config);
      if (!found.discovered) {
        found.discovered = true;
        discoveredIds.add(found.id);
        gsap.killTweensOf(found.haloMat);
        gsap.to(found.haloMat, { opacity: 0, duration: 0.5 });
        onDiscover(found.id, found.config.title);
      }
    } else {
      hideInfoPanel();
      updateCrosshair(false);
    }
  }
}

function highlight(ex) {
  gsap.to(ex.spot, { intensity: ex.baseSpotInt * 2, duration: 0.4 });
  ex.rotGroup.traverse(c => {
    if (c.isMesh && c.material.emissive) {
      gsap.to(c.material.emissive, { r: 0.15, g: 0.1, b: 0, duration: 0.3 });
      c.material.emissiveIntensity = 0.5;
    }
  });
  updateCrosshair(true);
}

function dehighlight(ex) {
  gsap.to(ex.spot, { intensity: ex.baseSpotInt, duration: 0.4 });
  ex.rotGroup.traverse(c => {
    if (c.isMesh && c.material.emissive) {
      gsap.to(c.material.emissive, { r: 0, g: 0, b: 0, duration: 0.3 });
    }
  });
  updateCrosshair(false);
}

// ════════════════════════════════════════════════════════════
// GAMIFICATION
// ════════════════════════════════════════════════════════════
const OBJECTIVES = EXHIBITS_DATA.map(e => e.id);

function onDiscover(id, title) {
  // Update obj checklist
  const item = document.querySelector(`#obj-${id}`);
  if (item) {
    item.querySelector('.obj-check').textContent = '✓';
    item.classList.add('done');
    gsap.fromTo(item, { x: -10 }, { x: 0, duration: 0.4, ease: 'back.out(2)' });
  }

  // Flash
  const flash = document.getElementById('discovery-flash');
  flash.textContent = `✦ ${title} descubierto`;
  gsap.killTweensOf(flash);
  gsap.fromTo(flash,
    { opacity: 0, y: -18, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(2)',
      yoyo: true, repeat: 1, repeatDelay: 2.5,
      onComplete: () => { flash.textContent = ''; } }
  );

  // speak
  narrate(`${title} descubierto`);

  // Check completion
  if (OBJECTIVES.every(id => discoveredIds.has(id))) {
    setTimeout(showCompletion, 1500);
  }
}

function showCompletion() {
  const banner = document.getElementById('completion-banner');
  banner.style.display = 'flex';
  gsap.fromTo(banner, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.5)' });
}

// ════════════════════════════════════════════════════════════
// HTML UI
// ════════════════════════════════════════════════════════════
document.body.insertAdjacentHTML('beforeend', `
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#c8a96e;--gold-lo:#7a5d2f;--glass:rgba(6,4,2,0.65);
  --glass-b:rgba(200,169,110,0.18);--text:#e8dcc8;--dim:rgba(232,220,200,0.5);
  --r:10px;--blur:blur(20px) saturate(160%);
  --font:'Inter',sans-serif;--serif:'Cinzel',serif;
}
body{overflow:hidden;background:#000;color:var(--text);font-family:var(--font);user-select:none;-webkit-font-smoothing:antialiased}
canvas{display:block}

/* OVERLAY */
#overlay{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.obg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(120,70,20,.15),transparent 65%),linear-gradient(180deg,#000 0%,#0a0503 60%,#000 100%)}
.oc{position:relative;z-index:2;padding:0 2rem;max-width:580px}
.ey{font-size:.68rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold-lo);margin-bottom:1rem;opacity:.8}
.ot{font-family:var(--serif);font-size:clamp(3.8rem,11vw,6.8rem);font-weight:700;letter-spacing:.15em;color:var(--gold);text-shadow:0 0 60px rgba(200,169,110,.4),0 0 120px rgba(200,169,110,.15);line-height:1;animation:tp 4s ease-in-out infinite alternate}
@keyframes tp{from{text-shadow:0 0 60px rgba(200,169,110,.3),0 0 120px rgba(200,169,110,.12)}to{text-shadow:0 0 90px rgba(200,169,110,.55),0 0 160px rgba(200,169,110,.22)}}
.od{width:70px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:1.6rem auto;opacity:.55}
.oq{font-size:.95rem;line-height:1.9;color:var(--dim);margin-bottom:2.8rem}
.oa{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:2rem}
.btn-p,.btn-s{display:flex;align-items:center;gap:.6rem;padding:.8rem 2rem;border-radius:3px;font-family:var(--font);font-size:.8rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border:1px solid;transition:all .3s cubic-bezier(.4,0,.2,1);outline:none}
.btn-p{background:var(--gold);color:#0a0603;border-color:var(--gold)}
.btn-p:hover{background:#e8c280;box-shadow:0 0 30px rgba(200,169,110,.45);transform:translateY(-2px)}
.btn-s{background:transparent;color:var(--gold-lo);border-color:rgba(200,169,110,.28)}
.btn-s:hover{border-color:var(--gold);color:var(--gold);background:rgba(200,169,110,.06);transform:translateY(-2px)}
.ok{display:flex;gap:1.6rem;justify-content:center;flex-wrap:wrap}
.ki{font-size:.7rem;color:var(--dim);display:flex;align-items:center;gap:.4rem}
kbd{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:2px 7px;font-size:.68rem;color:var(--text)}
.of{position:fixed;bottom:1.8rem;left:50%;transform:translateX(-50%);font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(200,169,110,.28);z-index:2}

/* HUD */
#hud{position:fixed;inset:0;z-index:10;pointer-events:none;display:none}
#room-banner{position:absolute;top:1.6rem;left:50%;transform:translateX(-50%);text-align:center}
#room-name{font-family:var(--serif);font-size:1rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);text-shadow:0 0 20px rgba(200,169,110,.45)}
#room-sub{font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin-top:3px}
#narrator{position:absolute;bottom:13%;left:50%;transform:translateX(-50%);width:min(600px,86vw);text-align:center;font-size:.98rem;line-height:1.85;color:rgba(232,220,200,.88);font-style:italic;text-shadow:0 0 40px rgba(0,0,0,1),0 2px 20px rgba(0,0,0,.9);opacity:0;white-space:pre-line}
#progress{position:absolute;top:50%;right:1.6rem;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center}
.pdot{position:relative;display:flex;flex-direction:column;align-items:center}
.din{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(200,169,110,.18);transition:all .6s}
.pdot.active .din{background:var(--gold);box-shadow:0 0 14px rgba(200,169,110,.75);border-color:var(--gold);transform:scale(1.35)}
.pdot.visited .din{background:rgba(200,169,110,.3);border-color:rgba(200,169,110,.35)}
.dlabel{font-size:.56rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin-top:3px;opacity:0;transition:opacity .3s;white-space:nowrap}
.pdot.active .dlabel{opacity:1;color:var(--gold)}
.pline{width:1px;height:36px;background:linear-gradient(180deg,rgba(200,169,110,.2),rgba(200,169,110,.03));margin:3px 0}
#objectives{position:absolute;top:50%;left:1.6rem;transform:translateY(-50%)}
#obj-title{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin-bottom:.7rem}
.obi{display:flex;align-items:center;gap:.45rem;margin-bottom:.5rem;font-size:.75rem;color:var(--dim);transition:color .4s}
.obi.done{color:var(--text)}
.och{font-size:.68rem;color:var(--dim);width:13px;display:inline-block;transition:color .4s}
.obi.done .och{color:var(--gold)}
#discovery-flash{position:absolute;top:36%;left:50%;transform:translate(-50%,-50%);font-family:var(--serif);font-size:1.05rem;letter-spacing:.2em;color:var(--gold);text-shadow:0 0 30px rgba(200,169,110,.65);text-transform:uppercase;opacity:0;pointer-events:none}
#hint{position:absolute;bottom:1.8rem;left:50%;transform:translateX(-50%);font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(200,169,110,.28)}

/* COMPLETION */
#completion-banner{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;background:var(--glass);border:1px solid var(--glass-b);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-radius:var(--r);padding:3rem 4rem;display:none;flex-direction:column;align-items:center;gap:1rem}
.ca{font-size:2.2rem;color:var(--gold);animation:spin 12s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.ct{font-family:var(--serif);font-size:1.7rem;letter-spacing:.15em;color:var(--gold)}
.cs{font-size:.78rem;letter-spacing:.1em;color:var(--dim)}

/* INFO PANEL */
#info-panel{position:fixed;left:0;bottom:0;right:0;top:0;z-index:15;pointer-events:none;display:flex;align-items:flex-end;padding:0 0 2.4rem 2.4rem}
.pi{display:none;flex-direction:column;gap:.7rem;width:min(360px,88vw);background:var(--glass);border:1px solid var(--glass-b);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-radius:var(--r);padding:1.5rem 1.7rem;pointer-events:all;box-shadow:0 30px 70px rgba(0,0,0,.75),inset 0 1px 0 rgba(200,169,110,.08)}
.ph{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid rgba(200,169,110,.1);padding-bottom:.7rem}
#pt{font-family:var(--serif);font-size:1rem;color:var(--gold);letter-spacing:.06em}
#pp{font-size:.65rem;color:var(--dim);letter-spacing:.08em}
.pdesc{font-size:.82rem;line-height:1.75;color:var(--dim)}
.pex{font-size:.76rem;line-height:1.8;color:rgba(232,220,200,.55);font-style:italic;display:none}
.pm{display:flex;flex-direction:column;gap:.26rem;font-size:.68rem;color:rgba(200,169,110,.42);letter-spacing:.04em}
.pa{display:flex}
.bm{background:transparent;border:1px solid rgba(200,169,110,.22);color:var(--gold-lo);font-family:var(--font);font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;padding:.4rem .9rem;border-radius:3px;cursor:pointer;transition:all .25s;pointer-events:all}
.bm:hover{border-color:var(--gold);color:var(--gold);background:rgba(200,169,110,.06)}

/* CROSSHAIR */
#ch{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:20}
.cd{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.45);transition:all .2s}
.cr{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;border:1px solid rgba(255,255,255,.18);transition:all .25s cubic-bezier(.4,0,.2,1)}
#ch.on .cd{background:var(--gold);transform:translate(-50%,-50%) scale(1.6)}
#ch.on .cr{border-color:var(--gold);width:30px;height:30px;box-shadow:0 0 14px rgba(200,169,110,.55)}
</style>

<!-- OVERLAY -->
<div id="overlay">
  <div class="obg"></div>
  <div class="oc">
    <div class="ey">Experiencia Inmersiva</div>
    <h1 class="ot">ÍBEROS</h1>
    <div class="od"></div>
    <p class="oq">Tres salas. Tres mundos.<br>Una civilización olvidada.</p>
    <div class="oa">
      <button class="btn-p" id="btn-explore"><span>⚔</span> Explorar Libremente</button>
      <button class="btn-s" id="btn-tour"><span>▶</span> Tour Guiado</button>
    </div>
    <div class="ok">
      <div class="ki"><kbd>W A S D</kbd> Moverse</div>
      <div class="ki"><kbd>🖱</kbd> Mirar</div>
      <div class="ki"><kbd>ESC</kbd> Pausa</div>
    </div>
  </div>
  <div class="of">Los íberos. Primeros guerreros de la Península.</div>
</div>

<!-- HUD -->
<div id="hud">
  <div id="room-banner">
    <div id="room-name"> </div>
    <div id="room-sub"> </div>
  </div>
  <div id="narrator"> </div>
  <div id="progress">
    ${ROOM_ORDER.map((id, i) => `
      <div class="pdot" data-room="${id}" id="dot-${id}">
        <div class="din"></div>
        <div class="dlabel">${ROOMS[id].name}</div>
      </div>
      ${i < ROOM_ORDER.length - 1 ? '<div class="pline"></div>' : ''}
    `).join('')}
  </div>
  <div id="objectives">
    <div id="obj-title">🎯 Artefactos</div>
    ${EXHIBITS_DATA.map(e => `
      <div class="obi" id="obj-${e.id}">
        <span class="och">○</span>
        <span>${e.title}</span>
      </div>
    `).join('')}
  </div>
  <div id="discovery-flash"></div>
  <div id="hint">WASD · Ratón para mirar · ESC pausa</div>
  <div id="completion-banner">
    <div class="ca">✦</div>
    <div class="ct">Viaje Completado</div>
    <div class="cs">Has desvelado los secretos íberos</div>
  </div>
</div>

<!-- INFO PANEL -->
<div id="info-panel">
  <div class="pi" id="panel-inner">
    <div class="ph">
      <span id="pt"> </span>
      <span id="pp"> </span>
    </div>
    <div class="pdesc" id="pd"> </div>
    <div class="pex" id="pe"> </div>
    <div class="pm">
      <span id="ploc"> </span>
      <span id="pmat"> </span>
    </div>
    <div class="pa">
      <button class="bm" id="btn-mode">Modo Experto</button>
    </div>
  </div>
</div>

<!-- CROSSHAIR -->
<div id="ch"><div class="cd"></div><div class="cr"></div></div>
`);

// UI refs
const overlayEl   = document.getElementById('overlay');
const hudEl       = document.getElementById('hud');
const narratorEl  = document.getElementById('narrator');
const roomNameEl  = document.getElementById('room-name');
const roomSubEl   = document.getElementById('room-sub');
const panelInner  = document.getElementById('panel-inner');
const chEl        = document.getElementById('ch');
const btnMode     = document.getElementById('btn-mode');
let expertMode    = false;
let currentMeta   = null;

btnMode.addEventListener('click', () => {
  expertMode = !expertMode;
  btnMode.textContent = expertMode ? 'Modo Explorador' : 'Modo Experto';
  document.getElementById('pd').style.display = expertMode ? 'none' : '';
  document.getElementById('pe').style.display = expertMode ? '' : 'none';
  gsap.fromTo(btnMode, { scale: 0.9 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
});

function showInfoPanel(meta) {
  if (currentMeta === meta) return;
  currentMeta = meta;
  document.getElementById('pt').textContent = meta.title;
  document.getElementById('pp').textContent = meta.period;
  document.getElementById('pd').textContent = meta.shortDesc;
  document.getElementById('pe').textContent = meta.expertDesc;
  document.getElementById('ploc').textContent = `📍 ${meta.location}`;
  document.getElementById('pmat').textContent = `🏺 ${meta.material}`;
  document.getElementById('pd').style.display = expertMode ? 'none' : '';
  document.getElementById('pe').style.display = expertMode ? '' : 'none';
  panelInner.style.display = 'flex';
  gsap.fromTo(panelInner, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.3)' });
}

function hideInfoPanel() {
  if (!currentMeta) return;
  currentMeta = null;
  gsap.to(panelInner, { opacity: 0, y: 12, scale: 0.97, duration: 0.3, ease: 'power2.in', onComplete: () => { panelInner.style.display = 'none'; } });
}

function updateCrosshair(on) {
  chEl.classList.toggle('on', on);
}

function updateHUDRoom(roomId) {
  const r = ROOMS[roomId];
  gsap.to([roomNameEl, roomSubEl], {
    opacity: 0, y: -8, duration: 0.3,
    onComplete: () => {
      roomNameEl.textContent = r.name;
      roomSubEl.textContent  = r.subtitle;
      gsap.fromTo([roomNameEl, roomSubEl], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 });
    }
  });
  const order = ROOM_ORDER.indexOf(roomId);
  ROOM_ORDER.forEach((id, i) => {
    const dot = document.getElementById(`dot-${id}`);
    if (!dot) return;
    dot.classList.toggle('active',  i === order);
    dot.classList.toggle('visited', i < order);
  });
  // fade out hint
  gsap.to(document.getElementById('hint'), { opacity: 0, delay: 8, duration: 2 });
}

function showNarrator(text) {
  gsap.killTweensOf(narratorEl);
  narratorEl.textContent = text;
  gsap.fromTo(narratorEl,
    { opacity: 0, y: 8 },
    {
      opacity: 1, y: 0, duration: 1.2,
      onComplete: () => gsap.to(narratorEl, { opacity: 0, duration: 1.5, delay: 7 }),
    }
  );
  narrate(text);
}

function narrate(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text.replace(/\n/g, ' '));
  utter.lang = 'es-ES'; utter.pitch = 0.6; utter.rate = 0.82; utter.volume = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// ════════════════════════════════════════════════════════════
// OVERLAY LOGIC
// ════════════════════════════════════════════════════════════
document.getElementById('btn-explore').addEventListener('click', () => {
  initAudio();
  gsap.to(overlayEl, {
    opacity: 0, duration: 0.7,
    onComplete: () => {
      overlayEl.style.display = 'none';
      hudEl.style.display = 'block';
      applyRoom('origen', true);
      currentRoom = 'origen';
      // Show click-to-start prompt — required by browser PointerLock API
      const cts = document.getElementById('click-to-start');
      if (cts) { cts.style.display='flex'; gsap.fromTo(cts,{opacity:0},{opacity:1,duration:0.5}); }
    }
  });
});

document.getElementById('btn-tour').addEventListener('click', () => {
  initAudio();
  gsap.to(overlayEl, {
    opacity: 0, duration: 0.7,
    onComplete: () => {
      overlayEl.style.display = 'none';
      hudEl.style.display = 'block';
      startNarrativeTour();
    }
  });
});

// Click anywhere → lock pointer (browser requires this step)
document.addEventListener('click', (e) => {
  const cts = document.getElementById('click-to-start');
  // Only lock if CTS prompt is visible and not clicking a UI button
  if (cts && cts.style.display !== 'none' && cts.style.display !== '') {
    gsap.to(cts, { opacity: 0, duration: 0.3, onComplete: () => cts.style.display='none' });
    controls.lock();
  }
  // Also lock from pause menu resume
  const pm = document.getElementById('pause-menu');
  if (pm && pm.style.display !== 'none' && e.target.id === 'btn-resume') {
    hidePauseMenu();
    controls.lock();
  }
});

controls.addEventListener('lock', () => {
  const cts = document.getElementById('click-to-start');
  if (cts) cts.style.display = 'none';
  hidePauseMenu();
});

controls.addEventListener('unlock', () => {
  if (narrativePlaying) return; // Don't interrupt tour
  // Show PAUSE MENU (not full overlay)
  showPauseMenu();
});

// ════════════════════════════════════════════════════════════
// NARRATIVE TOUR — GSAP Timeline
// ════════════════════════════════════════════════════════════
let narrativePlaying = false;

function startNarrativeTour() {
  narrativePlaying = true;
  applyRoom('origen', true);
  currentRoom = 'origen';

  const waypoints = [
    { pos: { x: 0, y: 1.6, z: 4.5 },  room: 'origen',  delay: 0    },
    { pos: { x: 0, y: 1.6, z: 0 },    room: 'origen',  delay: 5    },
    { pos: { x: 0, y: 1.6, z: -18 },  room: 'guerra',  delay: 12   },
    { pos: { x: 0, y: 1.6, z: -28 },  room: 'guerra',  delay: 20   },
    { pos: { x: 0, y: 1.6, z: -42 },  room: 'ritual',  delay: 28   },
    { pos: { x: 0, y: 1.6, z: -56 },  room: 'ritual',  delay: 36   },
    { pos: { x: 1.5, y: 3.0, z: -50}, room: 'ritual',  delay: 44   },
  ];

  let lastRoom = 'origen';
  const tl = gsap.timeline({
    onComplete: () => {
      narrativePlaying = false;
      overlayEl.style.display = 'flex';
      gsap.fromTo(overlayEl, { opacity: 0 }, { opacity: 1, duration: 0.8 });
    }
  });

  waypoints.forEach((wp, i) => {
    tl.to(camera.position, {
      x: wp.pos.x, y: wp.pos.y, z: wp.pos.z,
      duration: i === 0 ? 1.5 : 8,
      ease: 'power1.inOut',
      onStart: () => {
        if (wp.room !== lastRoom) {
          lastRoom = wp.room;
          applyRoom(wp.room);
          currentRoom = wp.room;
        }
      }
    }, wp.delay);
  });
}

// ════════════════════════════════════════════════════════════
// RENDER LOOP
// ════════════════════════════════════════════════════════════
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  if (!narrativePlaying) {
    movePlayer();
    if (controls.isLocked) detectAndTransition();
  }

  // Rotate exhibits
  exhibitObjects.forEach(ex => {
    ex.rotGroup.rotation.y += 0.005;
  });

  // Flicker torches
  flickerFlames(t);

  // Particles float
  if (pMat.opacity > 0.01) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pPositions[i3]     += pVels[i].x + Math.sin(t * 0.5 + i) * 0.0008;
      pPositions[i3 + 1] += pVels[i].y;
      pPositions[i3 + 2] += pVels[i].z;
      if (pPositions[i3 + 1] > 7.5) pPositions[i3 + 1] = 0.1;
    }
    pGeo.attributes.position.needsUpdate = true;
  }

  // Exhibit interaction
  checkInteraction();

  composer.render();
}

animate();

// ════════════════════════════════════════════════════════════
// RESIZE
// ════════════════════════════════════════════════════════════
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
});
