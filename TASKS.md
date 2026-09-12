# TASKS — Los Íberos Museo Virtual

## Flujo obligatorio

`TODO → IN PROGRESS → READY → VALIDATED → DEPLOYED`

## Backlog de implementación

### T01 — Auditar base actual
- Estado: `VALIDATED`
- Objetivo: conocer exactamente qué existe antes de tocar código.
- Resultado: Vite + Three.js + GSAP; landing histórica en `landing.js`; experiencia 3D Antigravity en `main.js`.

### T02 — Inventariar assets
- Estado: `TODO`
- Objetivo: identificar modelos, texturas, imágenes, audio y fuentes realmente utilizados.
- Validación: ninguna ruta rota y cada asset con uso identificado.

### T03 — Integrar landing histórica + entrada
- Estado: `READY`
- Objetivo: usar la referencia histórica de Vercel y conectarla con la experiencia Antigravity.
- Implementado: `landing.js` + `landing-theme.css` + entrada a `#btn-explore`.
- Validación pendiente: clic → transición → museo visible en desktop y móvil.

### T04 — Controles táctiles + tres salas
- Estado: `READY`
- Objetivo: mantener las tres salas Antigravity y hacerlas navegables en móvil.
- Implementado: joystick virtual, arrastre derecho para mirar, botón de interacción y puente para PointerLockControls.
- Validación pendiente: movimiento, mirada, interacción y cambio de sala en dispositivo real/emulación táctil.

### T05 — Build limpio
- Estado: `TODO`
- Objetivo: producir un build reproducible.
- Validación: `npm run build` sin errores.

### T06 — Validación navegador
- Estado: `TODO`
- Objetivo: probar desktop y móvil.
- Validación: consola sin errores críticos, landing usable y experiencia 3D cargando.

### T07 — Deploy producción
- Estado: `TODO`
- Objetivo: desplegar la versión validada desde `main`.
- Validación: Vercel `READY` + URL de producción comprobada.

### T08 — Cierre documental
- Estado: `IN PROGRESS`
- Objetivo: mantener `STATUS.md`, `AUDIT.md`, `ASSETS.md` e `IMPLEMENTATION.md` alineados con el estado real.

## Definition of Done

Una tarea solo pasa a `DEPLOYED` cuando código, assets, build, navegador y deployment han sido comprobados.
