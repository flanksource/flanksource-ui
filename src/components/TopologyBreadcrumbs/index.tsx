import { Icon } from "../Icon";
import { useComponentNameQuery } from "../../api/query-hooks";
import { useMemo } from "react";
import { Head } from "../Head/Head";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "../BreadcrumbNav";

type TopologyBreadcrumbsProps = {
  topologyId?: string;
  refererId?: string | null | undefined;
};

function TopologyBreadcrumbItem({
  topologyId
}: {
  topologyId: string | undefined;
}) {
  const { data: component } = useComponentNameQuery(topologyId, {});

  if (!component) {
    return null;
  }

  return (
    <>
      <Head prefix={component ? `Topology - ${component.name}` : "Topology"} />
      <BreadcrumbChild link={`/topology/${component.id}`}>
        <span>
          <Icon name={component.icon} className="h-5 mr-1" />
          {component.name}
        </span>
      </BreadcrumbChild>
    </>
  );
}

export function TopologyBreadcrumbs({
  topologyId,
  refererId
}: TopologyBreadcrumbsProps) {
  const componentId = refererId || topologyId;

  const { data: component } = useComponentNameQuery(componentId, {
    enabled: !!componentId
  });

  const ids = useMemo(() => {
    const topologyIds = [
      ...(component?.path || "").split("."),
      refererId,
      topologyId
    ].filter((v) => v?.trim());
    return topologyIds;
  }, [component, topologyId, refererId]);

  return (
    <BreadcrumbNav
      list={[
        <BreadcrumbRoot link="/topology">Dashboard</BreadcrumbRoot>,
        ...ids.map((id) => {
          return <TopologyBreadcrumbItem key={id} topologyId={id} />;
        })
      ]}
    />
  );
}
