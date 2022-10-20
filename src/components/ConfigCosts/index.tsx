import { useEffect, useMemo, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";

export function FormatCurrency({ value }: { value: number | string }) {
  return <span>${parseFloat(value.toString()).toFixed(2)}</span>;
}

export type ConfigCostsData = {
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
};

const configCostsKeysToDisplayValue = new Map([
  ["cost_per_minute", "Cost (per min)"],
  ["cost_total_1d", "Cost (1d)"],
  ["cost_total_7d", "Cost (7d)"],
  ["cost_total_30d", "Cost (30d)"]
]);

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
          <div className="flex flex-row justify-between space-x-3 w-full rounded-lg text-center border border-gray-300 px-4 py-6">
            {Object.entries(configCosts!).map(([key, value]) => (
              <div className="flex flex-col flex-1 space-y-4 items-center justify-center">
                <div className="text-black text-base font-semibold">
                  <FormatCurrency value={value} />
                </div>
                <div className="text-gray text-sm whitespace-nowrap">
                  {configCostsKeysToDisplayValue.get(key)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CollapsiblePanel>
  );
}
