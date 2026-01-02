// src/components/portfolio/PortfolioCard.tsx

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Children, isValidElement } from "react";

interface PortfolioCardProps {
  cover: string;
  title: string;
  desc: string;
  tags: string;
  expanded: boolean;
  children?: ReactNode;
}

export default function PortfolioCard({
  cover,
  title,
  desc,
  tags,
  expanded,
  children,
}: PortfolioCardProps) {
  return (
    <motion.div
      className={`border border-gray-200 rounded-2xl shadow-sm bg-white ${expanded ? "" : "md:h-[280px] md:overflow-hidden"}`}
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
              alt={title}
              className="w-full h-full object-cover object-center rounded-xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div className="md:w-7/12 p-6">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-gray-700 mt-2 max-w-[62ch]">{desc}</p>
          <p className="mt-3 text-sm text-gray-600">• {tags}</p>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            {Children.toArray(children).filter((child) => {
              if (isValidElement(child)) {
                return !(child.type === 'div' && child.props.className?.includes('border-t'));
              }
              return true;
            })}
          </div>
          {Children.toArray(children).find((child) => {
            if (isValidElement(child)) {
              return child.type === 'div' && child.props.className?.includes('border-t');
            }
            return false;
          })}
        </div>
      </div>
    </motion.div>
  );
}
