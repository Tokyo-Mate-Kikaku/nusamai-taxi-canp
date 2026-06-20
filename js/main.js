/* ====================================================
   福祉タクシーぬさまい — Main JS
   ==================================================== */

/* --- Accordion (FAQ) --- */
document.querySelectorAll('.accordion-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const panel = btn.nextElementSibling;

    // close all in same accordion group
    const group = btn.closest('.accordion');
    group.querySelectorAll('.accordion-trigger').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
    }
  });
});

/* Open first item in each accordion by default */
document.querySelectorAll('.accordion').forEach(acc => {
  const first = acc.querySelector('.accordion-trigger');
  if (first) {
    first.setAttribute('aria-expanded', 'true');
    first.nextElementSibling.classList.add('open');
  }
});

/* --- Mobile menu toggle --- */
const menuToggle = document.querySelector('.menu-toggle');
const headerNav  = document.querySelector('.header-nav');
const headerCta  = document.querySelector('.header-cta');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const open = headerNav.classList.toggle('open');
    if (headerCta) headerCta.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
}

/* --- Copyright year --- */
const yearEl = document.getElementById('copyright-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Close mobile menu on nav link click */
document.querySelectorAll('.header-nav a').forEach(a => {
  a.addEventListener('click', () => {
    headerNav.classList.remove('open');
    if (headerCta) headerCta.classList.remove('open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'メニューを開く');
    }
  });
});
