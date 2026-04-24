@AGENTS.md

# Reglas de trabajo para Claude

## Flujo obligatorio
1. **Leer primero** — antes de editar cualquier archivo, léelo completo con Read.
2. **Solución completa** — entregar el cambio terminado, no fragmentos ni "continúa tú".
3. **Probar una vez** — si hay tests o build, ejecutarlos; si pasan, listo.
4. **Sin sobre-ingeniería** — no abstraer, no refactorizar fuera del scope pedido, no agregar features no solicitadas.

## Idioma
Responder en **español** salvo que el usuario pida otro idioma.

## Sanity (estado actual)
- Studio hosteado: `redshell.sanity.studio`
- `basePath: "/studio"` en `sanity.config.ts` (no remover)
- `projectId: "l2dq4e3s"`, `dataset: "production"` hardcodeados en `sanity.config.ts` y `sanity.cli.ts`
- `/studio` en Next.js redirige a `https://redshell.sanity.studio`
- Tras cambios en `sanity.config.ts`, ejecutar `npx sanity deploy` para actualizar el studio hosteado

