import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import translations from "../i18n";
import { getLocalizedPath } from "../routes/siteRoutes";

export default function CustomSoftwarePage() {
  const { language } = useLanguage();
  const page = translations[language].servicesPages.systems;
  const homePath = getLocalizedPath("home", language);

  return (
    <div className="bg-black text-white">
      <header className="border-b border-white/10 px-4 pb-14 pt-28 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <Link
            to={getLocalizedPath("services", language)}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-gray-400 no-underline transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          >
            <span aria-hidden="true" className="text-base leading-none">
              ←
            </span>
            <span>{page.header.backLabel}</span>
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-primary sm:text-sm">
            {page.header.eyebrow}
          </p>
          <h1 className="mt-6 max-w-[52rem] text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {page.header.title}
          </h1>
          <p className="mt-5 max-w-[44rem] text-lg leading-relaxed text-gray-200 sm:text-xl">
            {page.header.subtitle}
          </p>
        </div>
      </header>

      <section
        aria-labelledby="custom-software-scope"
        className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="custom-software-scope"
            className="max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
          >
            {page.scope.title}
          </h2>
          <div className="mt-8 grid gap-7 sm:mt-12 sm:grid-cols-2 md:gap-x-10 lg:grid-cols-4">
            {page.scope.items.map((item) => (
              <div key={item.title} className="border-t border-white/15 pt-6">
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-gray-300/90">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="custom-software-proof"
        className="bg-neutral px-4 py-12 text-gray-900 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-on-light">
            {page.proof.eyebrow}
          </p>
          <h2
            id="custom-software-proof"
            className="mt-4 max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
          >
            {page.proof.title}
          </h2>
          <p className="mt-6 max-w-[48rem] text-base leading-relaxed text-gray-700 sm:text-lg">
            {page.proof.text}
          </p>
          <Link
            to={getLocalizedPath("lem-box", language)}
            className="mt-6 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.12em] text-primary-on-light no-underline transition-colors hover:text-primary-on-light-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-on-light focus-visible:ring-offset-4 focus-visible:ring-offset-neutral"
          >
            {page.proof.linkLabel}
          </Link>
          <p className="mt-8 max-w-[48rem] border-t border-gray-300 pt-6 text-base leading-relaxed text-gray-700">
            {page.proof.supporting}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="custom-software-method"
        className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="custom-software-method"
            className="max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
          >
            {page.method.title}
          </h2>
          <div className="mt-8 grid gap-7 sm:mt-12 md:grid-cols-3 md:gap-10">
            {page.method.items.map((item) => (
              <div key={item.title} className="border-t border-white/15 pt-6">
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-gray-300/90">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-20">
          <section
            aria-labelledby="custom-software-crosslink"
            className="border-t border-white/15 pt-7"
          >
            <h2
              id="custom-software-crosslink"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              {page.crossLink.title}
            </h2>
            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-gray-300/90 sm:text-lg">
              {page.crossLink.text}
            </p>
            <Link
              to={getLocalizedPath("business-websites", language)}
              className="mt-6 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.12em] text-primary no-underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black"
            >
              {page.crossLink.linkLabel}
            </Link>
          </section>
          <section
            aria-labelledby="custom-software-coverage"
            className="border-t border-white/15 pt-7"
          >
            <h2
              id="custom-software-coverage"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              {page.coverage.title}
            </h2>
            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-gray-300/90 sm:text-lg">
              {page.coverage.text}
            </p>
          </section>
        </div>
      </div>

      <section
        aria-labelledby="custom-software-cta"
        className="px-4 py-16 text-center sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="custom-software-cta"
            className="text-2xl font-bold leading-snug text-white sm:text-4xl"
          >
            {page.cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            {page.cta.text}
          </p>
          <Link
            to={`${homePath}#contacto`}
            className="mt-8 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-center font-semibold text-black transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
          >
            {page.cta.buttonLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
