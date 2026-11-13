/**
 * Nexora Digital - Script Principal
 * Navegación suave entre secciones, resaltado de la sección activa y botón "Volver arriba".
 */

const BACK_TO_TOP_THRESHOLD = 500;
// Línea de activación: una sección se considera visible al cruzar el 30 % superior del viewport.
const ACTIVE_LINE_RATIO = 0.3;
const SCROLL_DURATION_MIN = 450;
const SCROLL_DURATION_MAX = 1100;

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const getHeaderOffset = () => {
  const header = document.querySelector('.site-header');
  return header ? header.offsetHeight : 0;
};

/** Crea un elemento invisible que sirve como referencia para IntersectionObserver. */
function createSentinel(container, modifier) {
  const sentinel = document.createElement('div');
  sentinel.className = `scroll-sentinel scroll-sentinel--${modifier}`;
  sentinel.setAttribute('aria-hidden', 'true');
  container.appendChild(sentinel);
  return sentinel;
}

/** Mueve el foco a la sección de destino sin provocar un nuevo desplazamiento. */
function focusSection(section) {
  if (!section) return;
  if (!section.hasAttribute('tabindex')) section.setAttribute('tabindex', '-1');
  section.focus({ preventScroll: true });
}

/**
 * Devuelve una función que desplaza la ventana con aceleración y desaceleración.
 * La animación se cancela si el usuario interactúa (rueda, toque o teclado).
 */
function createSmoothScroller() {
  let frameId = null;
  let onFinish = null;

  const finish = () => {
    frameId = null;
    const callback = onFinish;
    onFinish = null;
    if (callback) callback();
  };

  const cancel = () => {
    if (frameId === null) return;
    cancelAnimationFrame(frameId);
    finish();
  };

  ['wheel', 'touchstart', 'keydown'].forEach((type) => {
    window.addEventListener(type, cancel, { passive: true });
  });

  return function scrollToPosition(targetY, callback) {
    cancel();
    onFinish = callback || null;

    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const endY = Math.min(Math.max(targetY, 0), maxY);
    const startY = window.scrollY;
    const distance = endY - startY;

    if (reducedMotionQuery.matches || Math.abs(distance) < 2) {
      window.scrollTo(0, endY);
      finish();
      return;
    }

    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, SCROLL_DURATION_MIN), SCROLL_DURATION_MAX);
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        finish();
      }
    };

    frameId = requestAnimationFrame(step);
  };
}

/**
 * Resalta en el menú la sección visible mediante IntersectionObserver.
 * Expone lock/unlock para fijar el estado mientras dura un desplazamiento iniciado por clic.
 */
function initActiveNavigation() {
  const links = [...document.querySelectorAll('.site-nav .nav-link[href^="#"]')];
  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter(Boolean);
  let isLocked = false;

  const setActive = (id) => {
    links.forEach((link) => {
      const isCurrent = link.hash === `#${id}`;
      link.classList.toggle('is-active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const isAtPageBottom = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

  const updateActiveSection = () => {
    if (isLocked || sections.length === 0) return;

    // La última sección puede ser demasiado corta para cruzar la línea de activación.
    if (isAtPageBottom()) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    const activationLine = Math.max(getHeaderOffset(), window.innerHeight * ACTIVE_LINE_RATIO);
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationLine) current = section;
    });
    setActive(current.id);
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(updateActiveSection, {
      rootMargin: '-30% 0px -69% 0px',
    });
    sections.forEach((section) => sectionObserver.observe(section));

    const footer = document.querySelector('.site-footer');
    if (footer) {
      new IntersectionObserver(updateActiveSection).observe(createSentinel(footer, 'bottom'));
    }
  }

  // Recalcula tras la carga completa para cubrir el acceso directo con un ancla (#seccion).
  window.addEventListener('load', updateActiveSection);
  window.addEventListener('popstate', updateActiveSection);

  return {
    lock(id) {
      if (!sections.some((section) => section.id === id)) return;
      isLocked = true;
      setActive(id);
    },
    unlock() {
      if (!isLocked) return;
      isLocked = false;
      updateActiveSection();
    },
  };
}

/** Intercepta los enlaces internos (#seccion) para desplazarse suavemente compensando el encabezado. */
function initSmoothAnchors(scrollToPosition, navigation) {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const id = decodeURIComponent(link.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    navigation.lock(id);

    const targetY = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    scrollToPosition(targetY, () => {
      navigation.unlock();
      focusSection(target);
    });

    if (window.location.hash !== `#${id}`) {
      history.pushState(null, '', `#${id}`);
    }
  });
}

/** Muestra el botón "Volver arriba" tras superar el umbral de desplazamiento. */
function initBackToTop(scrollToPosition, navigation) {
  const button = document.querySelector('.back-to-top');
  if (!button || !('IntersectionObserver' in window)) return;

  const sentinel = createSentinel(document.body, 'top');
  sentinel.style.top = `${BACK_TO_TOP_THRESHOLD}px`;

  const observer = new IntersectionObserver(([entry]) => {
    const hasScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    button.classList.toggle('is-visible', hasScrolledPast);
  });
  observer.observe(sentinel);

  button.addEventListener('click', () => {
    const hero = document.getElementById('inicio');
    navigation.lock('inicio');
    scrollToPosition(0, () => {
      navigation.unlock();
      focusSection(hero);
    });

    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const scrollToPosition = createSmoothScroller();
  const navigation = initActiveNavigation();

  initSmoothAnchors(scrollToPosition, navigation);
  initBackToTop(scrollToPosition, navigation);
});
