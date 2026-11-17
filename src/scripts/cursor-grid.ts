// CursorGrid — port a TypeScript del componente <CursorGrid /> de React Bits.
// Cambios respecto a la versión anterior:
//  · La retícula estática ya NO se dibuja en el canvas: la pinta el CSS (cero coste).
//  · El bucle de animación se detiene cuando no hay celdas encendidas (antes corría
//    a 60 fps aunque nadie moviera el mouse, gastando batería).
//  · Se pausa con la pestaña oculta y no se reconstruye con cada cambio de la barra
//    de direcciones en móviles.

type Falloff = 'linear' | 'smooth' | 'sharp';

export interface CursorGridOptions {
  cellSize: number;
  color: string;
  radius: number;
  falloff: Falloff;
  holdTime: number;
  fadeDuration: number;
  lineWidth: number;
  maxOpacity: number;
  clickPulse: boolean;
  pulseSpeed: number;
}

export interface CursorGridHandle {
  setColor: (hex: string) => void;
  destroy: () => void;
}

interface Pulse { readonly x: number; readonly y: number; readonly t0: number }

const FALLOFF: Record<Falloff, (t: number) => number> = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  sharp: (t) => t * t * t,
};

const DEFAULTS: CursorGridOptions = {
  cellSize: 44,
  color: '#FFB020',
  radius: 160,
  falloff: 'smooth',
  holdTime: 450,
  fadeDuration: 500,
  lineWidth: 1.2,
  maxOpacity: 0.55,
  clickPulse: true,
  pulseSpeed: 380,
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mountCursorGrid(canvas: HTMLCanvasElement, options: Partial<CursorGridOptions> = {}): CursorGridHandle | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const props: CursorGridOptions = { ...DEFAULTS, ...options };
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let cols = 0;
  let rows = 0;
  let w = 0;
  let h = 0;
  let alphas = new Float32Array(0);
  let touched = new Float64Array(0);
  const pulses: Pulse[] = [];
  let raf = 0;
  let running = false;
  let lastFrame = 0;

  // La retícula nace en (0,0) para que el patrón CSS coincida exactamente con las celdas.
  const center = (i: number): [number, number] => [
    (i % cols) * props.cellSize + props.cellSize / 2,
    Math.floor(i / cols) * props.cellSize + props.cellSize / 2,
  ];

  const rebuild = (): void => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / props.cellSize) + 1;
    rows = Math.ceil(h / props.cellSize) + 1;
    alphas = new Float32Array(cols * rows);
    touched = new Float64Array(cols * rows);
  };

  const energize = (x: number, y: number): void => {
    const r = Math.max(props.radius, 1);
    const ease = FALLOFF[props.falloff];
    const now = performance.now();
    const minCol = Math.max(0, Math.floor((x - r) / props.cellSize));
    const maxCol = Math.min(cols - 1, Math.floor((x + r) / props.cellSize));
    const minRow = Math.max(0, Math.floor((y - r) / props.cellSize));
    const maxRow = Math.min(rows - 1, Math.floor((y + r) / props.cellSize));
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const i = row * cols + col;
        const [cx, cy] = center(i);
        const dist = Math.hypot(cx - x, cy - y);
        if (dist > r) continue;
        const level = ease(1 - dist / r) * props.maxOpacity;
        if (level > (alphas[i] ?? 0)) alphas[i] = level;
        if (level > 0) touched[i] = now;
      }
    }
  };

  const advancePulses = (now: number): void => {
    for (let pi = pulses.length - 1; pi >= 0; pi--) {
      const pulse = pulses[pi];
      if (!pulse) continue;
      const ringR = ((now - pulse.t0) / 1000) * props.pulseSpeed;
      if (ringR > Math.hypot(w, h)) { pulses.splice(pi, 1); continue; }
      const band = props.cellSize;
      const minCol = Math.max(0, Math.floor((pulse.x - ringR - band) / props.cellSize));
      const maxCol = Math.min(cols - 1, Math.floor((pulse.x + ringR + band) / props.cellSize));
      const minRow = Math.max(0, Math.floor((pulse.y - ringR - band) / props.cellSize));
      const maxRow = Math.min(rows - 1, Math.floor((pulse.y + ringR + band) / props.cellSize));
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const i = row * cols + col;
          const [cx, cy] = center(i);
          if (Math.abs(Math.hypot(cx - pulse.x, cy - pulse.y) - ringR) < band / 2 && props.maxOpacity > (alphas[i] ?? 0)) {
            alphas[i] = props.maxOpacity;
            touched[i] = now;
          }
        }
      }
    }
  };

  const draw = (now: number): void => {
    const dt = Math.min(now - lastFrame, 50);
    lastFrame = now;
    ctx.clearRect(0, 0, w, h);
    const [cr, cg, cb] = hexToRgb(props.color);
    advancePulses(now);

    let anyVisible = pulses.length > 0;
    const fadeStep = dt / Math.max(props.fadeDuration, 16);
    const half = props.cellSize / 2;

    for (let i = 0; i < alphas.length; i++) {
      let a = alphas[i] ?? 0;
      if (a <= 0) continue;
      if (now - (touched[i] ?? 0) > props.holdTime) {
        a = Math.max(0, a - fadeStep);
        alphas[i] = a;
        if (a <= 0) continue;
      }
      anyVisible = true;
      const [cx, cy] = center(i);
      const gradient = ctx.createRadialGradient(cx, cy, half * 0.1, cx, cy, props.cellSize);
      gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${a})`);
      gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = props.lineWidth;
      ctx.strokeRect(cx - half + 0.5, cy - half + 0.5, props.cellSize - 1, props.cellSize - 1);
    }

    if (anyVisible && !document.hidden) {
      raf = requestAnimationFrame(draw);
    } else {
      running = false;               // en reposo: ningún fotograma programado
      if (!anyVisible) ctx.clearRect(0, 0, w, h);
    }
  };

  const wake = (): void => {
    if (running || document.hidden) return;
    running = true;
    lastFrame = performance.now();
    raf = requestAnimationFrame(draw);
  };

  const onMove = (e: PointerEvent): void => {
    if (e.pointerType === 'touch') return;      // no gastar batería mientras se hace scroll
    energize(e.clientX, e.clientY);
    wake();
  };
  const onDown = (e: PointerEvent): void => {
    if (!props.clickPulse) return;
    pulses.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
    wake();
  };
  const onResize = (): void => {
    // En móviles la barra de direcciones cambia la altura sin que cambie el layout real.
    if (window.innerWidth === w && Math.abs(window.innerHeight - h) < 120) return;
    rebuild();
  };
  const onVisibility = (): void => {
    if (!document.hidden) return;
    cancelAnimationFrame(raf);
    running = false;
  };

  rebuild();
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);

  return {
    setColor(hex: string): void { props.color = hex; wake(); },
    destroy(): void {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
