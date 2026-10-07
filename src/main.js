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
