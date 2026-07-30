import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { lemBoxCase } from "../data/portfolio/cases/lemBox";
import { useLanguage } from "../i18n/useLanguage";

type CasePanelProps = {
  children?: ReactNode;
  id: string;
  text: string;
  title: string;
};

function CasePanel({ children, id, text, title }: CasePanelProps) {
  return (
    <section
      aria-labelledby={id}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <h2 id={id} className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-gray-300">{text}</p>
      {children}
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
      <header className="border-b border-white/10 px-6 pb-16 pt-28 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/portfolio"
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-blue-300 underline decoration-blue-300/60 underline-offset-4 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            {page.header.backLabel}
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
            <div>
              <div className="flex flex-wrap gap-2">
                {page.header.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-blue-300/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {cardContent.title}
              </h1>
              <p className="mt-4 max-w-2xl text-xl leading-relaxed text-gray-200">
                {page.header.subtitle}
              </p>
              {cardContent.role !== undefined && (
                <p className="mt-6 max-w-2xl border-l-2 border-blue-400 pl-4 leading-relaxed text-gray-300">
                  {cardContent.role}
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
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

      <article className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-8">
          <CasePanel
            id="lem-box-summary"
            title={page.summary.title}
            text={page.summary.text}
          >
            <p className="mt-5 max-w-3xl border-l-2 border-blue-400/70 pl-4 text-sm leading-relaxed text-gray-400">
              {page.summary.clarification}
            </p>
          </CasePanel>

          <div className="grid gap-8 lg:grid-cols-2">
            <CasePanel
              id="lem-box-challenge"
              title={page.challenge.title}
              text={page.challenge.text}
            />
            <CasePanel
              id="lem-box-role"
              title={page.role.title}
              text={page.role.text}
            />
          </div>

          <section
            aria-labelledby="lem-box-ecosystem"
            className="rounded-2xl border border-white/10 bg-slate-950 p-6 sm:p-8"
          >
            <h2
              id="lem-box-ecosystem"
              className="text-2xl font-semibold tracking-tight"
            >
              {page.ecosystem.title}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {page.ecosystem.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-black p-5"
                >
                  <h3 className="font-semibold text-blue-200">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="lem-box-audiences"
            className="rounded-2xl bg-white p-6 text-gray-900 sm:p-8"
          >
            <h2
              id="lem-box-audiences"
              className="text-2xl font-semibold tracking-tight"
            >
              {page.audiences.title}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {page.audiences.items.map((item) => (
                <div key={item.title} className="border-t-2 border-blue-600 pt-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <CasePanel
            id="lem-box-solution"
            title={page.solution.title}
            text={page.solution.text}
          />

          <section
            aria-labelledby="lem-box-architecture"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
              <div>
                <h2
                  id="lem-box-architecture"
                  className="text-2xl font-semibold tracking-tight"
                >
                  {page.architecture.title}
                </h2>
                <p className="mt-4 leading-relaxed text-gray-300">
                  {page.architecture.text}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                  {page.architecture.stackLabel}
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {caseStudy.stack.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-lg border border-white/10 bg-black px-4 py-2 text-sm text-gray-200"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-2">
            <CasePanel
              id="lem-box-markets"
              title={page.markets.title}
              text={page.markets.text}
            />
            <CasePanel
              id="lem-box-evolution"
              title={page.evolution.title}
              text={page.evolution.text}
            >
              <h3 className="mt-6 font-semibold text-blue-200">
                {page.evolution.qualityTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {page.evolution.qualityText}
              </p>
            </CasePanel>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <CasePanel
              id="lem-box-mobile-future"
              title={page.mobileFuture.title}
              text={page.mobileFuture.text}
            />
            <CasePanel
              id="lem-box-current-state"
              title={page.currentState.title}
              text={page.currentState.text}
            />
          </div>

          <section
            aria-labelledby="lem-box-public-links"
            className="rounded-2xl border border-white/10 bg-slate-950 p-6 sm:p-8"
          >
            <h2
              id="lem-box-public-links"
              className="text-2xl font-semibold tracking-tight"
            >
              {page.publicLinksTitle}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {caseStudy.publicLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] flex-col justify-center rounded-lg border border-blue-300/30 px-4 py-2 text-blue-200 transition hover:border-blue-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
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
          </section>

          <section className="rounded-2xl bg-blue-700 px-6 py-10 text-center sm:px-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {page.finalCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-50">
              {page.finalCta.text}
            </p>
            <Link
              to={caseStudy.finalCtaHref}
              className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-blue-800 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700"
            >
              {page.finalCta.buttonLabel}
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
