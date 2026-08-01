import type { es } from "./es";
import type { TranslationSchema } from "./types";

export const en = {
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
      title: "Start with the problem. Build the right solution.",
      paragraph:
        "I work directly with each client to understand the business, define priorities, and build a clear, useful solution designed to grow.",
      primaryCta: "View case studies",
      secondaryCta: "Tell me about your project",
      points: {
        discovery: "Discovery and scope",
        development: "Custom development",
        stages: "Phased delivery",
      },
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
      title1: "Technology that connects product,",
      title2: "systems, and business.",
      description:
        "I work directly with each client to understand what the business needs and turn it into a clear solution: websites, applications, automations, and integrations that can evolve in stages.",
    },
    highlights: {
      title: "Why work with me?",
      items: {
        product: {
          title: "Product vision",
          desc: "I shape each solution around the problem, the user, and the business priority.",
        },
        purpose: {
          title: "Purposeful technology",
          desc: "I choose tools for their usefulness, maintainability, and fit for the project.",
        },
        direct: {
          title: "Direct communication",
          desc: "You work directly with me from start to finish, with clear decisions and no intermediaries.",
        },
        business: {
          title: "Real business experience",
          desc: "I bring a practical perspective on operations, customers, and product decisions.",
        },
        automation: {
          title: "Automation and integrations",
          desc: "I connect systems and tools to reduce manual work and improve processes.",
        },
        stages: {
          title: "Phased evolution",
          desc: "We prioritize what matters and build a foundation that can grow without overcomplicating the MVP.",
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
      lem_box: {
        title: "LEM-BOX",
        desc: "LEM-BOX is a logistics business with more than 10 years of experience and operations connected to the United States, Uruguay, and Argentina. Its digital ecosystem combines market-specific websites with a central platform used in the business's daily operations.",
        status: "Active product",
        platformLink: "View platform",
        platformNote: "Sign-in required",
        uruguayLink: "Uruguay",
        argentinaLink: "Argentina",
      },
      zentra: {
        title: "ZENTRA",
        desc: "ZENTRA is a professional scenting brand for commercial and residential spaces. The project began with a broader need than a website: define its positioning, naming, identity, and a coherent digital foundation for launch and growth.",
        status: "In development",
        link: "Visit site in development",
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
        title: "Portfolio: websites, systems and products | Rodrigo Opalo",
        description: "Explore systems, websites, e-commerce, and brand strategy projects with details on scope, role, and technology.",
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
        "Share the context, goal, and any important constraints. You can use the form or contact me by WhatsApp or email.",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "How can I help?",
      submit: "Send inquiry",
      privacyDisclosure:
        "When you submit this form, your name, email and message are used only to reply to your inquiry. The submission is processed through FormSubmit. Google Analytics measures general site usage and does not receive the form contents.",
      seo: {
        title: "Contact | Rodrigo Opalo",
        description:
          "Do you have a project in mind? Reach out and let’s talk about how I can help bring your vision to life.",
        keywords: "contact, web developer, send message, quote, website project",
      },
    },
    faq: {
      title: "Frequently asked questions",
      questions: {
        projectTypes: {
          question: "What kinds of projects do you build?",
          answer:
            "I build websites, custom systems, portals, automations, integrations, and digital brand launches. Scope is defined around the problem, users, and business goals.",
        },
        projectStart: {
          question: "How does a project start?",
          answer:
            "It starts with a conversation to understand the context, goal, users, and constraints. From there, I define priorities, scope, and a clear first stage.",
        },
        websiteVsSystem: {
          question: "When do I need a website versus a custom system?",
          answer:
            "A website helps communicate, attract inquiries, or sell. A custom system supports processes, users, data, and operations. Some projects need both.",
        },
        phasedWork: {
          question: "Can the project be built in stages, and how are timelines defined?",
          answer:
            "Yes. I first prioritize a useful, clear foundation. Timelines are estimated after defining the scope, dependencies, and deliverables for each stage.",
        },
        websiteCapabilities: {
          question: "What can a website include?",
          answer:
            "Depending on scope, it can include a catalog, forms, payments, a content management panel, multiple languages, and a technical SEO foundation. Responsive behavior is considered from the start. An SEO foundation does not guarantee specific search rankings.",
        },
        automations: {
          question: "Do you build automations and integrations?",
          answer:
            "Yes. I can connect APIs, payments, forms, CRMs, webhooks, and other services to reduce manual work and improve processes. I only add what creates real value for the project.",
        },
        brandDevelopment: {
          question: "How do you approach brand development?",
          answer:
            "I can lead strategy, naming, creative direction, and digital launch. When specialized visual identity work is needed, I coordinate with a designer.",
        },
        budgetAndPayment: {
          question: "How are budget and payment terms defined?",
          answer:
            "The budget is defined according to the project scope and stages. Before work begins, the proposal details deliverables, milestones, and payment terms.",
        },
        postLaunch: {
          question: "What happens with access, handoff, and support after launch?",
          answer:
            "Access, deliverables, documentation, and support terms are defined in the project scope. If the product needs to keep evolving, I organize improvements into new stages.",
        },
      },
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
      smallTitle: "IN PRACTICE",
      text: "Each project turns a specific need into a functional digital solution designed to evolve.",
    },
    call: {
      title: "Have a project in mind?",
      subtitle:
        "Share the context and we'll figure out the best place to start.",
      button: "Tell me about your project",
      seo: {
        title: "Final contact | Rodrigo Opalo",
        description: "Let’s build a modern, fast, and optimized site so your brand stands out.",
        keywords: "contact, start project, web design, freelance developer, stand out online",
      },
    },
    footer: {
      rights: "Rodrigo Opalo · devrodri",
      seo: {
        title: "Footer | Rodrigo Opalo",
        description: "Footer with contact and profile links for Rodrigo Opalo.",
        keywords: "Rodrigo Opalo, footer, web developer, credits, author",
      },
    },
    seo: {
      title: "Rodrigo Opalo | Websites, systems and automation",
      description: "I build custom websites, applications, and systems, plus automations and integrations aligned with real business goals.",
      keywords:
        "websites, developer, web design, seo, rodrigo opalo, multilingual sites, web developer",
    },
  } as const satisfies TranslationSchema<typeof es>;

export default en;
