// src/components/portfolio/PortfolioCard.tsx

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PortfolioCardProps {
  actions: ReactNode;
  cover: string;
  desc: string;
  details: ReactNode;
  expanded: boolean;
  headingLevel?: "h2" | "h3";
  disclaimer?: string;
  status?: string;
  tags: string;
  title: string;
}

export default function PortfolioCard({
  actions,
  cover,
  desc,
  details,
  expanded,
  headingLevel = "h3",
  disclaimer,
  status,
  tags,
  title,
}: PortfolioCardProps) {
  const Heading = headingLevel;

  return (
    <motion.div
      className={`border border-gray-200 rounded-2xl shadow-sm bg-white ${expanded || status ? "" : "md:h-[280px] md:overflow-hidden"}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-5/12">
          <div className="w-full aspect-[16/9] p-5 md:p-7 rounded-2xl bg-white overflow-hidden flex items-center justify-center">
            <img
              src={cover}
              alt=""
              className="w-full h-full object-cover object-center rounded-xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div className="md:w-7/12 p-6">
          {status && (
            <p className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
              {status}
            </p>
          )}
          <Heading className="text-xl font-semibold tracking-tight text-gray-900">
            {title}
          </Heading>
          <p className="text-gray-700 mt-2 max-w-[62ch]">{desc}</p>
          {disclaimer && (
            <p className="mt-3 max-w-[62ch] border-l-2 border-blue-200 pl-3 text-sm text-gray-700">
              {disclaimer}
            </p>
          )}
          <p className="mt-3 text-sm text-gray-600">• {tags}</p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            {actions}
          </div>
          {details}
        </div>
      </div>
    </motion.div>
  );
}
