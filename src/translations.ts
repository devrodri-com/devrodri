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
  hero: { title: string; subtitle: string };
  about: {
    title: string;
    description: string;
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
    items: {
      web: {
        title: string;
        desc: string;
      };
      seo: {
        title: string;
        desc: string;
      };
      lang: {
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
  transitionServicesIntro: {
    smallTitle: string;
    text: string;
  };
  transitionVisual: {
    title: string;
    subtitleLine1: string;
    subtitleLine2: string;
    paragraph: string;
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
      title: "Diseño web profesional.",
      subtitle:
        "Desarrollo sitios web elegantes, funcionales y optimizados. Ideal para marcas que buscan diferenciarse.",
    },
    transitionVisual: {
      title: "Diseño con intención.",
      subtitleLine1: "Funciona, conecta",
      subtitleLine2: "y se ve bien.",
      paragraph:
        "Cada proyecto es único, como cada cliente. No se trata de decorar, sino de proyectar lo que tu marca quiere decir.",
    },
    about: {
      title: "Sobre mí",
      description:
        "Soy Rodrigo Opalo, desarrollador web y emprendedor. Trabajo bajo la marca devrodri y creo sitios modernos, rápidos y optimizados para marcas que buscan destacarse. Combino diseño, funcionalidad y tecnología de inteligencia artificial para lograr resultados reales. También desarrollo proyectos como Boating Adventures Miami y LEM-BOX.",
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
          desc: "Tu sitio se verá perfecto en todos los dispositivos.",
        },
        results: {
          icon: "🎯",
          title: "Enfocado en resultados",
          desc: "Diseño con propósito que convierte visitantes en clientes.",
        },
        seo: {
          icon: "🚀",
          title: "SEO integrado",
          desc: "Optimización técnica y estratégica para posicionar en Google.",
        },
        automation: {
          icon: "🤖",
          title: "Automatizaciones",
          desc: "Integraciones y flujos con n8n y MCP que ahorran tiempo y escalan tu negocio.",
        },
        payments: {
          icon: "💳",
          title: "Pagos online embebidos",
          desc: "Checkout integrado con Stripe/PayPal/Mercado Pago, seguro y sin fricción.",
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
      title: "¿Qué puedo crear para vos?",
      items: {
        web: {
          title: "Sitios Web Personalizados",
          desc: "Diseño moderno, responsivo y adaptado a tu marca.",
        },
        seo: {
          title: "Optimizado para SEO",
          desc: "Posicionamiento orgánico con metadatos y estructura profesional.",
        },
        lang: {
          title: "Multilenguaje",
          desc: "Sitios en español, inglés y portugués con sistema de traducción.",
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
      title: "Contacto",
      subtitle:
        "¿Listo para llevar tu marca al siguiente nivel? Escribime por WhatsApp o correo y coordinamos una reunión o una llamada.",
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
          answer: "Depende del tipo de sitio, pero generalmente entre 5 y 15 días hábiles.",
        },
        {
          question: "¿Puedo pedir cambios luego de publicado?",
          answer: "¡Sí! Incluyo ajustes posteriores para que quedes conforme.",
        },
        {
          question: "¿Cómo se realiza el pago?",
          answer: "Seña al comenzar y saldo al entregar. A convenir.",
        },
        {
          question: "¿Qué tecnologías usás para desarrollar los sitios?",
          answer: "Trabajo con tecnologías modernas como React, Tailwind, TypeScript, Vite y más.",
        },
        {
          question: "¿Hacés sitios autoadministrables?",
          answer: "Sí. Puedo ofrecerte un panel para que edites textos, imágenes o productos fácilmente.",
        },
        {
          question: "¿Puedo tener más de un idioma en mi sitio?",
          answer: "Claro, puedo hacerlo multilingüe desde el inicio o dejarlo listo para sumar idiomas luego.",
        },
        {
          question: "¿Ofrecés diseño personalizado?",
          answer: "Sí. Cada sitio es único y se adapta a tu marca, estilo y necesidades.",
        },
        {
          question: "¿Mi sitio estará optimizado para celulares?",
          answer: "Por supuesto. Todos los sitios que desarrollo son 100% responsivos y se ven perfectos en cualquier dispositivo.",
        },
        {
          question: "¿Incluye SEO?",
          answer: "Sí, aplico prácticas básicas de SEO técnico y estructura optimizada para buscadores.",
        }
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
    transitionServicesIntro: {
      smallTitle: "CONSTRUYAMOS ALGO INCREÍBLE",
  text: "Ahora que sabés cómo trabajo, veamos qué podemos construir juntos.",
},
    call: {
      title: "¿Listo para destacar online?",
      subtitle:
        "Construyamos juntos un sitio moderno, rápido y optimizado para que tu marca se destaque.",
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
      title: "Professional web design.",
      subtitle:
        "I create elegant, functional, and optimized websites. Ideal for brands that want to stand out.",
    },
    transitionVisual: {
      title: "Design with intention.",
      subtitleLine1: "It works, it connects",
      subtitleLine2: "and it looks good.",
      paragraph:
        "Each project is as unique as each client. It's not about decoration, but about projecting what your brand wants to express.",
    },
    about: {
      title: "About me",
      description:
        "I’m Rodrigo Opalo, a web developer and entrepreneur. I work under the devrodri brand and build modern, fast, and optimized websites for brands that want to stand out online. I combine design, functionality, and applied AI to deliver real outcomes. I’ve also built projects like Boating Adventures Miami and LEM-BOX.",
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
          desc: "Your site will look perfect on every screen.",
        },
        results: {
          icon: "🎯",
          title: "Results-driven",
          desc: "Purposeful design that converts visitors into clients.",
        },
        seo: {
          icon: "🚀",
          title: "Built-in SEO",
          desc: "Technical and strategic optimization to rank on Google.",
        },
        automation: {
          icon: "🤖",
          title: "Automations",
          desc: "Integrations and workflows with n8n and MCP that save time and scale your business.",
        },
        payments: {
          icon: "💳",
          title: "Embedded payments",
          desc: "Integrated checkout with Stripe/PayPal/Mercado Pago – secure and frictionless.",
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
      title: "What can I build for you?",
      items: {
        web: {
          title: "Custom Websites",
          desc: "Modern, responsive design tailored to your brand.",
        },
        seo: {
          title: "SEO Optimization",
          desc: "Organic positioning with metadata and professional structure.",
        },
        lang: {
          title: "Multilanguage",
          desc: "Sites in Spanish and English with translation system.",
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
      title: "Contact",
      subtitle:
        "Ready to take your brand to the next level? Send me a message via WhatsApp or email and let’s schedule a meeting or a call.",
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
          answer: "It depends on the type of site, but usually between 5 and 15 business days.",
        },
        {
          question: "Can I request changes after the site is live?",
          answer: "Absolutely! I include post-launch adjustments to ensure you're fully satisfied.",
        },
        {
          question: "How is the payment handled?",
          answer: "A deposit to get started and the balance upon delivery. Terms are flexible.",
        },
        {
          question: "What technologies do you use to build websites?",
          answer: "I use modern tech like React, Tailwind, TypeScript, Vite, and more.",
        },
        {
          question: "Can I manage the site myself?",
          answer: "Yes. I can provide a dashboard so you can easily update content, images, or products.",
        },
        {
          question: "Can the site have more than one language?",
          answer: "Absolutely. I can make it multilingual from the start or prepare it for future languages.",
        },
        {
          question: "Do you offer custom design?",
          answer: "Yes. Every site is tailored to your brand, style, and business goals.",
        },
        {
          question: "Will my site be mobile-friendly?",
          answer: "Of course. All sites I develop are fully responsive and look great on any device.",
        },
        {
          question: "Is SEO included?",
          answer: "Yes. I apply technical SEO basics and optimized structure so your site ranks better.",
        }
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
    transitionServicesIntro: {
      smallTitle: "LET’S BUILD SOMETHING GREAT",
  text: "Now that you know how I work, let’s see what we can build together.",
},
    call: {
      title: "Ready to stand out online?",
      subtitle: "Let's build a modern, fast, and optimized site so your brand stands out.",
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