import { useEffect, useState } from "react";

export type ConfigTypeChanges = {
  id: string;
  config_id: string;
  external_change_id: string;
  change_type: string;
  severity: string;
  source: string;
  summary: string;
  patches: string;
  details: string;
  created_at: string;
  created_by: string;
  external_created_by: string;
};

type Props = {
  configID: string;
};

export default function ConfigChanges({ configID }: Props) {
  const [configChanges, setConfigChanges] = useState<ConfigTypeChanges[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/configs_db/config_changes?config_id=eq.${configID}`
      );
      const data = (await res.json()) as ConfigTypeChanges[];
      setConfigChanges(data);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  if (isLoading) {
    return null;
  }

  if (configChanges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 w-full px-2 py-4 shadow-lg rounded-md  bg-white">
      <h3 className="font-semibold text-xl py-4 border-b">Changes</h3>
      <ul className="flex flex-col space-y-1 w-full py-2">
        {configChanges.map((analysis) => (
          <li
            key={analysis.id}
            className="flex flex-row items-center space-x-2"
          >
            {/* <AnalysisIcon analysis={analysis} /> */}
            <span>{analysis.change_type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
