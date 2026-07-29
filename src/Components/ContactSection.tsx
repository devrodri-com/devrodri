// src/Components/ContactSection.tsx
import { useEffect, useRef, useState } from "react";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";
import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import {
  CONTACT_FORM_ENDPOINT,
  CONTACT_FORM_LIMITS,
  submitContactForm,
} from "../services/contactForm";
import {
  trackContactAttempt,
  trackContactError,
  trackContactSuccess,
  trackContactTimeout,
} from "../lib/analytics";

export default function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const activeRequestRef = useRef<AbortController | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      activeRequestRef.current?.abort();
      activeRequestRef.current = null;
      if (successTimerRef.current !== null) {
        globalThis.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeRequestRef.current !== null) return;

    setError(null);
    setSuccess(false);
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    trackContactAttempt(language);
    const request = submitContactForm(form.action, formData);
    activeRequestRef.current = request.controller;

    try {
      const result = await request.result;
      if (!isMountedRef.current) return;

      if (result.status === "success") {
        trackContactSuccess(language);
        setSuccess(true);
        form.reset();
        if (successTimerRef.current !== null) {
          globalThis.clearTimeout(successTimerRef.current);
        }
        successTimerRef.current = globalThis.setTimeout(() => {
          if (isMountedRef.current) setSuccess(false);
          successTimerRef.current = null;
        }, 5_000);
      } else if (result.status === "timeout") {
        trackContactTimeout(language);
        setError(
          language === "es"
            ? "El envío tardó demasiado. Probá nuevamente o escribime a r.opalo@icloud.com"
            : "The request took too long. Please try again or email me at r.opalo@icloud.com",
        );
      } else {
        trackContactError(language, result.status);
        setError(
          result.status === "validation_error"
            ? language === "es"
              ? "Revisá que el nombre, email y mensaje respeten los límites indicados."
              : "Check that your name, email and message meet the indicated limits."
            : language === "es"
              ? "No pudimos enviar el mensaje. Probá nuevamente o escribime a r.opalo@icloud.com"
              : "We couldn't send your message. Please try again or email me at r.opalo@icloud.com",
        );
      }
    } finally {
      if (activeRequestRef.current === request.controller) {
        activeRequestRef.current = null;
      }
      if (isMountedRef.current) setSubmitting(false);
    }
  };

  return (
    <section
      id="contacto"
      className="relative -mt-px py-28 px-4 sm:px-6 bg-black overflow-hidden"
    >

      {/* Imagen de fondo con degradado tipo Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
  <img
    src="/img/contact-bg.jpg"
    alt=""
    aria-hidden="true"
    loading="lazy"
    decoding="async"
    className="absolute inset-0 w-full h-full object-cover opacity-100"
  />
  {/* Gradiente lateral como antes */}
  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
  {/* NUEVO: Gradiente inferior para fundirse con negro */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-20" />
</div>

      {/* Gradiente superior para fundir con la sección anterior */}
      <div className="absolute inset-x-0 -top-[1px] h-24 bg-gradient-to-b from-black/95 via-black/70 to-transparent z-20" />

      <motion.div
        className="relative z-30 bg-white border border-white/70 max-w-xl mx-auto rounded-3xl shadow-xl p-10 sm:p-12 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-primary-on-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {t.contact.title}
        </h2>

        <p className="text-gray-600 mb-10 text-sm sm:text-base max-w-[40ch] mx-auto">
          {t.contact.subtitle}
        </p>

        <form
          action={CONTACT_FORM_ENDPOINT}
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-describedby="contact-privacy-disclosure"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="Nuevo mensaje desde devrodri.com" />
          <input type="text" name="_honey" className="hidden" style={{ display: "none" }} />
          <div className="space-y-2">
            <label htmlFor="name" className="block text-left text-sm font-medium text-gray-700">
              {t.contact.nameLabel}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              minLength={CONTACT_FORM_LIMITS.name.min}
              maxLength={CONTACT_FORM_LIMITS.name.max}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700">
              {t.contact.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              name="email"
              autoComplete="email"
              maxLength={CONTACT_FORM_LIMITS.email.max}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="block text-left text-sm font-medium text-gray-700">
              {t.contact.messageLabel}
            </label>
            <textarea
              id="message"
              name="message"
              autoComplete="off"
              minLength={CONTACT_FORM_LIMITS.message.min}
              maxLength={CONTACT_FORM_LIMITS.message.max}
              required
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            ></textarea>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="bg-primary-on-light text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-on-light-hover transition-all duration-300 ease-in-out shadow-md flex items-center justify-center gap-2 focus-visible:ring-2 ring-offset-2 ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: submitting ? 1 : 1.05 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
          >
            <FaEnvelope className="text-white" />
            {submitting ? (language === "es" ? "Enviando…" : "Sending…") : t.contact.submit}
          </motion.button>

          {success && (
            <div className="mt-6 text-center" role="status" aria-live="polite">
              <p className="inline-block bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full shadow-sm transition-all duration-300">
                {language === "es"
                  ? "¡Gracias por tu mensaje! Te responderé pronto."
                  : "Thanks for your message! I'll get back to you soon."}
              </p>
            </div>
          )}
          {error && (
            <div className="mt-4 text-center" role="status" aria-live="polite">
              <p className="inline-block bg-red-100 text-red-800 text-sm px-4 py-2 rounded-full shadow-sm transition-all duration-300">
                {error}
              </p>
            </div>
          )}

          <p
            id="contact-privacy-disclosure"
            className="mt-6 text-xs leading-relaxed text-gray-500"
          >
            {t.contact.privacyDisclosure}
          </p>
        </form>

        <div className="mt-10 flex justify-center gap-8 text-sm text-gray-500">
          <a
            href="mailto:r.opalo@icloud.com?subject=Consulta%20devrodri.com"
            className="hover:text-primary-on-light-hover flex items-center gap-2"
          >
            <FaEnvelope /> Email
          </a>
          <span>|</span>
          <a
            href="https://wa.me/17544653318?text=Hola%20Rodrigo%2C%20vengo%20de%20devrodri.com%20y%20me%20gustar%C3%ADa%20hablar%20sobre%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-on-light-hover flex items-center gap-2"
            data-analytics="contact-whatsapp"
          >
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
