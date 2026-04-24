// src/pages/PortfolioPage.tsx
import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import PortfolioCard from "../Components/portfolio/PortfolioCard";
import {
  type Category,
  type ProjectKey,
  projects,
  projectMeta,
  filters,
  caseDetails,
  initialExpandedState,
} from "../data/portfolioCases";

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
    projects.filter(p => filter === "all" || projectMeta[p.key].category === filter)
  , [filter]);

  useEffect(() => {
    const st = location.state;
    if (st === null || typeof st !== "object" || !("focusCase" in st)) return;
    const raw = (st as { focusCase: unknown }).focusCase;
    if (typeof raw !== "string" || !(raw in projectMeta)) return;
    const key = raw as ProjectKey;
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

  // Helper tipado para evitar problemas con acceso dinámico
  const P: Record<ProjectKey, { title: string; desc: string; link: string }> = {
    lem_web: t.portfolio.lem_web,
    lem_portal: t.portfolio.lem_portal,
    esteban: t.portfolio.esteban,
    mutter: t.portfolio.mutter,
    federico: t.portfolio.federico,
    boating: t.portfolio.boating,
    magenta: t.portfolio.magenta,
    campings_demo: t.portfolio.campings_demo,
  };

  return (
      <section className="py-24 bg-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">{t.portfolio.title}</h1>
          <p className="text-white/70 mt-2 max-w-[44rem] mx-auto">
            {language === "es"
              ? "Casos seleccionados de e‑commerce, marca personal y servicios."
              : "Selected work across e‑commerce, personal brands and services."}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 text-sm transition border-b-2 ${filter === f.key ? "border-white text-white" : "border-transparent text-white/70 hover:text-white"}`}
                aria-pressed={filter === f.key}
              >
                {language === "es" ? f.es : f.en}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <a
              href={`mailto:r.opalo@icloud.com?subject=${encodeURIComponent(language === "es" ? "Solicitud de caso detallado" : "Request detailed case")}`}
              className="inline-flex items-center justify-center rounded-lg bg-[#3B82F6] text-white text-sm font-medium px-5 py-2 shadow-md hover:shadow-lg hover:opacity-90 transition"
              aria-label={language === "es" ? "Solicitar caso detallado" : "Request detailed case"}
              data-analytics="portfolio-request-case"
            >
              {language === "es" ? "Solicitar caso detallado" : "Request detailed case"}
            </a>
          </div>
        </div>

        <div className="space-y-10">
          {list.map((p) => (
            <div key={p.key} id={`portfolio-case-${p.key}`} className="scroll-mt-28">
            <PortfolioCard
              cover={p.cover}
              title={P[p.key].title}
              desc={P[p.key].desc}
              tags={(language === "es" ? projectMeta[p.key].tags : projectMeta[p.key].tagsEn).join(" · ")}
              expanded={expanded[p.key]}
            >
              {p.key === "lem_web" ? (
                <>
                  <a href="https://lem-box.com.uy" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:text-primary-dark underline focus-visible:ring-2 ring-offset-2 ring-[#3B82F6] rounded-sm">UY</a>
                  <span className="text-gray-400">·</span>
                  <a href="https://lem-box.com.ar" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:text-primary-dark underline focus-visible:ring-2 ring-offset-2 ring-[#3B82F6] rounded-sm">AR</a>
                </>
              ) : p.key === "lem_portal" ? (
                <>
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:text-primary-dark underline focus-visible:ring-2 ring-offset-2 ring-[#3B82F6] rounded-sm">{P[p.key].link}</a>
                  <span className="text-xs text-gray-500">({language === "es" ? "requiere credenciales" : "credentials required"})</span>
                </>
              ) : p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:text-primary-dark underline focus-visible:ring-2 ring-offset-2 ring-[#3B82F6] rounded-sm">{P[p.key].link}</a>
              ) : null}
              <button
                type="button"
                aria-expanded={expanded[p.key]}
                aria-controls={`portfolio-details-${p.key}`}
                onClick={() => setExpanded(e => ({ ...e, [p.key]: !e[p.key] }))}
                className="text-sm text-gray-700 hover:text-black underline focus-visible:ring-2 ring-offset-2 ring-gray-300 rounded-sm min-h-[44px] min-w-[44px] inline-flex items-center"
              >
                {expanded[p.key] ? (language === "es" ? "Ver menos" : "View less") : (language === "es" ? "Ver más" : "View details")}
              </button>
              {expanded[p.key] && (
                <div id={`portfolio-details-${p.key}`} className="mt-5 border-t border-gray-100 pt-6">
                  <p className="text-gray-800 font-medium">{language === "es" ? caseDetails[p.key].summaryEs : caseDetails[p.key].summaryEn}</p>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Stack" : "Stack"}</h4>
                      <ul className="text-sm text-gray-700 list-disc ml-5">
                        {(language === "es"
                          ? caseDetails[p.key].stack
                          : (caseDetails[p.key].stackEn ?? caseDetails[p.key].stack)
                        ).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Integraciones" : "Integrations"}</h4>
                      <ul className="text-sm text-gray-700 list-disc ml-5">
                        {(language === "es"
                          ? caseDetails[p.key].integrations
                          : (caseDetails[p.key].integrationsEn ?? caseDetails[p.key].integrations)
                        ).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Retos" : "Challenges"}</h4>
                      <ul className="text-sm text-gray-700 list-disc ml-5">
                        {(language === "es" ? caseDetails[p.key].challengesEs : caseDetails[p.key].challengesEn).map((s,i)=>(<li key={i}>{s}</li>))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Solución" : "Solution"}</h4>
                      <ul className="text-sm text-gray-700 list-disc ml-5">
                        {(language === "es" ? caseDetails[p.key].solutionEs : caseDetails[p.key].solutionEn).map((s,i)=>(<li key={i}>{s}</li>))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Impacto" : "Impact"}</h4>
                    <ul className="text-sm text-gray-700 list-disc ml-5">
                      {(language === "es" ? caseDetails[p.key].resultsEs : caseDetails[p.key].resultsEn).map((s,i)=>(<li key={i}>{s}</li>))}
                    </ul>
                  </div>
                </div>
              )}
            </PortfolioCard>
            </div>
          ))}
        </div>
        </div>
      </section>
  );
}
