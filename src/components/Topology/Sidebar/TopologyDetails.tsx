import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BsCardList } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getComponentsTopology } from "../../../api/services/topology";
import { isCostsEmpty } from "../../../api/types/configs";
import { Topology } from "../../../api/types/topology";
import { Age } from "../../../ui/Age";
import CollapsiblePanel from "../../CollapsiblePanel";
import ConfigCostValue from "../../ConfigCosts/ConfigCostValue";
import Title from "../../Title/title";
import { CardMetrics } from "../../TopologyCard/CardMetrics";
import { TopologyLink } from "../../TopologyLink";
import DisplayDetailsRow from "../../Utils/DisplayDetailsRow";
import { DisplayGroupedProperties } from "../../Utils/DisplayGroupedProperties";
import { formatTopologyProperties } from "./Utils/formatTopologyProperties";
import { formatConfigTags } from "../../Configs/Sidebar/Utils/formatConfigTags";

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
  const { data } = useQuery({
    queryFn: () => getComponentsTopology(topology!.id),
    enabled: topology != null,
    queryKey: ["components", "topology", topology?.id],
    select: (data) => data?.topologies
  });

  const headlineProperties =
    topology?.properties?.filter((property) => property.headline) ?? [];

  const appendedDetails = useMemo(() => {
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

    if (topology.type) {
      items.push({
        label: "Type",
        value: (
          <>
            {topology.type}
            {data && (
              <>
                {" "}
                by{" "}
                <Link
                  to={{
                    pathname: `/settings/topologies/${data.id}`
                  }}
                  className="cursor-pointer text-blue-500 my-auto underline"
                >
                  {data.name}
                </Link>
              </>
            )}
          </>
        )
      });
    }

    if (!isCostsEmpty(topology)) {
      items.push({
        label: "Costs",
        value: <ConfigCostValue config={topology} />
      });
    }

    return items;
  }, [data, refererId, topology]);

  const formattedProperties = useMemo(() => {
    return formatTopologyProperties(topology);
  }, [topology]);

  const formattedLabels = useMemo(() => {
    return formatConfigTags({
      tags: topology?.labels ?? []
    });
  }, [topology?.labels]);

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
      <div className="flex flex-col  w-full gap-2">
        {headlineProperties.length > 0 && (
          <div className="flex flex-row gap-2 w-min py-2">
            <CardMetrics items={headlineProperties} />
          </div>
        )}

        {appendedDetails.length > 0 &&
          appendedDetails.map((property) => (
            <DisplayDetailsRow
              items={[
                {
                  label: property.label,
                  value: property.value
                }
              ]}
              key={property.label}
            />
          ))}

        <DisplayDetailsRow
          items={[
            {
              label: "Created",
              value: <Age from={topology.created_at} />
            },
            {
              label: "Updated",
              value: <Age from={topology.updated_at} />
            },
            ...(topology.deleted_at
              ? [
                  {
                    label: "Deleted",
                    value: <Age from={topology.deleted_at} />
                  }
                ]
              : [])
          ]}
        />

        <DisplayGroupedProperties items={formattedProperties} />

        {formattedLabels.length > 0 && (
          <div className="flex flex-col py-2">
            <div className="text-sm font-semibold text-gray-600 border-b border-dashed border-gray-300 pb-1">
              Labels
            </div>
            <div className="flex flex-col px-1 gap-2">
              <DisplayGroupedProperties items={formattedLabels} />
            </div>
          </div>
        )}
      </div>
    </CollapsiblePanel>
  );
}
