# IMPLEMENTATION — Los Íberos Museo Virtual

## Arquitectura actual

- `index.html`: punto de entrada.
- `main.js`: experiencia 3D principal.
- `landing.js`: capa/landing de entrada.
- `style.css`: estilos existentes.
- `public/`: recursos públicos.
- `src/`: código adicional existente; revisar antes de modificar.

## Principio

La implementación debe ser incremental y mínima: preservar lo que funciona, cambiar únicamente lo necesario y validar cada paso.

## Flujo de ejecución esperado

1. Carga de la landing.
2. Usuario selecciona entrada.
3. Se oculta/elimina la landing.
4. Se activa la experiencia 3D existente.
5. Usuario recorre las salas.
6. Transiciones y elementos interactivos funcionan sin errores.

## Orden de implementación

1. Auditar.
2. Localizar el problema exacto.
3. Definir la tarea.
4. Comprobar assets y dependencias.
5. Aplicar el cambio mínimo.
6. Ejecutar build.
7. Validar en navegador.
8. Desplegar en Vercel.
9. Verificar producción.
10. Actualizar documentación.

## Restricciones

- No reescribir la experiencia 3D completa para solucionar un problema puntual.
- No sustituir assets sin comprobar primero los existentes.
- No dar por terminado un cambio porque compile: debe probarse el comportamiento.
- No desplegar una versión no validada.
- No trabajar sobre una rama distinta de la objetivo sin dejarlo documentado.
