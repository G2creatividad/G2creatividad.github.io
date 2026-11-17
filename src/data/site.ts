// ============================================================
// DATOS DEL NEGOCIO — fuente única de verdad.
// Todo lo que aparece repetido en el sitio (teléfono, horario,
// años de trayectoria, enlaces) sale de este archivo.
// ============================================================

export const SITE_URL = 'https://g2creatividad.github.io';

/** Año de fundación. Los "años de trayectoria" se calculan solos en cada compilación. */
export const FOUNDED_YEAR = 2003;
export const YEARS_OF_EXPERIENCE: number = new Date().getFullYear() - FOUNDED_YEAR;

/** Pon `true` cuando el portafolio esté listo: lo activa en menú, pie de página y sitemap. */
export const SHOW_PORTFOLIO = false;

export const BUSINESS = {
  name: 'G2 Creatividad',
  phoneDisplay: '4220-3700',
  phoneE164: '+50242203700',
  /** Número de WhatsApp con código de país, sin "+" ni espacios. */
  whatsappNumber: '50242203700',
  email: 'g2creatividad@gmail.com',
  facebook: 'https://www.facebook.com/g2creatividadguatemala/?locale=es_LA',
  /** Ficha del negocio en Google Maps: ahí Google muestra el horario oficial y las reseñas. */
  googleMaps: 'https://maps.app.goo.gl/HrFF8FZF4wkBH9D57',
  waze: 'https://waze.com/ul/h9fxe53hwe',
  address: {
    street: '28 calle 0-47, Zona 12',
    neighborhood: 'La Reformita',
    city: 'Ciudad de Guatemala',
    region: 'Guatemala',
    countryCode: 'GT',
  },
  geo: { lat: 14.596641787110398, lng: -90.55404087194962 },
} as const;

// ------------------------------------------------------------
// HORARIO DE ATENCIÓN
// ⚠️ CONFIRMAR: estos horarios son REFERENCIALES. Cámbialos por los
// reales. Días: 0 = domingo, 1 = lunes … 6 = sábado. Formato 24 h.
// Un día que no aparezca aquí se muestra como "Cerrado".
// Cuando los confirmes, pon HOURS_CONFIRMED = true: así el horario
// también se envía a Google (datos estructurados) y se quita el
// aviso de "horario referencial" de la página.
// ------------------------------------------------------------
export const HOURS_CONFIRMED = false;

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface OpeningBlock {
  readonly days: readonly DayIndex[];
  readonly opens: string;
  readonly closes: string;
}

export const OPENING_HOURS: readonly OpeningBlock[] = [
  { days: [1, 2, 3, 4, 5], opens: '08:00', closes: '17:00' },
  { days: [6], opens: '08:00', closes: '12:00' },
];

/** Zona horaria de Guatemala (UTC−6, sin horario de verano). */
export const TIME_ZONE = 'America/Guatemala';
