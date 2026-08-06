import type { ReactNode } from "react";

type EditorialNoteTone = "dark" | "light";

interface EditorialNoteProps {
  children: ReactNode;
  className?: string;
  tone?: EditorialNoteTone;
}

const TONE_CLASSNAME: Record<EditorialNoteTone, string> = {
  dark: "border-primary/60 text-gray-300/90",
  light: "border-primary-on-light/70 text-gray-800",
};

export default function EditorialNote({
  children,
  className = "",
  tone = "dark",
}: EditorialNoteProps) {
  return (
    <p
      data-editorial-note
      className={`border-l pl-5 text-base leading-relaxed ${TONE_CLASSNAME[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
