import type { ImgHTMLAttributes } from "react";

export type ResponsiveImageCandidate = {
  src: string;
  width: number;
};

export type ResponsivePictureSource = {
  candidates: readonly ResponsiveImageCandidate[];
  media?: string;
  sizes?: string;
  type: "image/avif" | "image/webp" | "image/jpeg" | "image/png";
};

export type ResponsivePictureFallback = {
  candidates: readonly ResponsiveImageCandidate[];
  src: string;
};

type ResponsivePictureProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  | "alt"
  | "decoding"
  | "height"
  | "loading"
  | "sizes"
  | "src"
  | "srcSet"
  | "width"
> & {
  alt: string;
  fallback: ResponsivePictureFallback;
  height: number;
  pictureClassName?: string;
  sizes: string;
  sources: readonly ResponsivePictureSource[];
  width: number;
};

function toSrcSet(candidates: readonly ResponsiveImageCandidate[]): string {
  return candidates
    .map((candidate) => `${candidate.src} ${candidate.width}w`)
    .join(", ");
}

export default function ResponsivePicture({
  alt,
  fallback,
  height,
  pictureClassName,
  sizes,
  sources,
  width,
  ...imageProps
}: ResponsivePictureProps) {
  return (
    <picture className={pictureClassName}>
      {sources.map((source) => (
        <source
          key={`${source.type}-${source.media ?? "all"}`}
          type={source.type}
          srcSet={toSrcSet(source.candidates)}
          sizes={source.sizes ?? sizes}
          {...(source.media === undefined ? {} : { media: source.media })}
        />
      ))}
      <img
        {...imageProps}
        src={fallback.src}
        srcSet={toSrcSet(fallback.candidates)}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
