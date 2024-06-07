import { useMemo } from "react";
import { BsCardList } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useGetSettingsResourceDetails } from "../../../api/query-hooks/settingsResourcesHooks";
import { isCostsEmpty } from "../../../api/types/configs";
import { Topology } from "../../../api/types/topology";
import { Age } from "../../../ui/Age";
import CollapsiblePanel from "../../../ui/CollapsiblePanel/CollapsiblePanel";
import { Icon } from "../../../ui/Icons/Icon";
import ConfigCostValue from "../../Configs/ConfigCosts/ConfigCostValue";
import { formatConfigLabels } from "../../Configs/Sidebar/Utils/formatConfigLabels";
import Title from "../../Title/title";
import DisplayDetailsRow from "../../Utils/DisplayDetailsRow";
import { DisplayGroupedProperties } from "../../Utils/DisplayGroupedProperties";
import { CardMetrics } from "../TopologyCard/CardMetrics";
import { TopologyLink } from "../TopologyLink";
import { formatProperties } from "./Utils/formatProperties";

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
  const headlineProperties =
    topology?.properties?.filter((property) => property.headline) ?? [];

  const { data: topologySpec } = useGetSettingsResourceDetails(
    {
      api: "incident-commander",
      name: "Topology",
      table: "topologies"
    },
    topology?.topology_id
  );

  const appendedDetails = useMemo(() => {
    if (topology == null) {
      return [];
    }
    const items = [];

    items.push({
      label: "Name",
      value: (
        <>
          {(topology.type || topology.icon) && (
            <Link
              data-testid="type-link"
              to={`/topology?type=${topology.type}`}
              data-tooltip={topology.type}
              className="cursor-pointer text-blue-500 my-auto underline"
            >
              <Icon
                name={topology.icon}
                secondary={topology.type}
                className="mr-1 object-center h-5"
              />
            </Link>
          )}
          {topology.name}
        </>
      )
    });

    if (topology.labels && topology.labels["namespace"] != null) {
      items.push({
        label: "Namespace",
        value: topology.labels["namespace"]
      });
      delete topology.labels["namespace"];
    }
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

    if (!isCostsEmpty(topology)) {
      items.push({
        label: "Costs",
        value: <ConfigCostValue config={topology} />
      });
    }

    return items;
  }, [refererId, topology]);

  const formattedProperties = useMemo(() => {
    return formatProperties(topology);
  }, [topology]);

  const formattedLabels = useMemo(() => {
    return formatConfigLabels({
      labels: topology?.labels ?? []
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
      <div className="flex flex-col overflow-x-hidden w-full gap-2">
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
              value: (
                <>
                  <Age from={topology.created_at} suffix={true} />
                  {topology.topology_id && (
                    <>
                      {" "}
                      by{" "}
                      <Link
                        data-testid="settings-link"
                        to={{
                          pathname: `/settings/topologies/${topology.topology_id}`
                        }}
                        className="link my-auto"
                      >
                        {topologySpec?.name ?? "a topology"}
                      </Link>
                    </>
                  )}
                </>
              )
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
          <DisplayGroupedProperties items={formattedLabels} />
        )}
      </div>
    </CollapsiblePanel>
  );
}
