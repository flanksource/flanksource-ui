import { isEmpty, map } from "lodash";
import { BsCardList } from "react-icons/bs";
import { Topology } from "../../context/TopologyPageContext";
import CollapsiblePanel from "../CollapsiblePanel";
import { DescriptionCard } from "../DescriptionCard";
import EmptyState from "../EmptyState";
import { Icon } from "../Icon";
import Title from "../Title/title";
import { FormatProperty } from "../TopologyCard/Property";
import { TopologyLink } from "../TopologyLink";
import { useMemo } from "react";

type Props = {
  topology?: Topology;
  refererId?: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export default function TopologyDetails({
  topology,
  refererId,
  isCollapsed = true,
  onCollapsedStateChange = () => {}
}: Props) {
  const items = useMemo(() => {
    if (topology == null) {
      return [];
    }

    const items = [];

    if (
      refererId != null &&
      topology.parent_id != null &&
      topology.parent_id !== refererId
    ) {
      items.push({
        label: "Parent",
        value: <TopologyLink size="sm" topologyId={topology.parent_id} />
      });
    }

    const topologyProperties = topology?.properties ?? [];

    for (var property of topologyProperties) {
      items.push({
        label: isEmpty(property.label) ? property.name : property.label,
        value: (
          <>
            <Icon
              className="pr-1 w-5"
              name={property.icon}
              secondary={property.name}
            />
            <FormatProperty property={property} />
          </>
        )
      });
    }

    if (topology.labels != null && Object.entries(topology.labels).length > 0) {
      items.push({
        label: "Labels",
        value: (
          <div className="flex flex-col">
            {map(topology.labels, (v, k) => (
              <div
                data-tip={`${k}: ${v}`}
                className="max-w-full overflow-hidden text-ellipsis  mb-1 rounded-md text-gray-600 font-semibold text-sm"
                key={k}
              >
                {k}: <span className="text-sm font-light">{v}</span>
              </div>
            ))}
          </div>
        )
      });
    }
    return items;
  }, [refererId, topology]);

  if (topology == null) {
    return null;
  }

  return (
    <CollapsiblePanel
      Header={
        <Title title="Details" icon={<BsCardList className="w-6 h-auto" />} />
      }
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
    >
      {Boolean(items.length) ? (
        <DescriptionCard items={items} labelStyle="top" />
      ) : (
        <EmptyState />
      )}
    </CollapsiblePanel>
  );
}
