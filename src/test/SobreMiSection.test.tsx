import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SobreMiSection from "../Components/SobreMiSection";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

function renderAboutSection(language: Language) {
  localStorage.setItem("language", language);
  return render(
    <LanguageProvider>
      <SobreMiSection />
    </LanguageProvider>,
  );
}

function getAboutSection(container: HTMLElement) {
  const section = container.querySelector("#sobremi");
  if (!section) throw new Error("Expected About section");
  return section;
}

describe("SobreMiSection", () => {
  it("delivers the portrait and certificate thumbnails without changing their semantics", () => {
    const { container } = renderAboutSection("es");
    const portrait = container.querySelector<HTMLImageElement>(
      'img[data-home-image="sobremi"]',
    );
    const certificate = container.querySelector<HTMLImageElement>(
      'img[data-home-image="ibm-certificate"]',
    );
    const certificatePicture = certificate?.closest("picture");

    expect(portrait).toHaveAttribute("alt", "Rodrigo Opalo");
    expect(portrait).toHaveAttribute("width", "320");
    expect(portrait).toHaveAttribute("height", "320");
    expect(portrait).toHaveAttribute("loading", "lazy");
    expect(portrait).toHaveAttribute("decoding", "async");
    expect(portrait).toHaveAttribute(
      "sizes",
      "(min-width: 640px) 96px, 80px",
    );
    expect(portrait).toHaveClass("w-20", "h-20", "sm:w-24", "sm:h-24", "object-cover");

    expect(certificate).toHaveAttribute("alt", "");
    expect(certificate).toHaveAttribute("width", "88");
    expect(certificate).toHaveAttribute("height", "68");
    expect(certificate).toHaveAttribute("sizes", "83px");
    expect(certificatePicture?.querySelectorAll("source")).toHaveLength(1);
    expect(certificatePicture?.querySelector("source")).toHaveAttribute(
      "type",
      "image/webp",
    );
    expect(certificate?.closest("a")).toHaveAttribute(
      "href",
      "/img/certs/ibm-fullstack.png",
    );
  });

  it("stacks the IBM certificate content on mobile and restores the row at the small breakpoint", () => {
    const { container } = renderAboutSection("es");
    const section = getAboutSection(container);
    const certificateLink = section.querySelector<HTMLAnchorElement>(
      'a[href*="credly.com"]',
    );

    expect(certificateLink).toHaveClass(
      "flex-col",
      "items-center",
      "gap-2",
      "w-full",
      "max-w-[21rem]",
      "text-center",
      "sm:flex-row",
      "sm:w-auto",
      "sm:max-w-none",
    );
    expect(certificateLink).not.toHaveClass("justify-between");
    expect(certificateLink).toHaveTextContent(
      "IBM Full Stack Software Developer Professional Certificate (V5)",
    );
    expect(certificateLink).toHaveTextContent("Verificar");
  });

  it("presents the approved business-oriented positioning in Spanish", () => {
    const { container } = renderAboutSection("es");
    const section = getAboutSection(container);

    expect(section).toHaveTextContent("Integrador de tecnología con mentalidad de producto");
    expect(section).toHaveTextContent("Full-stack · Sistemas · Automatización · Integraciones");
    expect(section).toHaveTextContent(
      "Soy Rodrigo Opalo. Trabajo bajo la marca devrodri y desarrollo productos digitales orientados al negocio. Creo sitios, aplicaciones y sistemas a medida combinando estrategia, experiencia de usuario y tecnología.",
    );
    expect(section).toHaveTextContent(
      "También implemento automatizaciones, integraciones y asistentes con IA para conectar herramientas, optimizar procesos y reducir trabajo manual.",
    );
    expect(section).toHaveTextContent(
      "Next.js · React · Node.js · Python · Firebase · Docker · CI/CD · Integraciones API · Pagos digitales · Automatización e IA",
    );
    expect(section).toHaveTextContent("Certificación profesional verificada por IBM Skills Network y Credly");
    expect(section).toHaveTextContent("Contame tu proyecto");
    expect(section).not.toHaveTextContent(/IA aplicada/);
    expect(section).not.toHaveTextContent(/Stripe/);
    expect(section).not.toHaveTextContent(/OpenAI API/);
    expect(section).not.toHaveTextContent(/modernos, rápidos/);
    expect(section).not.toHaveTextContent(/n8n y MCP/);
    expect(section).not.toHaveTextContent(/escalar procesos/);
  });

  it("keeps the positioning equivalent in English", () => {
    const { container } = renderAboutSection("en");
    const section = getAboutSection(container);

    expect(section).toHaveTextContent("Technology integrator with a product mindset");
    expect(section).toHaveTextContent("Full-stack · Systems · Automation · Integrations");
    expect(section).toHaveTextContent(
      "I'm Rodrigo Opalo. I work under the devrodri brand and develop business-oriented digital products. I create custom websites, applications, and systems by combining strategy, user experience, and technology.",
    );
    expect(section).toHaveTextContent(
      "I also implement automations, integrations, and AI assistants to connect tools, optimize processes, and reduce manual work.",
    );
    expect(section).toHaveTextContent(
      "Next.js · React · Node.js · Python · Firebase · Docker · CI/CD · API integrations · Digital payments · Automation and AI",
    );
    expect(section).toHaveTextContent("Professional certification verified by IBM Skills Network and Credly");
    expect(section).toHaveTextContent("Tell me about your project");
    expect(section).not.toHaveTextContent(/Applied AI/);
    expect(section).not.toHaveTextContent(/Stripe/);
    expect(section).not.toHaveTextContent(/OpenAI API/);
    expect(section).not.toHaveTextContent(/modern, fast/);
    expect(section).not.toHaveTextContent(/n8n and MCP/);
    expect(section).not.toHaveTextContent(/scale operations/);
  });
});
