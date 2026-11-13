# Nexora Digital

Sitio web corporativo para **Nexora Digital**, construido con HTML5 semántico, CSS3 y JavaScript Vanilla.

## Estado del Proyecto

- **Etapa actual**: Etapa 6 — Formularios e interactividad (implementada, pendiente de aprobación).
- Formulario con nombre, correo electrónico, asunto y mensaje, según el alcance solicitado, y restricciones nativas de HTML5 (`required`, `type="email"`, `minlength` y `maxlength`).
- Menú móvil accesible con apertura/cierre, estados `aria-expanded`, cierre mediante enlaces y `Escape`; se conservan la navegación activa, el desplazamiento suave y el botón de volver arriba.
- Filtros del portafolio funcionales por categoría, con estado `aria-pressed`.
- Validación JavaScript al salir del campo, corregir errores y pulsar «Validar mensaje»: rechaza valores vacíos o compuestos solo por espacios y comprueba las longitudes sin espacios exteriores. El formato de correo se comprueba con la API nativa de HTML5, sin una expresión regular adicional.
- Los errores tienen contenedores propios vinculados con `aria-describedby`, anuncios `aria-live` y estado `aria-invalid`. El primer campo inválido recibe foco. La ayuda del mensaje se conserva y la confirmación indica únicamente que los datos son válidos, sin borrarlos ni simular su envío.
- El botón solo se habilita después de registrar el manejador que impide el envío con `preventDefault()`. JavaScript activa `noValidate` para presentar errores propios al enviar, manteniendo las restricciones HTML5 mediante `checkValidity()`. Sin JavaScript, el botón permanece deshabilitado. No hay servicio de envío configurado.
- El alcance solicitado sustituye los campos originalmente previstos en el plan. El responsive general de la etapa 7 no se adelanta; solo se adapta el menú móvil y el nuevo formulario.

## Verificación local de la etapa 6

Abrir `index.html` en el navegador o mediante un servidor estático existente:

- Probar el menú a un ancho de 768 px o inferior con teclado y ratón, incluidos `Escape`, selección de enlaces y cambio a escritorio.
- Recorrer los enlaces de sección y comprobar el estado activo, el desplazamiento suave y el botón de volver arriba.
- Probar cada filtro del portafolio y regresar a «Todos».
- Pulsar «Validar mensaje» con campos vacíos, valores compuestos solo por espacios, correo mal formado y textos demasiado cortos tras eliminar espacios exteriores. Comprobar los errores de cada campo y el foco en el primero inválido.
- Corregir los errores y comprobar que desaparecen sin borrar la ayuda del mensaje. Con datos válidos, comprobar la confirmación de validación sin recarga ni envío; editar un campo debe retirar la confirmación anterior.
- Revisar Console y Network para descartar errores y recursos 404.

**Verificación previa de la interfaz**: sintaxis JavaScript y `git diff --check` correctos; pruebas en navegador a 320, 375, 768 y 1440 px. Se comprobaron restricciones nativas, foco del aviso de error, bloqueo de envío implícito, menú por teclado, cambios de ancho, filtros, navegación activa, desplazamiento y reducción de movimiento. Sin errores de consola ni recursos 404 durante esas pruebas.

**Verificación del formulario corregido**: campos vacíos y solo espacios, correo inválido, mínimos tras `trim()`, límites máximos, corrección de errores, foco, conservación de la ayuda y validación mediante Enter comprobados en navegador. Sin recargas, solicitudes de envío, alertas ni errores de consola. Comprobados también el bloqueo sin JavaScript y la navegación existente.

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
