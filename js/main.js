/**
 * Nexora Digital - Script Principal
 * Navegación móvil, revelado progresivo, filtros de proyectos, desplazamiento suave y formulario.
 */

const BACK_TO_TOP_THRESHOLD = 500;
// Línea de activación: una sección se considera visible al cruzar el 30 % superior del viewport.
const ACTIVE_LINE_RATIO = 0.3;
const SCROLL_DURATION_MIN = 450;
const SCROLL_DURATION_MAX = 1100;
const REVEAL_STAGGER_STEP = 85;
const REVEAL_STAGGER_MAX = 255;
const REVEAL_CLEANUP_BUFFER = 700;

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
 * El callback recibe true al completar el recorrido y false al cancelarlo.
 */
function createSmoothScroller() {
  let frameId = null;
  let onFinish = null;

  const finish = (completed) => {
    frameId = null;
    const callback = onFinish;
    onFinish = null;
    if (callback) callback(completed);
  };

  const cancel = () => {
    if (frameId === null) return;
    cancelAnimationFrame(frameId);
    finish(false);
  };

  ['wheel', 'touchstart'].forEach((type) => {
    window.addEventListener(type, cancel, { passive: true });
  });
  window.addEventListener('keydown', cancel);

  return function scrollToPosition(targetY, callback) {
    cancel();
    onFinish = callback || null;

    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const endY = Math.min(Math.max(targetY, 0), maxY);
    const startY = window.scrollY;
    const distance = endY - startY;

    if (reducedMotionQuery.matches || Math.abs(distance) < 2) {
      window.scrollTo({ top: endY, left: 0, behavior: 'instant' });
      finish(true);
      return;
    }

    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, SCROLL_DURATION_MIN), SCROLL_DURATION_MAX);
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo({
        top: startY + distance * easeInOutCubic(progress),
        left: 0,
        behavior: 'instant',
      });

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        finish(true);
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

    const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;

    const rawId = link.hash.slice(1);
    if (!rawId) return;

    let id;
    try {
      id = decodeURIComponent(rawId);
    } catch {
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    navigation.lock(id);

    const targetY = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    scrollToPosition(targetY, (completed) => {
      navigation.unlock();
      if (completed) focusSection(target);
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
    scrollToPosition(0, (completed) => {
      navigation.unlock();
      if (completed) focusSection(hero);
    });

    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
}

function initMobileNavigation() {
  const header = document.querySelector('.site-header');
  const button = header?.querySelector('.nav-toggle');
  const controlsId = button?.getAttribute('aria-controls');
  const menu = controlsId ? document.getElementById(controlsId) : null;
  if (!header || !button || !menu) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  let lastNavigationFocus = null;

  const setOpen = (isOpen) => {
    header.classList.toggle('is-nav-open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    button.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) {
      lastNavigationFocus = null;
      setOpen(false);
    }
  });

  document.addEventListener('focusin', (event) => {
    lastNavigationFocus = header.contains(event.target) ? event.target : null;
  });

  header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });

  const syncViewport = () => {
    // El navegador puede retirar el foco antes de notificar que el breakpoint cambió.
    const focusedElement = document.activeElement === document.body ? lastNavigationFocus : document.activeElement;
    setOpen(false);
    if (mobileQuery.matches && menu.contains(focusedElement)) button.focus();
    if (!mobileQuery.matches && focusedElement === button) menu.querySelector('a')?.focus();
  };

  mobileQuery.addEventListener('change', syncViewport);
  header.classList.add('is-nav-ready');
  syncViewport();
}

/**
 * Revela progresivamente cabeceras, tarjetas y bloques de sección al desplazarse.
 * Si JavaScript falla, no hay IntersectionObserver o se prefiere reducir movimiento,
 * el contenido permanece completamente visible por defecto.
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window) || reducedMotionQuery.matches) return;

  const targets = [
    ...document.querySelectorAll(
      '#servicios .section-header, #servicios .card, ' +
      '#tecnologias .section-header, #tecnologias .card, ' +
      '#portafolio .section-header, #portafolio .filter-group, #portafolio .project-card, ' +
      '#preguntas-frecuentes .section-header, #preguntas-frecuentes .faq-item, ' +
      '#contacto .section-header, #contacto .contact-info, #contacto .contact-form'
    ),
  ];

  if (targets.length === 0) return;

  const finalizeReveal = (element) => {
    element.classList.remove('is-revealing');
    element.style.removeProperty('--reveal-delay');
  };

  let remainingCount = 0;

  const settleItem = (element) => {
    if (!element.classList.contains('is-revealed')) {
      remainingCount = Math.max(0, remainingCount - 1);
      if (remainingCount === 0) {
        window.removeEventListener('scroll', handleHiddenScrollFallback);
      }
    }
  };

  const revealElement = (element, delayMs = 0) => {
    if (element.classList.contains('is-revealed')) {
      finalizeReveal(element);
      return;
    }

    settleItem(element);

    // Si la pestaña está oculta en segundo plano, las transiciones CSS pueden quedar en pausa;
    // en ese caso se muestra de inmediato sin transición pendiente.
    if (document.visibilityState === 'hidden') {
      element.classList.add('is-revealed');
      finalizeReveal(element);
      return;
    }

    if (delayMs > 0) {
      element.style.setProperty('--reveal-delay', `${delayMs}ms`);
    }

    element.classList.add('is-revealing', 'is-revealed');

    element.addEventListener(
      'transitionend',
      (event) => {
        if (event.target === element && event.propertyName === 'opacity') {
          finalizeReveal(element);
        }
      },
      { once: true }
    );

    window.setTimeout(() => finalizeReveal(element), delayMs + REVEAL_CLEANUP_BUFFER);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      let batchIndex = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = entry.target;
        observer.unobserve(item);

        if (item.classList.contains('is-revealed')) {
          finalizeReveal(item);
          return;
        }

        const delay = Math.min(batchIndex * REVEAL_STAGGER_STEP, REVEAL_STAGGER_MAX);
        batchIndex += 1;
        revealElement(item, delay);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  // Respaldo exclusivo cuando la pestaña está oculta y el navegador pausa IntersectionObserver.
  function handleHiddenScrollFallback() {
    if (remainingCount === 0) {
      window.removeEventListener('scroll', handleHiddenScrollFallback);
      return;
    }
    if (document.visibilityState === 'visible') return;

    const currentTrigger = window.innerHeight * 0.92;
    targets.forEach((item) => {
      if (item.classList.contains('is-revealed') || item.hidden) return;
      if (item.getBoundingClientRect().top <= currentTrigger) {
        observer.unobserve(item);
        revealElement(item, 0);
      }
    });
  }

  // Se mide la posición inicial en una sola pasada de lectura antes de mutar clases.
  const triggerLine = window.innerHeight * 0.92;
  const initialRects = targets.map((item) => item.getBoundingClientRect());
  const initialInView = [];

  targets.forEach((item, index) => {
    const rect = initialRects[index];
    item.classList.add('reveal-item');

    // Los elementos que ya quedaron por encima del viewport al recargar no se reaniman.
    if (rect.bottom <= 0) {
      item.classList.add('is-revealed');
      return;
    }

    remainingCount += 1;
    if (rect.top <= triggerLine) {
      initialInView.push(item);
    } else {
      observer.observe(item);
    }
  });

  document.documentElement.classList.add('has-scroll-reveal');

  initialInView.forEach((item, batchIndex) => {
    const delay = Math.min(batchIndex * REVEAL_STAGGER_STEP, REVEAL_STAGGER_MAX);
    revealElement(item, delay);
  });

  if (remainingCount > 0) {
    window.addEventListener('scroll', handleHiddenScrollFallback, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && remainingCount > 0) {
      const currentTrigger = window.innerHeight * 0.92;
      let batchIndex = 0;
      targets.forEach((item) => {
        if (item.classList.contains('is-revealed') || item.hidden) return;
        const rect = item.getBoundingClientRect();
        if (rect.bottom <= 0) {
          observer.unobserve(item);
          settleItem(item);
          item.classList.add('is-revealed');
          finalizeReveal(item);
        } else if (rect.top <= currentTrigger) {
          observer.unobserve(item);
          const delay = Math.min(batchIndex * REVEAL_STAGGER_STEP, REVEAL_STAGGER_MAX);
          batchIndex += 1;
          revealElement(item, delay);
        }
      });
    }
  });

  // Garantiza visibilidad inmediata al navegar con teclado (Tab) hacia elementos aún no revelados.
  document.addEventListener('focusin', (event) => {
    const item = event.target.closest('.reveal-item:not(.is-revealed)');
    if (!item) return;
    observer.unobserve(item);
    revealElement(item, 0);
  });

  reducedMotionQuery.addEventListener('change', (event) => {
    if (!event.matches) return;
    observer.disconnect();
    window.removeEventListener('scroll', handleHiddenScrollFallback);
    remainingCount = 0;
    document.documentElement.classList.remove('has-scroll-reveal');
    targets.forEach((item) => {
      item.classList.add('is-revealed');
      finalizeReveal(item);
    });
  });
}

function initPortfolioFilters() {
  const buttons = [...document.querySelectorAll('#portafolio .filter-btn')];
  const projects = [...document.querySelectorAll('#portafolio .project-card')];

  projects.forEach((project) => {
    project.addEventListener('animationend', (event) => {
      if (event.animationName === 'project-filter-enter') {
        project.classList.remove('is-filter-entering');
        project.style.removeProperty('--filter-delay');
      }
    });
  });

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('is-active')) return;

      const category = button.dataset.filter;
      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      const visibleProjects = [];
      let needsAnimationRestart = false;

      projects.forEach((project) => {
        const shouldShow = category === 'todos' || project.dataset.category === category;
        if (shouldShow && project.classList.contains('is-filter-entering')) {
          needsAnimationRestart = true;
        }

        project.hidden = !shouldShow;
        project.classList.remove('is-filter-entering');
        project.style.removeProperty('--filter-delay');

        if (shouldShow) {
          project.classList.add('is-revealed');
          project.classList.remove('is-revealing');
          project.style.removeProperty('--reveal-delay');
          visibleProjects.push(project);
        }
      });

      if (!reducedMotionQuery.matches && visibleProjects.length > 0) {
        if (needsAnimationRestart) {
          void visibleProjects[0].offsetWidth;
        }

        visibleProjects.forEach((project, visibleIndex) => {
          project.style.setProperty('--filter-delay', `${visibleIndex * 65}ms`);
          project.classList.add('is-filter-entering');
        });
      }
    });
  });
}

function initFaqAccordion() {
  const items = [...document.querySelectorAll('#preguntas-frecuentes .faq-item')];

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((otherItem) => {
        if (otherItem !== item) otherItem.open = false;
      });
    });
  });
}

function initContactForm() {
  const form = document.querySelector('#contacto form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const fields = [...form.querySelectorAll('input[required], textarea[required]')];
  const status = document.getElementById('contacto-estado');
  const notice = document.getElementById('contacto-aviso');

  const setStatus = (message) => {
    if (status) status.textContent = message;
  };

  const setFieldError = (input, message) => {
    const errorElement = input.id ? document.getElementById(`${input.id}-error`) : null;
    if (errorElement) errorElement.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };

  const validateField = (input) => {
    const value = input.value.trim();
    let message = '';

    if (!value) {
      message = 'Este campo es obligatorio y no puede contener solo espacios.';
    } else if (input.type === 'email' && input.validity.typeMismatch) {
      message = 'Introduce un correo electrónico válido.';
    } else if (input.minLength > 0 && value.length < input.minLength) {
      message = `Escribe al menos ${input.minLength} caracteres, sin contar los espacios al inicio y al final.`;
    } else if (input.maxLength >= 0 && value.length > input.maxLength) {
      message = `No superes los ${input.maxLength} caracteres.`;
    } else if (!input.checkValidity()) {
      message = 'Revisa el contenido de este campo.';
    }

    setFieldError(input, message);
    return message === '';
  };

  fields.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      setStatus('');
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    setStatus('');
    const invalidFields = fields.filter((input) => !validateField(input));
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
    } else {
      setStatus('Validación correcta. Tus datos son válidos, pero no se ha enviado ningún mensaje.');
    }
  });

  // Se conservan las restricciones HTML5, pero JavaScript muestra los errores sin bloquear submit.
  form.noValidate = true;
  if (submitButton) submitButton.disabled = false;
  if (notice) notice.textContent = 'Este formulario solo valida tus datos; no envía mensajes.';
}

document.addEventListener('DOMContentLoaded', () => {
  const scrollToPosition = createSmoothScroller();
  const navigation = initActiveNavigation();

  initMobileNavigation();
  initScrollReveal();
  initPortfolioFilters();
  initSmoothAnchors(scrollToPosition, navigation);
  initBackToTop(scrollToPosition, navigation);
  initFaqAccordion();
  initContactForm();
});