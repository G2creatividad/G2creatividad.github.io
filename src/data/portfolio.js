// ============================================================
// PORTAFOLIO — datos de proyectos, organizados por empresa/cliente.
// ============================================================
// Cómo agregar una empresa nueva:
//   1) Copia el objeto "Empresa Ejemplo, S.A." de abajo (desde { hasta },).
//   2) Cambia name, sector y blurb por los datos reales del cliente.
//   3) En "projects", agrega un objeto por cada trabajo realizado para
//      esa empresa: title, service (debe coincidir con un servicio del
//      catálogo, se usa solo como etiqueta), description e image.
//   4) Si tienes una foto real del proyecto, guárdala en
//      /public/portfolio/nombre-del-archivo.jpg y pon esa ruta en
//      "image", por ejemplo: image: "/portfolio/torre-azul-fachada.jpg"
//   5) Si todavía no tienes la foto, deja image: null — la tarjeta
//      muestra automáticamente un color de relleno en su lugar, para
//      que la página nunca se vea rota mientras reúnes las fotos.
//
// No hay límite de empresas ni de proyectos por empresa: agrega tantos
// objetos como necesites en el arreglo "companies".
// ============================================================

export const companies = [
  {
    name: "Empresa Ejemplo, S.A.",
    sector: "Ejemplo — reemplaza con el nombre real del cliente",
    blurb: "Este bloque es una plantilla. Duplícalo en portfolio.js y cambia los textos e imágenes por los de cada cliente real.",
    projects: [
      {
        title: "Fachada corporativa en ACM",
        service: "Rótulos en ACM",
        description: "Rótulo de fachada con letras iluminadas e instalación en altura.",
        image: null,
        swatch: "acm"
      },
      {
        title: "Señalización interna de planta",
        service: "Seguridad industrial",
        description: "Rutas de evacuación, señalización de riesgo y numeración de áreas.",
        image: null,
        swatch: "seguridad"
      },
      {
        title: "Vinil vehicular de flotilla",
        service: "Vinil de corte electrónico",
        description: "Rotulación de 6 vehículos con la identidad de marca del cliente.",
        image: null,
        swatch: "vinil"
      }
    ]
  }

  // 👉 Agrega aquí la siguiente empresa real, copiando la estructura de arriba.
];
