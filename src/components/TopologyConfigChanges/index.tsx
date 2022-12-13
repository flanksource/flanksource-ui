import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { GoDiff } from "react-icons/go";
import { Link } from "react-router-dom";
import CollapsiblePanel from "../CollapsiblePanel";
import ConfigLink from "../ConfigLink/ConfigLink";
import { Icon } from "../Icon";
import Title from "../Title/title";

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
        `/api/db/changes_by_component?component_id=eq.${topologyID}`
      );
      const data = await res.json();
      setComponentConfigChanges(data);
      setIsLoading(false);
    }

    fetchComponentConfigChanges();
  }, [topologyID]);

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col mt-2">
        <div className="flex flex-col pl-2">
          {componentConfigChanges.map((item) => (
            <div className="flex flex-row text-sm mb-2">
              <ConfigLink
                className="text-zinc-600"
                configId={item.config_id}
                configName={item.name}
                configType={item.external_type}
                configTypeSecondary={item.config_type}
              />
              &nbsp;/&nbsp;
              <Link
                className="block"
                to={{
                  pathname: `/configs/${item.config_id}/changes`
                }}
              >
                <Icon name={item.change_type} />
                {item.summary ?? item.change_type}
              </Link>
              <span className="text-right grow" data-tip={item.created_at}>
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
        <Title title="Changes" icon={<GoDiff className="w-6 h-auto" />} />
      }
    >
      <div className="flex flex-col">
        <TopologyConfigChanges {...props} />
      </div>
    </CollapsiblePanel>
  );
}
