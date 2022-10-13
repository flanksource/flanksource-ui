import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ConfigChangeIcon from "../ConfigChangeIcon";
import { FaExclamationTriangle } from "react-icons/fa";
import { Loading } from "../Loading";

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

  return (
    <div className="flex flex-col space-y-2 w-full px-2 py-4">
      <h3 className="font-semibold text-xl py-4">Related changes</h3>
      {isLoading ? (
        <Loading />
      ) : configChanges.length > 0 ? (
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
            {configChanges.map((configChange) => (
              <tr key={configChange.id}>
                <td className="p-2 font-medium text-black whitespace-nowrap">
                  <ConfigChangeIcon changeType={configChange.change_type} />
                  {configChange.summary ?? configChange.change_type}
                </td>
                <td className="p-2 ">
                  {dayjs(configChange.created_at).fromNow()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-row space-x-2 text-gray-500 justify-center items-center">
          <FaExclamationTriangle /> <span>No config changes found</span>
        </div>
      )}
    </div>
  );
}
