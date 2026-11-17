import { OPENING_HOURS, TIME_ZONE, type DayIndex, type OpeningBlock } from '../data/site';

const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;
const DAY_LONG = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;
const SCHEMA_DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const ORDER: readonly DayIndex[] = [1, 2, 3, 4, 5, 6, 0];

export interface DayRow {
  readonly day: DayIndex;
  readonly label: string;
  /** `null` = cerrado ese día. */
  readonly range: { readonly opens: string; readonly closes: string } | null;
}

export type OpenStatus =
  | { readonly open: true; readonly closesAt: string }
  | { readonly open: false; readonly opensAt: string | null; readonly opensDay: DayIndex | null };

const toMinutes = (hhmm: string): number => {
  const [h = '0', m = '0'] = hhmm.split(':');
  return Number(h) * 60 + Number(m);
};

/** "08:00" → "8:00 a. m." (formato 12 h usado en Guatemala). */
export function formatTime(hhmm: string): string {
  const total = toMinutes(hhmm);
  const h24 = Math.floor(total / 60);
  const mm = String(total % 60).padStart(2, '0');
  const suffix = h24 >= 12 ? 'p. m.' : 'a. m.';
  return `${h24 % 12 === 0 ? 12 : h24 % 12}:${mm} ${suffix}`;
}

function blockFor(day: DayIndex, blocks: readonly OpeningBlock[]): OpeningBlock | undefined {
  return blocks.find((b) => b.days.includes(day));
}

/** Una fila por día, de lunes a domingo. */
export function weekRows(blocks: readonly OpeningBlock[] = OPENING_HOURS): DayRow[] {
  return ORDER.map((day) => {
    const b = blockFor(day, blocks);
    return { day, label: DAY_LONG[day], range: b ? { opens: b.opens, closes: b.closes } : null };
  });
}

/** Resumen corto agrupando días iguales: "Lun–Vie 8:00 a. m. – 5:00 p. m." */
export function summaryLines(blocks: readonly OpeningBlock[] = OPENING_HOURS): string[] {
  return blocks.map((b) => {
    const sorted = ORDER.filter((d) => b.days.includes(d));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const days =
      first === undefined || last === undefined
        ? ''
        : sorted.length === 1
          ? DAY_SHORT[first]
          : `${DAY_SHORT[first]}–${DAY_SHORT[last]}`;
    return `${days} ${formatTime(b.opens)} – ${formatTime(b.closes)}`;
  });
}

/** Día de la semana y minutos desde medianoche, en hora de Guatemala. */
export function zonedNow(now: Date): { day: DayIndex; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string): string => parts.find((p) => p.type === type)?.value ?? '';
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = Math.max(0, names.indexOf(get('weekday'))) as DayIndex;
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/** Estado "abierto/cerrado" para un instante dado, en hora de Guatemala. */
export function openStatus(now: Date, blocks: readonly OpeningBlock[] = OPENING_HOURS): OpenStatus {
  const { day: today, minutes } = zonedNow(now);
  const todayBlock = blockFor(today, blocks);
  if (todayBlock && minutes >= toMinutes(todayBlock.opens) && minutes < toMinutes(todayBlock.closes)) {
    return { open: true, closesAt: todayBlock.closes };
  }
  for (let offset = 0; offset < 7; offset++) {
    const day = ((today + offset) % 7) as DayIndex;
    const b = blockFor(day, blocks);
    if (!b) continue;
    if (offset === 0 && minutes >= toMinutes(b.opens)) continue;
    return { open: false, opensAt: b.opens, opensDay: offset === 0 ? null : day };
  }
  return { open: false, opensAt: null, opensDay: null };
}

export function statusLabel(status: OpenStatus): string {
  if (status.open) return `Abierto ahora, cierra a las ${formatTime(status.closesAt)}`;
  if (!status.opensAt) return 'Cerrado ahora';
  const when = status.opensDay === null ? 'hoy' : DAY_LONG[status.opensDay].toLowerCase();
  return `Cerrado ahora, abre ${when} a las ${formatTime(status.opensAt)}`;
}

/** Para JSON-LD (schema.org/OpeningHoursSpecification). */
export function schemaHours(blocks: readonly OpeningBlock[] = OPENING_HOURS) {
  return blocks.map((b) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: b.days.map((d) => SCHEMA_DAY[d]),
    opens: b.opens,
    closes: b.closes,
  }));
}
