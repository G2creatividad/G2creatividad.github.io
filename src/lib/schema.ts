import { BUSINESS, FOUNDED_YEAR, HOURS_CONFIRMED, SITE_URL } from '../data/site';
import { SERVICES, servicePath, type Service } from '../data/services';
import { schemaHours } from './hours';
import { absoluteUrl } from './url';

export type JsonLd = Record<string, unknown>;

export const BUSINESS_ID = `${SITE_URL}/#negocio`;
const WEBSITE_ID = `${SITE_URL}/#sitio`;

/** Negocio local: lo que Google usa para el panel de información y el mapa. */
export function localBusinessSchema(): JsonLd {
  return {
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: BUSINESS.name,
    description:
      'Fabricación de rótulos en acrílico, PVC y ACM, letras tipo block, vinil de corte, impresión full color, seguridad industrial y sandblast en Ciudad de Guatemala.',
    url: absoluteUrl('/'),
    image: absoluteUrl('/og-image.png'),
    logo: absoluteUrl('/icon-192.png'),
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    foundingDate: String(FOUNDED_YEAR),
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      addressCountry: BUSINESS.address.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
    hasMap: BUSINESS.googleMaps,
    areaServed: { '@type': 'Country', name: 'Guatemala' },
    ...(HOURS_CONFIRMED ? { openingHoursSpecification: schemaHours() } : {}),
    sameAs: [BUSINESS.facebook],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo de servicios',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, url: absoluteUrl(servicePath(s.slug)) },
      })),
    },
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: BUSINESS.name,
    alternateName: ['g2creatividad', 'G2 Creatividad Guatemala'],
    url: absoluteUrl('/'),
    inLanguage: 'es-GT',
    publisher: { '@id': BUSINESS_ID },
  };
}

export function serviceSchema(service: Service): JsonLd {
  return {
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.seoDescription,
    url: absoluteUrl(servicePath(service.slug)),
    provider: { '@id': BUSINESS_ID },
    areaServed: { '@type': 'Country', name: 'Guatemala' },
  };
}

export interface Crumb { readonly name: string; readonly path: string }

export function breadcrumbSchema(crumbs: readonly Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Serializa varios nodos en un solo bloque JSON-LD seguro para incrustar en HTML. */
export function toJsonLdScript(nodes: readonly JsonLd[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
