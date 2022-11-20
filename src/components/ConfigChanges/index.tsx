import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ConfigChangeIcon from "../ConfigChangeIcon";
import { FaExclamationTriangle } from "react-icons/fa";
import { Loading } from "../Loading";
import CollapsiblePanel from "../CollapsiblePanel";
import { GoDiff } from "react-icons/go";
import { Link } from "react-router-dom";

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

function ConfigChangesDetails({ configID }: Props) {
  const [configChanges, setConfigChanges] = useState<ConfigTypeChanges[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/db/config_changes?config_id=eq.${configID}`
      );
      const data = (await res.json()) as ConfigTypeChanges[];
      setConfigChanges(data);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  return (
    <div className="flex flex-col space-y-2">
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
                  <Link
                    className="block"
                    to={{
                      pathname: `/configs/${configChange.config_id}/changes`
                    }}
                  >
                    <ConfigChangeIcon changeType={configChange.change_type} />
                    {configChange.summary ?? configChange.change_type}
                  </Link>
                </td>
                <td className="p-2 ">
                  <Link
                    className="block"
                    to={{
                      pathname: `/configs/${configChange.config_id}/changes`
                    }}
                  >
                    {dayjs(configChange.created_at).fromNow()}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-row space-x-2 text-gray-500 justify-center items-center">
          <FaExclamationTriangle /> <span>No details found</span>
        </div>
      )}
    </div>
  );
}

export default function ConfigChanges(props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
          <GoDiff className="text-gray-400" />
          <span>Changes</span>
        </h3>
      }
    >
      <ConfigChangesDetails {...props} />
    </CollapsiblePanel>
  );
}
