import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const distDirectory = path.join(projectRoot, "dist");
const serverDirectory = path.join(projectRoot, "dist-ssr");
const expectedRoutes = [
  {
    pathname: "/",
    file: "index.html",
    lang: "es",
    ogImage: {
      path: "/img/og/brand-v1/home-es-1200x630.png",
      alt: "devrodri, de Rodrigo Opalo: Sitios, sistemas y productos digitales a medida.",
      sha256: "8b9de91627cecabd980bf49052308aa1b0daabeb1374a00e454eb07b7fb81934",
    },
    title: "Rodrigo Opalo | Sitios, sistemas y automatización",
    description:
      "Desarrollo sitios, aplicaciones y sistemas a medida, además de automatizaciones e integraciones orientadas a objetivos reales de negocio.",
    content: "Sitios web que comunican y convierten.",
    metadataHash:
      "aca8bbb6ec446419f199cc7fa32df16e3f818f64f9a0b21537f6f6d566e9f992",
    noJavaScriptMarkers: 17,
  },
  {
    pathname: "/portfolio",
    file: "portfolio/index.html",
    lang: "es",
    ogImage: {
      path: "/img/og/brand-v1/portfolio-es-1200x630.png",
      alt: "Portfolio de devrodri: sitios, sistemas y productos digitales.",
      sha256: "adff8e5429a3139b6087a74a8e522e6d9c64657fdc1f60ee6d90abaf5624d0bf",
    },
    title: "Portfolio: sitios, sistemas y productos | Rodrigo Opalo",
    description:
      "Explorá proyectos de sistemas, sitios web, e-commerce y estrategia de marca, con detalles de alcance, rol y tecnología.",
    content: "Algunos trabajos",
    metadataHash:
      "e71cd38df788eae0835cd411fed71d20e75aec9e2b8659841559758753416cc7",
    noJavaScriptMarkers: 9,
  },
  {
    pathname: "/portfolio/lem-box",
    file: "portfolio/lem-box/index.html",
    lang: "es",
    ogImage: {
      path: "/img/og/brand-v1/lem-box-es-1200x630.png",
      alt: "Caso de estudio de LEM-BOX: una plataforma digital conectada a una operación logística real.",
      sha256: "86b91da86ef4815db42894319737b8638e7cfa0f4dc5fd549cecd4d9b8e43d53",
    },
    title: "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
    description:
      "Caso de producto propio: un ecosistema digital conectado con la operación logística de LEM-BOX en Estados Unidos, Uruguay y Argentina.",
    content: "Un producto conectado a una operación real",
    metadataHash:
      "10ae192625ddec2c5603c58a455d99c251190809b112b79b5aab8c7f9aec3e71",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/en",
    file: "en/index.html",
    lang: "en",
    ogImage: {
      path: "/img/og/brand-v1/home-en-1200x630.png",
      alt: "devrodri by Rodrigo Opalo: Custom websites, systems, and digital products.",
      sha256: "ca829838b11b8aabc12e68e6bc955f533cf267175d95997ddd8caf82d99d8537",
    },
    title: "Rodrigo Opalo | Websites, systems and automation",
    description:
      "I build custom websites, applications, and systems, plus automations and integrations aligned with real business goals.",
    content: "Websites built to communicate and convert.",
    metadataHash:
      "261dab1d1914a931c67830443b56daa50d0958bfd068cd5cfbb5aa775867654d",
    noJavaScriptMarkers: 17,
  },
  {
    pathname: "/en/portfolio",
    file: "en/portfolio/index.html",
    lang: "en",
    ogImage: {
      path: "/img/og/brand-v1/portfolio-en-1200x630.png",
      alt: "devrodri portfolio: websites, systems, and digital products.",
      sha256: "dce128997291a0d2094a38e8083327e72c04636a32a59212ccdcc5a8b58df56e",
    },
    title: "Portfolio: websites, systems and products | Rodrigo Opalo",
    description:
      "Explore systems, websites, e-commerce, and brand strategy projects with details on scope, role, and technology.",
    content: "Some Work",
    metadataHash:
      "c1ac372e3b0249fa16ff041e2e97b7bde63aa062a851f287ea2aebec92d0549b",
    noJavaScriptMarkers: 9,
  },
  {
    pathname: "/en/portfolio/lem-box",
    file: "en/portfolio/lem-box/index.html",
    lang: "en",
    ogImage: {
      path: "/img/og/brand-v1/lem-box-en-1200x630.png",
      alt: "LEM-BOX case study: a digital platform connected to a real logistics operation.",
      sha256: "3efe5980a6ddb71abf6cee9743b22fcdce026ed8be033a9b80495ac929d83b09",
    },
    title: "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
    description:
      "Own-product case study: a digital ecosystem connected to LEM-BOX's logistics operation across the United States, Uruguay, and Argentina.",
    content: "A product connected to a real operation",
    metadataHash:
      "7cef537d87cf4f20c6ea73146f1e5b119cd0e60885cc957d12e231276d1676a7",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/servicios",
    file: "servicios/index.html",
    lang: "es",
    ogImage: {
      path: "/img/og/brand-v1/services-es-1200x630.png",
      alt: "Servicios de devrodri: sitios web, sistemas y automatización para empresas.",
      sha256: "61319523d564908a7906166c79732163c85145d790654de8904b40d4a3ce93fb",
    },
    title: "Servicios de desarrollo web y software a medida | Rodrigo Opalo",
    description:
      "Desarrollo sitios web profesionales, sistemas a medida y automatizaciones para empresas. Trabajo directo conmigo, en español e inglés, desde el sur de Florida y en remoto para Estados Unidos y Latinoamérica.",
    content: "Sitios web, sistemas y automatización para empresas.",
    metadataHash:
      "71305031c1b44c17f10d39782992c2c353b8bc134ba2506a6dd35b321ed7cae1",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/en/services",
    file: "en/services/index.html",
    lang: "en",
    ogImage: {
      path: "/img/og/brand-v1/services-en-1200x630.png",
      alt: "devrodri services: websites, custom systems, and automation for businesses.",
      sha256: "02b8fd91fb876a86877b58b19fc35adb10090d897698d264d5dc06f66609b789",
    },
    title: "Web development and custom software services | Rodrigo Opalo",
    description:
      "I build business websites, custom software, and automations for companies. You work directly with me, in English or Spanish, from South Florida and remotely across the United States and Latin America.",
    content: "Websites, custom systems, and automation for businesses.",
    metadataHash:
      "d1faf7474c730bd0f8ff1ef1339c2df468ec9289c362f6825f4092c9bf9366d5",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/servicios/sitios-web-para-empresas",
    file: "servicios/sitios-web-para-empresas/index.html",
    lang: "es",
    ogImage: {
      path: "/img/og/brand-v1/business-websites-es-1200x630.png",
      alt: "Servicio de devrodri: sitios web profesionales para empresas.",
      sha256: "33b2c7eaef4a1fac65585678735254094c806a3d8d90b23779c05b9cc902282e",
    },
    title: "Sitios web profesionales para empresas | Rodrigo Opalo",
    description:
      "Diseño y desarrollo de sitios web profesionales para empresas: institucionales, landings y catálogos bilingües, rápidos, con base técnica SEO y formularios o WhatsApp para captar consultas.",
    content: "Sitios web profesionales para empresas.",
    metadataHash:
      "66c30fb7c69684a1fff5459c5009955440d4bfbfe74b6439168ad39c4485641a",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/en/services/business-websites",
    file: "en/services/business-websites/index.html",
    lang: "en",
    ogImage: {
      path: "/img/og/brand-v1/business-websites-en-1200x630.png",
      alt: "devrodri service: professional websites for businesses.",
      sha256: "a9ddbeec5d98be6dd82b7dd7143b0732c47d83d3f17a41dd4e91a1140a3176a1",
    },
    title: "Business website design and development | Rodrigo Opalo",
    description:
      "Custom website development for businesses: institutional sites, landing pages, and bilingual catalogs that load fast, with a technical SEO foundation and forms or WhatsApp to capture inquiries.",
    content: "Professional websites for businesses.",
    metadataHash:
      "6a606f76406b583b1c735fe20b20195782066101f4af3becb1d25d2585c3afd7",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/servicios/sistemas-a-medida",
    file: "servicios/sistemas-a-medida/index.html",
    lang: "es",
    ogImage: {
      path: "/img/og/brand-v1/custom-software-es-1200x630.png",
      alt: "Servicio de devrodri: sistemas y aplicaciones a medida para empresas.",
      sha256: "ed64cd69bd1465b52ca77f7f60217cd940f6989516a96aa87a21f8f418edde70",
    },
    title: "Sistemas y aplicaciones a medida para empresas | Rodrigo Opalo",
    description:
      "Desarrollo de software a medida: aplicaciones web, portales de clientes y paneles internos con autenticación, roles, datos e integraciones. Implementación por etapas para empresas de Estados Unidos y Latinoamérica.",
    content: "Sistemas y aplicaciones a medida para empresas.",
    metadataHash:
      "a959ab051f322bf2d88f83a445313008122c2ee07f6e5201581b7e1ee4619a6e",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/en/services/custom-software",
    file: "en/services/custom-software/index.html",
    lang: "en",
    ogImage: {
      path: "/img/og/brand-v1/custom-software-en-1200x630.png",
      alt: "devrodri service: custom software and web applications for businesses.",
      sha256: "dbde14efcba9d1583abbde0c8b0cd0a913266907cecbe4385cd1fa598c400056",
    },
    title:
      "Custom software and web applications for businesses | Rodrigo Opalo",
    description:
      "Custom software development: web applications, client portals, and internal panels with authentication, roles, data, and integrations. Phased delivery for businesses in the United States and Latin America.",
    content: "Custom software and web applications for businesses.",
    metadataHash:
      "758920283757d7467cbb2916a71e38dc19b626655cb6d05562716ed2b581fde0",
    noJavaScriptMarkers: 1,
  },
];
const expectedThankYouRoutes = [
  {
    pathname: "/gracias",
    file: "gracias/index.html",
    lang: "es",
    title: "Consulta enviada | Rodrigo Opalo",
    description:
      "Gracias por escribirme. Recibí tu consulta y te voy a responder lo antes posible.",
    heading: "Consulta enviada",
    cta: "Volver al inicio",
    ctaPath: "/",
    equivalentLocalePath: "/en/thank-you",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/en/thank-you",
    file: "en/thank-you/index.html",
    lang: "en",
    title: "Inquiry sent | Rodrigo Opalo",
    description:
      "Thanks for getting in touch. I received your inquiry and will get back to you as soon as possible.",
    heading: "Inquiry sent",
    cta: "Back to home",
    ctaPath: "/en",
    equivalentLocalePath: "/gracias",
    noJavaScriptMarkers: 1,
  },
];
const localePairs = [
  ["/", "/en"],
  ["/portfolio", "/en/portfolio"],
  ["/portfolio/lem-box", "/en/portfolio/lem-box"],
  ["/servicios", "/en/services"],
  ["/servicios/sitios-web-para-empresas", "/en/services/business-websites"],
  ["/servicios/sistemas-a-medida", "/en/services/custom-software"],
];
const suspenseFallbacks = [
  "Cargando portfolio…",
  "Loading portfolio…",
  "Cargando caso LEM-BOX…",
  "Loading LEM-BOX case study…",
  ">Cargando…<",
  ">Loading…<",
];
const expectedPersonContent = new Map([
  [
    "/",
    {
      description:
        "Creo sitios, aplicaciones y sistemas a medida combinando estrategia, experiencia de usuario y tecnología. También implemento automatizaciones, integraciones y asistentes con IA para conectar herramientas, optimizar procesos y reducir trabajo manual.",
      jobTitle: "Integrador de tecnología con mentalidad de producto",
    },
  ],
  [
    "/en",
    {
      description:
        "I create custom websites, applications, and systems by combining strategy, user experience, and technology. I also implement automations, integrations, and AI assistants to connect tools, optimize processes, and reduce manual work.",
      jobTitle: "Technology integrator with a product mindset",
    },
  ],
]);
const expectedStructuredData = new Map([
  [
    "/",
    {
      types: [
        "WebSite",
        "Person",
        "EducationalOccupationalCredential",
        "Brand",
        "ImageObject",
      ],
      ids: [
        "https://www.devrodri.com/#website",
        "https://www.devrodri.com/#person",
        "https://www.devrodri.com/#ibm-full-stack-credential",
        "https://www.devrodri.com/#brand",
        "https://www.devrodri.com/#brand-logo",
      ],
    },
  ],
  [
    "/en",
    {
      types: [
        "WebSite",
        "Person",
        "EducationalOccupationalCredential",
        "Brand",
        "ImageObject",
      ],
      ids: [
        "https://www.devrodri.com/#website",
        "https://www.devrodri.com/#person",
        "https://www.devrodri.com/#ibm-full-stack-credential",
        "https://www.devrodri.com/#brand",
        "https://www.devrodri.com/#brand-logo",
      ],
    },
  ],
  [
    "/portfolio/lem-box",
    {
      types: ["CreativeWork", "WebApplication"],
      ids: [
        "https://www.devrodri.com/portfolio/lem-box#case-study",
        "https://www.devrodri.com/#lem-box-web-application",
      ],
    },
  ],
  [
    "/en/portfolio/lem-box",
    {
      types: ["CreativeWork", "WebApplication"],
      ids: [
        "https://www.devrodri.com/en/portfolio/lem-box#case-study",
        "https://www.devrodri.com/#lem-box-web-application",
      ],
    },
  ],
]);

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function openingTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "g"))].map(
    ([tag]) => tag,
  );
}

function canonical(pathname) {
  return `https://www.devrodri.com${pathname}`;
}

function escapeHtmlAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function sha256Source(value) {
  const digest = createHash("sha256").update(value).digest("base64");
  return `'sha256-${digest}'`;
}

const noJavaScriptStyle =
  "[data-nojs-visible]{opacity:1!important;transform:none!important}[data-nojs-hide]{display:none!important}[data-nojs-language]{display:flex!important}@media(max-width:639px){[data-nojs-navbar]{position:static!important}[data-nojs-mobile-nav]{display:flex!important}}";
const noJavaScriptStyleHash =
  "'sha256-F3e8uFPgP10pK68RX7B5e1ZHd++LBK67gz3K7SNPrgA='";
const previousNoJavaScriptStyleHash =
  "'sha256-s8Yo+QmbhprPrMTPA+WlxksKujTWurQ8EScEm2yFeM4='";
const noJavaScriptBlock =
  `<noscript><style>${noJavaScriptStyle}</style></noscript>`;

function assertNoJavaScriptNavigation(
  html,
  { englishPath, lang, spanishPath },
) {
  const navbarStart = html.indexOf('<nav data-nojs-navbar="true"');
  assert.notEqual(navbarStart, -1, `${lang}: Navbar start`);
  const mobileFallbackStart = html.indexOf(
    '<div data-nojs-mobile-nav="true"',
  );
  assert.notEqual(mobileFallbackStart, -1, `${lang}: mobile fallback`);
  const mobileFallbackEnd = html.indexOf("</nav>", mobileFallbackStart);
  assert.notEqual(mobileFallbackEnd, -1, `${lang}: Navbar close`);
  const navbar = html.slice(navbarStart, mobileFallbackEnd);
  const mobileFallback = html.slice(mobileFallbackStart, mobileFallbackEnd);
  const localizedHomePath = lang === "es" ? "/" : "/en";
  const localizedServicesPath = lang === "es" ? "/servicios" : "/en/services";
  const localizedPortfolioPath = lang === "es"
    ? "/portfolio"
    : "/en/portfolio";
  const expectedNavigationHrefs = [
    `${localizedHomePath}#sobremi`,
    `${localizedHomePath}#porqueelegirnos`,
    localizedServicesPath,
    localizedPortfolioPath,
    `${localizedHomePath}#contacto`,
    `${localizedHomePath}#faq`,
    spanishPath,
    englishPath,
  ];
  const fallbackAnchors = [
    ...mobileFallback.matchAll(/<a\b[^>]*>/g),
  ].map(([anchor]) => anchor);

  assert.equal(count(html, 'data-nojs-navbar="true"'), 1, `${lang}: Navbar`);
  assert.equal(
    count(html, 'data-nojs-mobile-nav="true"'),
    1,
    `${lang}: mobile fallback count`,
  );
  assert.equal(
    count(html, 'data-nojs-language="true"'),
    2,
    `${lang}: language fallback count`,
  );
  assert.equal(
    count(navbar, 'data-nojs-hide="true"'),
    2,
    `${lang}: Navbar JavaScript-only controls`,
  );
  assert.equal(
    count(html, 'aria-current="page"'),
    2,
    `${lang}: language current state`,
  );
  assert.ok(
    html.includes(
      `aria-label="${lang === "es" ? "Navegación principal" : "Primary navigation"}"`,
    ),
    `${lang}: localized navigation label`,
  );
  assert.ok(
    mobileFallback.includes(
      `aria-label="${lang === "es" ? "Selector de idioma" : "Language selector"}"`,
    ),
    `${lang}: localized language label`,
  );
  assert.ok(
    mobileFallback.includes(
      `aria-label="${lang === "es" ? "Español, idioma actual" : "English, current language"}"`,
    ),
    `${lang}: current language label`,
  );
  assert.equal(fallbackAnchors.length, expectedNavigationHrefs.length);
  assert.deepEqual(
    fallbackAnchors.map((anchor) =>
      anchor.match(/\shref="([^"]+)"/)?.[1]
    ),
    expectedNavigationHrefs,
    `${lang}: fallback hrefs`,
  );
  assert.ok(fallbackAnchors.every((anchor) => /\shref="[^"]+"/.test(anchor)));
  assert.equal(count(mobileFallback, "focus-visible:ring-2"), 8);
  assert.ok(!mobileFallback.includes("<button"));
  assert.ok(!mobileFallback.includes("aria-pressed"));
  assert.ok(!mobileFallback.includes("tabindex="));
}

function assertNoJavaScriptOnlyControls(html, { lang, pathname }) {
  const buttons = openingTags(html, "button");
  const anchors = openingTags(html, "a");
  const nativeSubmitButtons = buttons.filter((button) =>
    button.includes('type="submit"')
  );

  assert.ok(
    nativeSubmitButtons.every(
      (button) => !button.includes('data-nojs-hide="true"'),
    ),
    `${pathname}: native submit must remain available without JavaScript`,
  );
  assert.ok(
    anchors.every((anchor) => !anchor.includes('data-nojs-hide="true"')),
    `${pathname}: real anchors must not be marked as JavaScript-only`,
  );

  if (pathname === "/" || pathname === "/en") {
    const slideNavigationLabel = lang === "es"
      ? "Navegación de slides"
      : "Slide navigation";
    const slideNavigation = openingTags(html, "div").find(
      (tag) =>
        tag.includes('role="group"') &&
        tag.includes(`aria-label="${slideNavigationLabel}"`),
    );
    assert.ok(slideNavigation, `${pathname}: Hero dots wrapper`);
    assert.ok(
      slideNavigation.includes('data-nojs-hide="true"'),
      `${pathname}: Hero dots must be hidden without JavaScript`,
    );

    const slideNavigationStart = html.indexOf(slideNavigation);
    const slideNavigationEnd = html.indexOf("</div>", slideNavigationStart);
    const dotButtons = openingTags(
      html.slice(slideNavigationStart, slideNavigationEnd),
      "button",
    );
    assert.equal(dotButtons.length, 4, `${pathname}: Hero dot count`);
    assert.ok(
      dotButtons.every((button) => !button.includes('data-nojs-hide="true"')),
      `${pathname}: dots must use their shared wrapper`,
    );

    const arrowNavigation = openingTags(html, "div").find((tag) =>
      tag.includes(
        'class="hidden md:flex justify-between items-center absolute top-1/2',
      )
    );
    assert.ok(arrowNavigation, `${pathname}: Hero arrows wrapper`);
    assert.ok(
      arrowNavigation.includes('data-nojs-hide="true"'),
      `${pathname}: Hero arrows must be hidden without JavaScript`,
    );
    const arrowLabels = lang === "es"
      ? ['aria-label="Slide anterior"', 'aria-label="Slide siguiente"']
      : ['aria-label="Previous slide"', 'aria-label="Next slide"'];
    const arrowButtons = buttons.filter((button) =>
      arrowLabels.some((label) => button.includes(label))
    );
    assert.equal(arrowButtons.length, 2, `${pathname}: Hero arrow count`);
    assert.ok(
      arrowButtons.every(
        (button) => !button.includes('data-nojs-hide="true"'),
      ),
      `${pathname}: arrows must use their shared wrapper`,
    );
    assert.equal(
      count(html, 'data-nojs-hide="true"'),
      4,
      `${pathname}: approved no-JavaScript hide markers`,
    );
    assert.equal(nativeSubmitButtons.length, 1, `${pathname}: native submit`);
    return;
  }

  if (pathname === "/portfolio" || pathname === "/en/portfolio") {
    const filterNavigation = openingTags(html, "div").find((tag) =>
      tag.includes(
        'class="mt-4 flex flex-wrap items-center justify-center gap-2"',
      )
    );
    assert.ok(filterNavigation, `${pathname}: Portfolio filters wrapper`);
    assert.ok(
      filterNavigation.includes('data-nojs-hide="true"'),
      `${pathname}: Portfolio filters must be hidden without JavaScript`,
    );
    const filterNavigationStart = html.indexOf(filterNavigation);
    const filterNavigationEnd = html.indexOf("</div>", filterNavigationStart);
    const filterButtons = openingTags(
      html.slice(filterNavigationStart, filterNavigationEnd),
      "button",
    );
    assert.equal(filterButtons.length, 5, `${pathname}: Portfolio filter count`);
    assert.ok(
      filterButtons.every(
        (button) => !button.includes('data-nojs-hide="true"'),
      ),
      `${pathname}: filters must use their shared wrapper`,
    );

    const detailLabelPrefix = lang === "es" ? "Ver más:" : "View more:";
    const detailButtons = buttons.filter(
      (button) =>
        button.includes('type="button"') &&
        button.includes('aria-expanded="false"') &&
        button.includes(`aria-label="${detailLabelPrefix}`),
    );
    assert.equal(detailButtons.length, 7, `${pathname}: detail toggle count`);
    assert.ok(
      detailButtons.every((button) =>
        button.includes('data-nojs-hide="true"')
      ),
      `${pathname}: detail toggles must be hidden without JavaScript`,
    );
    assert.ok(
      detailButtons.every((button) => !button.includes("aria-controls=")),
      `${pathname}: collapsed toggles must not expose orphan aria-controls`,
    );
    assert.equal(
      count(
        html,
        lang === "es" ? ">Ver más</button>" : ">View details</button>",
      ),
      7,
      `${pathname}: localized detail toggle copy`,
    );
    assert.equal(
      count(html, 'id="portfolio-case-'),
      8,
      `${pathname}: prerendered Portfolio cards`,
    );
    assert.ok(
      html.includes(
        `href="${lang === "es" ? "/portfolio/lem-box" : "/en/portfolio/lem-box"}"`,
      ),
      `${pathname}: LEM-BOX case link`,
    );
    assert.equal(
      count(html, 'data-nojs-hide="true"'),
      10,
      `${pathname}: approved no-JavaScript hide markers`,
    );
    assert.equal(nativeSubmitButtons.length, 0, `${pathname}: no form submit`);
    return;
  }

  assert.equal(
    count(html, 'data-nojs-hide="true"'),
    2,
    `${pathname}: Navbar-only no-JavaScript hide markers`,
  );
}

function inlineScripts(html) {
  return [
    ...html.matchAll(
      /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
}

function helmetMetadataSource(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, "Missing document head");
  return [
    ...head.matchAll(
      /<title\b[^>]*data-rh="true"[^>]*>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*data-rh="true"[^>]*>/g,
    ),
  ].map(([tag]) => tag).join("");
}

const vercelConfigurationSource = await readFile(
  path.join(projectRoot, "vercel.json"),
  "utf8",
);
const vercelConfiguration = JSON.parse(vercelConfigurationSource);
const globalHeaderRule = vercelConfiguration.headers.find(
  (rule) => rule.source === "/(.*)",
);
assert.ok(globalHeaderRule, "Missing global Vercel header rule");
const canonicalSecurityHeaders = Object.fromEntries(
  globalHeaderRule.headers.map((header) => [header.key, header.value]),
);
const contentSecurityPolicy =
  globalHeaderRule.headers.find(
    (header) => header.key.toLowerCase() === "content-security-policy",
  )?.value ?? "";
assert.notEqual(contentSecurityPolicy, "", "Missing Content-Security-Policy");
assert.equal(Buffer.byteLength(noJavaScriptStyle, "utf8"), 265);
assert.equal(sha256Source(noJavaScriptStyle), noJavaScriptStyleHash);
assert.ok(!vercelConfigurationSource.includes(previousNoJavaScriptStyleHash));

const routeDocuments = [];
const routeDocumentHashes = [];
const renderedOgImageUrls = [];
const renderedOgImageHashes = [];
const liveInlineScriptHashes = new Set();
const noJavaScriptDocuments = [];
let prerenderedNoJavaScriptMarkerTotal = 0;
for (const route of expectedRoutes) {
  const html = await readFile(path.join(distDirectory, route.file), "utf8");
  const absoluteOgImageUrl = canonical(route.ogImage.path);
  const ogImageBuffer = await readFile(
    path.join(distDirectory, route.ogImage.path.replace(/^\/+/, "")),
  );
  const ogImageHash = createHash("sha256").update(ogImageBuffer).digest("hex");
  renderedOgImageUrls.push(absoluteOgImageUrl);
  renderedOgImageHashes.push(ogImageHash);
  assert.deepEqual(
    [...ogImageBuffer.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    `${route.pathname}: PNG signature`,
  );
  assert.equal(ogImageBuffer.readUInt32BE(16), 1200, `${route.pathname}: width`);
  assert.equal(ogImageBuffer.readUInt32BE(20), 630, `${route.pathname}: height`);
  assert.equal(ogImageBuffer[24], 8, `${route.pathname}: 8-bit PNG`);
  assert.equal(ogImageBuffer[25], 2, `${route.pathname}: opaque RGB PNG`);
  assert.equal(ogImageHash, route.ogImage.sha256, `${route.pathname}: SHA-256`);
  routeDocuments.push(html);
  noJavaScriptDocuments.push(html);
  routeDocumentHashes.push(
    createHash("sha256").update(html).digest("hex"),
  );
  assert.equal(
    createHash("sha256").update(helmetMetadataSource(html)).digest("hex"),
    route.metadataHash,
    `${route.pathname}: approved metadata bytes`,
  );

  assert.match(html, new RegExp(`<html lang="${route.lang}"`));
  assert.ok(html.includes(`<title data-rh="true">${route.title}</title>`));
  assert.ok(
    html.includes(
      `name="description" content="${escapeHtmlAttribute(route.description)}"`,
    ),
    `${route.pathname}: description`,
  );
  assert.ok(html.includes(`rel="canonical" href="${canonical(route.pathname)}"`));
  assert.ok(html.includes('name="description" content="'));
  assert.ok(html.includes('name="robots" content="index, follow"'));
  assert.ok(html.includes('property="og:title"'));
  assert.ok(
    html.includes(`property="og:title" content="${route.title}"`),
    `${route.pathname}: og:title`,
  );
  assert.ok(
    html.includes(
      `property="og:description" content="${escapeHtmlAttribute(route.description)}"`,
    ),
    `${route.pathname}: og:description`,
  );
  assert.ok(html.includes(`property="og:url" content="${canonical(route.pathname)}"`));
  assert.ok(html.includes('property="og:site_name" content="devrodri"'));
  assert.ok(
    html.includes(
      `property="og:locale" content="${route.lang === "es" ? "es_ES" : "en_US"}"`,
    ),
    `${route.pathname}: og:locale`,
  );
  assert.ok(
    html.includes(
      `property="og:locale:alternate" content="${route.lang === "es" ? "en_US" : "es_ES"}"`,
    ),
    `${route.pathname}: og:locale:alternate`,
  );
  assert.ok(
    html.includes(`property="og:image" content="${absoluteOgImageUrl}"`),
    `${route.pathname}: og:image`,
  );
  assert.ok(html.includes('property="og:image:width" content="1200"'));
  assert.ok(html.includes('property="og:image:height" content="630"'));
  assert.ok(html.includes('property="og:image:type" content="image/png"'));
  assert.ok(
    html.includes(
      `property="og:image:alt" content="${escapeHtmlAttribute(route.ogImage.alt)}"`,
    ),
    `${route.pathname}: og:image:alt`,
  );
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(html.includes('name="twitter:title"'));
  assert.ok(
    html.includes(`name="twitter:title" content="${route.title}"`),
    `${route.pathname}: twitter:title`,
  );
  assert.ok(
    html.includes(
      `name="twitter:description" content="${escapeHtmlAttribute(route.description)}"`,
    ),
    `${route.pathname}: twitter:description`,
  );
  assert.ok(html.includes('name="twitter:description"'));
  assert.ok(
    html.includes(`name="twitter:image" content="${absoluteOgImageUrl}"`),
    `${route.pathname}: twitter:image`,
  );
  assert.ok(
    html.includes(
      `name="twitter:image:alt" content="${escapeHtmlAttribute(route.ogImage.alt)}"`,
    ),
    `${route.pathname}: twitter:image:alt`,
  );
  assert.ok(
    !helmetMetadataSource(html).includes(".vercel.app"),
    `${route.pathname}: preview URL in metadata`,
  );
  assert.equal(count(html, "<title"), 1);
  assert.equal(count(html, 'name="description"'), 1);
  assert.equal(count(html, 'name="robots"'), 1);
  assert.equal(count(html, 'rel="canonical"'), 1);
  assert.equal(count(html, 'rel="alternate"'), 3);
  for (const tagName of [
    'property="og:title"',
    'property="og:description"',
    'property="og:type"',
    'property="og:locale"',
    'property="og:locale:alternate"',
    'property="og:site_name"',
    'property="og:url"',
    'property="og:image"',
    'property="og:image:width"',
    'property="og:image:height"',
    'property="og:image:type"',
    'property="og:image:alt"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
    'name="twitter:image:alt"',
  ]) {
    assert.equal(count(html, tagName), 1, `${route.pathname}: ${tagName}`);
  }
  const localePair = localePairs.find((pair) => pair.includes(route.pathname));
  assert.ok(localePair, `Missing locale pair for ${route.pathname}`);
  const [spanishPath, englishPath] = localePair;
  assert.ok(
    html.includes(`hrefLang="es" href="${canonical(spanishPath)}"`),
    `${route.pathname}: Spanish alternate`,
  );
  assert.ok(
    html.includes(`hrefLang="en" href="${canonical(englishPath)}"`),
    `${route.pathname}: English alternate`,
  );
  assert.ok(
    html.includes(`hrefLang="x-default" href="${canonical(spanishPath)}"`),
    `${route.pathname}: x-default alternate`,
  );
  assert.ok(html.includes(route.content));
  assert.match(html, /<h1[\s>]/);
  assert.match(html, /<p[\s>]/);
  assert.match(html, /<a[\s>]/);
  assert.ok(html.includes('<div id="root"><div'));
  assert.ok(!html.includes("<!--app-head-->"));
  assert.ok(!html.includes("<!--app-html-->"));
  assert.ok(!html.includes("/unknown"));
  assert.ok(!html.includes("data:image/gif"), `${route.pathname}: data GIF`);
  assert.equal(
    count(html, noJavaScriptBlock),
    1,
    `${route.pathname}: exact no-JavaScript block`,
  );
  assert.equal(
    count(html, 'data-nojs-visible="true"'),
    route.noJavaScriptMarkers,
    `${route.pathname}: no-JavaScript markers`,
  );
  assert.match(
    html,
    /<footer[^>]*data-nojs-visible="true"[^>]*>/,
    `${route.pathname}: marked Footer`,
  );
  assertNoJavaScriptNavigation(html, {
    englishPath,
    lang: route.lang,
    spanishPath,
  });
  assertNoJavaScriptOnlyControls(html, route);
  prerenderedNoJavaScriptMarkerTotal += route.noJavaScriptMarkers;
  for (const fallback of suspenseFallbacks) {
    assert.ok(!html.includes(fallback), `${route.pathname}: ${fallback}`);
  }

  const scripts = inlineScripts(html);
  const expectedGraph = expectedStructuredData.get(route.pathname);
  const expectedJsonLdCount = expectedGraph === undefined ? 0 : 1;
  assert.equal(scripts.length, expectedJsonLdCount, route.pathname);
  if (expectedJsonLdCount === 1) {
    assert.match(
      html,
      /<script data-rh="true" type="application\/ld\+json">/,
      `${route.pathname}: JSON-LD data-rh marker`,
    );
  }
  for (const [, jsonLd] of scripts) {
    const parsed = JSON.parse(jsonLd);
    assert.equal(parsed["@context"], "https://schema.org", route.pathname);
    assert.deepEqual(
      parsed["@graph"].map((node) => node["@type"]),
      expectedGraph.types,
      `${route.pathname}: graph types`,
    );
    assert.deepEqual(
      parsed["@graph"].map((node) => node["@id"]),
      expectedGraph.ids,
      `${route.pathname}: graph IDs`,
    );
    const personContent = expectedPersonContent.get(route.pathname);
    if (personContent !== undefined) {
      const personNodes = parsed["@graph"].filter(
        (node) => node["@type"] === "Person",
      );
      assert.equal(
        personNodes.length,
        1,
        `${route.pathname}: single canonical Person node`,
      );
      const [person] = personNodes;
      assert.equal(
        person["@id"],
        "https://www.devrodri.com/#person",
        `${route.pathname}: canonical Person @id`,
      );
      assert.equal(
        person.description,
        personContent.description,
        `${route.pathname}: Person description`,
      );
      assert.equal(
        person.jobTitle,
        personContent.jobTitle,
        `${route.pathname}: Person jobTitle`,
      );
      assert.deepEqual(person.sameAs, [
        "https://github.com/devrodri-com",
        "https://www.linkedin.com/in/rodrigo-opalo-b56685390/",
      ]);
      assert.deepEqual(person.brand, {
        "@id": "https://www.devrodri.com/#brand",
      });

      const website = parsed["@graph"].find(
        (node) => node["@type"] === "WebSite",
      );
      assert.deepEqual(website.creator, {
        "@id": "https://www.devrodri.com/#person",
      });
      assert.deepEqual(website.publisher, {
        "@id": "https://www.devrodri.com/#person",
      });
      assert.deepEqual(website.mainEntity, {
        "@id": "https://www.devrodri.com/#person",
      });
      assert.deepEqual(website.about, {
        "@id": "https://www.devrodri.com/#brand",
      });

      const brand = parsed["@graph"].find(
        (node) => node["@type"] === "Brand",
      );
      assert.deepEqual(brand, {
        "@type": "Brand",
        "@id": "https://www.devrodri.com/#brand",
        name: "devrodri",
        url: "https://www.devrodri.com/",
        owner: { "@id": "https://www.devrodri.com/#person" },
        logo: { "@id": "https://www.devrodri.com/#brand-logo" },
      });

      const brandLogo = parsed["@graph"].find(
        (node) => node["@type"] === "ImageObject",
      );
      assert.deepEqual(brandLogo, {
        "@type": "ImageObject",
        "@id": "https://www.devrodri.com/#brand-logo",
        contentUrl:
          "https://www.devrodri.com/brand/devrodri-wordmark-w1-black.svg",
        encodingFormat: "image/svg+xml",
      });
    }
    const hash = sha256Source(jsonLd);
    liveInlineScriptHashes.add(hash);
    assert.ok(
      contentSecurityPolicy.includes(hash),
      `${route.pathname}: JSON-LD CSP hash`,
    );
    for (const forbidden of [
      "Meta React",
      "https://www.ibm.com/skills-network",
      '"issuer"',
      '"issuedBy"',
      '"dateIssued"',
      '"offers"',
      '"price"',
      '"rating"',
      '"review"',
      '"operatingSystem"',
      "SoftwareApplication",
      '"@type":"Organization"',
      '"@type":"ProfessionalService"',
      '"@type":"LocalBusiness"',
      '"@type":"ProfilePage"',
    ]) {
      assert.ok(!jsonLd.includes(forbidden), `${route.pathname}: ${forbidden}`);
    }
  }

  const assetReferences = [
    ...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g),
  ].map((match) => match[1]);
  assert.ok(assetReferences.length >= 2);
  for (const assetReference of assetReferences) {
    const assetPath = path.join(
      distDirectory,
      assetReference.replace(/^\/+/, ""),
    );
    assert.ok((await stat(assetPath)).isFile(), `${assetReference} is missing`);
  }
}

const brandLogoBuffer = await readFile(
  path.join(distDirectory, "brand", "devrodri-wordmark-w1-black.svg"),
);
assert.equal(brandLogoBuffer.byteLength, 3968, "brand logo byte length");
assert.equal(
  createHash("sha256").update(brandLogoBuffer).digest("hex"),
  "3be5eaecfa9569652886dc812f4f34e6c9b1c5f4407ac6e476b16300fed9715f",
  "brand logo SHA-256",
);
const brandLogoSource = brandLogoBuffer.toString("utf8");
assert.equal(count(brandLogoSource, "<svg "), 1, "brand logo SVG element");
assert.equal(count(brandLogoSource, "<path "), 1, "brand logo path element");
assert.ok(brandLogoSource.includes('viewBox="0 0 8158.408 1584"'));
for (const forbidden of [
  "<text",
  "font-family",
  "font-face",
  "<image",
  "data:image",
  "<script",
  "javascript:",
  "href=",
  "xlink:href",
  "<use",
]) {
  assert.ok(!brandLogoSource.toLowerCase().includes(forbidden), forbidden);
}

assert.equal(new Set(renderedOgImageUrls).size, 12, "unique OG image URLs");
assert.equal(new Set(renderedOgImageHashes).size, 12, "unique OG image hashes");
assert.equal(expectedRoutes.filter((route) => route.lang === "es").length, 6);
assert.equal(expectedRoutes.filter((route) => route.lang === "en").length, 6);
assert.ok(
  renderedOgImageUrls.every((url) => url.startsWith("https://www.devrodri.com/")),
  "OG images use the canonical production origin",
);
assert.ok(
  renderedOgImageUrls.every(
    (url) =>
      !url.endsWith("/img/social-preview.png") &&
      !url.endsWith("/img/lem-box-cover.png"),
  ),
  "indexable OG images do not use legacy assets",
);

for (const route of expectedThankYouRoutes) {
  const html = await readFile(path.join(distDirectory, route.file), "utf8");
  routeDocuments.push(html);
  noJavaScriptDocuments.push(html);
  routeDocumentHashes.push(
    createHash("sha256").update(html).digest("hex"),
  );

  assert.match(html, new RegExp(`<html lang="${route.lang}"`));
  assert.ok(html.includes(`<title data-rh="true">${route.title}</title>`));
  assert.ok(
    html.includes(
      `name="description" content="${escapeHtmlAttribute(route.description)}"`,
    ),
    `${route.pathname}: description`,
  );
  assert.ok(html.includes(route.heading), `${route.pathname}: heading`);
  assert.ok(
    html.includes(escapeHtmlAttribute(route.description)),
    `${route.pathname}: localized copy`,
  );
  assert.ok(html.includes(`href="${route.ctaPath}"`), route.pathname);
  assert.ok(html.includes(route.cta), route.pathname);
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
  assert.equal(count(html, "<title"), 1);
  assert.equal(count(html, 'name="description"'), 1);
  assert.equal(count(html, 'name="robots"'), 1);
  assert.equal(count(html, 'rel="canonical"'), 0);
  assert.equal(count(html, 'rel="alternate"'), 0);
  assert.equal(count(html, 'property="og:'), 0);
  assert.equal(count(html, 'name="twitter:'), 0);
  assert.equal(inlineScripts(html).length, 0);
  assert.equal(count(html, "<main"), 1);
  assert.equal(count(html, "<h1"), 1);
  assert.equal(count(html, "<form"), 0);
  assert.ok(html.includes('<div id="root"><div'));
  assert.ok(!html.includes("<!--app-head-->"));
  assert.ok(!html.includes("<!--app-html-->"));
  assert.ok(!html.includes("/unknown"));
  assert.ok(!html.includes("data:image/gif"), `${route.pathname}: data GIF`);
  assert.equal(
    count(html, noJavaScriptBlock),
    1,
    `${route.pathname}: exact no-JavaScript block`,
  );
  assert.equal(
    count(html, 'data-nojs-visible="true"'),
    route.noJavaScriptMarkers,
    `${route.pathname}: no-JavaScript markers`,
  );
  assert.match(
    html,
    /<footer[^>]*data-nojs-visible="true"[^>]*>/,
    `${route.pathname}: marked Footer`,
  );
  assertNoJavaScriptNavigation(html, {
    englishPath: route.lang === "es"
      ? route.equivalentLocalePath
      : route.pathname,
    lang: route.lang,
    spanishPath: route.lang === "es"
      ? route.pathname
      : route.equivalentLocalePath,
  });
  assertNoJavaScriptOnlyControls(html, route);
  prerenderedNoJavaScriptMarkerTotal += route.noJavaScriptMarkers;
  for (const fallback of suspenseFallbacks) {
    assert.ok(!html.includes(fallback), `${route.pathname}: ${fallback}`);
  }

  const assetReferences = [
    ...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g),
  ].map((match) => match[1]);
  assert.ok(assetReferences.length >= 2);
  for (const assetReference of assetReferences) {
    const assetPath = path.join(
      distDirectory,
      assetReference.replace(/^\/+/, ""),
    );
    assert.ok((await stat(assetPath)).isFile(), `${assetReference} is missing`);
  }
}

const expectedRouteDocumentCount =
  expectedRoutes.length + expectedThankYouRoutes.length;
assert.equal(new Set(routeDocuments).size, expectedRouteDocumentCount);
assert.equal(new Set(routeDocumentHashes).size, expectedRouteDocumentCount);

const assetFiles = await readdir(path.join(distDirectory, "assets"));
assert.equal(
  assetFiles.filter((file) => /^PortfolioPage-.*\.js$/.test(file)).length,
  1,
);
assert.equal(
  assetFiles.filter((file) => /^LemBoxCasePage-.*\.js$/.test(file)).length,
  1,
);
assert.equal(
  assetFiles.filter((file) => /^ServicesHubPage-.*\.js$/.test(file)).length,
  1,
);
assert.equal(
  assetFiles.filter((file) => /^BusinessWebsitesPage-.*\.js$/.test(file))
    .length,
  1,
);
assert.equal(
  assetFiles.filter((file) => /^CustomSoftwarePage-.*\.js$/.test(file)).length,
  1,
);

const expectedNotFoundArtifacts = [
  {
    pathname: "/__not-found__",
    file: "404.html",
    lang: "es",
    title: "Página no encontrada | devrodri",
    description: "La página solicitada no está disponible.",
    heading: "Página no encontrada",
    body: "La página que buscás no está disponible.",
    cta: "Volver al inicio",
    ctaPath: "/",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/en/__not-found__",
    file: "en/404.html",
    lang: "en",
    title: "Page not found | devrodri",
    description: "The requested page isn't available.",
    heading: "Page not found",
    body: "The page you're looking for isn't available.",
    cta: "Back to home",
    ctaPath: "/en",
    noJavaScriptMarkers: 1,
  },
];
const notFoundDocuments = [];
for (const artifact of expectedNotFoundArtifacts) {
  const html = await readFile(path.join(distDirectory, artifact.file), "utf8");
  notFoundDocuments.push(html);
  noJavaScriptDocuments.push(html);

  assert.match(html, new RegExp(`<html lang="${artifact.lang}"`));
  assert.ok(html.includes(`<title data-rh="true">${artifact.title}</title>`));
  assert.ok(
    html.includes(
      `name="description" content="${escapeHtmlAttribute(artifact.description)}"`,
    ),
    artifact.file,
  );
  assert.ok(html.includes(artifact.heading), artifact.file);
  assert.ok(
    html.includes(artifact.body.replaceAll("'", "&#x27;")),
    artifact.file,
  );
  assert.ok(html.includes(`href="${artifact.ctaPath}"`), artifact.file);
  assert.ok(html.includes(artifact.cta), artifact.file);
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
  assert.equal(count(html, "<title"), 1);
  assert.equal(count(html, 'name="description"'), 1);
  assert.equal(count(html, 'name="robots"'), 1);
  assert.equal(count(html, 'rel="canonical"'), 0);
  assert.equal(count(html, 'rel="alternate"'), 0);
  assert.equal(count(html, 'property="og:'), 0);
  assert.equal(count(html, 'name="twitter:'), 0);
  assert.equal(inlineScripts(html).length, 0);
  assert.equal(count(html, "<main"), 1);
  assert.equal(count(html, "<h1"), 1);
  assert.ok(!html.includes("Sitios web que comunican y convierten."));
  assert.ok(!html.includes("Websites built to communicate and convert."));
  assert.ok(!html.includes("<!--app-head-->"));
  assert.ok(!html.includes("<!--app-html-->"));
  assert.ok(!html.includes("data:image/gif"), `${artifact.file}: data GIF`);
  assert.equal(
    count(html, noJavaScriptBlock),
    1,
    `${artifact.file}: exact no-JavaScript block`,
  );
  assert.equal(
    count(html, 'data-nojs-visible="true"'),
    artifact.noJavaScriptMarkers,
    `${artifact.file}: no-JavaScript markers`,
  );
  assert.match(
    html,
    /<footer[^>]*data-nojs-visible="true"[^>]*>/,
    `${artifact.file}: marked Footer`,
  );
  assertNoJavaScriptNavigation(html, {
    englishPath: "/en",
    lang: artifact.lang,
    spanishPath: "/",
  });
  assertNoJavaScriptOnlyControls(html, artifact);
  prerenderedNoJavaScriptMarkerTotal += artifact.noJavaScriptMarkers;
}
assert.equal(new Set(notFoundDocuments).size, expectedNotFoundArtifacts.length);
assert.equal(noJavaScriptDocuments.length, 16);
assert.equal(prerenderedNoJavaScriptMarkerTotal, 64);

const expectedHtmlArtifacts = [
  ...expectedRoutes.map((route) => route.file),
  ...expectedThankYouRoutes.map((route) => route.file),
  ...expectedNotFoundArtifacts.map((artifact) => artifact.file),
].toSorted();
const actualHtmlArtifacts = (
  await readdir(distDirectory, { recursive: true })
)
  .map((file) => String(file).replaceAll(path.sep, "/"))
  .filter((file) => file.endsWith(".html"))
  .toSorted();
assert.deepEqual(actualHtmlArtifacts, expectedHtmlArtifacts);

const styleSourceDirective = contentSecurityPolicy
  .split(";")
  .map((directive) => directive.trim().split(/\s+/))
  .find(([name]) => name === "style-src");
assert.deepEqual(styleSourceDirective, [
  "style-src",
  "'self'",
  noJavaScriptStyleHash,
]);
assert.equal(count(contentSecurityPolicy, noJavaScriptStyleHash), 1);

const scriptSourceDirective = contentSecurityPolicy
  .split(";")
  .map((directive) => directive.trim().split(/\s+/))
  .find(([name]) => name === "script-src");
assert.ok(scriptSourceDirective, "Missing script-src directive");
const configuredInlineHashes = scriptSourceDirective
  .slice(1)
  .filter((source) => source.startsWith("'sha256-"));
assert.deepEqual(
  configuredInlineHashes.toSorted(),
  [...liveInlineScriptHashes].toSorted(),
  "script-src must contain every live inline hash and no obsolete inline hash",
);
assert.ok(!scriptSourceDirective.includes("'unsafe-inline'"));

const robots = await readFile(path.join(distDirectory, "robots.txt"), "utf8");
assert.equal(
  robots,
  [
    "User-agent: *",
    "Allow: /",
    "Sitemap: https://www.devrodri.com/sitemap.xml",
    "",
  ].join("\n"),
);

const sitemap = await readFile(path.join(distDirectory, "sitemap.xml"), "utf8");
assert.equal(count(sitemap, "<url>"), expectedRoutes.length);
const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, location]) => location,
);
assert.equal(sitemapLocations.length, expectedRoutes.length);
for (const route of expectedRoutes) {
  assert.ok(sitemapLocations.includes(canonical(route.pathname)));
}
for (const forbidden of [
  "<lastmod>",
  "<priority>",
  "<changefreq>",
  "/404",
  "/gracias",
  "/en/thank-you",
  "vercel.app",
]) {
  assert.ok(!sitemap.includes(forbidden));
}
assert.ok(sitemapLocations.every((location) => !/[?#]/.test(location)));

assert.equal(vercelConfiguration.outputDirectory, "dist");
assert.equal(vercelConfiguration.trailingSlash, false);
assert.deepEqual(vercelConfiguration.rewrites, []);
assert.ok(!JSON.stringify(vercelConfiguration).includes('"/index.html"'));
const localizedNotFoundRouteSource =
  "/en/(?!(?:portfolio(?:/lem-box)?|services(?:/business-websites|/custom-software)?|thank-you)/?$).+$";
assert.deepEqual(vercelConfiguration.routes, [
  {
    src: localizedNotFoundRouteSource,
    caseSensitive: true,
    status: 404,
    dest: "/en/404.html",
    headers: canonicalSecurityHeaders,
  },
]);
assert.ok(!JSON.stringify(vercelConfiguration.routes).includes('"handle"'));
assert.equal(
  vercelConfigurationSource.match(/"Content-Security-Policy"\s*:/g)?.length ?? 0,
  1,
);

const [localizedNotFoundTerminalRoute] = vercelConfiguration.routes;
assert.equal(localizedNotFoundTerminalRoute.dest, "/en/404.html");
assert.equal(localizedNotFoundTerminalRoute.status, 404);
assert.ok(!("continue" in localizedNotFoundTerminalRoute));
assert.deepEqual(
  localizedNotFoundTerminalRoute.headers,
  canonicalSecurityHeaders,
);
assert.equal(
  Object.keys(localizedNotFoundTerminalRoute.headers).filter(
    (key) => key.toLowerCase() === "content-security-policy",
  ).length,
  1,
);

const localizedNotFoundRoute = new RegExp(localizedNotFoundRouteSource);
for (const publicEnglishPath of [
  "/en",
  "/en/",
  "/en/portfolio",
  "/en/portfolio/",
  "/en/portfolio/lem-box",
  "/en/portfolio/lem-box/",
  "/en/services",
  "/en/services/",
  "/en/services/business-websites",
  "/en/services/business-websites/",
  "/en/services/custom-software",
  "/en/services/custom-software/",
  "/en/thank-you",
  "/en/thank-you/",
]) {
  assert.equal(localizedNotFoundRoute.test(publicEnglishPath), false);
}
for (const invalidEnglishPath of [
  "/en/no-existe",
  "/en/portfolio/no-existe",
  "/en/services/no-existe",
]) {
  assert.equal(localizedNotFoundRoute.test(invalidEnglishPath), true);
}

function configuredContentType(source) {
  const rule = vercelConfiguration.headers.find(
    (candidate) => candidate.source === source,
  );
  return rule?.headers.find(
    (header) => header.key.toLowerCase() === "content-type",
  )?.value;
}

assert.equal(
  configuredContentType("/robots.txt"),
  "text/plain; charset=utf-8",
);
assert.equal(
  configuredContentType("/sitemap.xml"),
  "application/xml; charset=utf-8",
);

await assert.rejects(
  stat(path.join(distDirectory, "es", "index.html")),
  (error) => error?.code === "ENOENT",
);
const serverFiles = await readdir(serverDirectory, { recursive: true });
for (const assetFile of assetFiles.filter((file) =>
  /\.(?:css|js)$/.test(file)
)) {
  const source = await readFile(
    path.join(distDirectory, "assets", assetFile),
    "utf8",
  );
  assert.ok(!source.includes("data:image/gif"), `${assetFile}: data GIF`);
}
for (const serverFile of serverFiles.filter((file) => /\.mjs$/.test(file))) {
  const source = await readFile(
    path.join(serverDirectory, serverFile),
    "utf8",
  );
  assert.ok(!source.includes("data:image/gif"), `${serverFile}: data GIF`);
}
assert.ok(
  serverFiles.every(
    (file) =>
      !String(file).startsWith("img/") &&
      !String(file).startsWith("videos/"),
  ),
);

console.log(
  `Verified ${expectedRouteDocumentCount} route documents, metadata, CSP, 404, robots and sitemap`,
);
