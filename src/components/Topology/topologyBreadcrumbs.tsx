import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { getTopology } from "../../api/services/topology";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { useLoader } from "../../hooks";

function isTopologyEmpty(topology: { id?: string; components: any[] }) {
  return (
    topology == null ||
    (isEmpty(topology.id) && topology.components.length === 0)
  );
}

type Props = {
  topologyId?: string;
  topology?: any;
};

export function TopologyBreadcrumbs({ topology, topologyId }: Props) {
  const [_topology, setTopology] = useState(topology);
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    async function fetchTopology() {
      if (isEmpty(topologyId) && isTopologyEmpty(_topology)) {
        return;
      }
      if (topologyId != null && _topology == null) {
        setLoading(true);
        const results = await getTopology({ id: topologyId });
        setLoading(false);
        setTopology(
          results.data.find((item: { id: string }) => item.id === topologyId)
        );
      }
    }
    fetchTopology();
  }, [_topology, topologyId]);

  useEffect(() => {
    if (!topologyId) {
      setTopology(null);
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
      {_topology && (
        <>
          &nbsp;/&nbsp;
          <Link
            to={`/topology/${_topology.id}`}
            className="flex flex-nowrap hover:text-gray-500 my-auto "
          >
            <Icon name={_topology.icon} size="xl" className="mr-1" />
            {_topology.name || _topology.title}
          </Link>
        </>
      )}
    </>
  );
}
