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

type Props = {
  topology?: Topology;
  refererId?: string;
};

export default function TopologyDetails({ topology, refererId }: Props) {
  if (topology == null) {
    return null;
  }

  const topologyProperties = topology?.properties ?? [];

  var items = [];

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
      value: map(topology.labels, (v, k) => (
        <div
          data-tip={`${k}: ${v}`}
          className="max-w-full overflow-hidden text-ellipsis  mb-1 rounded-md text-gray-600 font-semibold text-sm"
          key={k}
        >
          {k}: <span className="font-light">{v}</span>
        </div>
      ))
    });
  }

  return (
    <CollapsiblePanel
      Header={
        <Title title="Details" icon={<BsCardList className="w-6 h-auto" />} />
      }
    >
      {Boolean(items.length) ? (
        <DescriptionCard items={items} />
      ) : (
        <EmptyState />
      )}
    </CollapsiblePanel>
  );
}
