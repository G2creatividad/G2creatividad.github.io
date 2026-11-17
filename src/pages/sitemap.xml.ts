import type { APIRoute } from 'astro';
import { SERVICES, servicePath } from '../data/services';
import { SHOW_PORTFOLIO } from '../data/site';
import { absoluteUrl } from '../lib/url';

// Genera /sitemap.xml automáticamente con todas las páginas indexables.
// (Ya no hace falta editar un sitemap a mano al añadir servicios.)
export const GET: APIRoute = () => {
  const paths: string[] = [
    '/',
    '/catalogo/',
    ...SERVICES.map((s) => servicePath(s.slug)),
    '/cotizar/',
    '/contacto/',
    ...(SHOW_PORTFOLIO ? ['/portafolio/'] : []),
  ];
  const urls = paths.map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
