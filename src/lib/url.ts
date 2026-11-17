import { SITE_URL } from '../data/site';

const BASE: string = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Convierte una ruta interna en un enlace correcto para el despliegue:
 * respeta `base` de astro.config y añade la barra final en páginas
 * (GitHub Pages redirige /catalogo → /catalogo/, así evitamos ese salto).
 */
export function withBase(path: string): string {
  const [, rawPath = '', suffix = ''] = /^([^?#]*)(.*)$/.exec(path) ?? [];
  const pathname = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const lastSegment = pathname.split('/').pop() ?? '';
  const needsSlash = !pathname.endsWith('/') && !lastSegment.includes('.');
  return `${BASE}${pathname}${needsSlash ? '/' : ''}${suffix}`;
}

/** URL absoluta (para canonical, Open Graph y datos estructurados). */
export function absoluteUrl(path: string): string {
  return new URL(withBase(path), SITE_URL).href;
}
