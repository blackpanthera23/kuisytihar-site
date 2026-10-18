import './style.css';

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const navLinks = [...nav.querySelectorAll('a')];

function closeMenu({ returnFocus = false } = {}) {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  if (returnFocus) toggle.focus();
}

function openMenu() {
  nav.classList.add('is-open');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  navLinks[0]?.focus();
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  open ? closeMenu() : openMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu({ returnFocus: true });
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => closeMenu());
});

const heroVideo = document.querySelector('.hero-video');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (heroVideo && !reduceMotion.matches) {
  const play = () => heroVideo.play().catch(() => {});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? play() : heroVideo.pause();
    }, { threshold: 0.25 }).observe(heroVideo);
  } else {
    play();
  }
}

const sectionLinks = navLinks.filter((link) => link.hash);
const sections = sectionLinks
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach((section) => observer.observe(section));
}

// Leak map: hover/focus a node to spotlight its matching annotation card.
// Keyboard: Tab reaches each node (role=button, tabindex=0); Enter/Space
// toggles persistent spotlight (Escape clears). Pure state, no scroll anim.
const leakNodes = document.querySelectorAll('.leak-node[data-node]');
const leakNotes = document.querySelectorAll('.leak-note[data-note]');

function setLeakActive(name) {
  leakNodes.forEach((node) => node.classList.toggle('is-active', node.dataset.node === name));
  leakNotes.forEach((note) => note.classList.toggle('is-active', note.dataset.note === name));
}

let leakPinned = null;
leakNodes.forEach((node) => {
  const name = node.dataset.node;
  node.addEventListener('pointerenter', () => { if (!leakPinned) setLeakActive(name); });
  node.addEventListener('pointerleave', () => { if (!leakPinned) setLeakActive(null); });
  node.addEventListener('focus', () => { if (!leakPinned) setLeakActive(name); });
  node.addEventListener('blur', () => { if (!leakPinned) setLeakActive(null); });
  node.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      leakPinned = leakPinned === name ? null : name;
      setLeakActive(leakPinned);
    } else if (event.key === 'Escape' && leakPinned) {
      leakPinned = null;
      setLeakActive(null);
    }
  });
  node.addEventListener('click', () => {
    leakPinned = leakPinned === name ? null : name;
    setLeakActive(leakPinned);
  });
});

// Lightbox: clone the referenced node into the dialog so the original
// SVG keeps its event listeners. Closes on backdrop click, Escape, or
// the explicit close button (form method=dialog).
const lightbox = document.querySelector('#lightbox');
const lightboxStage = document.querySelector('#lightbox-stage');
const lightboxTitle = document.querySelector('#lightbox-title');

function openLightbox(sourceId, label) {
  if (!lightbox || !lightboxStage) return;
  const source = document.getElementById(sourceId);
  if (!source) return;
  // The copy is a static enlargement: strip duplicate IDs and the node
  // button semantics so the dialog exposes no dead controls.
  const copy = source.cloneNode(true);
  copy.removeAttribute('id');
  copy.removeAttribute('aria-labelledby');
  copy.setAttribute('aria-label', source.querySelector('title')?.textContent || '');
  copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  copy.querySelectorAll('[tabindex], [role="button"]').forEach((el) => {
    el.removeAttribute('tabindex');
    el.removeAttribute('role');
    el.removeAttribute('aria-describedby');
  });
  lightboxStage.replaceChildren(copy);
  if (lightboxTitle && label) lightboxTitle.textContent = label;
  if (typeof lightbox.showModal === 'function') lightbox.showModal();
  else lightbox.setAttribute('open', '');
}

document.querySelectorAll('[data-zoom]').forEach((button) => {
  button.addEventListener('click', () => {
    openLightbox(button.dataset.zoom, button.getAttribute('aria-label') || 'Zoom');
  });
});

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    const rect = lightbox.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) lightbox.close();
  });
  lightbox.addEventListener('close', () => { if (lightboxStage) lightboxStage.replaceChildren(); });
}
