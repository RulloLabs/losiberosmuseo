# STATUS — Los Íberos Museo Virtual

Última actualización: 2026-09-12
Rama: `feat/historic-landing-mobile`
PR: #2

| Área | Estado | Observación |
|---|---|---|
| Repositorio | 🟢 | GitHub `main` protegido de cambios directos durante esta fase |
| Vite | 🟢 | Configurado en `package.json` |
| Three.js | 🟢 | Motor 3D presente |
| Salas 3D | 🟢 | Antigravity: Origen, Guerreros y Ritual |
| Postprocesado | 🟢 | Bloom + viñeta |
| Landing histórica | 🟢 | Reconstruida a partir de la referencia histórica de Vercel |
| Fondo landing | 🟢 | Gris neutro restaurado |
| Entrada landing → museo | 🟢 | CTA conectado con `#btn-explore` |
| Controles táctiles | 🟢 | Joystick + arrastre para mirar + acción + ayuda |
| Mobile performance | 🟢 | DPR limitado; capa táctil sin Pointer Lock nativo |
| Assets | 🟡 | `hero-ibero.png` histórico detectado en Vercel pero no recuperado al árbol actual |
| Build | 🟡 | Validación local bloqueada por binding nativo de Rolldown en el entorno de auditoría |
| Vercel Preview | 🟡 | Pendiente confirmar deployment automático de PR #2 |
| Producción final | 🔴 | No promover hasta cerrar QA |

## Base de implementación

**Vercel histórico → Antigravity**. Kimi se considera referencia intermedia, no fuente final.

## Checkpoint actual

- [x] Landing implementada.
- [x] Fondo gris implementado.
- [x] Entrada a la experiencia conectada.
- [x] Controles táctiles implementados.
- [x] Guard de rendimiento móvil implementado.
- [x] PR #2 creado en draft.
- [ ] Build validado.
- [ ] QA desktop.
- [ ] QA móvil.
- [ ] Preview Vercel validado.
- [ ] Consolidación en `main`.
