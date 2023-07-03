import { MdOutlineInsights } from "react-icons/md";
import { useGetConfigInsights } from "../../api/query-hooks";
import { ConfigItem } from "../../api/services/configs";
import CollapsiblePanel from "../CollapsiblePanel";
import InsightsDetails from "../Insights/Insights";
import Title from "../Title/title";
import PillBadge from "../Badge/PillBadge";

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
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export default function ConfigInsights({
  configID,
  isCollapsed = false,
  onCollapsedStateChange = () => {}
}: Props) {
  const { data: response } = useGetConfigInsights(configID, 0, 50);
  const count = response?.totalEntries ?? 0;

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title
            title="Insights"
            icon={<MdOutlineInsights className="w-6 h-auto" />}
          />
          <PillBadge>{count}</PillBadge>
        </div>
      }
      dataCount={count}
    >
      <InsightsDetails type="configs" configId={configID} />
    </CollapsiblePanel>
  );
}
