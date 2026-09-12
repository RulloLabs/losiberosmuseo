# DEPLOY — Los Íberos Museo Virtual

## Checklist obligatorio

### Antes de desplegar
- [ ] AUDIT.md actualizado.
- [ ] STATUS.md actualizado.
- [ ] TASKS.md actualizado.
- [ ] IMPLEMENTATION.md actualizado.
- [ ] ASSETS.md comprobado.
- [ ] Código revisado.
- [ ] Build ejecutado correctamente.
- [ ] Flujo principal validado en navegador.
- [ ] Consola revisada.

### GitHub
- [ ] Cambios en la rama objetivo.
- [ ] Commit claro y trazable.
- [ ] Push realizado.
- [ ] SHA comprobado.

### Vercel
- [ ] Deployment creado desde la rama objetivo.
- [ ] Estado `READY`.
- [ ] URL de deployment identificada.
- [ ] URL de producción comprobada.

### Después del deploy
- [ ] Landing carga.
- [ ] CTA de entrada funciona.
- [ ] Experiencia 3D carga.
- [ ] Tres salas accesibles.
- [ ] No hay errores críticos de consola.
- [ ] STATUS actualizado.
- [ ] TASKS actualizado a `DEPLOYED` donde corresponda.

## Regla de rollback

Si producción falla o una regresión rompe una funcionalidad existente, detener nuevas implementaciones, identificar el commit causante y restaurar la última versión validada antes de continuar.
