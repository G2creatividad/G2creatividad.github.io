# G2 Creatividad — sitio web

Construido con [Astro](https://astro.build). Genera HTML/CSS/JS estático puro —
no necesita servidor Node en producción, solo en el paso de compilación.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:4321

## Compilar para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con el sitio ya compilado: HTML, CSS y JS
planos, listos para subir a cualquier hosting (cPanel, Netlify, Vercel,
GitHub Pages, etc.) exactamente como subirías un sitio HTML normal.
No hace falta Node.js en el servidor de hosting, solo en la computadora
donde compilas.

## Estructura

```
src/
  components/   Nav, Footer, tarjetas del catálogo, tarjeta de portafolio
  data/         portfolio.js — datos del portafolio por empresa (editar aquí)
  layouts/      BaseLayout.astro — head, fuentes, tema claro/oscuro
  pages/        index.astro, catalogo.astro, portafolio.astro, contacto.astro
  scripts/      cursor-grid.js — efecto de fondo interactivo
  styles/       global.css — tokens de color, tipografía, utilidades
public/         logo-light.png, logo-dark.png (archivos estáticos)
```

## Cómo agregar una empresa al portafolio

Edita `src/data/portfolio.js` — instrucciones detalladas están comentadas
al inicio del archivo. Resumen: copia el objeto de la empresa de ejemplo,
cambia los textos, y si tienes fotos reales colócalas en `public/portfolio/`
y referencia la ruta en el campo `image` de cada proyecto.

## Colores y modo oscuro/claro

Editables en `src/styles/global.css`, dentro de `html[data-theme="light"]`
y `html[data-theme="dark"]`.

## Dominio y hosting

Conectar un dominio a la carpeta `dist/` compilada funciona igual que con
cualquier sitio HTML estático — no hay nada especial que configurar por
usar Astro. Sube el contenido de `dist/` a la raíz de tu hosting.
