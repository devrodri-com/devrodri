import { Link } from "react-router-dom";
import {
  lemBoxAudienceIntro,
  lemBoxCase,
  lemBoxPublicLinks,
  lemBoxPublicLinksSection,
} from "../data/portfolio/cases/lemBox";
import { useLanguage } from "../i18n/useLanguage";
import { getLocalizedPath } from "../routes/siteRoutes";
import { PortfolioCoverImage } from "../Components/portfolio/PortfolioCard";

type LemBoxEditorialColumnProps = {
  id: string;
  text: string;
  title: string;
};

function LemBoxEditorialColumn({
  id,
  text,
  title,
}: LemBoxEditorialColumnProps) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-white/15 pt-7"
    >
      <h2
        id={id}
        className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-gray-300/90 sm:text-lg">
        {text}
      </p>
    </section>
  );
}

export default function LemBoxCasePage() {
  const { language } = useLanguage();
  const caseStudy = lemBoxCase.caseStudy;
  const page = caseStudy.content[language];
  const cardContent = lemBoxCase.content[language];
  const audienceIntro = lemBoxAudienceIntro[language];
  const publicLinksSection = lemBoxPublicLinksSection[language];
  const centralPlatform = lemBoxPublicLinks[0].directory[language];
  const uruguaySite = lemBoxPublicLinks[1].directory[language];
  const argentinaSite = lemBoxPublicLinks[2].directory[language];

  return (
    <div className="bg-black text-white">
      <header className="border-b border-white/10 px-4 pb-14 pt-28 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <Link
            to={getLocalizedPath("portfolio", language)}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-gray-400 no-underline transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          >
            <span aria-hidden="true" className="text-base leading-none">
              ←
            </span>
            <span>{page.header.backLabel}</span>
          </Link>

          <div className="mt-10 grid items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-primary sm:text-sm">
                {page.header.badges.join(" · ")}
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                {cardContent.title}
              </h1>
              <p className="mt-5 max-w-[36rem] text-lg leading-relaxed text-gray-200 sm:text-xl">
                {page.header.subtitle}
              </p>
              {cardContent.role !== undefined && (
                <p className="mt-7 max-w-[36rem] border-l border-primary/60 pl-5 text-base leading-relaxed text-gray-300/90">
                  {cardContent.role}
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-xl md:col-span-6">
              <PortfolioCoverImage
                cover={lemBoxCase.cover}
                alt={
                  language === "es"
                    ? "Logo de LEM-BOX con el lema «Logística en Miami»"
                    : "LEM-BOX logo with the tagline “Logística en Miami”"
                }
                className="h-auto w-full object-contain"
                priority
                sizes="(min-width: 1200px) 552px, (min-width: 768px) calc(50vw - 48px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                {...(lemBoxCase.responsiveCover === undefined
                  ? {}
                  : { responsiveCover: lemBoxCase.responsiveCover })}
              />
            </div>
          </div>
        </div>
      </header>

      <article>
        <section
          aria-labelledby="lem-box-summary"
          className="border-b border-white/10 px-4 py-12 sm:px-6 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="lem-box-summary"
              className="max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
            >
              {page.summary.title}
            </h2>
            <p className="mt-7 max-w-[48rem] text-lg leading-relaxed text-gray-300/90">
              {page.summary.text}
            </p>
          </div>
        </section>

        <div className="border-b border-white/10 px-4 py-12 sm:px-6 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:gap-20">
            <LemBoxEditorialColumn
              id="lem-box-challenge"
              title={page.challenge.title}
              text={page.challenge.text}
            />
            <LemBoxEditorialColumn
              id="lem-box-role"
              title={page.role.title}
              text={page.role.text}
            />
          </div>
        </div>

        <div>
          <section
            aria-labelledby="lem-box-ecosystem"
            className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24 lg:py-28"
          >
            <div className="mx-auto max-w-6xl">
              <h2
                id="lem-box-ecosystem"
                className="max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
              >
                {page.ecosystem.title}
              </h2>
              <div
                data-ecosystem-flow
                className="relative mt-8 sm:mt-12"
              >
                <span
                  aria-hidden="true"
                  data-ecosystem-flow-line
                  className="absolute left-0 right-0 top-[3px] hidden h-px bg-primary/35 md:block"
                />
                <div className="relative grid gap-7 md:grid-cols-3 md:gap-10">
                  {page.ecosystem.items.map((item, index) => (
                    <div
                      key={item.title}
                      data-ecosystem-flow-stage
                      className="relative pl-6 md:pl-0 md:pt-7"
                    >
                      {index < page.ecosystem.items.length - 1 && (
                        <span
                          aria-hidden="true"
                          data-ecosystem-flow-line
                          className="absolute bottom-[-1.75rem] left-[3px] top-2 w-px bg-primary/30 md:hidden"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        data-ecosystem-flow-node
                        className={`absolute left-0 top-1 h-2 w-2 rounded-full md:top-0 ${
                          index === 1 ? "bg-primary/90" : "bg-primary/60"
                        }`}
                      />
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
            </div>
          </section>

          <section
            aria-labelledby="lem-box-audiences"
            className="bg-neutral px-4 py-12 text-gray-900 sm:px-6 sm:py-24"
          >
            <div className="mx-auto max-w-6xl">
              <h2
                id="lem-box-audiences"
                className="max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
              >
                {page.audiences.title}
              </h2>
              <p
                data-audiences-intro
                className="mt-5 max-w-[48rem] text-base leading-relaxed text-gray-700 sm:text-lg"
              >
                {audienceIntro}
              </p>
              <div className="mt-8 grid gap-8 sm:mt-12 md:grid-cols-3 md:gap-10">
                {page.audiences.items.map((item) => (
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
        </div>

        <div className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-12">
            <LemBoxEditorialColumn
              id="lem-box-solution"
              title={page.solution.title}
              text={page.solution.text}
            />

            <section
              aria-labelledby="lem-box-architecture"
              className="border-t border-white/15 pt-7"
            >
              <h2
                id="lem-box-architecture"
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                {page.architecture.title}
              </h2>
              <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-gray-300/90 sm:text-lg">
                {page.architecture.text}
              </p>
              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {page.architecture.stackLabel}
              </h3>
              <ul className="mt-4 grid sm:grid-flow-col sm:grid-rows-4 sm:gap-x-8">
                {caseStudy.stack.map((technology) => (
                  <li
                    key={technology}
                    className="border-t border-white/10 py-3 text-sm text-gray-300"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <section
              aria-labelledby="lem-box-markets"
              className="max-w-[48rem]"
            >
              <h2
                id="lem-box-markets"
                className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
              >
                {page.markets.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-300/90">
                {page.markets.text}
              </p>
            </section>

            <div className="mt-10 max-w-[48rem] border-t border-white/15 pt-10 sm:mt-16 sm:pt-12">
              <section aria-labelledby="lem-box-evolution">
                <p
                  data-evolution-status-metadata
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-primary"
                >
                  {page.currentState.title}
                </p>
                <h2
                  id="lem-box-evolution"
                  className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
                >
                  {page.evolution.title}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-gray-300/90">
                  {page.evolution.text}
                </p>

                <div className="mt-7 sm:mt-10">
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {page.evolution.qualityTitle}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-gray-300/90">
                    {page.evolution.qualityText}
                  </p>
                </div>
              </section>

              <section
                aria-labelledby="lem-box-mobile-future"
                className="mt-7 border-t border-white/10 pt-7 sm:mt-10 sm:pt-10"
              >
                <h2
                  id="lem-box-mobile-future"
                  className="text-xl font-semibold tracking-tight text-white"
                >
                  {page.mobileFuture.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-gray-300/90">
                  {page.mobileFuture.text}
                </p>
              </section>
            </div>
          </div>
        </div>

        <div>
          <section
            aria-labelledby="lem-box-public-links"
            className="bg-neutral px-4 py-12 text-gray-900 sm:px-6 sm:py-24"
          >
            <div
              data-public-links-directory
              className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.39fr)_minmax(0,0.61fr)] lg:gap-16"
            >
              <div className="lg:flex lg:h-full lg:flex-col lg:overflow-hidden lg:rounded-2xl lg:border lg:border-gray-200 lg:bg-white lg:shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                <div
                  aria-hidden="true"
                  data-public-links-ecosystem-preview
                  className="relative hidden min-h-[15rem] overflow-hidden border-b border-white/10 bg-gray-950 px-8 py-8 text-white lg:block"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(10,132,255,0.24),_transparent_58%)]" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                        LEM-BOX
                      </span>
                      <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(10,132,255,0.75)]" />
                    </div>

                    <div className="mt-8">
                      <div className="mx-auto w-fit rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-center">
                        <span className="block text-xs font-semibold">
                          {centralPlatform.title}
                        </span>
                        <span className="mt-0.5 block text-[0.6875rem] text-white/60">
                          {centralPlatform.domain}
                        </span>
                      </div>
                      <div className="mx-auto h-6 w-px bg-primary/45" />
                      <div className="relative mx-auto max-w-[17rem]">
                        <span className="absolute left-[25%] right-[25%] top-0 h-px bg-primary/45" />
                        <div className="grid grid-cols-2 gap-6 pt-3">
                          {[uruguaySite, argentinaSite].map((site) => (
                            <div
                              key={site.domain}
                              className="relative rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-center"
                            >
                              <span className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-primary/45" />
                              <span className="block text-xs font-medium">
                                {site.title}
                              </span>
                              <span className="mt-0.5 block text-[0.6875rem] text-white/55">
                                {site.domain}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:flex lg:flex-1 lg:flex-col lg:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-on-light">
                    {publicLinksSection.eyebrow}
                  </p>
                  <h2
                    id="lem-box-public-links"
                    className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
                  >
                    {publicLinksSection.title}
                  </h2>
                  <p className="mt-5 max-w-[32rem] text-base leading-relaxed text-gray-700 sm:text-lg">
                    {publicLinksSection.description}
                  </p>
                </div>
              </div>

              <div className="border-b border-gray-300">
                {lemBoxPublicLinks.map((link) => {
                  const directory = link.directory[language];

                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-public-link-row
                      className="group grid min-h-[44px] grid-cols-[minmax(0,1fr)_auto] gap-6 border-t border-gray-300 py-6 text-gray-900 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-on-light sm:py-7"
                    >
                      <span>
                        <span className="block text-lg font-semibold tracking-tight transition-colors group-hover:text-primary-on-light-hover group-focus-visible:text-primary-on-light-hover">
                          {directory.title}
                        </span>
                        <span
                          data-public-link-domain
                          className="mt-1 block text-sm font-medium text-gray-600"
                        >
                          {directory.domain}
                        </span>
                        <span className="mt-4 block text-sm leading-relaxed text-gray-700">
                          {directory.description}
                        </span>
                        <span className="mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-primary-on-light">
                          {directory.action}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 text-xl leading-none text-gray-500 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-primary-on-light group-focus-visible:text-primary-on-light"
                      >
                        ↗
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="lem-box-final-cta"
            className="px-4 py-16 text-center sm:px-6 sm:py-20"
          >
            <div className="mx-auto max-w-4xl">
              <h2
                id="lem-box-final-cta"
                className="text-2xl font-bold leading-snug text-white sm:text-4xl"
              >
                {page.finalCta.title}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                {page.finalCta.text}
              </p>
              <Link
                to={`${getLocalizedPath("home", language)}#contacto`}
                className="mt-8 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-center font-semibold text-black transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
              >
                {page.finalCta.buttonLabel}
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
