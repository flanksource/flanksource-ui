import { MdOutlineInsights } from "react-icons/md";
import CollapsiblePanel from "../CollapsiblePanel";
import Title from "../Title/title";
import { useGetConfigInsights } from "../../api/query-hooks";
import { ConfigItem } from "../../api/services/configs";
import InsightsDetails from "../Insights/Insights";
import { CountBadge } from "../Badge/CountBadge";

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
          <CountBadge
            roundedClass="rounded-full"
            value={response.length ?? 0}
          />
        </div>
      }
    >
      <InsightsDetails isLoading={isLoading} insights={response ?? []} />
    </CollapsiblePanel>
  );
}
