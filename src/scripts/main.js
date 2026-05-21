const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

function initHeader() {
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a.site-logo[href="#hero"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      e.preventDefault();
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#hero');
    });
  });
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
}

function initReveal() {
  const targets = document.querySelectorAll(
    '.reveal, .flow-cut, .mood, .dim-reveal:not(#hero .dim-reveal), .brand-card, .menu-card'
  );

  const reveal = (el) => {
    el.classList.add('is-visible');
    el.querySelectorAll('.dim-reveal').forEach((d) => d.classList.add('is-visible'));
  };

  targets.forEach((el) => {
    if (isInViewport(el)) reveal(el);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

function initParallax() {
  if (prefersReducedMotion) return;

  const layers = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.parallax) || 0.2;
      const rect = layer.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * speed * 0.15;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-scroll-anim');
  initHeader();
  initReveal();
  initParallax();
  initYear();
});
