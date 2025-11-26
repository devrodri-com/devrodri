/*
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

export default function TestimonialsSection() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <motion.section
      id="testimonios"
      className="bg-white py-28 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold text-primary mb-16 font-sans"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t.testimonials.title}
        </motion.h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {t.testimonials.items.map(
            ({ quote, name }: { quote: string; name: string }, index: number) => (
              <motion.div
                key={index}
                className="bg-neutral p-6 rounded-2xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-800 italic text-base leading-relaxed mb-4">
                  “{quote}”
                </p>
                <p className="font-semibold text-sm text-gray-700">– {name}</p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.section>
  );
}
*/