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
  objectPosition?: string;
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
  objectPosition,
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
      {...(objectPosition === undefined
        ? {}
        : { style: { objectPosition } })}
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
  expanded: boolean;
  fullBleed?: boolean;
  headingLevel?: "h2" | "h3";
  disclaimer?: string;
  objectPosition?: string;
  priority?: boolean;
  responsiveCover?: ResponsivePortfolioCover;
  sizes?: string;
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
  fullBleed = false,
  headingLevel = "h3",
  disclaimer,
  objectPosition,
  priority = false,
  responsiveCover,
  sizes = "(min-width: 1280px) 457px, (min-width: 768px) calc(41.67vw - 76px), calc(100vw - 88px)",
  status,
  tags,
  title,
}: PortfolioCardProps) {
  const Heading = headingLevel;
  const coverFit = getPortfolioCoverFit(responsiveCover);

  return (
    <motion.div
      data-nojs-visible
      className={`border border-gray-200 rounded-2xl shadow-sm bg-white ${expanded ? "" : "lg:h-[360px]"}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col md:flex-row lg:h-full">
        <div className="md:w-5/12 lg:h-full">
          <div
            className={`flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-white lg:h-full lg:aspect-auto ${
              fullBleed ? "" : "p-5 md:p-7"
            }`}
          >
            <PortfolioCoverImage
              cover={cover}
              alt=""
              className={`w-full h-full object-center ${
                fullBleed ? "" : "rounded-xl"
              } ${
                coverFit === "cover" ? "object-cover" : "object-contain"
              }`}
              {...(objectPosition === undefined ? {} : { objectPosition })}
              priority={priority}
              sizes={sizes}
              {...(responsiveCover === undefined
                ? {}
                : { responsiveCover })}
            />
          </div>
        </div>
        <div className="p-6 md:w-7/12 lg:flex lg:h-full lg:flex-col">
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
          <div className="mt-4 flex flex-wrap items-center gap-4 lg:mt-auto lg:pt-4">
            {actions}
          </div>
          {details}
        </div>
      </div>
    </motion.div>
  );
}
