# Plan de Arquitectura y Desarrollo: Sitio Corporativo Nexora Digital

## 1. Visión General y Enfoque Propuesto
Desarrollar un sitio web corporativo tipo Single-Page Application estática (Landing Page multi-sección) para la agencia tecnológica ficticia **Nexora Digital**, construido exclusivamente con **HTML5 semántico**, **CSS3 moderno (Custom Properties, Flexbox, CSS Grid)** y **JavaScript Vanilla (ES6+)** sin dependencias externas ni frameworks.

El desarrollo seguirá un flujo **estrictamente incremental en 9 etapas**, donde cada etapa construye sobre los artefactos validados de la etapa anterior sin adelantar código ni funcionalidades de fases posteriores.

---

## 2. Estructura de Carpetas Propuesta

```text
nexora-digital/
├── PLAN_PROYECTO.md          # Documento rector de arquitectura y planificación por etapas
├── index.html                # Documento principal con estructura semántica HTML5
├── css/
│   └── styles.css            # Hoja de estilos única organizada por capas (Tokens, Base, Layout, Componentes, Utilidades)
├── js/
│   └── main.js               # Script principal modularizado por responsabilidades (Navegación, UI, Validación)
├── assets/
│   ├── img/                  # Imágenes optimizadas (hero, portafolio, ilustraciones tecnológicas)
│   └── icons/                # Iconografía SVG inline o local y favicon
└── README.md                 # Documentación del proyecto, arquitectura y despliegue
```

---

## 3. Decisiones Arquitectónicas y de Diseño

1. **Arquitectura CSS basada en Design Tokens (`:root`)**:
   - **Paleta de colores oficial**:
     - Fondo principal: `#0B1020` (`--color-bg-primary`)
     - Superficies / Tarjetas: `#111B34` (`--color-surface`)
     - Acento Cian: `#22D3EE` (`--color-accent-cyan`)
     - Acento Violeta: `#8B5CF6` (`--color-accent-violet`)
     - Texto Principal: `#F8FAFC` (`--color-text-primary`)
     - Texto Secundario (derivado accesible): `#94A3B8` (`--color-text-muted`)
   - **Tipografía**: Pila tipográfica moderna sin bloqueo de renderizado (`Inter`, `Plus Jakarta Sans` o `system-ui, -apple-system, sans-serif`) con escalas fluidas mediante `clamp()`.
   - **Efectos visuales controlados**: Bordes translúcidos sutiles (`rgba(255, 255, 255, 0.08)`), degradados lineales/radiales discretos entre `#22D3EE` y `#8B5CF6`, y sombras suaves sin sobrecargar la GPU.

2. **HTML5 Semántico y SEO On-Page**:
   - Uso estricto de etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
   - Jerarquía de encabezados única (`<h1>` en Hero, `<h2>` por sección, `<h3>` en tarjetas).
   - Metadatos completos (title, description, Open Graph básico, viewport y favicon).

3. **JavaScript Vanilla Desacoplado y Seguro**:
   - Ejecución con atributo `defer` para no bloquear el parseo del DOM.
   - Encapsulamiento por funciones puras e inicializadores de módulos (navegación móvil, filtrado o vista de proyectos, validación de formulario en cliente con feedback accesible `aria-live`).
   - Sin librerías de terceros.

---

## 4. Planificación Incremental en 9 Etapas

### Etapa 1: Presentación y planificación
- **Objetivo**: Definir la arquitectura técnica, los tokens de diseño, la estructura de directorios, los estándares de calidad y la hoja de ruta incremental del proyecto, documentándolo en `PLAN_PROYECTO.md` en la raíz del proyecto.
- **Archivos involucrados**: `PLAN_PROYECTO.md`.
- **Funcionalidades que se implementarán**:
  - Definición de arquitectura HTML5/CSS3/JS.
  - Especificación del sistema de diseño (colores, tipografía, espaciados, contenedores).
  - Mapa de secciones y criterios de calidad por etapa.
- **Dependencias con etapas anteriores**: Ninguna (etapa inicial).
- **Criterios de aceptación**:
  - Plan documentado en `PLAN_PROYECTO.md` con las 9 etapas detalladas, riesgos identificados y estructura de archivos clara.
  - Repositorio limpio sin código adelantado de las etapas siguientes.
- **Procedimiento básico de verificación**:
  - Revisión del archivo `PLAN_PROYECTO.md` en la raíz del proyecto y confirmación del usuario antes de pasar a la Etapa 2.

---

### Etapa 2: Estructura inicial con Agent Mode
- **Objetivo**: Crear el esqueleto de carpetas y archivos base del proyecto con la configuración de Design Tokens CSS, reset moderno y marcadores semánticos de las 7 secciones.
- **Archivos involucrados**:
  - `index.html`
  - `css/styles.css`
  - `js/main.js`
  - `README.md`
  - Directorios `assets/img/` y `assets/icons/`
- **Funcionalidades que se implementarán**:
  - Documento `index.html` con metadatos SEO base, enlaces a `css/styles.css` y `js/main.js` (`defer`), y contenedores semánticos vacíos/titulados para las 7 secciones del sitio.
  - Variables CSS (`:root`) en `css/styles.css` con la paleta exacta (`#0B1020`, `#111B34`, `#22D3EE`, `#8B5CF6`, `#F8FAFC`), reset de estilos, tipografía base y clases utilitarias de contenedor (`.container`, `.section`).
  - Punto de entrada `DOMContentLoaded` limpio en `js/main.js`.
- **Dependencias con etapas anteriores**: Etapa 1 aprobada.
- **Criterios de aceptación**:
  - La estructura de carpetas coincide exactamente con el diseño arquitectónico.
  - El navegador carga `index.html` con el fondo `#0B1020` y texto `#F8FAFC`, sin errores en la consola.
  - No existe contenido detallado ni lógica de etapas posteriores.
- **Procedimiento básico de verificación**:
  - Abrir `index.html` en el navegador, inspeccionar la carga correcta de hojas de estilo y script en DevTools (pestañas Network y Console sin errores 404 ni excepciones).

---

### Etapa 3: Encabezado, navegación y Hero
- **Objetivo**: Implementar la barra de navegación superior fija/pegajosa y la sección principal de bienvenida (Hero) con propuesta de valor y llamadas a la acción (CTA).
- **Archivos involucrados**:
  - `index.html`
  - `css/styles.css`
- **Funcionalidades que se implementarán**:
  - `<header>` con logotipo tipográfico/SVG de Nexora Digital, menú de navegación con enlaces de anclaje (`#servicios`, `#tecnologias`, `#portafolio`, `#contacto`), botón CTA principal y botón hamburguesa preparado con atributos ARIA (`aria-expanded`, `aria-controls`).
  - Sección Hero con badge tecnológico, título principal `<h1>` con acento en degradado cian-violeta, subtítulo descriptivo, grupo de botones CTA (primario y secundario), indicadores clave (métricas de agencia) y contenedor reservado para el recurso visual del Hero.
- **Dependencias con etapas anteriores**: Etapa 2 (variables CSS, layout base y contenedores semánticos).
- **Criterios de aceptación**:
  - El encabezado mantiene contraste adecuado sobre `#0B1020` con efecto superficie translúcida sutil.
  - El Hero comunica claramente la identidad de Nexora Digital y respeta la jerarquía visual.
  - Los enlaces de navegación apuntan a los IDs semánticos de cada sección.
- **Procedimiento básico de verificación**:
  - Verificar visualmente en escritorio el alineamiento del Header y Hero, probar clic en enlaces de anclaje y comprobar estados `:hover` y `:focus-visible`.

---

### Etapa 4: Generación e integración de imágenes
- **Objetivo**: Dotar al sitio de recursos gráficos optimizados y coherentes con la estética tecnológica cian/violeta sobre fondo oscuro, integrándolos en el Hero y dejándolos listos para el Portafolio.
- **Archivos involucrados**:
  - `assets/icons/favicon.svg`
  - `assets/img/hero-visual.svg` (o PNG/WebP generado)
  - `assets/img/project-1.svg`, `assets/img/project-2.svg`, `assets/img/project-3.svg` (o imágenes generadas equivalentes)
  - `index.html`
  - `css/styles.css`
- **Funcionalidades que se implementarán**:
  - Creación/generación de ilustraciones o composiciones visuales tecnológicas para el Hero y las tarjetas de proyectos.
  - Integración del favicon y de la imagen principal en la sección Hero con atributos `alt` descriptivos, dimensiones explícitas (`width`, `height`) para evitar Cumulative Layout Shift (CLS) y `loading="lazy"` para recursos bajo el pliegue.
- **Dependencias con etapas anteriores**: Etapa 3 (estructura del Hero lista para alojar el activo visual).
- **Criterios de aceptación**:
  - Todas las imágenes cargan sin enlaces rotos y armonizan con la paleta `#0B1020`, `#111B34`, `#22D3EE` y `#8B5CF6`.
  - Ninguna imagen distorsiona su relación de aspecto ni provoca saltos de layout al cargar.
- **Procedimiento básico de verificación**:
  - Inspeccionar en el navegador que el recurso visual del Hero y el favicon se rendericen nítidamente y que todos los archivos en `assets/` tengan peso reducido.

---

### Etapa 5: Servicios, tecnologías y portafolio
- **Objetivo**: Maquetar y estilizar las secciones centrales de valor comercial y técnico, más el pie de página corporativo.
- **Archivos involucrados**:
  - `index.html`
  - `css/styles.css`
- **Funcionalidades que se implementarán**:
  - **Sección 3 - Servicios tecnológicos**: Grid de tarjetas (`#111B34`) con iconografía SVG, título, descripción y etiquetas de entregables (p. ej., Arquitectura Cloud, Desarrollo Web de Alto Rendimiento, Inteligencia Artificial Aplicada, Ciberseguridad & DevSecOps).
  - **Sección 4 - Tecnologías y capacidades**: Matriz categorizada de stack técnico y capacidades clave (Frontend, Cloud & Infraestructura, Datos & IA, Calidad & Entrega Continua) con indicadores visuales limpios.
  - **Sección 5 - Portafolio de proyectos destacados**: Tarjetas de casos de éxito con las imágenes de la Etapa 4, categoría del proyecto, problema resuelto, stack empleado y métricas de impacto, incluyendo botones de filtro por categoría preparados para la Etapa 6.
  - **Sección 7 - Pie de página (`<footer>`)**: Resumen de marca, enlaces rápidos, información de contacto corporativa y derechos reservados.
- **Dependencias con etapas anteriores**: Etapa 2 (sistema de grillas y tokens) y Etapa 4 (imágenes del portafolio).
- **Criterios de aceptación**:
  - Las tarjetas utilizan `#111B34` con bordes y efectos luminosos sutiles en `#22D3EE` / `#8B5CF6` al pasar el cursor.
  - La información está estructurada con semántica `<article>` y listas claras.
- **Procedimiento básico de verificación**:
  - Recorrer la página completa verificando la consistencia de espaciados, alineación de grillas y legibilidad de textos en Servicios, Tecnologías, Portafolio y Footer.

---

### Etapa 6: Formularios e interactividad
- **Objetivo**: Implementar la sección de formulario de contacto y programar toda la lógica interactiva en JavaScript Vanilla.
- **Archivos involucrados**:
  - `index.html`
  - `css/styles.css`
  - `js/main.js`
- **Funcionalidades que se implementarán**:
  - **Sección 6 - Formulario de contacto**: Campos para Nombre completo, Correo corporativo, Servicio de interés (`<select>`), Presupuesto/Alcance opcional, Mensaje y casilla de aceptación de privacidad, acompañados de datos de contacto directo.
  - **Validación del lado del cliente (`js/main.js`)**: Validación en tiempo real (`blur`/`input`) y al enviar (`submit`), verificando campos obligatorios, formato de email válido y longitud mínima de mensaje; mensajes de error específicos por campo y estado de éxito simulado sin recarga de página.
  - **Interactividad de interfaz (`js/main.js`)**:
    - Apertura/cierre del menú móvil con actualización de `aria-expanded` y cierre al pulsar enlaces o tecla `Escape`.
    - Resaltado dinámico del enlace activo en la barra de navegación según la sección visible.
    - Filtrado interactivo de proyectos del portafolio por categoría.
- **Dependencias con etapas anteriores**: Etapas 3 y 5 (navegación y portafolio maquetados).
- **Criterios de aceptación**:
  - El formulario impide envíos inválidos, muestra errores claros vinculados con `aria-describedby` y limpia el estado tras un envío válido mostrando confirmación visual.
  - Los filtros de portafolio y el menú interactivo funcionan sin errores en consola.
- **Procedimiento básico de verificación**:
  - Intentar enviar el formulario vacío, con email mal formado y con datos válidos; probar el filtrado de categorías en el portafolio y la navegación interactiva.

---

### Etapa 7: Responsive, animaciones y optimización visual
- **Objetivo**: Garantizar la adaptabilidad total en dispositivos móviles, tablets y pantallas grandes, incorporando micro-interacciones y animaciones CSS discretas.
- **Archivos involucrados**:
  - `css/styles.css`
  - `js/main.js` (si se emplea `IntersectionObserver` ligero para revelado al hacer scroll)
- **Funcionalidades que se implementarán**:
  - Media queries para breakpoints clave (`<= 1024px`, `<= 768px`, `<= 480px`), adaptando grillas, tipografía fluida y menú colapsable móvil.
  - Desplazamiento suave (`scroll-behavior: smooth`) y ajuste de `scroll-margin-top` en las secciones para compensar el header fijo.
  - Animaciones CSS discretas (transiciones de tarjetas, aparición suave de secciones con `IntersectionObserver`, soporte estricto para `@media (prefers-reduced-motion: reduce)`).
- **Dependencias con etapas anteriores**: Etapas 3, 5 y 6 (todas las secciones e interacciones construidas).
- **Criterios de aceptación**:
  - Cero desbordamiento horizontal (`overflow-x`) en cualquier ancho desde `320px` hasta `1920px+`.
  - Si el sistema operativo tiene activada la reducción de movimiento, las animaciones se desactivan automáticamente.
- **Procedimiento básico de verificación**:
  - Probar el sitio mediante el modo de diseño adaptable del navegador en resoluciones `375x667` (móvil), `768x1024` (tablet) y `1440x900` (escritorio).

---

### Etapa 8: Depuración, accesibilidad y pruebas
- **Objetivo**: Auditar y corregir detalles de accesibilidad (WCAG AA), SEO técnico, rendimiento y ausencia total de errores.
- **Archivos involucrados**:
  - `index.html`
  - `css/styles.css`
  - `js/main.js`
- **Funcionalidades que se implementarán**:
  - Enlace de salto al contenido principal (*"Saltar al contenido"*) visible al enfocar con teclado.
  - Revisión de navegación completa por teclado (`Tab`, `Shift+Tab`, `Enter`, `Escape`) y anillos de foco (`:focus-visible`) de alto contraste en `#22D3EE`.
  - Verificación de relaciones `<label for="...">`, roles ARIA, contraste de colores, etiquetas `alt` y metadatos SEO.
- **Dependencias con etapas anteriores**: Etapa 7 completada.
- **Criterios de aceptación**:
  - Todo el sitio es operable usando únicamente el teclado.
  - Contraste de texto cumple con el estándar WCAG AA sobre `#0B1020` y `#111B34`.
  - Cero errores o advertencias en consola o validación HTML/CSS.
- **Procedimiento básico de verificación**:
  - Recorrer de principio a fin la página usando solo la tecla `Tab`, verificar estados de foco, probar el formulario con teclado y validar el DOM e indicadores de rendimiento.

---

### Etapa 9: Revisión final, GitHub y publicación
- **Objetivo**: Preparar la documentación final, inicializar y versionar el repositorio Git, subir los cambios a GitHub y publicar el sitio en GitHub Pages.
- **Archivos involucrados**:
  - `README.md`
  - Configuración Git del proyecto (`.gitignore` si aplica)
- **Funcionalidades que se implementarán**:
  - Documentación completa en `README.md` (descripción de Nexora Digital, paleta de colores, estructura del proyecto, instrucciones de ejecución local y enlace de despliegue).
  - Inicialización del repositorio Git (`git init`, rama `main`), commit limpio y estructurado.
  - Configuración del repositorio remoto en GitHub, `git push` y activación/verificación de **GitHub Pages**.
- **Dependencias con etapas anteriores**: Etapa 8 validada.
- **Criterios de aceptación**:
  - Todas las rutas de recursos (`./css/...`, `./js/...`, `./assets/...`) son relativas para funcionar tanto en raíz como en subruta de GitHub Pages (`https://<usuario>.github.io/nexora-digital/`).
  - El repositorio está publicado y el sitio es accesible públicamente en línea.
- **Procedimiento básico de verificación**:
  - Comprobar `git status` limpio, verificar la carga de la URL pública de GitHub Pages y confirmar que estilos, imágenes e interacciones funcionen en producción.

---

## 5. Orden de Trabajo

El flujo seguirá una secuencia lineal estricta:
`Etapa 1` → `Etapa 2` → `Etapa 3` → `Etapa 4` → `Etapa 5` → `Etapa 6` → `Etapa 7` → `Etapa 8` → `Etapa 9`.

En cada etapa se realizará:
1. Implementación acotada únicamente a los archivos y alcance de esa etapa.
2. Ejecución del procedimiento básico de verificación.
3. Confirmación del cumplimiento de los criterios de aceptación antes de avanzar a la siguiente etapa.

---

## 6. Posibles Riesgos y Mitigaciones

1. **Rutas rotas al publicar en GitHub Pages**:
   - *Riesgo*: Usar rutas absolutas que inicien con `/` (ej. `/css/styles.css`) falla cuando GitHub Pages sirve el sitio desde una subcarpeta (`/nexora-digital/`).
   - *Mitigación*: Utilizar siempre rutas relativas (`./css/styles.css` o `css/styles.css`) desde la Etapa 2.
2. **Problemas de contraste en tema oscuro**:
   - *Riesgo*: Textos secundarios o bordes demasiado oscuros sobre `#0B1020` y `#111B34` que dificulten la lectura.
   - *Mitigación*: Emplear `#F8FAFC` para textos principales y un gris azulado claro (`#94A3B8` o `#CBD5E1`) para textos secundarios, garantizando ratio > 4.5:1.
3. **Pérdida de rendimiento por efectos luminosos excesivos**:
   - *Riesgo*: Abusar de `filter: blur()` grandes o sombras animadas que degraden el desplazamiento en móviles.
   - *Mitigación*: Usar `radial-gradient` estáticos en pseudoelementos y animar únicamente `transform` y `opacity`.
4. **Dependencia de fuentes externas o bloqueo de red**:
   - *Riesgo*: Fallo o demora en la carga de fuentes externas.
   - *Mitigación*: Definir una pila de fuentes del sistema robusta como fallback inmediato (`'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`).

---

## 7. Decisiones Pendientes

1. **Estrategia de imágenes en la Etapa 4**: Confirmar si se prefieren ilustraciones vectoriales SVG personalizadas de alta precisión (ultraligeras, escalables y con los colores exactos `#22D3EE` y `#8B5CF6`) o imágenes rasterizadas generadas por IA (PNG/WebP).
2. **Tipografía**: Confirmar si se desea cargar `Inter` / `Plus Jakarta Sans` desde Google Fonts o mantener 100% cero peticiones externas usando exclusivamente fuentes nativas del sistema (`system-ui`).
3. **Publicación en la Etapa 9**: Confirmar si el repositorio remoto de GitHub ya existe o si se creará durante la Etapa 9.
