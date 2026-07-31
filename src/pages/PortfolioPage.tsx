import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";
import PortfolioCard from "../Components/portfolio/PortfolioCard";
import PortfolioCaseDetails from "../Components/portfolio/PortfolioCaseDetails";
import {
  type Category,
  type ProjectKey,
  filters,
  initialExpandedState,
  isProjectKey,
  portfolioCases,
} from "../data/portfolio";
import { getLocalizedPath } from "../routes/siteRoutes";

export default function PortfolioPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Category>("all");
  const [expanded, setExpanded] = useState<Record<ProjectKey, boolean>>(() => ({
    ...initialExpandedState,
  }));
  const list = useMemo(() =>
    portfolioCases.filter(
      (portfolioCase) =>
        filter === "all" || portfolioCase.category === filter,
    )
  , [filter]);

  useEffect(() => {
    const st = location.state;
    if (st === null || typeof st !== "object" || !("focusCase" in st)) return;
    const raw = (st as { focusCase: unknown }).focusCase;
    if (!isProjectKey(raw)) return;
    const key = raw;
    const id = `portfolio-case-${key}`;
    setFilter("all");
    setExpanded((e) => ({ ...e, [key]: true }));
    navigate(".", { replace: true, state: {} });
    const scrollToCase = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    requestAnimationFrame(() => requestAnimationFrame(scrollToCase));
    const timeoutId = window.setTimeout(scrollToCase, 220);
    return () => window.clearTimeout(timeoutId);
  }, [location.state, navigate]);

  return (
      <section className="py-24 bg-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">{t.portfolio.title}</h1>
          <p className="text-white/70 mt-2 max-w-[44rem] mx-auto">
            {language === "es"
              ? "Sistemas, sitios web, e-commerce y estrategia de marca."
              : "Systems, websites, e-commerce, and brand strategy."}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 text-sm transition border-b-2 ${filter === f.key ? "border-white text-white" : "border-transparent text-white/70 hover:text-white"}`}
                aria-pressed={filter === f.key}
              >
                {f.label[language]}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <a
              href={`mailto:r.opalo@icloud.com?subject=${encodeURIComponent(language === "es" ? "Solicitud de caso detallado" : "Request detailed case")}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary-on-light text-white text-sm font-medium px-5 py-2 shadow-md hover:shadow-lg hover:opacity-90 transition"
              aria-label={language === "es" ? "Solicitar caso detallado" : "Request detailed case"}
              data-analytics="portfolio-request-case"
            >
              {language === "es" ? "Solicitar caso detallado" : "Request detailed case"}
            </a>
          </div>
        </div>

        <div className="space-y-10">
          {list.map((portfolioCase) => {
            const content = portfolioCase.content[language];
            const detailsId = `portfolio-details-${portfolioCase.key}`;
            const caseStudy = portfolioCase.caseStudy;

            return (
              <div
                key={portfolioCase.key}
                id={`portfolio-case-${portfolioCase.key}`}
                className="scroll-mt-28"
              >
                <PortfolioCard
                  actions={
                    caseStudy !== undefined ? (
                      <Link
                        to={getLocalizedPath("lem-box", language)}
                        className="inline-flex min-h-[44px] items-center rounded-lg bg-primary-on-light px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-on-light-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        {caseStudy.content[language].header.portfolioCta}
                      </Link>
                    ) : (
                      <>
                        {portfolioCase.actions.map((action, actionIndex) => (
                          <span
                            key={action.href}
                            className="inline-flex items-center gap-2"
                          >
                            {actionIndex > 0 && (
                              <span className="hidden text-gray-400 sm:inline">·</span>
                            )}
                            <a
                              href={action.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-on-light font-medium hover:text-primary-on-light-hover underline focus-visible:ring-2 ring-offset-2 ring-[#3B82F6] rounded-sm"
                            >
                              {action.label[language]}
                            </a>
                            {action.note !== undefined && (
                              <span className="text-xs text-gray-500">
                                {action.note[language]}
                              </span>
                            )}
                          </span>
                        ))}
                        <button
                          type="button"
                          aria-expanded={expanded[portfolioCase.key]}
                          aria-controls={detailsId}
                          onClick={() =>
                            setExpanded((current) => ({
                              ...current,
                              [portfolioCase.key]:
                                !current[portfolioCase.key],
                            }))
                          }
                          className="text-sm text-gray-700 hover:text-black underline focus-visible:ring-2 ring-offset-2 ring-gray-300 rounded-sm min-h-[44px] min-w-[44px] inline-flex items-center"
                        >
                          {expanded[portfolioCase.key]
                            ? language === "es"
                              ? "Ver menos"
                              : "View less"
                            : language === "es"
                              ? "Ver más"
                              : "View details"}
                        </button>
                      </>
                    )
                  }
                  cover={portfolioCase.cover}
                  desc={content.description}
                  details={
                    caseStudy === undefined &&
                    expanded[portfolioCase.key] &&
                    content.details !== undefined ? (
                      <PortfolioCaseDetails
                        details={content.details}
                        id={detailsId}
                        language={language}
                        {...(content.role === undefined
                          ? {}
                          : { role: content.role })}
                      />
                    ) : null
                  }
                  expanded={
                    caseStudy === undefined && expanded[portfolioCase.key]
                  }
                  tags={content.tags.join(" · ")}
                  title={content.title}
                  {...(content.status === undefined
                    ? {}
                    : { status: content.status })}
                  {...(content.disclaimer === undefined
                    ? {}
                    : { disclaimer: content.disclaimer })}
                />
              </div>
            );
          })}
        </div>
        </div>
      </section>
  );
}
