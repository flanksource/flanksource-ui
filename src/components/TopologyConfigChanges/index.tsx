import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
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
        `/api/configs_db/config_component_relationships?component_id=eq.${topologyID}&select=*`
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
      console.log(resConfigChanges);
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
              <th className="font-normal">Age:</th>
              <th className="font-normal">Description:</th>
            </tr>
          </thead>
          <tbody>
            {componentConfigChanges.map((item) => (
              <tr>
                <td>{dayjs(item.created_at).fromNow()}</td>
                <td>{item.summary ?? item.change_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-row justify-center items-center py-4 space-x-2 text-gray-500">
          <FaExclamationTriangle className="text-xl" />
          <span>No changes found for this component</span>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: Props) {
  return (
    <CollapsiblePanel
      Header={<h3 className="text-xl font-semibold">Recent changes</h3>}
    >
      <div className="flex flex-col px-4">
        <TopologyConfigChanges {...props} />
      </div>
    </CollapsiblePanel>
  );
}
