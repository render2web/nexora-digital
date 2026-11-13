# Instrucciones de GitHub Copilot — Nexora Digital

## Visión General y Arquitectura

Sitio web corporativo estático de una sola página (Single-Page Website), organizado en múltiples secciones para la agencia tecnológica ficticia Nexora Digital.

- **Stack sin dependencias**: Construido exclusivamente con **HTML5 semántico**, **CSS3 moderno** (`Custom Properties`, `Flexbox`, `CSS Grid`, `clamp()`) y **JavaScript Vanilla (ES6+)**. No se deben introducir librerías externas, frameworks ni gestores de paquetes (`package.json`).
- **Puntos de entrada**:
  - `index.html`: Documento único estructurado en `<header>`, `<main>` (con las secciones `#inicio`, `#servicios`, `#tecnologias`, `#portafolio` y `#contacto`) y `<footer>`.
  - `css/styles.css`: Hoja de estilos única organizada por capas (Design Tokens en `:root`, Reset, Tipografía/Base, Layout, Componentes y Utilidades).
  - `js/main.js`: Script principal cargado con `defer`, modularizado por funciones inicializadoras dentro de `DOMContentLoaded` (navegación móvil, filtrado de portafolio, validación de formulario en cliente).
  - `PLAN_PROYECTO.md`: Documento rector que define las decisiones arquitectónicas y el plan de trabajo en 9 etapas.

## Flujo de Desarrollo Incremental (Regla Crítica)

El proyecto sigue un flujo **estrictamente incremental en 9 etapas** definido en `PLAN_PROYECTO.md` (consulta `README.md` para ver la etapa activa):

1. Presentación y planificación (`PLAN_PROYECTO.md`)
2. Estructura inicial (`index.html`, `css/styles.css`, `js/main.js`, `README.md`, `assets/`)
3. Encabezado, navegación y Hero
4. Generación e integración de imágenes (`assets/img/`, `assets/icons/`)
5. Servicios, tecnologías, portafolio y pie de página
6. Formularios e interactividad en JavaScript Vanilla
7. Responsive (`<= 1024px`, `<= 768px`, `<= 480px`), animaciones y optimización visual
8. Depuración, accesibilidad (WCAG AA) y pruebas
9. Revisión final, GitHub y publicación en GitHub Pages

**Importante**: Limita cualquier cambio estrictamente al alcance y archivos de la etapa solicitada. **No adelantes código, estilos ni funcionalidades de etapas posteriores** hasta que la etapa en curso haya sido verificada y aprobada. Al avanzar de etapa, mantén actualizado el estado en `README.md`.

## Ejecución y Verificación

No existen comandos de compilación (`build`), linters por CLI ni suites de tests automatizados.

- **Ejecución local**: Abrir `index.html` directamente en el navegador o servir el directorio raíz con un servidor estático (por ejemplo, `python -m http.server 8080` o Live Server).
- **Verificación por etapa**:
  - Comprobar en DevTools que las pestañas **Console** y **Network** tengan cero errores o recursos `404`.
  - Validar los criterios de aceptación específicos de la etapa activa descritos en la sección 4 de `PLAN_PROYECTO.md`.

## Convenciones Clave del Proyecto

- **Idioma**: Todo el contenido de la interfaz, comentarios de código, nombres de IDs de sección (`#inicio`, `#servicios`, `#tecnologias`, `#portafolio`, `#contacto`) y mensajes de validación deben estar en **español**.
- **Design Tokens obligatorios (`:root` en `css/styles.css`)**:
  - `--color-bg-primary`: `#0B1020` (fondo principal)
  - `--color-surface`: `#111B34` (superficies, tarjetas, header/footer)
  - `--color-accent-cyan`: `#22D3EE` (acento primario y anillos `:focus-visible`)
  - `--color-accent-violet`: `#8B5CF6` (acento secundario y degradados)
  - `--color-text-primary`: `#F8FAFC` (texto principal)
  - `--color-text-muted`: `#94A3B8` (texto secundario con contraste accesible > 4.5:1)
  - `--color-border`: `rgba(255, 255, 255, 0.08)`
- **Rutas compatibles con GitHub Pages**: Utiliza siempre **rutas relativas** que comiencen con `./` (por ejemplo, `./css/styles.css`, `./js/main.js`, `./assets/img/...`) y nunca rutas absolutas desde la raíz (`/css/...`), para que el sitio funcione al desplegarse en una subruta (`https://<usuario>.github.io/nexora-digital/`).
- **Rendimiento visual y accesibilidad**:
  - Evita `filter: blur()` pesados o sombras animadas; utiliza `radial-gradient` estáticos y anima únicamente `transform` y `opacity`, respetando `@media (prefers-reduced-motion: reduce)`.
  - Mantén `width` y `height` explícitos en imágenes para evitar CLS, Utiliza enlaces de anclaje que apunten a IDs existentes; aplica aria-labelledby para identificar regiones cuando corresponda y utiliza los atributos ARIA únicamente cuando aporten información accesible necesaria., estados `aria-expanded` en navegación móvil y mensajes de error vinculados con `aria-describedby` y `aria-live`.



## Reglas de Ejecución y Supervisión de GitHub Copilot

### Control Estricto de Etapas

- Antes de modificar archivos, consultar PLAN_PROYECTO.md y verificar el alcance de la etapa solicitada.
- Implementar exclusivamente las tareas autorizadas para la etapa activa.
- No anticipar componentes, estilos ni funcionalidades de etapas posteriores.
- No modificar decisiones arquitectónicas del plan sin aprobación del desarrollador.
- Preservar el código funcional de las etapas anteriores.
- No regenerar archivos completos cuando sea suficiente realizar modificaciones puntuales.
- Ante requisitos ambiguos que afecten la arquitectura, solicitar aclaración antes de implementar.

### Comportamiento del Agente

- Priorizar modificaciones mínimas, específicas y fáciles de revisar.
- Reutilizar las funciones, estilos y estructuras existentes cuando corresponda.
- No crear archivos, carpetas ni configuraciones innecesarias.
- No instalar dependencias ni ejecutar comandos destructivos sin autorización.
- No realizar commits, pushes ni publicaciones sin autorización explícita.
- Si una tarea presenta errores, investigar su causa antes de modificar el código.
- No declarar una tarea como completada sin verificar sus criterios de aceptación.

### Calidad del Código

- Utilizar nombres descriptivos y mantener consistencia con las convenciones existentes.
- Evitar duplicación de código y complejidad innecesaria.
- Mantener separadas la estructura HTML, la presentación CSS y la lógica JavaScript.
- Priorizar elementos HTML semánticos y accesibilidad nativa.
- Implementar interacciones compatibles con teclado y tecnologías de asistencia.
- No introducir credenciales, secretos ni información sensible en el código.
- El formulario de contacto tendrá validación del lado del cliente; no simular un envío real de mensajes sin un servicio configurado.
- Mantener compatibilidad con navegadores modernos y GitHub Pages.

### Validación y Entrega

Al finalizar una tarea:

1. Resumir los archivos creados o modificados.
2. Verificar que los cambios correspondan a la etapa actual.
3. Comprobar los criterios de aceptación aplicables.
4. Ejecutar las verificaciones disponibles sin instalar herramientas innecesarias.
5. Informar errores, limitaciones o comprobaciones pendientes.
6. No avanzar a la siguiente etapa sin autorización.

### Restricciones de Extensibilidad

- No implementar servidores MCP.
- No crear ni utilizar Skills personalizados.
- No crear agentes personalizados ni subagentes.
- No configurar hooks ni automatizaciones avanzadas de agentes.
- Utilizar únicamente las capacidades estándar de GitHub Copilot y las instrucciones existentes en este repositorio.

