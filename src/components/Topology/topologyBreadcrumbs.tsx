import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { Topology } from "../../context/TopologyPageContext";

function isTopologyEmpty(topology?: Topology) {
  return (
    topology == null ||
    (isEmpty(topology.id) && topology.components?.length === 0)
  );
}

type Props = {
  topologyId?: string;
};

export function TopologyBreadcrumbs({ topologyId }: Props) {
  const [loading, setLoading] = useState(false);

  const [pathTopology, setPathTopology] = useState<
    Pick<Topology, "text" | "name" | "id" | "icon">[]
  >([]);

  useEffect(() => {
    async function fetchPath() {
      if (topologyId) {
        setLoading(true);
        const topology = await fetch(
          `/api/incidents_db/components?select=id,path&id=eq.${topologyId}`
        );
        const topologyJson = (await topology.json())[0] as Pick<
          Topology,
          "icon" | "path"
        >;
        const ids = topologyJson?.path ? topologyJson.path.split(".") : [];
        const res = await fetch(
          `/api/incidents_db/components?select=text,name,id,icon&id=in.(${[
            ...ids,
            topologyId
          ]})`
        );
        const data = (await res.json()) as Pick<
          Topology,
          "text" | "name" | "id"
        >[];
        setPathTopology(data);
        setLoading(false);
      }
    }

    fetchPath();
  }, [topologyId]);

  useEffect(() => {
    if (!topologyId) {
      setPathTopology([]);
    }
  }, [topologyId]);

  if (loading) {
    return <Loading text=".." />;
  }

  return (
    <>
      {/* {depth > 0 &&
        _topology.parent_id != null &&
        _topology.parent_id != _topology.id && (
          <>
            <TopologyBreadcrumbs
              topologyId={_topology.parent_id}
              depth={depth - 1}
            />
          </>

        )} */}
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
