import dayjs from "dayjs";
import { useEffect, useState } from "react";
import AnalysisIcon from "../AnalysisIcon";

export type ConfigTypeAnalysis = {
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

export default function ConfigAnalysis({ configID }: Props) {
  const [configAnalysis, setConfigAnalysis] = useState<ConfigTypeAnalysis[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/configs_db/config_analysis?config_id=eq.${configID}`
      );
      const data = (await res.json()) as ConfigTypeAnalysis[];
      setConfigAnalysis(data);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (configAnalysis.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 w-full px-2 py-4">
      <h3 className="font-semibold text-2xl py-4 border-b">Analysis</h3>
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
          {configAnalysis.map((analysis) => (
            <tr key={analysis.id}>
              <td className="p-2 font-medium text-black whitespace-nowrap">
                <p>
                  <AnalysisIcon analysis={analysis} />
                  {analysis.analyzer} <br />
                </p>
                {analysis.summary ? analysis.summary : ""}
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
