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
        "Ready to take your brand to the next level? Message me via the form, WhatsApp or email and we’ll align fit and next steps together.",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      messagePlaceholder: "How can I help you?",
      submit: "Send message",
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
  } as const satisfies TranslationSchema<typeof es>;

export default en;
