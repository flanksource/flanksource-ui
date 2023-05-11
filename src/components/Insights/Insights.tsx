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
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";

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
    <div className="flex flex-row space-y-2 overflow-x-hidden">
      {isLoading ? (
        <TableSkeletonLoader />
      ) : insightsWithSanitizedMessages.length > 0 ? (
        <table className="flex flex-col w-full text-sm text-left">
          <thead className="text-sm uppercase text-gray-600 w-full bg-white">
            <tr className="flex flex-row">
              <th scope="col" className="py-2 flex-1">
                Name
              </th>
              <th scope="col" className="py-2 w-24">
                Age
              </th>
            </tr>
          </thead>
          <tbody className="w-full">
            {insightsWithSanitizedMessages.map((insight) => (
              <tr
                className="flex flex-row items-center space-x-2"
                key={insight.id}
              >
                <td
                  data-html={true}
                  data-tip={insight.sanitizedMessageTxt}
                  data-class="max-w-[20rem]"
                  className="py-2 font-medium text-black overflow-hidden cursor-pointer flex-1"
                >
                  <ConfigAnalysisLink
                    key={insight.id}
                    configAnalysis={insight}
                  />
                </td>
                <td className="py-2 w-24 truncate">
                  {relativeDateTime(insight.first_observed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <EmptyState />
        </div>
      )}
    </div>
  );
}
