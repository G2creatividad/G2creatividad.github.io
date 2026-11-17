// ============================================================
// CATÁLOGO — un objeto por servicio. De aquí salen: las tarjetas
// del catálogo, cada página /catalogo/<slug>/, el sitemap, los
// datos estructurados y las opciones del cotizador.
//
// Para añadir un servicio nuevo: copia un bloque, cambia `slug`
// y los textos. La página se crea sola al compilar.
// ============================================================

export interface ServiceBenefit { readonly title: string; readonly text: string }
export interface ServiceFaq { readonly q: string; readonly a: string }
export interface ServiceSpec { readonly label: string; readonly value: string }

export interface Service {
  readonly slug: string;
  readonly title: string;
  /** Texto corto de la tarjeta del catálogo. */
  readonly desc: string;
  /** Contenido interno del <svg viewBox="0 0 48 48">. */
  readonly icon: string;
  /** Frase para el mensaje de WhatsApp: "quisiera cotizar {waQuery}". */
  readonly waQuery: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly h1: string;
  readonly intro: string;
  readonly specs: readonly ServiceSpec[];
  readonly uses: readonly string[];
  readonly benefits: readonly ServiceBenefit[];
  readonly faqs: readonly ServiceFaq[];
  readonly related: readonly string[];
}

const PRICE_FAQ = (what: string): ServiceFaq => ({
  q: `¿Cuánto cuesta ${what}?`,
  a: 'Depende del tamaño, el material, los acabados y si incluye instalación. Con las medidas aproximadas y una idea del diseño te damos un precio por WhatsApp; puedes usar el cotizador de esta página para enviarnos esos datos ordenados.',
});

export const SERVICES: readonly Service[] = [
  {
    slug: 'rotulos-acrilico',
    title: 'Rótulos en acrílico',
    desc: 'Paneles pintados o translúcidos de alto brillo fabricados con corte laser, ideales para señalización interior y letreros iluminados que destacan de día y de noche.',
    icon: `<rect x="9" y="7" width="27" height="34" rx="1"/><line x1="15" y1="7" x2="9" y2="15"/><line x1="24" y1="7" x2="15" y2="17"/><circle cx="29" cy="27" r="2.4"/>`,
    waQuery: 'un rótulo en acrílico',
    seoTitle: 'Rótulos en acrílico en Guatemala | G2 Creatividad',
    seoDescription: 'Rótulos y letreros en acrílico con corte láser en Ciudad de Guatemala: placas, letreros iluminados y señalización interior. Cotiza por WhatsApp.',
    h1: 'Rótulos en acrílico en Guatemala',
    intro: 'El acrílico da un acabado limpio y de alto brillo que se ve profesional desde cerca. Lo cortamos con láser para lograr bordes precisos y lo fabricamos pintado o translúcido, según cómo quieras que se vea tu marca de día y de noche.',
    specs: [
      { label: 'Material', value: 'Acrílico (PMMA)' },
      { label: 'Corte', value: 'Láser' },
      { label: 'Acabado', value: 'Pintado o translúcido, brillo alto' },
      { label: 'Uso ideal', value: 'Interior e iluminados' },
    ],
    uses: ['Placas de recepción y oficinas', 'Letreros iluminados (cajas de luz)', 'Directorios y señalización interior', 'Logotipos para pared', 'Identificación de puertas y áreas'],
    benefits: [
      { title: 'Bordes precisos', text: 'El corte láser permite formas y letras finas sin rebabas.' },
      { title: 'Se ve de día y de noche', text: 'Al ser translúcido admite iluminación interna.' },
      { title: 'Acabado premium', text: 'Superficie lisa y brillante que transmite calidad.' },
      { title: 'Fácil de mantener', text: 'Se limpia con un paño suave, sin pintura que se descascare.' },
    ],
    faqs: [
      PRICE_FAQ('un rótulo en acrílico'),
      { q: '¿Se puede iluminar?', a: 'Sí. El acrílico translúcido se usa en cajas de luz y letreros iluminados. Cuéntanos dónde irá y te recomendamos la mejor opción.' },
      { q: '¿Sirve para exteriores?', a: 'Puede usarse en exteriores, aunque con sol y lluvia directos conviene elegir el tipo de acrílico y el acabado adecuados. Te asesoramos según la ubicación.' },
    ],
    related: ['rotulos-pvc', 'letras-tipo-block', 'sandblast'],
  },
  {
    slug: 'rotulos-pvc',
    title: 'Rótulos en PVC',
    desc: 'Ligero, resistente a la intemperie y económico: perfecto para rotulación exterior de alto impacto visual.',
    icon: `<path d="M8 15 L24 7 L40 15 L40 33 L24 41 L8 33 Z"/><path d="M8 15 L24 23 L40 15"/><line x1="24" y1="23" x2="24" y2="41"/>`,
    waQuery: 'un rótulo en PVC',
    seoTitle: 'Rótulos en PVC en Guatemala | G2 Creatividad',
    seoDescription: 'Rótulos en PVC espumado: livianos, resistentes a la humedad y económicos. Letreros para negocios, obra y eventos en Guatemala. Cotiza por WhatsApp.',
    h1: 'Rótulos en PVC en Guatemala',
    intro: 'El PVC espumado (también conocido como sintra) es la opción práctica para rótulos grandes sin gastar de más: es liviano, no absorbe humedad y recibe muy bien el vinil de corte y la impresión directa.',
    specs: [
      { label: 'Material', value: 'PVC espumado (sintra)' },
      { label: 'Peso', value: 'Liviano, fácil de instalar' },
      { label: 'Acabado', value: 'Vinil de corte o impresión' },
      { label: 'Uso ideal', value: 'Interior y exterior' },
    ],
    uses: ['Letreros de negocio y local comercial', 'Rótulos de obra y proyectos', 'Señalización informativa', 'Letreros para eventos y ferias', 'Paneles promocionales'],
    benefits: [
      { title: 'Económico', text: 'Buena relación entre costo y tamaño: ideal para rótulos grandes.' },
      { title: 'Resiste la humedad', text: 'No se pudre ni se hincha con la lluvia o el ambiente húmedo.' },
      { title: 'Fácil de instalar', text: 'Su poco peso simplifica el montaje en pared, estructura o poste.' },
      { title: 'Versátil', text: 'Admite vinil de corte, impresión a todo color y cortes por contorno.' },
    ],
    faqs: [
      PRICE_FAQ('un rótulo en PVC'),
      { q: '¿Qué diferencia hay entre PVC y ACM?', a: 'El PVC es más liviano y económico; el ACM (aluminio compuesto) es más rígido y de acabado metálico, pensado para fachadas de larga duración. Si dudas, te recomendamos según tu caso.' },
      { q: '¿Aguanta el sol y la lluvia?', a: 'Resiste bien la humedad y se usa en exteriores. Para exposición muy prolongada al sol conviene un acabado protegido; lo definimos contigo al cotizar.' },
    ],
    related: ['rotulos-acm', 'vinil-de-corte', 'impresion-full-color'],
  },
  {
    slug: 'rotulos-acm',
    title: 'Rótulos en ACM',
    desc: 'Paneles de aluminio compuesto, rígidos y de acabado metálico, para fachadas y letreros corporativos de larga duración.',
    icon: `<rect x="8" y="10" width="32" height="28" rx="1"/><line x1="8" y1="19" x2="40" y2="19"/><line x1="8" y1="29" x2="40" y2="29"/>`,
    waQuery: 'un rótulo en ACM',
    seoTitle: 'Rótulos en ACM en Guatemala | G2 Creatividad',
    seoDescription: 'Rótulos y fachadas en ACM (aluminio compuesto): paneles rígidos, planos y de larga duración para negocios e industrias en Guatemala. Cotiza por WhatsApp.',
    h1: 'Rótulos en ACM (aluminio compuesto) en Guatemala',
    intro: 'El ACM combina dos láminas de aluminio con un núcleo interno: queda rígido, plano y con un acabado metálico que luce corporativo. Es la base de muchas fachadas y letreros que deben verse bien durante años.',
    specs: [
      { label: 'Material', value: 'ACM, aluminio compuesto' },
      { label: 'Estructura', value: 'Rígido y plano' },
      { label: 'Acabado', value: 'Metálico, con vinil o impresión' },
      { label: 'Uso ideal', value: 'Fachadas y exteriores' },
    ],
    uses: ['Fachadas de locales y edificios', 'Letreros corporativos', 'Tótems y rótulos de gran formato', 'Revestimientos decorativos', 'Paneles de señalización exterior'],
    benefits: [
      { title: 'Rígido y plano', text: 'Mantiene la forma aun en tamaños grandes, sin ondularse.' },
      { title: 'Pensado para exteriores', text: 'El aluminio resiste la intemperie mejor que materiales más blandos.' },
      { title: 'Imagen corporativa', text: 'Su acabado metálico da un aspecto sobrio y profesional.' },
      { title: 'Combina con otros procesos', text: 'Admite vinil, impresión y letras corpóreas montadas encima.' },
    ],
    faqs: [
      PRICE_FAQ('un rótulo en ACM'),
      { q: '¿Cuándo conviene ACM en lugar de PVC?', a: 'Cuando el rótulo es grande, va en fachada o necesitas máxima rigidez y durabilidad. Para usos más sencillos o temporales, el PVC suele alcanzar.' },
      { q: '¿Pueden instalarlo?', a: 'Sí, ofrecemos instalación en sitio. Cuéntanos la ubicación y la altura aproximada para incluirla en la cotización.' },
    ],
    related: ['letras-tipo-block', 'rotulos-pvc', 'impresion-full-color'],
  },
  {
    slug: 'letras-tipo-block',
    title: 'Letras tipo block',
    desc: 'Letras corpóreas con volumen real, para una identidad de marca que se nota de día, de noche y desde lejos.',
    icon: `<path d="M14 8 V38 H30"/><path d="M17 13 V43 H35"/><line x1="12" y1="8" x2="17" y2="13"/><line x1="12" y1="38" x2="17" y2="43"/><line x1="30" y1="38" x2="35" y2="43"/>`,
    waQuery: 'letras tipo block',
    seoTitle: 'Letras tipo block (corpóreas) en Guatemala | G2 Creatividad',
    seoDescription: 'Letras tipo block (corpóreas) con volumen para fachadas y recepciones en Guatemala. Fabricación e instalación con tu logotipo. Cotiza por WhatsApp.',
    h1: 'Letras tipo block (corpóreas) en Guatemala',
    intro: 'Las letras tipo block, también llamadas corpóreas o en relieve, tienen volumen real: proyectan sombra, dan profundidad y hacen que el nombre de tu negocio se lea con fuerza desde la calle y desde adentro.',
    specs: [
      { label: 'Tipo', value: 'Letras y logotipos con volumen' },
      { label: 'Materiales', value: 'Rígidos como acrílico, PVC o ACM' },
      { label: 'Montaje', value: 'Fachada o pared interior' },
      { label: 'Uso ideal', value: 'Identidad de marca' },
    ],
    uses: ['Nombre de negocio en fachada', 'Logotipo en recepción', 'Letras para oficinas e instituciones', 'Números y nomenclatura', 'Rótulos de centros comerciales'],
    benefits: [
      { title: 'Presencia', text: 'El relieve crea sombras y profundidad que llaman la atención.' },
      { title: 'Se adapta a tu tipografía', text: 'Cortamos la forma exacta de tu logotipo o la fuente que elijas.' },
      { title: 'Montaje limpio', text: 'Se instala sobre pared o panel, sin marcos que distraigan.' },
      { title: 'Combinable', text: 'Puedes montarlas sobre un panel de ACM o un fondo pintado.' },
    ],
    faqs: [
      PRICE_FAQ('un juego de letras tipo block'),
      { q: '¿Qué necesito para cotizar?', a: 'El texto o logotipo, la altura aproximada de las letras y dónde irán instaladas. Si tienes el diseño en digital, envíalo por WhatsApp.' },
      { q: '¿De qué material se hacen?', a: 'Según el proyecto usamos materiales rígidos como acrílico, PVC o ACM. Te recomendamos el más adecuado para interior o exterior.' },
    ],
    related: ['rotulos-acm', 'rotulos-acrilico', 'vinil-de-corte'],
  },
  {
    slug: 'vinil-de-corte',
    title: 'Vinil de corte electrónico',
    desc: 'Rotulación vehicular, vitrinas y gráficos de precisión, cortados a la medida exacta de tu diseño.',
    icon: `<path d="M6 36 C16 36 16 12 26 12 C33 12 33 22 41 22"/><path d="M41 22 L35 19 M41 22 L38 28"/>`,
    waQuery: 'vinil de corte',
    seoTitle: 'Vinil de corte electrónico en Guatemala | G2 Creatividad',
    seoDescription: 'Vinil de corte electrónico en Guatemala: rotulación vehicular, vitrinas y paredes con gráficos de precisión cortados a tu diseño. Cotiza por WhatsApp.',
    h1: 'Vinil de corte electrónico en Guatemala',
    intro: 'Con el vinil de corte electrónico, una máquina recorta tu diseño en una lámina adhesiva de color con precisión milimétrica. Es la forma más limpia de rotular vehículos, vitrinas, paredes y cualquier superficie lisa.',
    specs: [
      { label: 'Proceso', value: 'Corte electrónico por contorno' },
      { label: 'Material', value: 'Vinil adhesivo de colores' },
      { label: 'Superficies', value: 'Vehículos, vidrio, pared, paneles' },
      { label: 'Uso ideal', value: 'Textos y logotipos de color sólido' },
    ],
    uses: ['Rotulación de vehículos y flotillas', 'Vitrinas y puertas de vidrio', 'Textos y logotipos en pared', 'Horarios y avisos para local', 'Rotulación de paneles de PVC o ACM'],
    benefits: [
      { title: 'Precisión', text: 'Cada letra y forma se corta exacta al archivo de diseño.' },
      { title: 'Acabado limpio', text: 'Sin fondo ni marco: solo el color de tu marca sobre la superficie.' },
      { title: 'Muchos colores', text: 'Amplia gama de colores sólidos para respetar tu identidad.' },
      { title: 'Rápido de aplicar', text: 'Se aplica con cinta de transferencia, sin obra ni pintura.' },
    ],
    faqs: [
      PRICE_FAQ('rotular con vinil de corte'),
      { q: '¿Se puede quitar después?', a: 'Sí. El vinil puede retirarse, aunque el resultado depende de la superficie y del tiempo que lleve aplicado. Lo vemos contigo según el caso.' },
      { q: '¿Rotulan vehículos?', a: 'Sí, rotulamos vehículos individuales y flotillas con tu logotipo, nombre y datos de contacto.' },
    ],
    related: ['impresion-full-color', 'rotulos-pvc', 'sandblast'],
  },
  {
    slug: 'impresion-full-color',
    title: 'Impresión full color',
    desc: 'Gran formato de alta resolución para banners, lonas, vinil impreso y gráficos publicitarios con color fiel.',
    icon: `<rect x="10" y="16" width="28" height="14" rx="1"/><rect x="15" y="6" width="18" height="10"/><rect x="13" y="30" width="22" height="12"/><circle cx="18" cy="36" r="1.3" fill="currentColor" stroke="none"/><circle cx="24" cy="36" r="1.3" fill="currentColor" stroke="none"/><circle cx="30" cy="36" r="1.3" fill="currentColor" stroke="none"/>`,
    waQuery: 'impresión full color',
    seoTitle: 'Impresión full color en Guatemala | G2 Creatividad',
    seoDescription: 'Impresión full color de alta resolución en gran formato: lonas, banners y vinil impreso en Ciudad de Guatemala. Cotiza por WhatsApp.',
    h1: 'Impresión full color en gran formato en Guatemala',
    intro: 'Cuando tu diseño lleva fotografías, degradados o muchos colores, la impresión full color de alta resolución es lo que lo hace posible: gran formato con colores fieles y detalle nítido, listo para colgar o pegar.',
    specs: [
      { label: 'Proceso', value: 'Impresión digital full color' },
      { label: 'Resolución', value: 'Alta resolución' },
      { label: 'Soportes', value: 'Lona, vinil, banner y más' },
      { label: 'Uso ideal', value: 'Diseños con fotos y degradados' },
    ],
    uses: ['Lonas y mantas publicitarias', 'Banners y roll-ups', 'Vinil impreso para vitrinas y vehículos', 'Gráficos para pared y exhibidores', 'Material para eventos y ferias'],
    benefits: [
      { title: 'Color fiel', text: 'Reproducimos los colores de tu diseño con la mayor fidelidad posible.' },
      { title: 'Detalle nítido', text: 'La alta resolución mantiene definidos textos pequeños y fotografías.' },
      { title: 'Gran formato', text: 'Piezas grandes sin perder calidad, para verse a distancia.' },
      { title: 'Se combina', text: 'Puede montarse sobre PVC, ACM o aplicarse directamente en superficies.' },
    ],
    faqs: [
      PRICE_FAQ('imprimir en gran formato'),
      { q: '¿Qué archivo necesito?', a: 'Un diseño en alta resolución (PDF, AI, PSD o imagen grande) con las medidas finales. Si no lo tienes, cuéntanos la idea y te orientamos.' },
      { q: '¿Pueden diseñarlo?', a: 'Sí, podemos ayudarte con el diseño y la asesoría de materiales según el uso que le darás.' },
    ],
    related: ['vinil-de-corte', 'rotulos-pvc', 'rotulos-acm'],
  },
  {
    slug: 'seguridad-industrial',
    title: 'Seguridad industrial',
    desc: 'Señalización normada para plantas, bodegas y obra: rótulos de riesgo, rutas de evacuación y señalización de seguridad.',
    icon: `<path d="M24 6 L44 40 H4 Z"/><line x1="24" y1="18" x2="24" y2="28"/><circle cx="24" cy="33" r="1.3" fill="currentColor" stroke="none"/>`,
    waQuery: 'señalización de seguridad industrial',
    seoTitle: 'Seguridad industrial: rótulos en Guatemala | G2 Creatividad',
    seoDescription: 'Rótulos de seguridad industrial en Guatemala: advertencia, prohibición, rutas de evacuación y equipo contra incendios para plantas, bodegas y obra.',
    h1: 'Señalización de seguridad industrial en Guatemala',
    intro: 'Una buena señalización previene accidentes y ordena la circulación en plantas, bodegas, obras y edificios. Fabricamos los rótulos de seguridad que necesita tu instalación, con los símbolos y colores que se reconocen de un vistazo.',
    specs: [
      { label: 'Tipos', value: 'Advertencia, prohibición, obligación, emergencia' },
      { label: 'Soportes', value: 'PVC, ACM u otros materiales rígidos' },
      { label: 'Referencias', value: 'ISO 7010, NRD2 de CONRED' },
      { label: 'Uso ideal', value: 'Plantas, bodegas, obra y edificios' },
    ],
    uses: ['Rutas de evacuación y salidas de emergencia', 'Ubicación de extintores y equipo contra incendios', 'Uso obligatorio de equipo de protección', 'Advertencia de riesgos (eléctrico, químico, altura)', 'Numeración y rotulación de áreas'],
    benefits: [
      { title: 'Se entiende rápido', text: 'Símbolos y colores estandarizados que cualquier persona reconoce.' },
      { title: 'Material resistente', text: 'Lo fabricamos en soportes pensados para uso continuo en planta y obra.' },
      { title: 'A tu medida', text: 'Rótulos por tamaño, texto y cantidad según tu instalación.' },
      { title: 'Asesoría', text: 'Te ayudamos a elegir qué señales necesita cada área.' },
    ],
    faqs: [
      PRICE_FAQ('la señalización de seguridad'),
      { q: '¿Cumple con la normativa?', a: 'Trabajamos con las referencias habituales, como la norma ISO 7010 y los lineamientos de CONRED (NRD2). La normativa exacta que aplica a tu instalación debes confirmarla con tu responsable de seguridad.' },
      { q: '¿Pueden hacer un lote completo?', a: 'Sí. Si nos compartes un croquis o el listado de áreas, cotizamos el conjunto de rótulos para toda la instalación.' },
    ],
    related: ['rotulos-pvc', 'rotulos-acm', 'impresion-full-color'],
  },
  {
    slug: 'sandblast',
    title: 'Sandblast',
    desc: 'Grabado con acabado esmerilado en vidrio, madera y piedra — ideal para placas y detalles arquitectónicos.',
    icon: `<line x1="36" y1="6" x2="36" y2="42"/><line x1="32" y1="12" x2="40" y2="12"/><line x1="32" y1="20" x2="40" y2="20"/><line x1="32" y1="28" x2="40" y2="28"/><path d="M6 24 H16 L22 18"/><circle cx="20" cy="26" r="1" fill="currentColor" stroke="none"/><circle cx="24" cy="22" r="1" fill="currentColor" stroke="none"/><circle cx="26" cy="28" r="1" fill="currentColor" stroke="none"/>`,
    waQuery: 'sandblast',
    seoTitle: 'Sandblast: grabado en vidrio y piedra | G2 Creatividad',
    seoDescription: 'Sandblast (arenado) en Guatemala: grabado esmerilado en vidrio, espejos, madera y piedra para placas, divisiones de oficina y detalles arquitectónicos.',
    h1: 'Sandblast: grabado en vidrio, madera y piedra',
    intro: 'El sandblast, o arenado, proyecta un abrasivo a presión sobre la superficie para dejar un acabado esmerilado permanente. Es ideal para logotipos y diseños en vidrio, y para placas grabadas en piedra o madera.',
    specs: [
      { label: 'Proceso', value: 'Arenado con máscara de diseño' },
      { label: 'Superficies', value: 'Vidrio, espejo, madera, piedra' },
      { label: 'Acabado', value: 'Esmerilado, permanente' },
      { label: 'Uso ideal', value: 'Placas y detalles arquitectónicos' },
    ],
    uses: ['Divisiones de oficina en vidrio', 'Puertas y ventanas con logotipo', 'Placas conmemorativas en piedra', 'Espejos decorados', 'Grabado en madera'],
    benefits: [
      { title: 'Permanente', text: 'El diseño forma parte de la superficie: no se despega ni se desgasta como un adhesivo.' },
      { title: 'Elegante', text: 'El acabado esmerilado aporta privacidad con una apariencia sobria.' },
      { title: 'Muchos materiales', text: 'Funciona en vidrio, piedra, madera y otras superficies.' },
      { title: 'Diseños a medida', text: 'Logotipos, textos, patrones o ilustraciones según tu archivo.' },
    ],
    faqs: [
      PRICE_FAQ('un trabajo de sandblast'),
      { q: '¿Se puede hacer sobre un vidrio ya instalado?', a: 'Depende del tamaño y del lugar. Cuéntanos por WhatsApp dónde está y te decimos si se trabaja en sitio o en taller.' },
      { q: '¿Qué diferencia hay con el vinil esmerilado?', a: 'El vinil esmerilado imita el efecto y puede retirarse; el sandblast graba el vidrio de forma permanente.' },
    ],
    related: ['rotulos-acrilico', 'vinil-de-corte', 'letras-tipo-block'],
  },
];

export const getService = (slug: string): Service | undefined => SERVICES.find((s) => s.slug === slug);

export const servicePath = (slug: string): string => `/catalogo/${slug}/`;

export const whatsappLinkFor = (service: Service, number: string): string =>
  `https://wa.me/${number}?text=${encodeURIComponent(`Hola, quisiera cotizar ${service.waQuery}`)}`;
