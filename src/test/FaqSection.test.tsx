import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FaqSection from "../Components/FaqSection";
import translations from "../i18n";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

const expectedFaqEs = {
  projectTypes: {
    question: "¿Qué tipo de proyectos desarrollás?",
    answer:
      "Trabajo en sitios web, sistemas a medida, portales, automatizaciones, integraciones y lanzamientos digitales de marca. El alcance se define según el problema, los usuarios y los objetivos del negocio.",
  },
  projectStart: {
    question: "¿Cómo comienza un proyecto?",
    answer:
      "Empieza con una conversación para entender el contexto, el objetivo, los usuarios y las restricciones. A partir de eso defino prioridades, alcance y una primera etapa concreta.",
  },
  websiteVsSystem: {
    question: "¿Cuándo conviene un sitio web y cuándo un sistema a medida?",
    answer:
      "Un sitio web sirve para comunicar, captar consultas o vender. Un sistema a medida organiza procesos, usuarios, datos y operaciones. Algunos proyectos necesitan ambas cosas.",
  },
  phasedWork: {
    question: "¿Se puede trabajar por etapas y cómo se definen los tiempos?",
    answer:
      "Sí. Primero priorizo una base útil y clara. Los tiempos se estiman después de definir el alcance, las dependencias y los entregables de cada etapa.",
  },
  websiteCapabilities: {
    question: "¿Qué puede incluir un sitio web?",
    answer:
      "Según el alcance, puede incluir catálogo, formularios, pagos, panel autoadministrable, varios idiomas y una base técnica SEO. El diseño responsive se contempla desde el inicio. La base SEO no garantiza posiciones específicas en buscadores.",
  },
  automations: {
    question: "¿También desarrollás automatizaciones e integraciones?",
    answer:
      "Sí. Puedo conectar APIs, pagos, formularios, CRMs, webhooks y otros servicios para reducir tareas manuales y mejorar procesos. Solo incorporo lo que aporta valor real al proyecto.",
  },
  brandDevelopment: {
    question: "¿Cómo trabajás el desarrollo de marca?",
    answer:
      "Puedo liderar estrategia, naming, dirección creativa y lanzamiento digital. Cuando el proyecto requiere identidad visual especializada, coordino el trabajo con un diseñador.",
  },
  budgetAndPayment: {
    question: "¿Cómo se definen el presupuesto y la forma de pago?",
    answer:
      "El presupuesto se define según el alcance y las etapas del proyecto. Antes de comenzar, la propuesta detalla entregables, hitos y forma de pago.",
  },
  postLaunch: {
    question:
      "¿Qué ocurre con los accesos, la entrega y el soporte después del lanzamiento?",
    answer:
      "Los accesos, entregables, documentación y condiciones de soporte quedan definidos en el alcance. Si el producto necesita continuar evolucionando, organizo las mejoras en nuevas etapas.",
  },
} as const;

const expectedFaqEn = {
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
    question:
      "Can the project be built in stages, and how are timelines defined?",
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
} as const;

const expectedFaqKeys = [
  "projectTypes",
  "projectStart",
  "websiteVsSystem",
  "phasedWork",
  "websiteCapabilities",
  "automations",
  "brandDevelopment",
  "budgetAndPayment",
  "postLaunch",
] as const;

function renderFaq(language: Language) {
  localStorage.setItem("language", language);
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <FaqSection />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

function expectRenderedFaq(
  expectedTitle: string,
  expectedQuestions: typeof expectedFaqEs | typeof expectedFaqEn,
) {
  const section = document.querySelector<HTMLElement>("section#faq");
  expect(section).not.toBeNull();
  if (section === null) return;

  expect(
    within(section).getByRole("heading", { level: 2, name: expectedTitle }),
  ).toBeInTheDocument();
  expect(within(section).getAllByRole("heading", { level: 3 })).toHaveLength(9);
  expect(
    Array.from(section.querySelectorAll("[data-faq-key]"), (element) =>
      element.getAttribute("data-faq-key"),
    ),
  ).toEqual(expectedFaqKeys);

  for (const key of expectedFaqKeys) {
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: expectedQuestions[key].question,
      }),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(expectedQuestions[key].answer),
    ).toBeInTheDocument();
  }
}

describe("FaqSection", () => {
  it("keeps the exact stable FAQ keys and ES/EN parity", () => {
    expect(expectedFaqKeys).toHaveLength(9);
    expect(Object.keys(translations.es.faq.questions)).toEqual(
      expectedFaqKeys,
    );
    expect(Object.keys(translations.en.faq.questions)).toEqual(
      expectedFaqKeys,
    );
    expect(translations.es.faq.questions).toEqual(expectedFaqEs);
    expect(translations.en.faq.questions).toEqual(expectedFaqEn);
  });

  it("renders the exact Spanish FAQ in the approved order", () => {
    renderFaq("es");

    expectRenderedFaq("Preguntas frecuentes", expectedFaqEs);
    expect(
      screen.getByRole("link", { name: "Contame tu proyecto" }),
    ).toHaveAttribute("href", "/#contacto");
    expect(screen.getByText("¿Tenés otra pregunta?")).toBeInTheDocument();
  });

  it("renders the exact English FAQ in the approved order", () => {
    renderFaq("en");

    expectRenderedFaq("Frequently asked questions", expectedFaqEn);
    expect(
      screen.getByRole("link", { name: "Tell me about your project" }),
    ).toHaveAttribute("href", "/#contacto");
    expect(screen.getByText("Still have a question?")).toBeInTheDocument();
  });

  it("removes legacy promises, rigid timelines, and agency voice", () => {
    const publicCopy = JSON.stringify({
      es: translations.es.faq,
      en: translations.en.faq,
    }).toLowerCase();

    for (const legacyCopy of [
      "5 y 15 días",
      "5 and 15 business days",
      "2–5 días",
      "2–5 days",
      "1–3 semanas",
      "1–3 weeks",
      "ajustes posteriores para que quedes conforme",
      "ensure you're fully satisfied",
      "backups",
      "monitoreo de flujos",
      "flow monitoring",
      "so your site ranks better",
      "100% responsivos",
      "trabajamos",
      "ofrecemos",
      "nuestro equipo",
      "we use",
      "we keep",
      "we offer",
      "our team",
    ]) {
      expect(publicCopy).not.toContain(legacyCopy);
    }

    expect(publicCopy).not.toMatch(/[—–]/);
    expect(expectedFaqEs.websiteCapabilities.answer).toContain(
      "no garantiza posiciones específicas",
    );
    expect(expectedFaqEn.websiteCapabilities.answer).toContain(
      "does not guarantee specific search rankings",
    );
  });

  it("keeps the static semantic layout without requests or form controls", () => {
    renderFaq("es");

    const section = document.querySelector<HTMLElement>("section#faq");
    expect(section).not.toBeNull();
    expect(section?.querySelectorAll("button")).toHaveLength(0);
    expect(section?.querySelectorAll("details")).toHaveLength(0);
    expect(section?.querySelectorAll("[aria-expanded]")).toHaveLength(0);
    expect(section?.querySelector("form")).toBeNull();
    expect(section?.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(section?.querySelector('a[href^="https://wa.me/"]')).toBeNull();
  });
});
