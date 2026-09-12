# AUDIT — Los Íberos Museo Virtual

Fecha: 2026-09-12
Rama auditada: `main`
Repositorio: `RulloLabs/losiberosmuseo`

## 1. Resumen ejecutivo

El repositorio contiene una aplicación Vite/Three.js que funciona como experiencia inmersiva 3D y una landing visual añadida recientemente.

**Estado global: 🟡 FUNCIONAL EN BASE, PENDIENTE DE INTEGRACIÓN FINAL**

La landing está implementada en `landing.js` y se carga desde `index.html`. La experiencia 3D principal está en `main.js` y define tres salas: El Origen, Los Guerreros y El Ritual.

## 2. Base técnica detectada

- Vite 8
- Three.js 0.183.2
- GSAP 3.14.2
- JavaScript ES Modules
- WebGL + postprocesado
- PointerLockControls
- EffectComposer
- UnrealBloomPass
- ShaderPass / viñeta

## 3. Evidencias

- `index.html` carga `/main.js` y `/landing.js`.
- `main.js` inicializa renderer, cámara, escena y postprocesado.
- `main.js` contiene la definición de las tres salas.
- `landing.js` contiene hero, contexto, colecciones y CTA de experiencia inmersiva.
- La landing intenta salir y activar `#btn-explore` al pulsar cualquier CTA de entrada.

## 4. Riesgos / puntos a comprobar

- Confirmar que existe un elemento funcional con id `btn-explore` en la experiencia 3D. No aparece en la búsqueda del código de `main` realizada durante esta auditoría.
- Validar en navegador el flujo completo `landing → entrada → experiencia 3D`.
- Revisar assets reales y sus rutas; no asumir que los assets presentes son los definitivos.
- Ejecutar build antes de considerar cualquier cambio listo.
- Verificar Vercel después de cada despliegue.

## 5. Regla de implementación

No modificar código sin pasar primero por:

`AUDIT → STATUS → TASKS → IMPLEMENTATION → CODE → BUILD → VALIDATE → DEPLOY → VERIFY`

Cada cambio debe actualizar el estado y marcar la tarea correspondiente.
