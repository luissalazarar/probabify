# Probabify — contexto para agentes

## Producto

`¿Hasta dónde llegarías?` es un simulador narrativo, móvil y de escritorio, sobre una carrera política ficticia en el Perú. Cada partida combina origen, antecedente, decisiones, resultados probabilísticos, estadísticas, elecciones, expedientes y finales. Todos los personajes, partidos, medios y casos son ficticios, aunque el tono y los dilemas estén inspirados en la política peruana.

El objetivo no es premiar una ideología: cada opción debe tener una ventaja comprensible, un costo o riesgo coherente y consecuencias narrativas visibles. El español debe sonar peruano, directo y editorial, sin convertir a personas reales en personajes.

## Arquitectura

- Sitio estático sin framework ni dependencias de npm. No introducir Next.js, React, bundlers ni un backend salvo pedido explícito.
- `index.html`: interfaz principal del juego.
- `js/app.js`: renderizado, controles, guardado en `localStorage` y presentación de resultados.
- `js/engine.js`: estado, validación de datos, selección ponderada, requisitos, efectos, avance temporal y finales.
- `js/caseSystem.js`: expedientes y acciones relacionadas.
- `js/narrativeSystem.js`: texto de legado y relaciones narrativas.
- `data/config.js`: estadísticas visibles, ocultas, nacionales y contextos.
- `data/origins.js` y `data/backgrounds.js`: puntos de partida.
- `data/events/*.js`: eventos por etapa o tema. `data/events/index.js` reúne todos los eventos.
- `data/eventLogic.js`: puertas de trayectoria para eventos que exigen una posición concreta.
- `data/statCausality.js`, `data/narrativeCausality.js`, `data/specialCases.js` y `data/peruvianLore.js`: capas que enriquecen y validan los eventos.
- `data/endings.js` y `data/narrativeBanks.js`: finales y textos de cierre.
- `css/theme.css`: colores y tokens; `css/styles.css`: juego; `css/editorial.css`: páginas informativas.
- `vercel.json`: despliegue estático y rutas limpias.

## Contrato de eventos

- Cada `event`, `option` y `outcome` necesita un `id` globalmente único.
- Cada evento necesita `category`, `title`, `kicker`, `description` y al menos una opción.
- Cada resultado debe tener `headline` y `text`; `weight` controla su probabilidad.
- Usar `requirements` con un solo selector por nodo (`all`, `any`, `not`, `origin`, `background`, `age`, `stat`, `hidden`, `decision`, `outcome`, etc.).
- Los efectos públicos van en `effects`; reputación y causalidad interna en `hiddenEffects`; el país en `nationalEffects`.
- Las cadenas explícitas usan `nextEvent`; sus destinos deben existir. Marcar como `directedOnly: true` los eventos que solo pueden aparecer dentro de una cadena.
- Las historias únicas deben tener `maxOccurrences: 1` o pertenecer a `SINGLE_OCCURRENCE_EVENTS` en `data/narrativeCausality.js`.
- Todo evento nuevo debe aparecer exactamente una vez en `THEME_EVENTS` de `data/peruvianLore.js`; la carga falla si falta o está duplicado.
- Si se añade un evento exclusivo aleatorio de un origen, actualizar `exclusiveEvents` en `data/origins.js`. No es necesario para eventos `directedOnly` alcanzados por `nextEvent`.
- Mantener equilibrados aceptación, influencia, dinero, riesgo, ideología y estadísticas ocultas. Una decisión agresiva puede aumentar notoriedad mientras reduce credibilidad o reputación.
- Los memes, titulares y reacciones públicas deben traducirse a efectos reales del juego, no quedarse solo en el texto.

## Cadenas narrativas relevantes

La entrada del podcaster es:

`antecedente -> podcaster-lanzamiento -> podcast-ruta-{ideologica|sensacional|independiente}`

La relación con la influencer continúa desde cualquiera de esas tres rutas:

`podcaster-relacion-influencer -> podcaster-infidelidad-influencer`

Preservar esta secuencia cuando se edite cualquiera de esos eventos.

## Interfaz y contenido

- Reutilizar los componentes y estilos existentes; no añadir una librería visual.
- Conservar modo claro/oscuro, accesibilidad básica, controles táctiles y diseño responsive.
- Escapar cualquier dato introducido por el usuario antes de insertarlo en HTML.
- El juego se guarda bajo `probabify-save-v2`. Si cambia de forma incompatible el estado persistido, crear una migración en `GameEngine.migrateLoadedState` y considerar una nueva versión de la clave.
- No usar nombres o acusaciones que identifiquen a personas reales. Mantener el aviso de ficción.

## Validación y publicación

- No iniciar servidores locales. El usuario trabaja sobre la web publicada.
- Validar el modelo sin servidor con:

  `node --input-type=module -e "import { GameEngine } from './js/engine.js'; new GameEngine({ seed: 'qa' }); console.log('Datos válidos');"`

- Para cadenas nuevas, crear una comprobación temporal con `GameEngine.start`, `forceEvent` y `choose`, y confirmar eventos, tags, efectos e historial. No dejar scripts temporales en el repositorio.
- Revisar `git diff --check` y `git status` antes de publicar.
- GitHub es la fuente de verdad. `main` despliega el sitio estático mediante Vercel; para publicar, confirmar los cambios y hacer `git push origin main`.
- Después del push, verificar que `origin/main` contiene el commit. Si no se dispone de acceso al panel o a la URL de producción, informar que la validación visible de Vercel queda pendiente; nunca afirmar que el despliegue terminó sin evidencia.
- No incluir `.vercel`, secretos, archivos de entorno ni artefactos locales.

## Disciplina de cambios

- Leer primero este archivo y solo los módulos directamente relacionados con el pedido.
- Preservar cambios del usuario y evitar refactors no solicitados.
- Mantener diffs pequeños y datos legibles; no comprimir eventos nuevos en líneas gigantes.
- No modificar el servidor de QA ni ejecutar una vista local salvo pedido explícito posterior.
- Al entregar, resumir archivos cambiados, validaciones ejecutadas, commit/push y cualquier verificación externa pendiente.
