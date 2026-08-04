// src/components/portfolio/PortfolioCard.tsx

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { getPortfolioCoverFit } from "../../data/portfolio/types";
import type {
  ResponsiveImageCandidates,
  ResponsivePortfolioCover,
} from "../../data/portfolio/types";

type PortfolioCoverImageProps = {
  alt: string;
  className: string;
  cover: string;
  priority?: boolean;
  responsiveCover?: ResponsivePortfolioCover;
  sizes: string;
};

function toSrcSet(candidates: ResponsiveImageCandidates) {
  return candidates
    .map((candidate) => `${candidate.src} ${candidate.width}w`)
    .join(", ");
}

export function PortfolioCoverImage({
  alt,
  className,
  cover,
  priority = false,
  responsiveCover,
  sizes,
}: PortfolioCoverImageProps) {
  const image = (
    <img
      src={cover}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? { fetchpriority: "high" } : {})}
      {...(responsiveCover === undefined
        ? {}
        : { width: responsiveCover.width, height: responsiveCover.height })}
    />
  );

  if (responsiveCover === undefined) {
    return image;
  }

  return (
    <picture className="contents">
      <source
        type="image/avif"
        srcSet={toSrcSet(responsiveCover.sources.avif)}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={toSrcSet(responsiveCover.sources.webp)}
        sizes={sizes}
      />
      {image}
    </picture>
  );
}

interface PortfolioCardProps {
  actions: ReactNode;
  cover: string;
  desc: string;
  details: ReactNode;
  headingLevel?: "h2" | "h3";
  disclaimer?: string;
  priority?: boolean;
  responsiveCover?: ResponsivePortfolioCover;
  status?: string;
  tags: string;
  title: string;
}

export default function PortfolioCard({
  actions,
  cover,
  desc,
  details,
  headingLevel = "h3",
  disclaimer,
  priority = false,
  responsiveCover,
  status,
  tags,
  title,
}: PortfolioCardProps) {
  const Heading = headingLevel;
  const coverFit = getPortfolioCoverFit(responsiveCover);

  return (
    <motion.div
      data-nojs-visible
      className="border border-gray-200 rounded-2xl shadow-sm bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col lg:flex-row">
        <div className="flex items-center justify-center lg:w-[340px] lg:shrink-0">
          <div className="w-full p-4 sm:p-5 rounded-2xl bg-white overflow-hidden flex items-center justify-center">
            <PortfolioCoverImage
              cover={cover}
              alt=""
              className={`w-full h-auto max-w-[280px] sm:max-w-[360px] lg:max-w-none aspect-[40/21] object-center rounded-xl ${
                coverFit === "cover" ? "object-cover" : "object-contain"
              }`}
              priority={priority}
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 360px, (min-width: 358px) 280px, calc(100vw - 80px)"
              {...(responsiveCover === undefined
                ? {}
                : { responsiveCover })}
            />
          </div>
        </div>
        <div className="min-w-0 flex flex-col p-6 lg:flex-1">
          {status && (
            <p className="mb-2 inline-flex self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
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
          <div className="mt-4 flex items-center gap-4 flex-wrap lg:mt-auto lg:pt-4">
            {actions}
          </div>
          {details}
        </div>
      </div>
    </motion.div>
  );
}
