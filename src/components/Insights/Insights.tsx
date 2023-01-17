import { useEffect, useMemo } from "react";
import ReactTooltip from "react-tooltip";
import {
  sanitizeHTMLContent,
  truncateText,
  sanitizeHTMLContentToText
} from "../../utils/common";
import { relativeDateTime } from "../../utils/date";
import { ConfigAnalysisLink } from "../ConfigAnalysisLink/ConfigAnalysisLink";
import { ConfigTypeInsights } from "../ConfigInsights";
import EmptyState from "../EmptyState";
import { Loading } from "../Loading";

type Props = {
  insights: ConfigTypeInsights[];
  isLoading: boolean;
};

export default function InsightsDetails({ insights, isLoading }: Props) {
  const insightsWithSanitizedMessages = useMemo(
    () =>
      insights.map((item) => {
        return {
          ...item,
          sanitizedMessageHTML: sanitizeHTMLContent(item.message),
          sanitizedMessageTxt: truncateText(
            sanitizeHTMLContentToText(item.message)!,
            500
          )
        };
      }),
    [insights]
  );

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="flex flex-row justify-center space-y-2">
      {isLoading ? (
        <Loading />
      ) : insightsWithSanitizedMessages.length > 0 ? (
        <table className="w-full text-sm text-left">
          <thead className="text-sm uppercase text-gray-600">
            <tr>
              <th scope="col" className="p-2">
                Name
              </th>
              <th scope="col" className="p-2">
                Age
              </th>
            </tr>
          </thead>
          <tbody>
            {insightsWithSanitizedMessages.map((insight) => (
              <tr key={insight.id}>
                <td
                  data-html={true}
                  data-tip={insight.sanitizedMessageTxt}
                  data-class="max-w-[20rem]"
                  className="p-2 font-medium text-black whitespace-nowrap cursor-pointer"
                >
                  <ConfigAnalysisLink
                    key={insight.id}
                    configAnalysis={insight}
                  />
                </td>
                <td className="p-2 ">
                  {relativeDateTime(insight.first_observed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
