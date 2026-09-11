export const EXHIBITS = [
  {
    id: 'vasija',
    room: 'origen',
    modelPath: '/models/vasija.glb',
    fallbackType: 'vessel',
    position: { x: 0, y: 0, z: 0 },
    rotation: { y: 0.3 },
    scale: 1.0,
    spotlight: { color: 0xffddaa, intensity: 12, angle: Math.PI / 7, penumbra: 0.6 },
    metadata: {
      title: 'Vasija Cerámica',
      period: 'S. V - III a.C.',
      shortDesc: 'Cerámica con decoración geométrica íbera.',
      expertDesc: `Las vasijas íberas son testimonio de una cultura vibrante y comercial. 
        Los motivos geométricos en bandas concéntricas reflejan influencias griegas y fenicias, 
        absorbidas y reinterpretadas con una identidad propia inconfundible. 
        Esta pieza fue hallada en el yacimiento de La Bastida (Murcia), fechada c. 350 a.C.`,
      location: 'Murcia, España',
      material: 'Arcilla cocida con engobe',
    },
    objective: true,
    guideLight: { color: 0xffffff, intensity: 3 },
  },
  {
    id: 'falcata',
    room: 'guerra',
    modelPath: '/models/falcata.glb',
    fallbackType: 'sword',
    position: { x: 0, y: 0, z: -25 },
    rotation: { y: 0 },
    scale: 1.0,
    spotlight: { color: 0xff4400, intensity: 15, angle: Math.PI / 8, penumbra: 0.9 },
    metadata: {
      title: 'Falcata Íbera',
      period: 'S. IV - II a.C.',
      shortDesc: 'La espada curva que aterrorizó a Roma.',
      expertDesc: `La falcata íbera es considerada una de las armas más letales de la Antigüedad. 
        Su geometría curva —inspirada en la kopis griega— concentra el peso en el filo, 
        generando cortes devastadores. Polibio y Tito Livio la mencionan con respeto. 
        Ejemplares hallados en necrópolis de Baza y Alcoy muestran decoración en damasquinado de plata.`,
      location: 'Baza, Granada',
      material: 'Hierro forjado, empuñadura de bronce',
    },
    objective: true,
    guideLight: { color: 0xff2200, intensity: 4 },
  },
  {
    id: 'urna',
    room: 'ritual',
    modelPath: '/models/urna.glb',
    fallbackType: 'urn',
    position: { x: 0, y: 0, z: -50 },
    rotation: { y: 0.8 },
    scale: 1.0,
    spotlight: { color: 0x9944ff, intensity: 18, angle: Math.PI / 6, penumbra: 1.0 },
    metadata: {
      title: 'Urna Funeraria',
      period: 'S. VI - IV a.C.',
      shortDesc: 'El recipiente del alma. Puente entre mundos.',
      expertDesc: `Las urnas cinerarias íberas son objetos de enorme carga simbólica. 
        Tras la cremación del guerrero, sus cenizas eran depositadas junto a sus armas y ofrendas. 
        La urna no era solo un recipiente: era la nueva morada del espíritu. 
        Los rituales de enterramiento íberos combinaban creencias locales con influencias mediterráneas 
        sobre la vida después de la muerte. Esta pieza procede de la necrópolis de Pozo Moro.`,
      location: 'Chinchilla, Albacete',
      material: 'Piedra caliza labrada',
    },
    objective: true,
    guideLight: { color: 0x6600ff, intensity: 5 },
  },
];
