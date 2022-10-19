import { useEffect, useMemo, useState } from "react";
import { FaExclamationTriangle, FaMoneyBill } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";

export function FormatCurrency({ value }: { value: number }) {
  const amount = useMemo(() => {
    if (value > 1000) {
      return (value / 1000).toFixed(1) + "k";
    }
    if (value > 100) {
      return value.toFixed(0);
    }
    if (value > 10) {
      return value.toFixed(1);
    }
    if (value > 0.01) {
      return value.toFixed(2);
    }
    if (value > 0.001) {
      return value.toFixed(3);
    }
    return value.toString();
  }, [value]);

  return <span>{amount}</span>;
}

export type ConfigCostsData = {
  id: string;
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
};

type Props = {
  configID: string;
};

function ConfigCostsDetails({ configID }: Props) {
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
        `/api/configs_db/configs?id=eq.${configID}&select=id,cost_per_minute,cost_total_1d,cost_total_7d,cost_total_30d`
      );
      const data = (await res.json()) as ConfigCostsData[];
      setConfigCosts(data[0]);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="flex flex-col space-y-2">
      {isLoading ? (
        <Loading />
      ) : !isConfigCostsEmpty ? (
        <table className="w-full text-sm text-left">
          <tbody>
            <tr>
              <td className="p-2 font-medium text-black whitespace-nowrap">
                Per Minute
              </td>
              <td className="p-2 ">
                <FormatCurrency value={configCosts?.cost_per_minute!} />
              </td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-black whitespace-nowrap">
                Per Day
              </td>
              <td className="p-2 ">
                <FormatCurrency value={configCosts?.cost_total_1d!} />
              </td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-black whitespace-nowrap">
                Per Week
              </td>
              <td className="p-2 ">
                <FormatCurrency value={configCosts?.cost_total_7d!} />
              </td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-black whitespace-nowrap">
                Per Month
              </td>
              <td className="p-2 ">
                <FormatCurrency value={configCosts?.cost_total_30d!} />
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="flex flex-row justify-center items-center space-x-2 text-gray-500 text-center">
          <FaExclamationTriangle />
          <span>No details found</span>
        </div>
      )}
    </div>
  );
}

export default function ConfigCosts(props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
          <FaMoneyBill className="text-gray-400" />
          <span>Costs</span>
        </h3>
      }
    >
      <ConfigCostsDetails {...props} />
    </CollapsiblePanel>
  );
}
