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
      console.log(data, "data");
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
      <h3 className="font-semibold text-2xl py-4 border-b">Config Analysis</h3>
      <ul className="flex flex-col space-y-1 w-full py-2">
        {configAnalysis.map((analysis) => (
          <li
            key={analysis.id}
            className="flex flex-row items-center space-x-2"
          >
            <AnalysisIcon analysis={analysis} />
            <span>{analysis.analyzer}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
