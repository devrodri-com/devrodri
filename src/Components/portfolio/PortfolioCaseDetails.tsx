import type { PortfolioCaseDetails as PortfolioCaseDetailsData } from "../../data/portfolio/types";
import type { Language } from "../../i18n/language";

type PortfolioCaseDetailsProps = {
  details: PortfolioCaseDetailsData;
  id: string;
  language: Language;
  role?: string;
};

export default function PortfolioCaseDetails({
  details,
  id,
  language,
  role,
}: PortfolioCaseDetailsProps) {
  return (
    <div id={id} className="mt-5 border-t border-gray-100 pt-6">
      {role !== undefined && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {language === "es" ? "Mi rol" : "My role"}
          </h4>
          <p className="text-sm text-gray-700">{role}</p>
        </div>
      )}
      <p className="text-gray-800 font-medium">{details.summary}</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {details.stackLabel ?? "Stack"}
          </h4>
          <ul className="text-sm text-gray-700 list-disc ml-5">
            {details.stack.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {details.integrationsLabel ??
              (language === "es" ? "Integraciones" : "Integrations")}
          </h4>
          <ul className="text-sm text-gray-700 list-disc ml-5">
            {details.integrations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {language === "es" ? "Retos" : "Challenges"}
          </h4>
          <ul className="text-sm text-gray-700 list-disc ml-5">
            {details.challenges.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {language === "es" ? "Solución" : "Solution"}
          </h4>
          <ul className="text-sm text-gray-700 list-disc ml-5">
            {details.solution.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          {language === "es" ? "Impacto" : "Impact"}
        </h4>
        <ul className="text-sm text-gray-700 list-disc ml-5">
          {details.impact.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
