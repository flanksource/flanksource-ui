import { useEffect, useState } from "react";
import { useConfigAnalysisQuery } from "../../api/query-hooks";
import { CostInfoPanel } from "../CostDetails/CostDetails";
import { CostsData } from "../../api/types/common";

type Props = {
  configID: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export default function ConfigCosts({
  configID,
  isCollapsed = true,
  onCollapsedStateChange = () => {}
}: Props) {
  const [configCosts, setConfigCosts] = useState<CostsData>();
  const { data, isLoading } = useConfigAnalysisQuery(configID);

  useEffect(() => {
    if (!data) {
      return;
    }
    setConfigCosts(data[0]);
  }, [data]);

  if (isLoading) {
    return null;
  }

  return (
    <CostInfoPanel
      onCollapsedStateChange={onCollapsedStateChange}
      isCollapsed={isCollapsed}
      title="Costs"
      {...(configCosts || {})}
    />
  );
}
