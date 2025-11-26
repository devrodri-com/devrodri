/*
// src/Components/GallerySection.tsx

import { motion } from "framer-motion";

export default function GallerySection() {
  const images = [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    "/images/gallery3.jpg",
    "/images/gallery4.jpg",
    "/images/gallery5.jpg",
    "/images/gallery6.jpg",
    "/images/gallery7.jpg",
    "/images/gallery8.jpg",
  ];

  return (
    <motion.section
      id="galeria"
      className="bg-white py-28 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-primary mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Galería
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <img
                src={src}
                alt={`Galería ${idx + 1}`}
                className="w-full h-48 object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
*/