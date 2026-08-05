import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import translations from "../i18n";
import { getLocalizedPath } from "../routes/siteRoutes";

const SERVICE_ROW_CLASSNAME =
  "group grid min-h-[44px] grid-cols-[minmax(0,1fr)_auto] gap-6 py-7 text-white no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:py-8";

export default function ServicesHubPage() {
  const { language } = useLanguage();
  const page = translations[language].servicesPages.hub;
  const homePath = getLocalizedPath("home", language);

  return (
    <div className="bg-black text-white">
      <header className="border-b border-white/10 px-4 pb-14 pt-28 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-primary sm:text-sm">
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
        aria-labelledby="services-choose"
        className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="services-choose"
            className="max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
          >
            {page.choose.title}
          </h2>
          <p className="mt-5 max-w-[44rem] text-base leading-relaxed text-gray-300/90 sm:text-lg">
            {page.choose.intro}
          </p>
          <div className="mt-8 grid gap-7 sm:mt-12 md:grid-cols-3 md:gap-10">
            {page.choose.items.map((item) => (
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
          <p className="mt-8 max-w-[44rem] border-l border-primary/60 pl-5 text-base leading-relaxed text-gray-300/90">
            {page.choose.note}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="services-directory"
        className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="services-directory"
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
          >
            {page.directory.title}
          </h2>
          <div className="mt-8 border-y border-white/15 sm:mt-12">
            <Link
              to={getLocalizedPath("business-websites", language)}
              className={SERVICE_ROW_CLASSNAME}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary group-focus-visible:text-primary sm:text-2xl">
                  {page.directory.web.title}
                </h3>
                <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-gray-300/90">
                  {page.directory.web.text}
                </p>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  {page.directory.web.linkLabel}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="mt-1 text-xl leading-none text-gray-500 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:text-primary motion-reduce:transform-none motion-reduce:transition-none"
              >
                →
              </span>
            </Link>
            <Link
              to={getLocalizedPath("custom-software", language)}
              className={`${SERVICE_ROW_CLASSNAME} border-t border-white/15`}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary group-focus-visible:text-primary sm:text-2xl">
                  {page.directory.systems.title}
                </h3>
                <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-gray-300/90">
                  {page.directory.systems.text}
                </p>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  {page.directory.systems.linkLabel}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="mt-1 text-xl leading-none text-gray-500 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:text-primary motion-reduce:transform-none motion-reduce:transition-none"
              >
                →
              </span>
            </Link>
            <div className="border-t border-white/15 py-7 sm:py-8">
              <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {page.directory.automation.title}
              </h3>
              <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-gray-300/90">
                {page.directory.automation.text}
              </p>
              <Link
                to={`${homePath}#contacto`}
                className="mt-5 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.12em] text-primary no-underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                {page.directory.automation.linkLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="services-method"
        className="bg-neutral px-4 py-12 text-gray-900 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="services-method"
            className="max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
          >
            {page.method.title}
          </h2>
          <div className="mt-8 grid gap-8 sm:mt-12 md:grid-cols-3 md:gap-10">
            {page.method.items.map((item) => (
              <div
                key={item.title}
                className="border-t-2 border-primary-on-light pt-5"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-gray-700">
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
            aria-labelledby="services-coverage"
            className="border-t border-white/15 pt-7"
          >
            <h2
              id="services-coverage"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              {page.coverage.title}
            </h2>
            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-gray-300/90 sm:text-lg">
              {page.coverage.text}
            </p>
          </section>
          <section
            aria-labelledby="services-proof"
            className="border-t border-white/15 pt-7"
          >
            <h2
              id="services-proof"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              {page.proof.title}
            </h2>
            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-gray-300/90 sm:text-lg">
              {page.proof.text}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-8">
              <Link
                to={getLocalizedPath("portfolio", language)}
                className="inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.12em] text-primary no-underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                {page.proof.portfolioLink}
              </Link>
              <Link
                to={getLocalizedPath("lem-box", language)}
                className="inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.12em] text-primary no-underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                {page.proof.lemboxLink}
              </Link>
            </div>
          </section>
        </div>
      </div>

      <section
        aria-labelledby="services-cta"
        className="px-4 py-16 text-center sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="services-cta"
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
