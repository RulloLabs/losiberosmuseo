# TASKS — Los Íberos Museo Virtual

## Flujo obligatorio

`TODO → IN PROGRESS → READY → VALIDATED → DEPLOYED`

## Backlog de implementación

### T01 — Auditar base actual
- Estado: `VALIDATED`
- Objetivo: conocer exactamente qué existe antes de tocar código.
- Resultado: Vite + Three.js + GSAP; landing en `landing.js`; experiencia 3D en `main.js`.

### T02 — Inventariar assets
- Estado: `TODO`
- Objetivo: identificar modelos, texturas, imágenes, audio y fuentes realmente utilizados.
- Validación: ninguna ruta rota y cada asset con uso identificado.

### T03 — Validar entrada desde landing
- Estado: `TODO`
- Objetivo: garantizar que los botones de entrada llevan realmente a la experiencia 3D.
- Base: `landing.js` elimina la landing y ejecuta `#btn-explore`.
- Validación: clic → transición → museo visible → controles operativos.

### T04 — Validar tres salas
- Estado: `TODO`
- Objetivo: comprobar El Origen, Los Guerreros y El Ritual.
- Validación: navegación, cámara, iluminación, fog, bloom y transición sin errores.

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
- Estado: `TODO`
- Objetivo: actualizar `STATUS.md`, `AUDIT.md`, `ASSETS.md` e `IMPLEMENTATION.md` con el resultado real.

## Definition of Done

Una tarea solo pasa a `DEPLOYED` cuando código, assets, build, navegador y deployment han sido comprobados.
