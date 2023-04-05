import { MdOutlineInsights } from "react-icons/md";
import CollapsiblePanel from "../CollapsiblePanel";
import Title from "../Title/title";
import { useGetConfigInsights } from "../../api/query-hooks";
import { ConfigItem } from "../../api/services/configs";
import { Badge } from "../Badge";
import InsightsDetails from "../Insights/Insights";

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

export default function ConfigInsights({ configID }: Props) {
  const { data: response = [], isLoading } =
    useGetConfigInsights<ConfigTypeInsights[]>(configID);

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
      <InsightsDetails isLoading={isLoading} insights={response ?? []} />
    </CollapsiblePanel>
  );
}
