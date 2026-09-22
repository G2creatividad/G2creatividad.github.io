// CursorGrid — vanilla JS port of the React Bits <CursorGrid /> component.
// Same visual behaviour (canvas grid that lights up near the cursor, with
// falloff + fade + click pulses) but framework-free, so it can run as a
// full-viewport background across any Astro page without a React runtime.

const FALLOFF_CURVES = {
  linear: t => t,
  smooth: t => t * t * (3 - 2 * t),
  sharp: t => t * t * t
};

function hexToRgb(hex) {
  const h = hex.trim().replace('#', '');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const num = parseInt(v.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Mount a CursorGrid onto a canvas element.
 * @param {HTMLCanvasElement} canvas
 * @param {Object} opts - same prop names as the React version
 * @returns {{ destroy: Function, setColor: Function }}
 */
export function mountCursorGrid(canvas, opts = {}) {
  const props = {
    cellSize: 44,
    color: '#FFCC00',
    radius: 160,
    falloff: 'smooth',
    holdTime: 450,
    fadeDuration: 500,
    lineWidth: 1.2,
    maxOpacity: 0.55,
    fillOpacity: 0,
    gridOpacity: 0.035,
    cellRadius: 0,
    clickPulse: true,
    pulseSpeed: 380,
    ...opts
  };

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let cols = 0, rows = 0, offX = 0, offY = 0;
  let alphas = new Float32Array(0);
  let touched = new Float64Array(0);
  let w = 0, h = 0;
  const pulses = [];
  let raf = 0;
  let running = false;
  let lastFrame = 0;
  let destroyed = false;

  const rebuild = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / props.cellSize) + 1;
    rows = Math.ceil(h / props.cellSize) + 1;
    offX = (w - cols * props.cellSize) / 2;
    offY = (h - rows * props.cellSize) / 2;
    alphas = new Float32Array(cols * rows);
    touched = new Float64Array(cols * rows);
  };

  const cellCenter = i => {
    const cx = offX + (i % cols) * props.cellSize + props.cellSize / 2;
    const cy = offY + Math.floor(i / cols) * props.cellSize + props.cellSize / 2;
    return [cx, cy];
  };

  const energize = (x, y, boost) => {
    const r = Math.max(props.radius, 1);
    const ease = FALLOFF_CURVES[props.falloff] ?? FALLOFF_CURVES.linear;
    const now = performance.now();
    const minCol = Math.max(0, Math.floor((x - r - offX) / props.cellSize));
    const maxCol = Math.min(cols - 1, Math.floor((x + r - offX) / props.cellSize));
    const minRow = Math.max(0, Math.floor((y - r - offY) / props.cellSize));
    const maxRow = Math.min(rows - 1, Math.floor((y + r - offY) / props.cellSize));
    for (let cRow = minRow; cRow <= maxRow; cRow++) {
      for (let cCol = minCol; cCol <= maxCol; cCol++) {
        const i = cRow * cols + cCol;
        const [cx, cy] = cellCenter(i);
        const dist = Math.hypot(cx - x, cy - y);
        if (dist > r) continue;
        const level = ease(1 - dist / r) * props.maxOpacity * (boost ?? 1);
        if (level > alphas[i]) { alphas[i] = level; touched[i] = now; }
        else if (level > 0) { touched[i] = now; }
      }
    }
  };

  const draw = now => {
    const dt = Math.min(now - lastFrame, 50);
    lastFrame = now;
    ctx.clearRect(0, 0, w, h);
    const [cr, cg, cb] = hexToRgb(props.color);

    if (props.gridOpacity > 0) {
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${props.gridOpacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let cCol = 0; cCol <= cols; cCol++) {
        const x = Math.round(offX + cCol * props.cellSize) + 0.5;
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      for (let cRow = 0; cRow <= rows; cRow++) {
        const y = Math.round(offY + cRow * props.cellSize) + 0.5;
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.stroke();
    }

    for (let pi = pulses.length - 1; pi >= 0; pi--) {
      const pulse = pulses[pi];
      const age = (now - pulse.t0) / 1000;
      const ringR = age * props.pulseSpeed;
      if (ringR > Math.hypot(w, h)) { pulses.splice(pi, 1); continue; }
      const band = props.cellSize;
      const minCol = Math.max(0, Math.floor((pulse.x - ringR - band - offX) / props.cellSize));
      const maxCol = Math.min(cols - 1, Math.floor((pulse.x + ringR + band - offX) / props.cellSize));
      const minRow = Math.max(0, Math.floor((pulse.y - ringR - band - offY) / props.cellSize));
      const maxRow = Math.min(rows - 1, Math.floor((pulse.y + ringR + band - offY) / props.cellSize));
      for (let cRow = minRow; cRow <= maxRow; cRow++) {
        for (let cCol = minCol; cCol <= maxCol; cCol++) {
          const i = cRow * cols + cCol;
          const [cx, cy] = cellCenter(i);
          const dist = Math.hypot(cx - pulse.x, cy - pulse.y);
          if (Math.abs(dist - ringR) < band / 2 && props.maxOpacity > alphas[i]) {
            alphas[i] = props.maxOpacity; touched[i] = now;
          }
        }
      }
    }

    let anyVisible = pulses.length > 0;
    const fadeStep = dt / Math.max(props.fadeDuration, 16);
    const half = props.cellSize / 2;

    for (let i = 0; i < alphas.length; i++) {
      let a = alphas[i];
      if (a <= 0) continue;
      if (now - touched[i] > props.holdTime) {
        a = Math.max(0, a - fadeStep);
        alphas[i] = a;
        if (a <= 0) continue;
      }
      anyVisible = true;
      const [cx, cy] = cellCenter(i);
      const gradient = ctx.createRadialGradient(cx, cy, half * 0.1, cx, cy, props.cellSize);
      gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${a})`);
      gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

      const x = cx - half + 0.5, y = cy - half + 0.5, s = props.cellSize - 1;
      ctx.beginPath();
      if (props.cellRadius > 0) ctx.roundRect(x, y, s, s, props.cellRadius);
      else ctx.rect(x, y, s, s);
      if (props.fillOpacity > 0) {
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${a * props.fillOpacity})`;
        ctx.fill();
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = props.lineWidth;
      ctx.stroke();
    }

    if (destroyed) return;
    if (anyVisible || props.gridOpacity > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      running = false;
    }
  };

  const wake = () => {
    if (running || destroyed) return;
    running = true;
    lastFrame = performance.now();
    raf = requestAnimationFrame(draw);
  };

  const onMove = e => { energize(e.clientX, e.clientY); wake(); };
  const onDown = e => {
    if (!props.clickPulse) return;
    pulses.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
    wake();
  };
  const onResize = () => { rebuild(); wake(); };

  rebuild();
  wake();
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('resize', onResize);

  return {
    setColor(hex) { props.color = hex; wake(); },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
    }
  };
}
