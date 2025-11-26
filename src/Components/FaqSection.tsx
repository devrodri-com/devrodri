// src/Components/FaqSection.tsx
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

export default function FaqSection() {
  const { language } = useLanguage();
  const t = translations[language];

  const extraFaq = language === "es"
    ? [
        {
          question: "¿Automatizaciones: qué puedo automatizar (n8n / MCP)?",
          answer:
            "Integraciones entre apps (CRM, pagos, Sheets), disparadores por webhooks, reportes automáticos, sincronización de catálogos/pedidos y bots de soporte. MCP permite que un agente de IA use herramientas seguras (leer/crear tickets, consultar CRM) con permisos controlados.",
        },
        {
          question: "¿Tiempos y costo de una automatización?",
          answer:
            "Un flujo simple (ej. webhook → Google Sheets → aviso a WhatsApp) suele estar en 2–5 días. Flujos medianos con panel y validaciones: 1–3 semanas. Presupuesto según alcance y conexiones (APIs/pagos).",
        },
        {
          question: "¿Seguridad y acceso a mis cuentas?",
          answer:
            "Trabajamos con credenciales por entorno y roles. En Firebase y n8n usamos variables de entorno; en MCP se definen herramientas con permisos mínimos. Acceso revocable y logs de actividad.",
        },
        {
          question: "¿Mantenimiento y monitoreo?",
          answer:
            "Opcional: monitoreo de flujos, alertas por error, backups y versiones. Ofrecemos soporte mensual para evolutivos y nuevos conectores.",
        },
      ]
    : [
        {
          question: "Automations: what can we automate (n8n / MCP)?",
          answer:
            "App integrations (CRM, payments, Sheets), webhook triggers, automated reports, catalog/order sync and support bots. MCP lets an AI agent use safe tools (read/create tickets, query CRM) with least‑privilege permissions.",
        },
        {
          question: "Timeline & cost for an automation?",
          answer:
            "Simple flows (e.g., webhook → Google Sheets → WhatsApp alert) ship in 2–5 days. Mid‑size with validations/panel: 1–3 weeks. Budget depends on scope and APIs.",
        },
        {
          question: "Security & access",
          answer:
            "We use env‑scoped credentials and roles. In Firebase/n8n we keep secrets in env; in MCP tools are permissioned. Access is revocable and activity is logged.",
        },
        {
          question: "Maintenance & monitoring",
          answer:
            "Optional monthly plan: flow monitoring, error alerts, backups/versioning and evolutive changes.",
        },
      ];

  // Patch the "technologies" answer to include Next.js and stack items
  const techAnswerEs =
    "Next.js, React, Vite (según proyecto), TypeScript, Tailwind, Firebase (Firestore/Auth/Hosting/Storage), Stripe/PayPal, n8n y MCP (automatizaciones), ImageKit/Cloudinary (medios), Framer Motion e i18next (multilenguaje).";
  const techAnswerEn =
    "Next.js, React, Vite (per project), TypeScript, Tailwind, Firebase (Firestore/Auth/Hosting/Storage), Stripe/PayPal, n8n & MCP (automations), ImageKit/Cloudinary (media), Framer Motion and i18next (multilanguage).";

  const baseFaqs = [...t.faq.questions];
  const techIdx = baseFaqs.findIndex((q: any) => /tecnolog|technolog/i.test(q.question));
  if (techIdx > -1) {
    baseFaqs[techIdx] = {
      ...baseFaqs[techIdx],
      answer: language === "es" ? techAnswerEs : techAnswerEn,
    };
  }

  const faqs = [...baseFaqs, ...extraFaq];

  return (
    <section
      id="faq"
      className="relative bg-black py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Imagen de fondo centrada y ampliada con degradado sutil */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/img/faq-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125" // aumentamos el tamaño
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </div>

      {/* Degradado superior (desde negro a imagen) */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-10" />

      {/* Degradado inferior (imagen a negro) */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-10" />

      {/* Contenido principal */}
      <div className="relative z-20 max-w-4xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold text-center text-white mb-12 tracking-tight leading-tight drop-shadow-sm"
        >
          {t.faq.title}
        </h2>

        <div className="space-y-8">
          {faqs.map((q: any, index: number) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-7 px-5 sm:px-6 rounded-2xl shadow-md border border-gray-100 cursor-default transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-lg hover:scale-[1.01]"
            >
              <h3 className="font-semibold text-lg sm:text-xl text-primary mb-2">
                {q.question}
              </h3>
              <p className="text-neutral-800 text-base leading-relaxed">
                {q.answer}
              </p>
            </div>
          ))}
        </div>

        {/* CTA final para contacto */}
        <div className="text-center mt-12 text-sm text-gray-500">
          {language === "es" ? "¿Tenés otra duda? " : "Still have a question? "}
          <a href="https://wa.me/17544653318" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{language === "es" ? "Escribime por WhatsApp" : "Message me on WhatsApp"}</a>
          <span className="mx-2">·</span>
          <a href="mailto:r.opalo@icloud.com?subject=Consulta%20FAQ%20devrodri.com" className="text-primary hover:underline font-medium">Email</a>
        </div>
      </div>
    </section>
  );
}