// src/Components/Footer.tsx
import { motion } from "framer-motion";
import { FaEnvelope, FaWhatsapp, FaGithub, FaLinkedin } from "react-icons/fa";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const linkClassName =
    "relative hover:text-primary-on-light-hover transition-all duration-300 text-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-on-light focus-visible:ring-offset-2 after:absolute after:left-1/2 after:top-1/2 after:h-10 after:w-8 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']";
  const labels =
    language === "es"
      ? {
          github: "GitHub de Rodrigo Opalo",
          linkedin: "LinkedIn de Rodrigo Opalo",
          email: "Enviar email a Rodrigo Opalo",
          whatsapp: "Contactar a Rodrigo Opalo por WhatsApp",
        }
      : {
          github: "Rodrigo Opalo on GitHub",
          linkedin: "Rodrigo Opalo on LinkedIn",
          email: "Email Rodrigo Opalo",
          whatsapp: "Contact Rodrigo Opalo on WhatsApp",
        };

  return (
    <motion.footer
      data-nojs-visible
      className="border-t border-gray-200 bg-white py-3 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto text-center text-[11px] text-gray-600 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
        {/* Icons row */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/devrodri-com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.github}
            title="GitHub"
            className={linkClassName}
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/rodrigo-opalo-b56685390/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.linkedin}
            title="LinkedIn"
            className={linkClassName}
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:r.opalo@icloud.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.email}
            title="Email"
            className={linkClassName}
          >
            <FaEnvelope />
          </a>
          <a
            href="https://wa.me/17544653318"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.whatsapp}
            title="WhatsApp"
            className={linkClassName}
          >
            <FaWhatsapp />
          </a>
        </div>
        {/* Copyright row */}
        <p className="leading-none text-center px-4">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
      </div>
    </motion.footer>
  );
}
