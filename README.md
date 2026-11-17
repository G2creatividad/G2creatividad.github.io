# G2 Creatividad — sitio web

Sitio estático construido con [Astro](https://astro.build) y publicado en GitHub Pages
(`https://g2creatividad.github.io`). Cada `git push` a `main` compila y publica solo.

## Comandos

```bash
npm install        # primera vez
npm run dev        # desarrollo en http://localhost:4321
npm run check      # revisa tipos (TypeScript estricto) y errores en .astro
npm run build      # genera dist/ (lo hace GitHub Actions automáticamente)
```

Requiere Node 22.12 o superior (`.nvmrc` lo fija en 22).

## Qué editar y dónde

| Quiero cambiar…                              | Archivo                         |
| -------------------------------------------- | ------------------------------- |
| Teléfono, correo, dirección, enlaces         | `src/data/site.ts`              |
| **Horario de atención** (y `HOURS_CONFIRMED`) | `src/data/site.ts`              |
| Año de fundación (los "años" se calculan solos) | `src/data/site.ts` → `FOUNDED_YEAR` |
| Activar el portafolio                        | `src/data/site.ts` → `SHOW_PORTFOLIO` |
| Textos de servicios y páginas individuales   | `src/data/services.ts`          |
| Empresas y trabajos del portafolio           | `src/data/portfolio.js`         |
| Colores, tipografías, tokens                 | `src/styles/global.css`         |

Al añadir un servicio en `services.ts` se crean solos su tarjeta, su página
`/catalogo/<slug>/`, su entrada en el sitemap y su opción en el cotizador.

## Estructura

```
src/
  components/   Nav, Footer, ServiceCard, QuoteForm, BusinessHours, SeoHead…
    home/       secciones de la página de inicio
    service/    secciones de cada página de servicio
  data/         site.ts (negocio, horario) · services.ts · portfolio.js
  lib/          lógica pura: url, horario, cotizador, datos estructurados
  pages/        index, catalogo, catalogo/[slug], cotizar, contacto, 404, sitemap.xml
  scripts/      cursor-grid.ts, quote-form.ts, counters.ts, card-tilt.ts
  styles/       fonts.css, global.css, catalog.css, quote-form.css
  assets/fonts/ fuentes autoalojadas (licencia OFL incluida)
public/         logos, favicon, imagen para compartir (og-image.png)
```

## SEO

- Cada página tiene título, descripción, canonical, Open Graph y datos estructurados
  (`LocalBusiness`, `Service`, `BreadcrumbList`) — ver `src/components/SeoHead.astro`.
- `/sitemap.xml` se genera automáticamente. `robots.txt` apunta a él.
- La verificación de Google Search Console está en `public/google3c773ae9bad9053c.html`.
- Para que el horario también llegue a Google, confirma las horas y pon `HOURS_CONFIRMED = true`.
  Mantén igualmente al día la ficha de Google Business Profile (enlazada desde el sitio).

## Mantenimiento

- **Dependabot** (`.github/dependabot.yml`) abre solicitudes mensuales con actualizaciones.
- `package-lock.json` debe estar siempre en el repositorio (el workflow instala con él).
- El workflow recompila cada 1 de enero para actualizar los "años de trayectoria".
- Si cambias de dominio: actualiza `SITE_URL` en `src/data/site.ts` y `site` en `astro.config.mjs`
  (y quita `base` si lo hubiera).
