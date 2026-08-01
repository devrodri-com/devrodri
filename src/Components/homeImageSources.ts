import experience1200Avif from "../assets/home/experience/experience-1200.avif";
import experience1200Jpeg from "../assets/home/experience/experience-1200.jpg";
import experience1200Webp from "../assets/home/experience/experience-1200.webp";
import experience1536Avif from "../assets/home/experience/experience-1536.avif";
import experience1536Jpeg from "../assets/home/experience/experience-1536.jpg";
import experience1536Webp from "../assets/home/experience/experience-1536.webp";
import experience480Avif from "../assets/home/experience/experience-480.avif?no-inline";
import experience480Jpeg from "../assets/home/experience/experience-480.jpg";
import experience480Webp from "../assets/home/experience/experience-480.webp";
import experience768Avif from "../assets/home/experience/experience-768.avif?no-inline";
import experience768Jpeg from "../assets/home/experience/experience-768.jpg";
import experience768Webp from "../assets/home/experience/experience-768.webp";
import ibmCertificate176Png from "../assets/home/ibm/ibm-fullstack-176.png";
import ibmCertificate176Webp from "../assets/home/ibm/ibm-fullstack-176.webp";
import ibmCertificate264Png from "../assets/home/ibm/ibm-fullstack-264.png";
import ibmCertificate264Webp from "../assets/home/ibm/ibm-fullstack-264.webp";
import ibmCertificate88Png from "../assets/home/ibm/ibm-fullstack-88.png";
import ibmCertificate88Webp from "../assets/home/ibm/ibm-fullstack-88.webp";
import impact1200Avif from "../assets/home/impact/impact-1200.avif";
import impact1200Jpeg from "../assets/home/impact/impact-1200.jpg";
import impact1200Webp from "../assets/home/impact/impact-1200.webp";
import impact1536Avif from "../assets/home/impact/impact-1536.avif";
import impact1536Jpeg from "../assets/home/impact/impact-1536.jpg";
import impact1536Webp from "../assets/home/impact/impact-1536.webp";
import impact480Avif from "../assets/home/impact/impact-480.avif";
import impact480Jpeg from "../assets/home/impact/impact-480.jpg";
import impact480Webp from "../assets/home/impact/impact-480.webp";
import impact768Avif from "../assets/home/impact/impact-768.avif";
import impact768Jpeg from "../assets/home/impact/impact-768.jpg";
import impact768Webp from "../assets/home/impact/impact-768.webp";
import servicesDesktop1200Avif from "../assets/home/servicios/servicios-desktop-1200.avif";
import servicesDesktop1200Jpeg from "../assets/home/servicios/servicios-desktop-1200.jpg";
import servicesDesktop1200Webp from "../assets/home/servicios/servicios-desktop-1200.webp";
import servicesDesktop1920Avif from "../assets/home/servicios/servicios-desktop-1920.avif";
import servicesDesktop1920Jpeg from "../assets/home/servicios/servicios-desktop-1920.jpg";
import servicesDesktop1920Webp from "../assets/home/servicios/servicios-desktop-1920.webp";
import servicesMobile1440Avif from "../assets/home/servicios/servicios-mobile-1440.avif";
import servicesMobile1440Jpeg from "../assets/home/servicios/servicios-mobile-1440.jpg";
import servicesMobile1440Webp from "../assets/home/servicios/servicios-mobile-1440.webp";
import servicesMobile480Avif from "../assets/home/servicios/servicios-mobile-480.avif";
import servicesMobile480Jpeg from "../assets/home/servicios/servicios-mobile-480.jpg";
import servicesMobile480Webp from "../assets/home/servicios/servicios-mobile-480.webp";
import servicesMobile960Avif from "../assets/home/servicios/servicios-mobile-960.avif";
import servicesMobile960Jpeg from "../assets/home/servicios/servicios-mobile-960.jpg";
import servicesMobile960Webp from "../assets/home/servicios/servicios-mobile-960.webp";
import servicesTablet1440Avif from "../assets/home/servicios/servicios-tablet-1440.avif";
import servicesTablet1440Jpeg from "../assets/home/servicios/servicios-tablet-1440.jpg";
import servicesTablet1440Webp from "../assets/home/servicios/servicios-tablet-1440.webp";
import servicesTablet1920Avif from "../assets/home/servicios/servicios-tablet-1920.avif";
import servicesTablet1920Jpeg from "../assets/home/servicios/servicios-tablet-1920.jpg";
import servicesTablet1920Webp from "../assets/home/servicios/servicios-tablet-1920.webp";
import servicesTablet768Avif from "../assets/home/servicios/servicios-tablet-768.avif";
import servicesTablet768Jpeg from "../assets/home/servicios/servicios-tablet-768.jpg";
import servicesTablet768Webp from "../assets/home/servicios/servicios-tablet-768.webp";
import about160Avif from "../assets/home/sobremi/sobremi-160.avif";
import about160Jpeg from "../assets/home/sobremi/sobremi-160.jpg";
import about160Webp from "../assets/home/sobremi/sobremi-160.webp";
import about240Avif from "../assets/home/sobremi/sobremi-240.avif";
import about240Jpeg from "../assets/home/sobremi/sobremi-240.jpg";
import about240Webp from "../assets/home/sobremi/sobremi-240.webp";
import about320Avif from "../assets/home/sobremi/sobremi-320.avif";
import about320Jpeg from "../assets/home/sobremi/sobremi-320.jpg";
import about320Webp from "../assets/home/sobremi/sobremi-320.webp";
import type {
  ResponsiveImageCandidate,
  ResponsivePictureFallback,
  ResponsivePictureSource,
} from "./ResponsivePicture";

type HomeImageConfig = {
  fallback: ResponsivePictureFallback;
  height: number;
  sizes: string;
  sources: readonly ResponsivePictureSource[];
  width: number;
};

function candidates(
  ...items: ReadonlyArray<readonly [src: string, width: number]>
): readonly ResponsiveImageCandidate[] {
  return items.map(([src, width]) => ({ src, width }));
}

const aboutAvif = candidates(
  [about160Avif, 160],
  [about240Avif, 240],
  [about320Avif, 320],
);
const aboutWebp = candidates(
  [about160Webp, 160],
  [about240Webp, 240],
  [about320Webp, 320],
);
const aboutJpeg = candidates(
  [about160Jpeg, 160],
  [about240Jpeg, 240],
  [about320Jpeg, 320],
);

export const aboutPortraitImage: HomeImageConfig = {
  sources: [
    { type: "image/avif", candidates: aboutAvif },
    { type: "image/webp", candidates: aboutWebp },
  ],
  fallback: { src: about160Jpeg, candidates: aboutJpeg },
  sizes: "(min-width: 640px) 96px, 80px",
  width: 320,
  height: 320,
};

const ibmWebp = candidates(
  [ibmCertificate88Webp, 88],
  [ibmCertificate176Webp, 176],
  [ibmCertificate264Webp, 264],
);
const ibmPng = candidates(
  [ibmCertificate88Png, 88],
  [ibmCertificate176Png, 176],
  [ibmCertificate264Png, 264],
);

export const ibmCertificateImage: HomeImageConfig = {
  sources: [{ type: "image/webp", candidates: ibmWebp }],
  fallback: { src: ibmCertificate88Png, candidates: ibmPng },
  sizes: "83px",
  width: 88,
  height: 68,
};

const experienceAvif = candidates(
  [experience480Avif, 480],
  [experience768Avif, 768],
  [experience1200Avif, 1200],
  [experience1536Avif, 1536],
);
const experienceWebp = candidates(
  [experience480Webp, 480],
  [experience768Webp, 768],
  [experience1200Webp, 1200],
  [experience1536Webp, 1536],
);
const experienceJpeg = candidates(
  [experience480Jpeg, 480],
  [experience768Jpeg, 768],
  [experience1200Jpeg, 1200],
  [experience1536Jpeg, 1536],
);

export const experienceImage: HomeImageConfig = {
  sources: [
    { type: "image/avif", candidates: experienceAvif },
    { type: "image/webp", candidates: experienceWebp },
  ],
  fallback: { src: experience480Jpeg, candidates: experienceJpeg },
  sizes:
    "(min-width: 1200px) 552px, (min-width: 768px) calc(50vw - 48px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)",
  width: 1536,
  height: 1024,
};

const impactAvif = candidates(
  [impact480Avif, 480],
  [impact768Avif, 768],
  [impact1200Avif, 1200],
  [impact1536Avif, 1536],
);
const impactWebp = candidates(
  [impact480Webp, 480],
  [impact768Webp, 768],
  [impact1200Webp, 1200],
  [impact1536Webp, 1536],
);
const impactJpeg = candidates(
  [impact480Jpeg, 480],
  [impact768Jpeg, 768],
  [impact1200Jpeg, 1200],
  [impact1536Jpeg, 1536],
);

export const impactImage: HomeImageConfig = {
  sources: [
    { type: "image/avif", candidates: impactAvif },
    { type: "image/webp", candidates: impactWebp },
  ],
  fallback: { src: impact480Jpeg, candidates: impactJpeg },
  sizes:
    "(min-width: 1200px) 556px, (min-width: 768px) calc(50vw - 44px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)",
  width: 1536,
  height: 1024,
};

const servicesDesktopAvif = candidates(
  [servicesDesktop1200Avif, 1200],
  [servicesDesktop1920Avif, 1920],
);
const servicesDesktopWebp = candidates(
  [servicesDesktop1200Webp, 1200],
  [servicesDesktop1920Webp, 1920],
);
const servicesDesktopJpeg = candidates(
  [servicesDesktop1200Jpeg, 1200],
  [servicesDesktop1920Jpeg, 1920],
);
const servicesTabletAvif = candidates(
  [servicesTablet768Avif, 768],
  [servicesTablet1440Avif, 1440],
  [servicesTablet1920Avif, 1920],
);
const servicesTabletWebp = candidates(
  [servicesTablet768Webp, 768],
  [servicesTablet1440Webp, 1440],
  [servicesTablet1920Webp, 1920],
);
const servicesTabletJpeg = candidates(
  [servicesTablet768Jpeg, 768],
  [servicesTablet1440Jpeg, 1440],
  [servicesTablet1920Jpeg, 1920],
);
const servicesMobileAvif = candidates(
  [servicesMobile480Avif, 480],
  [servicesMobile960Avif, 960],
  [servicesMobile1440Avif, 1440],
);
const servicesMobileWebp = candidates(
  [servicesMobile480Webp, 480],
  [servicesMobile960Webp, 960],
  [servicesMobile1440Webp, 1440],
);
const servicesMobileJpeg = candidates(
  [servicesMobile480Jpeg, 480],
  [servicesMobile960Jpeg, 960],
  [servicesMobile1440Jpeg, 1440],
);

const desktopMedia = "(min-width: 1200px)";
const tabletMedia = "(min-width: 640px)";

export const servicesImage: HomeImageConfig = {
  sources: [
    {
      type: "image/avif",
      media: desktopMedia,
      sizes: "1152px",
      candidates: servicesDesktopAvif,
    },
    {
      type: "image/avif",
      media: tabletMedia,
      sizes: "calc(100vw - 48px)",
      candidates: servicesTabletAvif,
    },
    {
      type: "image/avif",
      sizes: "calc(100vw - 32px)",
      candidates: servicesMobileAvif,
    },
    {
      type: "image/webp",
      media: desktopMedia,
      sizes: "1152px",
      candidates: servicesDesktopWebp,
    },
    {
      type: "image/webp",
      media: tabletMedia,
      sizes: "calc(100vw - 48px)",
      candidates: servicesTabletWebp,
    },
    {
      type: "image/webp",
      sizes: "calc(100vw - 32px)",
      candidates: servicesMobileWebp,
    },
    {
      type: "image/jpeg",
      media: desktopMedia,
      sizes: "1152px",
      candidates: servicesDesktopJpeg,
    },
    {
      type: "image/jpeg",
      media: tabletMedia,
      sizes: "calc(100vw - 48px)",
      candidates: servicesTabletJpeg,
    },
    {
      type: "image/jpeg",
      sizes: "calc(100vw - 32px)",
      candidates: servicesMobileJpeg,
    },
  ],
  fallback: { src: servicesMobile480Jpeg, candidates: servicesMobileJpeg },
  sizes:
    "(min-width: 1200px) 1152px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)",
  width: 480,
  height: 160,
};
