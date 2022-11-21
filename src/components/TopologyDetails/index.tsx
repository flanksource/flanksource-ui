import { isEmpty, map } from "lodash";
import { BsCardList } from "react-icons/bs";
import { FaExclamationTriangle } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { NodePodPropToLabelMap } from "../../constants";
import { Topology } from "../../context/TopologyPageContext";
import CollapsiblePanel from "../CollapsiblePanel";
import { DescriptionCard } from "../DescriptionCard";
import { Icon } from "../Icon";
import { CardMetrics } from "../TopologyCard/CardMetrics";
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

  if (topology.labels != null && topology.labels.length > 0) {
    items.push({
      label: "Labels",
      value: map(topology.labels, (v, k) => (
        <div
          data-tip={`${k}: ${v}`}
          className="max-w-full overflow-hidden text-ellipsis  mb-1 rounded-md text-gray-600 font-semibold text-xs"
          key={k}
        >
          {k}: <span className="font-light">{v}</span>
        </div>
      ))
    });
  }

  return (
    <div className="flex flex-col space-y-2">
      <h4>
        <BsCardList className="inline-block text-gray-400" /> Details
      </h4>
      <DescriptionCard items={items} />
    </div>
  );
}
