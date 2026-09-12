# STATUS — Los Íberos Museo Virtual

Última actualización: 2026-09-12
Rama: `main`

| Área | Estado | Observación |
|---|---|---|
| Repositorio | 🟢 | GitHub `main` operativo |
| Vite | 🟢 | Configurado en `package.json` |
| Three.js | 🟢 | Motor 3D presente |
| Salas 3D | 🟢 | Antigravity: Origen, Guerreros y Ritual |
| Postprocesado | 🟢 | Bloom + viñeta |
| Landing histórica | 🟢 | Integrada desde la referencia de Vercel |
| Fondo landing | 🟢 | Gris neutro restaurado |
| Entrada landing → museo | 🟢 | La landing carga antes de la experiencia inmersiva |
| Controles táctiles | 🟢 | Joystick + arrastre para mirar + acción |
| Mobile performance | 🟢 | DPR limitado y controles sin Pointer Lock nativo |
| Assets | 🟡 | Inventario fino pendiente |
| Build | 🟡 | Pendiente de validación en CI/Vercel tras los últimos cambios |
| Vercel | 🟡 | Esperando deployment de este commit |
| Producción final | 🟡 | Falta smoke test visual desktop + móvil |

## Base de implementación

**Vercel histórico → Antigravity**. Kimi se considera referencia intermedia, no fuente final.

## Objetivo inmediato

Validar build, deployment y flujo completo: landing gris → entrada → experiencia 3D → tres salas → interacción → móvil.
