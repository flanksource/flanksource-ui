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
            `/api/db/config_changes?config_id=eq.${item.config_id}`
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
    <div className="flex flex-col ">
      <div className="flex flex-col mt-2">
        <div className="flex flex-col pl-2">
          {componentConfigChanges.map((item) => (
            <div className="flex flex-row text-xs">
              <Link
                className="block"
                to={{
                  pathname: `/configs/${item.config_id}/changes`
                }}
              >
                {item.summary ?? item.change_type}
              </Link>

              <span className="text-right grow">
                {dayjs(item.created_at).fromNow()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <h4 className="flex flex-row">
          <GoDiff className="text-gray-400" />
          <span className="pl-1">Changes</span>
        </h4>
      }
    >
      <div className="flex flex-col">
        <TopologyConfigChanges {...props} />
      </div>
    </CollapsiblePanel>
  );
}
