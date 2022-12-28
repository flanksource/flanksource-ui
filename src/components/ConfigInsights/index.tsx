import { useEffect, useState } from "react";
import { MdOutlineInsights } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import CollapsiblePanel from "../CollapsiblePanel";
import EmptyState from "../EmptyState";
import { Loading } from "../Loading";
import Title from "../Title/title";
import {
  sanitizeHTMLContent,
  sanitizeHTMLContentToText,
  truncateText
} from "../../utils/common";
import { useGetConfigInsights } from "../../api/query-hooks";
import { ConfigAnalysisLink } from "../ConfigAnalysisLink/ConfigAnalysisLink";

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
  });

  return (
    <div className="flex flex-row space-y-2">
      {isLoading ? (
        <Loading />
      ) : configInsights.length > 0 ? (
        <div className="w-full">
          {configInsights.map((insight) => {
            return (
              <div className="py-2 border-b border-dashed">
                <ConfigAnalysisLink key={insight.id} configAnalysis={insight} />
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState />
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
