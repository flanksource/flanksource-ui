import { useEffect, useMemo, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";

export function FormatCurrency({ value }: { value: number | string }) {
  const amount = useMemo(() => {
    const parsedValue = typeof value === "string" ? parseInt(value) : value;
    if (value <= 10) {
      return parsedValue.toFixed(2);
    }
    return parsedValue.toFixed(0);
  }, [value]);

  return <span>{amount}</span>;
}

export type ConfigCostsData = {
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
};

function DisplayCostItem({ label, value }: { value?: number; label: string }) {
  if (!value) {
    return null;
  }

  return (
    <div className="overflow-hidden flex flex-col flex-1 space-y-2 px-2">
      <div className="text-gray-500 text-sm font-medium  whitespace-nowrap">
        {label}
      </div>
      <div className="text-black text-xl font-semibold">
        <FormatCurrency value={value} />
      </div>
    </div>
  );
}

type Props = {
  configID: string;
};

export default function ConfigCosts({ configID }: Props) {
  const [configCosts, setConfigCosts] = useState<ConfigCostsData>();
  const [isLoading, setIsLoading] = useState(true);

  const isConfigCostsEmpty = useMemo(
    () =>
      configCosts?.cost_per_minute === undefined &&
      configCosts?.cost_total_1d === undefined &&
      configCosts?.cost_total_7d === undefined &&
      configCosts?.cost_total_30d === undefined,
    [configCosts]
  );

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/configs_db/configs?id=eq.${configID}&select=cost_per_minute,cost_total_1d,cost_total_7d,cost_total_30d`
      );
      const data = (await res.json()) as ConfigCostsData[];
      setConfigCosts(data[0]);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  if (!isLoading && isConfigCostsEmpty) {
    return null;
  }

  return (
    <CollapsiblePanel
      Header={
        <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
          <FaDollarSign className="text-gray-400" />
          <span>Costs</span>
        </h3>
      }
    >
      <div className="flex flex-col space-y-2">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-row justify-between space-x-3 w-full px-2">
            <DisplayCostItem
              value={configCosts?.cost_per_minute}
              label="Per min"
            />
            <DisplayCostItem value={configCosts?.cost_total_1d} label="1d" />
            <DisplayCostItem value={configCosts?.cost_total_7d} label="7d" />
            <DisplayCostItem value={configCosts?.cost_total_30d} label="30d" />
          </div>
        )}
      </div>
    </CollapsiblePanel>
  );
}
