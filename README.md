# Nexora Digital

Sitio web corporativo para **Nexora Digital**, construido con HTML5 semántico, CSS3 y JavaScript Vanilla.

## Estado del Proyecto

- **Etapa actual**: Etapa 9 — Revisión final, GitHub y publicación (completada).
- **Etapa 8**: Verificada y aprobada por el desarrollador antes de publicar.
- Adaptabilidad completa con breakpoints en `<= 1024px`, `<= 768px` y `<= 480px`, cero desbordamiento horizontal desde `320px` hasta `1920px+`, desplazamiento suave (`scroll-behavior: smooth`) y `scroll-margin-top` en secciones.
- Animaciones de entrada escalonadas en el Hero (badge, título, descripción, botones, ilustración vectorial y tarjetas del mockup) basadas exclusivamente en `transform` y `opacity`.
- Revelado progresivo al desplazarse en `#servicios`, `#tecnologias`, `#portafolio` y `#contacto` mediante `IntersectionObserver`, con mejora progresiva (todo permanece visible si JavaScript falla o está deshabilitado) y desbloqueo inmediato al recibir foco por teclado.
- Microinteracciones discretas con curvas de aceleración/desaceleración naturales en enlaces, botones, tarjetas, iconos, medidores de nivel, filtros del portafolio, formulario y menú móvil, respetando estrictamente `@media (prefers-reduced-motion: reduce)`.
- Se conservan íntegramente el menú móvil accesible, la navegación activa, el botón de volver arriba, el filtrado de proyectos y la validación en cliente del formulario de contacto (sin envío real).

## Publicación

- **Sitio público**: https://render2web.github.io/nexora-digital/
- **Repositorio**: https://github.com/render2web/nexora-digital
- **GitHub Pages**: despliegue desde la rama `main` y la carpeta raíz (`/`), con HTTPS obligatorio.
- No requiere instalación de dependencias ni compilación local. Las rutas relativas permiten servir el sitio bajo `/nexora-digital/`.
- Para publicar actualizaciones, crear los commits correspondientes y ejecutar `git push origin main`. GitHub Pages desplegará los cambios automáticamente.
- Consultar el estado del despliegue en [Actions](https://github.com/render2web/nexora-digital/actions) y la configuración en [Settings > Pages](https://github.com/render2web/nexora-digital/settings/pages).

### Verificación de publicación

El 14 de noviembre de 2026 se comprobó el despliegue correcto de GitHub Pages, la respuesta HTTP 200 del sitio y sus nueve recursos locales (CSS, JavaScript e imágenes), el filtrado de proyectos y la habilitación del formulario.

## Paleta de colores

| Uso | Color |
| --- | --- |
| Fondo principal | `#0B1020` |
| Superficies | `#111B34` |
| Acento cian | `#22D3EE` |
| Acento violeta | `#8B5CF6` |
| Texto principal | `#F8FAFC` |
| Texto secundario | `#94A3B8` |

## Verificación local de la etapa 7

Abrir `index.html` en el navegador o mediante un servidor estático existente:

- Comprobar la entrada escalonada del Hero al cargar la página y el revelado progresivo al desplazarse por Servicios, Tecnologías, Portafolio y Contacto.
- Probar estados `:hover`, `:focus-visible` y `:active` en navegación, botones CTA, tarjetas, iconos, filtros del portafolio, formulario y enlaces del pie de página.
- Interrumpir el desplazamiento de un enlace interno o de «Volver arriba» con Tab, rueda o toque: debe detenerse sin trasladar el foco al destino y la navegación activa debe volver a seguir la sección visible. Sin interrupción, el foco debe llegar al destino, también con movimiento reducido.
- Probar resoluciones de `320px`, `375x667` (móvil), `768x1024` (tablet), `1024px` y `1440x900` (escritorio), verificando ausencia total de `overflow-x`.
- Activar `prefers-reduced-motion: reduce` en el sistema o DevTools y comprobar que las animaciones y el desplazamiento suave se desactivan automáticamente.
- Deshabilitar JavaScript temporalmente y comprobar que todo el contenido permanece visible y legible.
- Revisar Console y Network para descartar errores y recursos 404.

## Estructura de Archivos

```text
nexora-digital/
├── PLAN_PROYECTO.md
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    ├── img/
    │   ├── logo.svg
    │   ├── project-1.svg
    │   ├── project-2.svg
    │   └── project-3.svg
    └── icons/
        ├── favicon.svg
        ├── icon-play.svg
        └── icon-rocket.svg
```
