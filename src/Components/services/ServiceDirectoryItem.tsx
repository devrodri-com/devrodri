import { ArrowRight as ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceDirectoryItemProps {
  bordered?: boolean;
  ctaLabel: string;
  description: string;
  title: string;
  to: string;
}

export default function ServiceDirectoryItem({
  bordered = false,
  ctaLabel,
  description,
  title,
  to,
}: ServiceDirectoryItemProps) {
  return (
    <Link
      to={to}
      data-interaction-contract="service-directory-row"
      data-service-directory-item
      className={`group grid min-h-[44px] grid-cols-[minmax(0,1fr)_auto] gap-6 py-7 text-white no-underline transition-colors active:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:py-8 ${
        bordered ? "border-t border-white/15" : ""
      }`}
    >
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary group-active:text-primary group-focus-visible:text-primary sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-gray-300/90">
          {description}
        </p>
        <span className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors group-hover:text-primary group-active:text-primary group-focus-visible:text-primary">
          {ctaLabel}
        </span>
      </div>
      <span
        aria-hidden="true"
        data-service-directory-arrow
        className="mt-1 text-gray-500 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-primary group-active:translate-x-0.5 group-active:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:text-primary motion-reduce:transform-none motion-reduce:transition-none"
      >
        <ArrowRightIcon
          aria-hidden="true"
          data-navigation-icon="arrow-right"
          focusable="false"
          className="h-5 w-5"
          strokeWidth={1.5}
        />
      </span>
    </Link>
  );
}
