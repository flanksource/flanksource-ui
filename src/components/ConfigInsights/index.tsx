import { useEffect, useState } from "react";
import { MdOutlineInsights } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import CollapsiblePanel from "../CollapsiblePanel";
import Title from "../Title/title";
import {
  sanitizeHTMLContent,
  sanitizeHTMLContentToText,
  truncateText
} from "../../utils/common";
import { useGetConfigInsights } from "../../api/query-hooks";
import { ConfigAnalysisLink } from "../ConfigAnalysisLink/ConfigAnalysisLink";
import { relativeDateTime } from "../../utils/date";
import { ConfigItem } from "../../api/services/configs";
import { DetailsTable } from "../DetailsTable/DetailsTable";
import { Badge } from "../Badge";

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
  config?: ConfigItem;
};

type Props = {
  configID: string;
};

const columns = [
  {
    key: "analysis",
    label: "Name"
  },
  {
    key: "age",
    label: "Age"
  }
];

function ConfigInsightsDetails({ configID }: Props) {
  const [configInsights, setConfigInsights] = useState<
    {
      age: string;
      analysis: React.ReactNode;
    }[]
  >([]);
  const { data: response = [], isLoading } =
    useGetConfigInsights<ConfigTypeInsights[]>(configID);

  useEffect(() => {
    const data = response
      ?.map((item) => {
        return {
          ...item,
          sanitizedMessageHTML: sanitizeHTMLContent(item.message),
          sanitizedMessageTxt: truncateText(
            sanitizeHTMLContentToText(item.message)!,
            500
          )
        };
      })
      .map((item) => {
        return {
          age: relativeDateTime(item.first_observed),
          analysis: (
            <div
              key={item.id}
              data-html={true}
              data-tip={item.sanitizedMessageTxt}
              data-class="max-w-[20rem]"
            >
              <ConfigAnalysisLink configAnalysis={item} />
            </div>
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
      <DetailsTable
        loading={isLoading}
        data={configInsights}
        columns={columns}
      />
    </div>
  );
}

export default function ConfigInsights(props: Props) {
  const { data: response = [] } = useGetConfigInsights<ConfigTypeInsights[]>(
    props.configID
  );

  return (
    <CollapsiblePanel
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title
            title="Insights"
            icon={<MdOutlineInsights className="w-6 h-auto" />}
          />
          <Badge
            className="w-5 h-5 flex items-center justify-center"
            roundedClass="rounded-full"
            text={response.length ?? 0}
          />
        </div>
      }
    >
      <ConfigInsightsDetails {...props} />
    </CollapsiblePanel>
  );
}
