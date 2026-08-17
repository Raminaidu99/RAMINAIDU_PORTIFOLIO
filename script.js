/**
 * script.js — Sankarapu Raminaidu Portfolio
 * Vanilla JavaScript interactions
 */

'use strict';

/* ============================================================
   1. UTILITY HELPERS
   ============================================================ */

/**
 * Debounce: limits how often a function is called.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ============================================================
   2. NAVBAR — SCROLL STATE
   Adds .scrolled class to navbar once user scrolls past
   a threshold; triggers blur/shadow visual.
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init
})();

/* ============================================================
   3. MOBILE HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    navMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    navMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target) &&
      navMenu.classList.contains('is-open')
    ) {
      closeMenu();
    }
  });
})();

/* ============================================================
   4. ACTIVE NAV LINK ON SCROLL
   Uses IntersectionObserver to highlight which section
   is currently in view.
   ============================================================ */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');
  if (!navLinks.length || !sections.length) return;

  const sectionMap = {};
  sections.forEach(sec => {
    sectionMap[sec.id] = sec;
  });

  function setActive(id) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === id) {
        link.classList.add('active');
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
})();

/* ============================================================
   5. SMOOTH SCROLL — all internal anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ============================================================
   6. SCROLL REVEAL ANIMATIONS
   Elements with [data-reveal] fade+slide in as they enter
   the viewport.
   ============================================================ */
(function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  // If user prefers reduced motion, reveal everything immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.08,
    }
  );

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   7. HERO TYPING EFFECT
   Cycles through phrases, typing and deleting them.
   ============================================================ */
(function initTypingEffect() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = 'practical and scalable web experiences.';
    return;
  }

  const phrases = [
    'practical and scalable web experiences.',
    'clean, responsive frontend interfaces.',
    'Python-powered backend solutions.',
    'AI & ML applications.',
    'software that solves real problems.',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let pauseTimer   = null;

  const TYPE_SPEED   = 55;   // ms per character (typing)
  const DELETE_SPEED = 30;   // ms per character (deleting)
  const PAUSE_FULL   = 2200; // pause at full phrase
  const PAUSE_EMPTY  = 400;  // pause at empty string

  function tick() {
    const phrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        pauseTimer = setTimeout(tick, PAUSE_EMPTY);
        return;
      }
      pauseTimer = setTimeout(tick, DELETE_SPEED);
    } else {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        isDeleting = true;
        pauseTimer = setTimeout(tick, PAUSE_FULL);
        return;
      }
      pauseTimer = setTimeout(tick, TYPE_SPEED);
    }
  }

  // Start typing after a short delay
  pauseTimer = setTimeout(tick, 800);
})();

/* ============================================================
   8. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const SHOW_THRESHOLD = 400;

  function onScroll() {
    if (window.scrollY > SHOW_THRESHOLD) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   9. SKILL TAG HOVER (subtle micro-interaction)
   On hover, briefly highlight the tag with accent border.
   ============================================================ */
(function initTagInteractions() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
      this.style.borderColor = 'rgba(124, 58, 237, 0.45)';
      this.style.color       = '#C4B5FD';
      this.style.background  = 'rgba(124, 58, 237, 0.1)';
    });
    tag.addEventListener('mouseleave', function () {
      this.style.borderColor = '';
      this.style.color       = '';
      this.style.background  = '';
    });
  });
})();

/* ============================================================
   10. TERMINAL CODE — subtle cursor line highlight
   Adds a class to the hovered code line in the terminal.
   ============================================================ */
(function initTerminalInteraction() {
  const terminal = document.querySelector('.terminal__code');
  if (!terminal) return;

  // Nothing heavy — terminal is pure CSS
  // Add a subtle "active" border pulse when hovering the terminal
  const terminalBox = document.querySelector('.terminal');
  if (!terminalBox) return;

  terminalBox.addEventListener('mouseenter', () => {
    terminalBox.style.borderColor = 'rgba(124, 58, 237, 0.5)';
    terminalBox.style.boxShadow = '0 0 40px rgba(124,58,237,0.25), 0 0 80px rgba(59,130,246,0.15), 0 16px 56px rgba(0,0,0,0.7)';
  });

  terminalBox.addEventListener('mouseleave', () => {
    terminalBox.style.borderColor = '';
    terminalBox.style.boxShadow   = '';
  });
})();

/* ============================================================
   11. CERT CARD INTERACTIONS
   Subtle tilt effect on hover.
   ============================================================ */
(function initCertCardInteractions() {
  const cards = document.querySelectorAll('.cert-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.background = 'rgba(124, 58, 237, 0.06)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.background = '';
    });
  });
})();

/* ============================================================
   12. PROJECT CARD — subtle image/visual placeholder if needed
   ============================================================ */
// No fabricated project data — no extra logic needed.

/* ============================================================
   13. NAV BRAND CLICK → SCROLL TO TOP
   ============================================================ */
(function initBrandClick() {
  const brand = document.querySelector('.navbar__brand');
  if (!brand) return;
  brand.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   14. CONTACT LINK — HOVER TRACK (optional subtle glow)
   ============================================================ */
(function initContactLinks() {
  const links = document.querySelectorAll('.contact-link');
  links.forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.querySelector('.contact-link__icon').style.background = 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.25))';
      this.querySelector('.contact-link__icon').style.boxShadow = '0 0 20px rgba(124,58,237,0.3)';
    });
    link.addEventListener('mouseleave', function () {
      this.querySelector('.contact-link__icon').style.background = '';
      this.querySelector('.contact-link__icon').style.boxShadow = '';
    });
  });
})();

/* ============================================================
   15. INIT — log (dev only, harmless in production)
   ============================================================ */
console.log('%c Sankarapu Raminaidu — Portfolio', 'color:#4F8EF7;font-weight:bold;font-size:14px;');
console.log('%c Built with HTML + CSS + Vanilla JS', 'color:#808080;font-size:12px;');
