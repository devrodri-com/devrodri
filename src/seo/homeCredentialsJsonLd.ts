/** JSON-LD para credenciales (solo home); no incluye title/description. */
export const metaReactCredential = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  name: "Meta React (Specialization)",
  credentialCategory: "Certificate",
  dateIssued: "2025-10-30",
  url: "https://coursera.org/verify/specialization/MITZ2I8D39XP",
  issuer: {
    "@type": "Organization",
    name: "Meta",
    sameAs: "https://about.meta.com",
  },
  recognizedBy: {
    "@type": "Organization",
    name: "Coursera",
    sameAs: "https://www.coursera.org",
  },
  description: "React Basics and Advanced React specialization taught by Meta staff.",
} as const;

export const ibmFullStackCredential = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  name: "IBM Full Stack Software Developer Professional Certificate",
  credentialCategory: "Professional Certificate",
  dateIssued: "2025-11-04",
  url: "https://coursera.org/verify/professional-cert/K86YRE6ARP76",
  issuer: {
    "@type": "Organization",
    name: "IBM Skills Network",
    sameAs: "https://www.ibm.com/skills-network",
  },
  recognizedBy: {
    "@type": "Organization",
    name: "Coursera",
    sameAs: "https://www.coursera.org",
  },
  description:
    "Professional certificate covering Cloud Native apps, React, Node.js, Docker, Kubernetes, microservices, and a final capstone project.",
} as const;
