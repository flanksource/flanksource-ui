import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ConfigInsightsIcon from "../ConfigInsightsIcon";

export type ConfigTypeInsights = {
  id: string;
  config_id: string;
  analyzer: string;
  analysis_type: string;
  severity: string;
  summary: string;
  status: string;
  message: string;
  analysis: string;
  first_observed: string;
  last_observed: string;
};

type Props = {
  configID: string;
};

export default function ConfigInsights({ configID }: Props) {
  const [configInsights, setConfigInsights] = useState<ConfigTypeInsights[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/configs_db/config_analysis?config_id=eq.${configID}`
      );
      const data = (await res.json()) as ConfigTypeInsights[];
      setConfigInsights(data);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  if (isLoading) {
    return null;
  }

  if (configInsights.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 w-full px-2 py-4">
      <h3 className="font-semibold text-xl py-4">Insights</h3>
      <table className="w-full text-sm text-left">
        <thead className="text-sm uppercase text-gray-600">
          <tr>
            <th scope="col" className="p-2">
              Name
            </th>
            <th scope="col" className="p-2">
              Age
            </th>
          </tr>
        </thead>
        <tbody>
          {configInsights.map((analysis) => (
            <tr key={analysis.id}>
              <td
                title={analysis.summary ? analysis.summary : ""}
                className="p-2 font-medium text-black whitespace-nowrap"
              >
                <ConfigInsightsIcon analysis={analysis} />
                {analysis.analyzer}
              </td>
              <td className="p-2 ">
                {dayjs(analysis.first_observed).fromNow()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
