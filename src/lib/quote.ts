import { BUSINESS } from '../data/site';

export type Unit = 'cm' | 'm' | 'pulg';
export type Placement = 'interior' | 'exterior' | 'no-se';

export interface QuoteData {
  readonly name: string;
  readonly service: string;
  readonly width: string;
  readonly height: string;
  readonly unit: Unit;
  readonly quantity: number;
  readonly placement: Placement;
  readonly hasDesign: boolean;
  readonly needsInstall: boolean;
  readonly notes: string;
}

const PLACEMENT_LABEL: Record<Placement, string> = {
  interior: 'Interior',
  exterior: 'Exterior',
  'no-se': 'Aún no lo sé',
};

const UNIT_LABEL: Record<Unit, string> = { cm: 'cm', m: 'm', pulg: 'pulgadas' };

/** Arma el texto que se enviará por WhatsApp. Solo incluye lo que el cliente llenó. */
export function buildQuoteMessage(d: QuoteData): string {
  const lines: string[] = [`Hola, soy ${d.name.trim()}. Quisiera cotizar: ${d.service}.`, ''];
  if (d.width.trim() && d.height.trim()) {
    lines.push(`• Medidas aproximadas: ${d.width.trim()} × ${d.height.trim()} ${UNIT_LABEL[d.unit]}`);
  }
  lines.push(`• Cantidad: ${d.quantity}`);
  lines.push(`• Lugar de uso: ${PLACEMENT_LABEL[d.placement]}`);
  lines.push(`• Diseño: ${d.hasDesign ? 'Ya lo tengo' : 'Necesito ayuda con el diseño'}`);
  lines.push(`• Instalación: ${d.needsInstall ? 'Sí, la necesito' : 'No la necesito'}`);
  if (d.notes.trim()) lines.push('', `Detalles: ${d.notes.trim()}`);
  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type QuoteErrors = Partial<Record<'name' | 'service' | 'quantity' | 'size', string>>;

/** Validaciones; devuelve un mensaje en español por cada campo con problema. */
export function validateQuote(
  d: Pick<QuoteData, 'name' | 'service' | 'quantity' | 'width' | 'height'>,
): QuoteErrors {
  const errors: QuoteErrors = {};
  if (d.name.trim().length < 2) errors.name = 'Escribe tu nombre para saber cómo dirigirnos a ti.';
  if (!d.service) errors.service = 'Elige el servicio que quieres cotizar.';
  if (!Number.isInteger(d.quantity) || d.quantity < 1) errors.quantity = 'La cantidad debe ser un número entero, mínimo 1.';
  const hasW = d.width.trim() !== '';
  const hasH = d.height.trim() !== '';
  const numeric = /^\d+([.,]\d+)?$/;
  if (hasW !== hasH) errors.size = 'Completa ancho y alto, o deja ambos vacíos.';
  else if (hasW && (!numeric.test(d.width.trim()) || !numeric.test(d.height.trim()))) {
    errors.size = 'Usa solo números, por ejemplo 120 o 1.5.';
  }
  return errors;
}

export const isUnit = (v: string): v is Unit => v === 'cm' || v === 'm' || v === 'pulg';
export const isPlacement = (v: string): v is Placement => v === 'interior' || v === 'exterior' || v === 'no-se';
