import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { Topology } from "../../context/TopologyPageContext";
import { useComponentsQuery } from "../../api/query-hooks";

type Props = {
  topologyId?: string;
};

export function TopologyBreadcrumbs({ topologyId }: Props) {
  const { data: components, isLoading } = useComponentsQuery();

  const [pathTopology, setPathTopology] = useState<
    Pick<Topology, "text" | "name" | "id" | "icon">[]
  >([]);

  useEffect(() => {
    if (!topologyId || !components?.data?.length) {
      return;
    }
    const rootTopology = components.data.find(
      (item: Record<string, string>) => item.id === topologyId
    );
    const items: any[] = [];
    let ids =
      rootTopology?.path?.split(".").filter((v: string) => v.trim()) || [];
    ids = [...ids, topologyId];
    ids.forEach((id: string) => {
      const item = components.data.find(
        (v: Record<string, string>) => v.id === id
      );
      if (item) {
        items.push(item);
      }
    });
    setPathTopology(items);
  }, [topologyId, components]);

  useEffect(() => {
    if (!topologyId) {
      setPathTopology([]);
    }
  }, [topologyId]);

  if (isLoading) {
    return <Loading text=".." />;
  }

  return (
    <>
      <Link to="/topology" className="hover:text-gray-500 ">
        Topology
      </Link>
      {pathTopology?.map(({ id, text, icon, name }) => (
        <>
          &nbsp;/&nbsp;
          <Link
            to={{
              pathname: `/topology/${id}`
            }}
            className="flex flex-nowrap hover:text-gray-500 my-auto "
          >
            <Icon name={icon} size="xl" className="mr-1" />
            {name || text}
          </Link>
        </>
      ))}
    </>
  );
}
