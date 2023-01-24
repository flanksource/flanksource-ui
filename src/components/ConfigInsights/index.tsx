import { useEffect, useState } from "react";
import { MdOutlineInsights } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import CollapsiblePanel from "../CollapsiblePanel";
import EmptyState from "../EmptyState";
import Title from "../Title/title";
import {
  sanitizeHTMLContent,
  sanitizeHTMLContentToText,
  truncateText
} from "../../utils/common";
import { useGetConfigInsights } from "../../api/query-hooks";
import { ConfigAnalysisLink } from "../ConfigAnalysisLink/ConfigAnalysisLink";
import { relativeDateTime } from "../../utils/date";
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";

export type ConfigTypeInsights = {
  id: string;
  config_id: string;
  analyzer: string;
  analysis_type: string;
  severity: string;
  summary: string;
  status: string;
  message: string;
  sanitizedMessageHTML?: string;
  sanitizedMessageTxt?: string;
  analysis: string;
  first_observed: string;
  last_observed: string;
  created_at: string | number | Date | null | undefined;
  source: any;
  created_by: any;
};

type Props = {
  configID: string;
};

function ConfigInsightsDetails({ configID }: Props) {
  const [configInsights, setConfigInsights] = useState<ConfigTypeInsights[]>(
    []
  );
  const { data: response = [], isLoading } =
    useGetConfigInsights<ConfigTypeInsights[]>(configID);

  useEffect(() => {
    const data = response?.map((item) => {
      return {
        ...item,
        sanitizedMessageHTML: sanitizeHTMLContent(item.message),
        sanitizedMessageTxt: truncateText(
          sanitizeHTMLContentToText(item.message)!,
          500
        )
      };
    });
    setConfigInsights(data);
  }, [response]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [response]);

  return (
    <div className="flex flex-row space-y-2">
      {isLoading ? (
        <TableSkeletonLoader />
      ) : configInsights.length > 0 ? (
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
            {configInsights.map((insight) => (
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
        <div className="w-full">
          <EmptyState />
        </div>
      )}
    </div>
  );
}

export default function ConfigInsights(props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <Title
          title="Insights"
          icon={<MdOutlineInsights className="w-6 h-auto" />}
        />
      }
    >
      <ConfigInsightsDetails {...props} />
    </CollapsiblePanel>
  );
}
