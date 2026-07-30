import { Link } from "react-router-dom";
import { lemBoxCase } from "../data/portfolio/cases/lemBox";
import { useLanguage } from "../i18n/useLanguage";

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

  return (
    <main className="bg-black text-white">
      <header className="border-b border-white/10 px-4 pb-14 pt-28 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/portfolio"
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-gray-300 underline decoration-white/30 underline-offset-4 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {page.header.backLabel}
          </Link>

          <div className="mt-10 grid items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:text-sm">
                {page.header.badges.join(" · ")}
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                {cardContent.title}
              </h1>
              <p className="mt-5 max-w-[36rem] text-lg leading-relaxed text-gray-200 sm:text-xl">
                {page.header.subtitle}
              </p>
              {cardContent.role !== undefined && (
                <p className="mt-7 max-w-[36rem] border-l-2 border-primary pl-4 text-base leading-relaxed text-gray-300/90">
                  {cardContent.role}
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-xl md:col-span-6">
              <img
                src={lemBoxCase.cover}
                alt={page.header.coverAlt}
                width={caseStudy.coverWidth}
                height={caseStudy.coverHeight}
                className="h-auto w-full object-cover"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </header>

      <article>
        <section
          aria-labelledby="lem-box-summary"
          className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24 lg:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="lem-box-summary"
              className="max-w-[48rem] text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
            >
              {page.summary.title}
            </h2>
            <p className="mt-7 max-w-[46rem] text-lg leading-relaxed text-gray-300/90">
              {page.summary.text}
            </p>
            <p className="mt-8 max-w-[60ch] border-l-2 border-primary pl-4 text-sm leading-relaxed text-gray-400">
              {page.summary.clarification}
            </p>
          </div>
        </section>

        <div className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-white/10">
            <div className="lg:pr-12">
              <LemBoxEditorialColumn
                id="lem-box-challenge"
                title={page.challenge.title}
                text={page.challenge.text}
              />
            </div>
            <div className="lg:pl-12">
              <LemBoxEditorialColumn
                id="lem-box-role"
                title={page.role.title}
                text={page.role.text}
              />
            </div>
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
              <div className="mt-8 grid gap-8 sm:mt-12 md:grid-cols-3 md:gap-10">
                {page.ecosystem.items.map((item) => (
                  <div key={item.title} className="border-t-2 border-primary pt-5">
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
                <h2
                  id="lem-box-evolution"
                  className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
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
                <h3
                  id="lem-box-mobile-future"
                  className="text-xl font-semibold tracking-tight text-white"
                >
                  {page.mobileFuture.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-gray-300/90">
                  {page.mobileFuture.text}
                </p>
              </section>

              <section
                aria-labelledby="lem-box-current-state"
                className="mt-7 border-l-2 border-primary pl-4 sm:mt-10"
              >
                <h3
                  id="lem-box-current-state"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-primary"
                >
                  {page.currentState.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  {page.currentState.text}
                </p>
              </section>
            </div>
          </div>
        </div>

        <div>
          <section
            aria-labelledby="lem-box-public-links"
            className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-24"
          >
            <div className="mx-auto max-w-6xl">
              <h2
                id="lem-box-public-links"
                className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
              >
                {page.publicLinksTitle}
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                {caseStudy.publicLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] flex-col justify-center rounded-lg border border-white/30 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <span className="font-semibold">{link.label[language]}</span>
                    {link.note !== undefined && (
                      <span className="text-xs text-gray-400">
                        {link.note[language]}
                      </span>
                    )}
                  </a>
                ))}
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
                to={caseStudy.finalCtaHref}
                className="mt-8 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-center font-semibold text-black transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
              >
                {page.finalCta.buttonLabel}
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
