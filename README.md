# Nexora Digital

Sitio web corporativo para **Nexora Digital**, construido con HTML5 semántico, CSS3 y JavaScript Vanilla.

## Estado del Proyecto

- **Etapa actual**: Etapa 7 — Responsive, animaciones y optimización visual (implementada, pendiente de aprobación).
- Adaptabilidad completa con breakpoints en `<= 1024px`, `<= 768px` y `<= 480px`, cero desbordamiento horizontal desde `320px` hasta `1920px+`, desplazamiento suave (`scroll-behavior: smooth`) y `scroll-margin-top` en secciones.
- Animaciones de entrada escalonadas en el Hero (badge, título, descripción, botones, ilustración vectorial y tarjetas del mockup) basadas exclusivamente en `transform` y `opacity`.
- Revelado progresivo al desplazarse en `#servicios`, `#tecnologias`, `#portafolio` y `#contacto` mediante `IntersectionObserver`, con mejora progresiva (todo permanece visible si JavaScript falla o está deshabilitado) y desbloqueo inmediato al recibir foco por teclado.
- Microinteracciones discretas con curvas de aceleración/desaceleración naturales en enlaces, botones, tarjetas, iconos, medidores de nivel, filtros del portafolio, formulario y menú móvil, respetando estrictamente `@media (prefers-reduced-motion: reduce)`.
- Se conservan íntegramente el menú móvil accesible, la navegación activa, el botón de volver arriba, el filtrado de proyectos y la validación en cliente del formulario de contacto (sin envío real).

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
