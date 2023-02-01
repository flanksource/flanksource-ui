import { useEffect, useState } from "react";
import { useConfigAnalysisQuery } from "../../api/query-hooks";
import { CostInfoPanel, CostsData } from "../CostDetails/CostDetails";

type Props = {
  configID: string;
};

export default function ConfigCosts({ configID }: Props) {
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

  return <CostInfoPanel title="Costs" {...(configCosts || {})} />;
}
