import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import translations from "../i18n";
import { getLocalizedPath } from "../routes/siteRoutes";
import EditorialNote from "../Components/services/EditorialNote";
import ServiceDirectoryItem from "../Components/services/ServiceDirectoryItem";

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
          <EditorialNote className="mt-8 max-w-[44rem] lg:max-w-[64rem]">
            {page.choose.note}
          </EditorialNote>
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
            <ServiceDirectoryItem
              to={getLocalizedPath("business-websites", language)}
              title={page.directory.web.title}
              description={page.directory.web.text}
              ctaLabel={page.directory.web.linkLabel}
            />
            <ServiceDirectoryItem
              bordered
              to={getLocalizedPath("custom-software", language)}
              title={page.directory.systems.title}
              description={page.directory.systems.text}
              ctaLabel={page.directory.systems.linkLabel}
            />
            <ServiceDirectoryItem
              bordered
              to={`${homePath}#contacto`}
              title={page.directory.automation.title}
              description={page.directory.automation.text}
              ctaLabel={page.directory.automation.linkLabel}
            />
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
        <div className="mx-auto grid max-w-6xl gap-10 lg:max-w-7xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
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
            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-gray-300/90 sm:text-lg lg:max-w-none">
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
