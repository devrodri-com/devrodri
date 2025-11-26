// src/Components/ContactSection.tsx
import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import { motion } from "framer-motion";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(form.action!, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Network response was not ok");
      setSuccess(true);
      form.reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(
        language === "es"
          ? "No pudimos enviar el mensaje. Probá nuevamente o escribime a r.opalo@icloud.com"
          : "We couldn't send your message. Please try again or email me at r.opalo@icloud.com"
      );
    } finally {
      setSubmitting(false);
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
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {t.contact.title}
        </h2>

        <p className="text-gray-600 mb-10 text-sm sm:text-base max-w-[40ch] mx-auto">
          {t.contact.subtitle}
        </p>

        <form
          action="https://formsubmit.co/ajax/r.opalo@icloud.com"
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="Nuevo mensaje desde devrodri.com" />
          <input type="text" name="_honey" className="hidden" style={{ display: "none" }} />
          <label htmlFor="name" className="sr-only">{language === "es" ? "Nombre" : "Name"}</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder={t.contact.namePlaceholder}
            autoComplete="name"
            minLength={2}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="email" className="sr-only">{language === "es" ? "Correo electrónico" : "Email"}</label>
          <input
            id="email"
            type="email"
            inputMode="email"
            name="email"
            placeholder={t.contact.emailPlaceholder}
            autoComplete="email"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="message" className="sr-only">{language === "es" ? "Mensaje" : "Message"}</label>
          <textarea
            id="message"
            name="message"
            placeholder={t.contact.messagePlaceholder}
            autoComplete="off"
            minLength={10}
            required
            rows={5}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          ></textarea>

          <motion.button
            type="submit"
            data-analytics="contact-submit"
            disabled={submitting}
            aria-busy={submitting}
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-all duration-300 ease-in-out shadow-md flex items-center justify-center gap-2 focus-visible:ring-2 ring-offset-2 ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
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
        </form>

        <div className="mt-10 flex justify-center gap-8 text-sm text-gray-500">
          <a
            href="mailto:r.opalo@icloud.com?subject=Consulta%20devrodri.com"
            className="hover:text-primary flex items-center gap-2"
          >
            <FaEnvelope /> Email
          </a>
          <span>|</span>
          <a
            href="https://wa.me/17544653318?text=Hola%20Rodrigo%2C%20vengo%20de%20devrodri.com%20y%20me%20gustar%C3%ADa%20hablar%20sobre%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary flex items-center gap-2"
            data-analytics="contact-whatsapp"
          >
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}