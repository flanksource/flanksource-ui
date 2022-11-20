import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { GoDiff } from "react-icons/go";
import { Link } from "react-router-dom";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";

type Props = {
  topologyID: string;
};

export function TopologyConfigChanges({ topologyID }: Props) {
  const [componentConfigChanges, setComponentConfigChanges] = useState<
    Record<string, any>[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchComponentConfigChanges() {
      setIsLoading(true);
      const res = await fetch(
        `/api/db/config_component_relationships?component_id=eq.${topologyID}&select=*`
      );
      const data = (await res.json()) as Record<string, any>[];

      const resConfigChanges = await Promise.all(
        data.map(async (item) => {
          const res = await fetch(
            `/api/configs_db/config_changes?config_id=eq.${item.config_id}`
          );
          return res.json();
        })
      );
      setComponentConfigChanges(resConfigChanges.flat());
      setIsLoading(false);
    }

    fetchComponentConfigChanges();
  }, [topologyID]);

  return (
    <div className="flex flex-col space-y-4">
      {isLoading ? (
        <Loading />
      ) : componentConfigChanges.length > 0 ? (
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 font-normal">
              <th className="font-normal">Description:</th>
              <th className="font-normal">Age:</th>
            </tr>
          </thead>
          <tbody>
            {componentConfigChanges.map((item) => (
              <tr>
                <td>
                  <Link
                    className="block"
                    to={{
                      pathname: `/configs/${item.config_id}/changes`
                    }}
                  >
                    {item.summary ?? item.change_type}
                  </Link>
                </td>
                <td>
                  <Link
                    className="block"
                    to={{
                      pathname: `/configs/${item.config_id}/changes`
                    }}
                  >
                    {dayjs(item.created_at).fromNow()}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-row justify-center items-center py-4 space-x-2 text-gray-400">
          <FaExclamationTriangle className="text-xl" />
          <span>No details found</span>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
          <GoDiff className="text-gray-400" />
          <span>Changes</span>
        </h3>
      }
    >
      <div className="flex flex-col">
        <TopologyConfigChanges {...props} />
      </div>
    </CollapsiblePanel>
  );
}
