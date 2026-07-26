// src/translations.ts

export type LanguageKeys = "es" | "en";

export type TranslationsStructure = {
  header: { title: string; subtitle: string };
  nav: {
    about: string;
    why: string;
    services: string;
    portfolio: string;
    contact: string;
    faq: string;
  };
  hero: {
    eyebrow: string;
    primaryCta: string;
    slides: {
      websites: {
        title: string;
        description: string;
      };
      customSystems: {
        title: string;
        description: string;
      };
      integrations: {
        title: string;
        description: string;
      };
      brandLaunches: {
        title: string;
        description: string;
      };
    };
    carouselLabel: string;
    goToSlide: string;
    slideCountConnector: string;
    previousSlide: string;
    nextSlide: string;
  };
  about: {
    title: string;
    role: string;
    expertise: string;
    introduction: string;
    experience: string;
    collaboration: string;
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  highlights: {
    title: string;
    items: {
      fast: { icon: string; title: string; desc: string };
      responsive: { icon: string; title: string; desc: string };
      results: { icon: string; title: string; desc: string };
      seo: { icon: string; title: string; desc: string };
      automation: { icon: string; title: string; desc: string };
      payments: { icon: string; title: string; desc: string };
    };
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  services: {
    title: string;
    intro: string;
    items: {
      systems: {
        title: string;
        desc: string;
      };
      web: {
        title: string;
        desc: string;
      };
      brand: {
        title: string;
        desc: string;
      };
    };
    seoMeta: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  experience: {
    title1: string;
    title2: string;
    description: string;
  };
  portfolio: {
    title: string;
    boating: {
      title: string;
      desc: string;
      link: string;
    };
    bionova: {
      title: string;
      desc: string;
      link: string;
    };
    federico: {
      title: string;
      desc: string;
      link: string;
    };
    mutter: {
      title: string;
      desc: string;
      link: string;
    };
    lem_web: {
      title: string;
      desc: string;
      link: string;
    };
    lem_portal: {
      title: string;
      desc: string;
      link: string;
    };
    esteban: {
      title: string;
      desc: string;
      link: string;
    };
    magenta: {
      title: string;
      desc: string;
      link: string;
    };
    campings_demo: {
      title: string;
      desc: string;
      status: string;
      disclaimer: string;
      link: string;
    };
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  testimonials: {
    title: string;
    items: { name: string; quote: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  faq: {
    title: string;
    questions: { question: string; answer: string }[];
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  transitionIntro: {
    text: string;
  };
  transitionVisual: {
    title: string;
    subtitleLine1: string;
    subtitleLine2: string;
    paragraph: string;
    principles: string[];
  };
  call: {
    title: string;
    subtitle: string;
    button: string;
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  footer: {
    rights: string;
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };
};

const translations: Record<LanguageKeys, TranslationsStructure> = {
  es: {
    header: {
      title: "Rodrigo Opalo",
      subtitle: "Diseñador & Desarrollador Web",
    },
    nav: {
      about: "Sobre mí",
      why: "Por qué elegirme",
      services: "Servicios", // si lo dejás o lo quitás depende de si usarás esa sección
      portfolio: "Portfolio",
      contact: "Contacto",
      faq: "FAQ"
    },
    hero: {
      eyebrow: "RODRIGO OPALO · DESARROLLADOR FULL-STACK",
      primaryCta: "Contame tu proyecto",
      slides: {
        websites: {
          title: "Sitios web profesionales.",
          description:
            "Diseño y desarrollo sitios claros, rápidos y orientados a objetivos reales de negocio.",
        },
        customSystems: {
          title: "Sistemas y aplicaciones a medida.",
          description:
            "Creo herramientas para ordenar procesos, administrar operaciones y hacer crecer tu negocio.",
        },
        integrations: {
          title: "Integraciones y automatización.",
          description:
            "Conecto servicios y automatizo tareas para reducir trabajo manual y mejorar la operación.",
        },
        brandLaunches: {
          title: "Marcas con una base digital sólida.",
          description:
            "Coordino identidad, dominio, correo y sitio para lanzar una marca de forma profesional.",
        },
      },
      carouselLabel: "Capacidades destacadas",
      goToSlide: "Ir a la capacidad",
      slideCountConnector: "de",
      previousSlide: "Capacidad anterior",
      nextSlide: "Capacidad siguiente",
    },
    transitionVisual: {
      title: "Trabajo técnico con visión de negocio.",
      subtitleLine1: "Funciona, conecta",
      subtitleLine2: "y se ve bien.",
      paragraph:
        "Defino cada solución a partir del problema, el contexto operativo y las prioridades reales del proyecto.",
      principles: [
        "Trabajo directo",
        "Soluciones a medida",
        "Desarrollo por etapas",
        "Visión técnica y de negocio",
      ],
    },
    about: {
      title: "Sobre mí",
      role: "Desarrollador full-stack independiente con mentalidad de producto",
      expertise: "Full-stack · Producto · Operaciones · Automatización",
      introduction:
        "Soy Rodrigo Opalo. Trabajo bajo la marca devrodri, dirijo cada proyecto y trato directamente con el cliente para diseñar y desarrollar sitios, aplicaciones, sistemas e integraciones.",
      experience:
        "Mi experiencia en operaciones, logística, e-commerce y producto me ayuda a entender tanto la solución técnica como la forma en que el negocio necesita usarla y hacerla evolucionar.",
      collaboration:
        "Cuando el alcance requiere diseño visual u otra especialidad, coordino profesionales seleccionados para ese proyecto y mantengo un único punto de contacto.",
      seo: {
        title: "Sobre mí | Rodrigo Opalo",
        description: "Conocé quién está detrás del diseño y desarrollo web. Emprendedor con visión, desarrollador con enfoque en resultados.",
        keywords: "sobre mí, rodrigo opalo, desarrollador web, emprendedor, diseño web, experiencia, historia",
      },
    },
    experience: {
      title1: "Más que diseño.",
      title2: "Creo experiencias.",
      description:
        "Me enfoco en crear sitios que comuniquen antes de que el usuario haga clic. Interfaces intuitivas, limpias y veloces. Diseño funcional que se siente y se ve.",
    },
    highlights: {
      title: "¿Por qué elegirme?",
      items: {
        fast: {
          icon: "⚡️",
          title: "Velocidad y rendimiento",
          desc: "Carga rápida, navegación fluida y experiencia optimizada.",
        },
        responsive: {
          icon: "📱",
          title: "Diseño responsive",
          desc: "Interfaces preparadas y revisadas para adaptarse a distintos tamaños de pantalla.",
        },
        results: {
          icon: "🎯",
          title: "Decisiones con contexto",
          desc: "Prioridades definidas según la necesidad del negocio y de quienes usan la solución.",
        },
        seo: {
          icon: "🚀",
          title: "Base técnica para SEO",
          desc: "Estructura, metadatos y accesibilidad técnica preparados para buscadores.",
        },
        automation: {
          icon: "🤖",
          title: "Integraciones y automatización",
          desc: "Flujos con n8n, MCP y APIs conectados con los procesos definidos para el proyecto.",
        },
        payments: {
          icon: "💳",
          title: "Pagos según el proyecto",
          desc: "Integraciones con Stripe, PayPal o Mercado Pago cuando el flujo lo requiere.",
        },
      },
      seo: {
        title: "¿Por qué elegirme? | Rodrigo Opalo",
        description:
          "Explorá mis diferenciales como desarrollador web: velocidad, diseño responsive, enfoque en resultados y optimización SEO.",
        keywords:
          "diseño web, responsive, SEO, velocidad, resultados, desarrollo web, diferencial, elección",
      },
    },
    services: {
      title: "Soluciones digitales de punta a punta",
      intro:
        "Me involucro desde la definición del problema hasta el lanzamiento y la evolución de la solución.",
      items: {
        systems: {
          title: "Sistemas, aplicaciones e integraciones a medida",
          desc: "Portales, herramientas internas, productos web, roles, administración, trazabilidad, pagos, APIs y automatización de procesos.",
        },
        web: {
          title: "Sitios web y e-commerce",
          desc: "Sitios profesionales, catálogos, reservas, captación de clientes, tiendas y experiencias multilenguaje.",
        },
        brand: {
          title: "Desarrollo de marcas y lanzamiento digital",
          desc: "Dirección del proyecto, identidad visual, dominio, correo corporativo y presencia digital. Cuando hace falta una especialidad concreta, coordino el trabajo con profesionales seleccionados para el proyecto.",
        },
      },
      seoMeta: {
        title: "Servicios | Rodrigo Opalo",
        description:
          "Creo sitios web rápidos, optimizados, multilingües y con posicionamiento SEO.",
        keywords: "desarrollo web, seo, internacionalización, diseño, servicios digitales",
      },
    },
    portfolio: {
      title: "Algunos trabajos",
      boating: {
        title: "Boating Adventures Miami",
        desc: "Sitio web responsivo en 3 idiomas, con SEO, WhatsApp directo y diseño personalizado.",
        link: "Ver sitio web",
      },
      bionova: {
        title: "Bionova Supplements",
        desc: "Tienda online profesional en EE.UU. para venta de suplementos. Sitio multilenguaje, integrado con Stripe, PayPal, Firebase y panel de administración completo.",
        link: "Ver sitio web",
      },
      federico: {
        title: "Federico Roma",
        desc: "Sitio web personal y profesional del campeón mundial de kickboxing y muay thai. Incluye biografía, cursos en video, fotos, y productos exclusivos.",
        link: "Ver sitio web",
      },
      mutter: {
        title: "Mutter Games",
        desc: "E-commerce de videojuegos, consolas y accesorios. Catálogo dinámico, carrito y checkout con Mercado Pago, SEO y diseño responsive.",
        link: "Ver sitio web",
      },
      lem_web: {
        title: "LEM-BOX Web (UY/AR)",
        desc: "Landing multipaís para logística (Uruguay/Argentina), mobile-first, SEO y contacto.",
        link: "Ver sitio web",
      },
      lem_portal: {
        title: "LEM-BOX Portal (Sistema)",
        desc: "Sistema operativo con roles, trazabilidad, cajas/embarques, facturación y pagos (Stripe).",
        link: "Ver portal",
      },
      esteban: {
        title: "Esteban Firpo · Miami Real Estate",
        desc: "Sitio inmobiliario de preconstrucción en Miami. Catálogo de proyectos, galerías, planes de pago y fichas ES/EN con integración a WhatsApp y SEO optimizado.",
        link: "Ver sitio web",
      },
      magenta: {
        title: "Imprenta Magenta · Paysandú, Uruguay",
        desc: "Imprenta moderna especializada en impresión digital, offset y packaging gastronómico. Catálogo optimizado, formulario dinámico y SEO completo. MVP funcional ya activo.",
        link: "Ver sitio",
      },
      campings_demo: {
        title: "Plataforma de reservas de campings",
        desc: "Prototipo full-stack presentado como propuesta para explorar la gestión de disponibilidad, reservas, pagos simulados y administración de campings. No fue encargado ni adoptado por la organización destinataria.",
        status: "Prototipo conceptual",
        disclaimer: "Proyecto conceptual e independiente. No es un sistema oficial ni está afiliado a Administración de Parques Nacionales.",
        link: "Ver código",
      },
      seo: {
        title: "Portfolio | Rodrigo Opalo",
        description: "Explorá algunos de los sitios web desarrollados por mí, con diseño moderno, SEO y experiencia optimizada.",
        keywords: "portfolio, sitios web, trabajos, diseño, desarrollador web, Rodrigo Opalo",
      },
    },
    testimonials: {
      title: "Lo que dicen los clientes",
      items: [
        {
          name: "Lucía Martínez",
          quote:
            "Rodrigo entendió exactamente lo que necesitaba. Mi sitio quedó increíble.",
        },
        {
          name: "Carlos Díaz",
          quote: "Profesional, rápido y muy atento. Lo recomiendo 100%.",
        },
        {
          name: "Valentina Suárez",
          quote:
            "El diseño es moderno y funciona perfecto en el celular. ¡Gracias!",
        },
      ],
    },
    contact: {
      title: "Contame tu proyecto",
      subtitle:
        "Contame qué necesitás resolver. Te respondo en menos de 24 horas con los próximos pasos.",
      namePlaceholder: "Nombre",
      emailPlaceholder: "Correo electrónico",
      messagePlaceholder: "¿En qué te puedo ayudar?",
      submit: "Enviar mensaje",
      seo: {
        title: "Contacto | Rodrigo Opalo",
        description:
          "¿Tenés un proyecto en mente? Escribime para conversar sobre tu idea y ayudarte a llevarla al siguiente nivel.",
        keywords: "contacto, desarrollador web, enviar mensaje, presupuesto, proyecto web, sitio web",
      },
    },
    faq: {
      title: "Preguntas Frecuentes",
      questions: [
        {
          question: "¿Cuánto tarda en estar listo un sitio web?",
          answer:
            "El plazo depende del alcance. Después de entender el proyecto, organizo el trabajo por etapas y dejo tiempos y entregables definidos en la propuesta.",
        },
        {
          question: "¿Puedo pedir cambios luego de publicado?",
          answer:
            "Sí. Los ajustes, mejoras o nuevas etapas después del lanzamiento se acuerdan según las necesidades del proyecto.",
        },
        {
          question: "¿Cómo se realiza el pago?",
          answer:
            "La forma de pago se define en la propuesta según el alcance y las etapas acordadas.",
        },
        {
          question: "¿Qué tecnologías usás para desarrollar los sitios?",
          answer:
            "Trabajo con herramientas como Next.js, React, Vite, TypeScript, Tailwind, Firebase, Node.js, Python, Stripe, n8n y APIs. Elijo el stack según las necesidades del proyecto.",
        },
        {
          question: "¿Hacés sitios autoadministrables?",
          answer:
            "Sí. Cuando el proyecto lo requiere, puedo incluir un panel para administrar textos, imágenes, productos u otros contenidos.",
        },
        {
          question: "¿Puedo tener más de un idioma en mi sitio?",
          answer:
            "Sí. Puedo planificar una experiencia multilenguaje desde el inicio o preparar la estructura para sumar idiomas después.",
        },
        {
          question: "¿Ofrecés diseño personalizado?",
          answer:
            "Sí. Defino la interfaz según la identidad, el contenido y los objetivos concretos del proyecto.",
        },
        {
          question: "¿Mi sitio estará optimizado para celulares?",
          answer:
            "Diseño y reviso cada interfaz para que se adapte a celulares, tablets y pantallas de escritorio.",
        },
        {
          question: "¿Incluye SEO?",
          answer:
            "Puedo incluir una base de SEO técnico con estructura, metadatos y criterios de accesibilidad. El alcance se define en la propuesta.",
        },
        {
          question: "¿Qué procesos puedo automatizar?",
          answer:
            "Puedo conectar herramientas, pagos, formularios, catálogos, reportes y tareas internas mediante APIs, webhooks, n8n o MCP. Primero reviso el proceso para definir qué conviene automatizar.",
        },
        {
          question: "¿Cómo definís tiempos y costo de una automatización?",
          answer:
            "Dependen del alcance, las integraciones y las validaciones necesarias. Después de entender el flujo, organizo el trabajo por etapas y detallo tiempos y entregables en la propuesta.",
        },
        {
          question: "¿Cómo manejás la seguridad y el acceso a mis cuentas?",
          answer:
            "Trabajo con credenciales por entorno, permisos mínimos y accesos revocables. La configuración concreta depende de las herramientas incluidas en el proyecto.",
        },
        {
          question: "¿Incluís mantenimiento, monitoreo y backups?",
          answer:
            "El soporte, mantenimiento, monitoreo y backups se acuerdan según las necesidades del proyecto y quedan detallados en la propuesta.",
        },
      ],
      seo: {
        title: "Preguntas Frecuentes | Rodrigo Opalo",
        description: "Resolvé tus dudas sobre diseño, desarrollo y contratación de sitios web.",
        keywords: "preguntas frecuentes, dudas, diseño web, desarrollo web, contratar sitio web",
      },
    },
    transitionIntro: {
      text: "Transformo ideas en experiencias digitales con propósito.",
    },
    call: {
      title: "¿Listo para destacar online?",
      subtitle:
        "Contame tu idea por el formulario y te respondo para alinear alcance y próximos pasos.",
      button: "Empezar proyecto",
      seo: {
        title: "Contacto final | Rodrigo Opalo",
        description: "Construyamos juntos un sitio moderno, rápido y optimizado para que tu marca se destaque.",
        keywords: "contacto, empezar proyecto, diseño web, programador freelance, destacar online",
      },
    },
    footer: {
      rights: "Made with 💻 by Rodrigo Opalo.",
      seo: {
        title: "Footer | Rodrigo Opalo",
        description: "Créditos finales y autoría del sitio. Web creada con 💻 por Rodrigo Opalo.",
        keywords: "Rodrigo Opalo, pie de página, desarrollador web, créditos, autor",
      },
    },
    seo: {
      title: "Rodrigo Opalo | Diseñador y Desarrollador Web",
      description: "Desarrollo sitios web profesionales, multilenguaje y optimizados para SEO.",
      keywords: "sitios web, desarrollador, diseño web, seo, rodrigo opalo, sitios multilenguaje, programador",
      ogTitle: "devrodri - Diseño y desarrollo web",
      ogDescription: "Portfolio profesional de Rodrigo Opalo. Diseño y desarrollo sitios web modernos, rápidos y optimizados para marcas que quieren destacarse online.",
    },
  },  
  en: {
    header: {
      title: "Rodrigo Opalo",
      subtitle: "Web Designer & Developer",
    },
    nav: {
      about: "About me",
      why: "Why choose me",
      services: "Services",
      portfolio: "Portfolio",
      contact: "Contact",
      faq: "FAQ"
    },
    hero: {
      eyebrow: "RODRIGO OPALO · INDEPENDENT FULL-STACK DEVELOPER",
      primaryCta: "Tell me about your project",
      slides: {
        websites: {
          title: "Professional websites.",
          description:
            "I design and build clear, fast websites focused on real business goals.",
        },
        customSystems: {
          title: "Custom systems and applications.",
          description:
            "I build tools that organize processes, support operations and help businesses grow.",
        },
        integrations: {
          title: "Integrations and automation.",
          description:
            "I connect services and automate tasks to reduce manual work and improve operations.",
        },
        brandLaunches: {
          title: "Brands with a solid digital foundation.",
          description:
            "I coordinate identity, domain, business email and website for a professional launch.",
        },
      },
      carouselLabel: "Featured capabilities",
      goToSlide: "Go to capability",
      slideCountConnector: "of",
      previousSlide: "Previous capability",
      nextSlide: "Next capability",
    },
    transitionVisual: {
      title: "Technical work with a business perspective.",
      subtitleLine1: "It works, it connects",
      subtitleLine2: "and it looks good.",
      paragraph:
        "I define each solution around the problem, the operating context and the project's real priorities.",
      principles: [
        "Direct collaboration",
        "Tailored solutions",
        "Phased development",
        "Technical and business perspective",
      ],
    },
    about: {
      title: "About me",
      role: "Independent full-stack developer with a product mindset",
      expertise: "Full-stack · Product · Operations · Automation",
      introduction:
        "I am Rodrigo Opalo. I work under the devrodri brand, lead each project and work directly with the client to design and build websites, applications, systems and integrations.",
      experience:
        "My experience in operations, logistics, e-commerce and product helps me understand both the technical solution and how the business needs to use and evolve it.",
      collaboration:
        "When the scope requires visual design or another specialty, I coordinate professionals selected for that project and remain the single point of contact.",
      seo: {
        title: "About me | Rodrigo Opalo",
        description: "Meet the team behind the creation of modern, optimized, and purpose-driven websites.",
        keywords: "about me, rodrigo opalo, web developer, team, modern websites, web design",
      },
    },
    experience: {
      title1: "More than design.",
      title2: "I create experiences.",
      description:
        "I focus on building websites that communicate before the user even clicks. Intuitive, clean and fast interfaces. Functional design that feels and looks right.",
    },
    highlights: {
      title: "Why choose me?",
      items: {
        fast: {
          icon: "⚡️",
          title: "Speed & performance",
          desc: "Fast loading, smooth navigation and optimized UX.",
        },
        responsive: {
          icon: "📱",
          title: "Responsive design",
          desc: "Interfaces prepared and reviewed to adapt across different screen sizes.",
        },
        results: {
          icon: "🎯",
          title: "Context-aware decisions",
          desc: "Priorities shaped by the needs of the business and the people using the solution.",
        },
        seo: {
          icon: "🚀",
          title: "Technical SEO foundation",
          desc: "Structure, metadata and technical accessibility prepared for search engines.",
        },
        automation: {
          icon: "🤖",
          title: "Integrations and automation",
          desc: "Workflows using n8n, MCP and APIs connected to the processes defined for the project.",
        },
        payments: {
          icon: "💳",
          title: "Payments when needed",
          desc: "Integrations with Stripe, PayPal or Mercado Pago when the project flow requires them.",
        },
      },
      seo: {
        title: "Why choose me as your web developer?",
        description:
          "Speed, mobile optimization, SEO and UX in every site I build. Discover what makes my work stand out.",
        keywords:
          "developer highlights, website benefits, SEO features, UX advantages",
      },
    },
    services: {
      title: "End-to-end digital solutions",
      intro:
        "I work from problem definition through launch and the ongoing evolution of the solution.",
      items: {
        systems: {
          title: "Custom systems, applications and integrations",
          desc: "Portals, internal tools, web products, roles, administration, traceability, payments, APIs and process automation.",
        },
        web: {
          title: "Websites and e-commerce",
          desc: "Professional websites, catalogs, booking flows, lead generation, online stores and multilingual experiences.",
        },
        brand: {
          title: "Brand development and digital launch",
          desc: "Project direction, visual identity, domain, business email and digital presence. When a project requires a specific specialty, I coordinate professionals selected for that work.",
        },
      },
      seoMeta: {
        title: "Services | Rodrigo Opalo",
        description:
          "I create fast, optimized, multilingual websites with SEO positioning.",
        keywords: "web development, seo, internationalization, design, digital services",
      },
    },

    portfolio: {
      title: "Some Work",
      boating: {
        title: "Boating Adventures Miami",
        desc: "Responsive site in 3 languages, with SEO, WhatsApp integration and custom design.",
        link: "View website",
      },
      bionova: {
        title: "Bionova Supplements",
        desc: "Professional online store in the U.S. for supplement sales. Multilanguage site with Stripe, PayPal, Firebase integration and a complete admin panel.",
        link: "View website",
      },
      federico: {
        title: "Federico Roma",
        desc: "Personal and professional website for the Muay Thai and Kickboxing world champion. Includes biography, video courses, photos, and exclusive products.",
        link: "View website",
      },
      mutter: {
        title: "Mutter Games",
        desc: "E-commerce for video games, consoles and accessories. Dynamic catalog, cart and checkout with Mercado Pago, SEO and responsive design.",
        link: "View website",
      },
      lem_web: {
        title: "LEM-BOX Web (UY/AR)",
        desc: "Multi-country landing for logistics (Uruguay/Argentina), mobile-first, SEO and contact.",
        link: "View website",
      },
      lem_portal: {
        title: "LEM-BOX Portal (System)",
        desc: "Operational system with roles, traceability, boxes/shipments, invoicing and payments (Stripe).",
        link: "View portal",
      },
      esteban: {
        title: "Esteban Firpo · Miami Real Estate",
        desc: "Miami preconstruction real‑estate site. Project catalog, galleries, payment plans and ES/EN pages with WhatsApp integration and optimized SEO.",
        link: "View website",
      },
      magenta: {
        title: "Imprenta Magenta · Paysandú, Uruguay",
        desc: "Modern print shop specializing in digital printing, offset and food packaging. Optimized catalog, dynamic quote form and full SEO. Functional MVP currently live.",
        link: "Visit site",
      },
      campings_demo: {
        title: "Campground booking platform",
        desc: "Full-stack prototype presented as a proposal to explore campground availability, bookings, simulated payments and administration. It was not commissioned or adopted by the intended organization.",
        status: "Concept prototype",
        disclaimer: "Independent concept project. It is not an official system and is not affiliated with Administración de Parques Nacionales.",
        link: "View code",
      },
      seo: {
        title: "Portfolio | Rodrigo Opalo",
        description: "Take a look at some of the websites I’ve built - modern, optimized and user-focused.",
        keywords: "portfolio, web design, projects, websites, Rodrigo Opalo, developer",
      },
    },
    testimonials: {
      title: "What clients are saying",
      items: [
        {
          name: "Lucía Martínez",
          quote: "Rodrigo understood exactly what I needed. My site looks amazing.",
        },
        {
          name: "Carlos Díaz",
          quote: "Professional, fast and super responsive. I highly recommend him.",
        },
        {
          name: "Valentina Suárez",
          quote: "The design is modern and mobile-friendly. Thanks a lot!",
        },
      ],
    },
    contact: {
      title: "Tell me about your project",
      subtitle:
        "Tell me what you need to solve. I will reply within 24 hours with the next steps.",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      messagePlaceholder: "How can I help you?",
      submit: "Send message",
      seo: {
        title: "Contact | Rodrigo Opalo",
        description:
          "Do you have a project in mind? Reach out and let’s talk about how I can help bring your vision to life.",
        keywords: "contact, web developer, send message, quote, website project",
      },
    },
    faq: {
      title: "FAQ",
      questions: [
        {
          question: "How long does it take to build a website?",
          answer:
            "The timeline depends on the scope. Once I understand the project, I organize the work in stages and define timing and deliverables in the proposal.",
        },
        {
          question: "Can I request changes after the site is live?",
          answer:
            "Yes. Adjustments, improvements or new stages after launch are agreed according to the project's needs.",
        },
        {
          question: "How is the payment handled?",
          answer:
            "Payment terms are defined in the proposal according to the scope and agreed stages.",
        },
        {
          question: "What technologies do you use to build websites?",
          answer:
            "I work with tools such as Next.js, React, Vite, TypeScript, Tailwind, Firebase, Node.js, Python, Stripe, n8n and APIs. I choose the stack according to the project's needs.",
        },
        {
          question: "Can I manage the site myself?",
          answer:
            "Yes. When the project requires it, I can include a dashboard for managing text, images, products or other content.",
        },
        {
          question: "Can the site have more than one language?",
          answer:
            "Yes. I can plan a multilingual experience from the start or prepare the structure for additional languages later.",
        },
        {
          question: "Do you offer custom design?",
          answer:
            "Yes. I define the interface around the project's identity, content and specific goals.",
        },
        {
          question: "Will my site be mobile-friendly?",
          answer:
            "I design and review each interface to adapt across phones, tablets and desktop screens.",
        },
        {
          question: "Is SEO included?",
          answer:
            "I can include a technical SEO foundation covering structure, metadata and accessibility criteria. The scope is defined in the proposal.",
        },
        {
          question: "What processes can I automate?",
          answer:
            "I can connect tools, payments, forms, catalogs, reports and internal tasks through APIs, webhooks, n8n or MCP. I first review the process to define what is worth automating.",
        },
        {
          question: "How do you define the timeline and cost of an automation?",
          answer:
            "They depend on the scope, integrations and required validation. Once I understand the workflow, I organize the work in stages and define timing and deliverables in the proposal.",
        },
        {
          question: "How do you handle security and access to my accounts?",
          answer:
            "I work with environment-specific credentials, minimum permissions and revocable access. The exact setup depends on the tools included in the project.",
        },
        {
          question: "Do you include maintenance, monitoring and backups?",
          answer:
            "Support, maintenance, monitoring and backups are agreed according to the project's needs and documented in the proposal.",
        },
      ],
      seo: {
        title: "FAQ | Rodrigo Opalo",
        description: "Answers to common questions about web design, development, and hiring process.",
        keywords: "frequently asked questions, website design, web development, hiring a developer, FAQ",
      },
    },
    transitionIntro: {
      text: "I turn ideas into meaningful digital experiences.",
    },
    call: {
      title: "Ready to stand out online?",
      subtitle:
        "Tell me about your idea via the form and I’ll follow up to align scope and next steps.",
      button: "Start project",
      seo: {
        title: "Final contact | Rodrigo Opalo",
        description: "Let’s build a modern, fast, and optimized site so your brand stands out.",
        keywords: "contact, start project, web design, freelance developer, stand out online",
      },
    },
    footer: {
      rights: "Made with 💻 by Rodrigo Opalo.",
      seo: {
        title: "Footer | Rodrigo Opalo",
        description: "Final credits and authorship of the site. Web made with 💻 by Rodrigo Opalo.",
        keywords: "Rodrigo Opalo, footer, web developer, credits, author",
      },
    },
    seo: {
      title: "Rodrigo Opalo | Web Designer and Developer",
      description: "I build professional websites with SEO and multilingual support.",
      keywords:
        "websites, developer, web design, seo, rodrigo opalo, multilingual sites, web developer",
      ogTitle: "devrodri - Web design & development",
      ogDescription: "Professional portfolio of Rodrigo Opalo. I design and build modern, fast and optimized websites for brands that want to stand out online.",
    },
  },
};

export default translations;
