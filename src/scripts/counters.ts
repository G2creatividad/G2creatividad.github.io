export {}; // convierte el archivo en módulo (evita colisión de nombres globales)

// Cuenta animada para las estadísticas. El HTML ya trae el número real (útil para
// buscadores y para quien no ejecute JavaScript); aquí solo se anima al verse en pantalla.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nodes = document.querySelectorAll<HTMLElement>('[data-count]');

function animate(el: HTMLElement): void {
  const target = Number(el.dataset.count ?? '0');
  const suffix = el.dataset.suffix ?? '';
  const duration = 1200;
  let start: number | null = null;
  const step = (ts: number): void => {
    start ??= ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = `${Math.round((1 - Math.pow(1 - p, 3)) * target)}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

if (nodes.length > 0 && !reduceMotion && 'IntersectionObserver' in window) {
  nodes.forEach((el) => { el.textContent = `0${el.dataset.suffix ?? ''}`; });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
      animate(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  nodes.forEach((el) => io.observe(el));
}
