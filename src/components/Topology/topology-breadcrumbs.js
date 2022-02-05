import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTopology } from "../../api/services/topology";
import { Icon } from "../Icon";
import { Loading } from "../Loading";

function isTopologyEmpty(topology) {
  return (
    topology == null ||
    (isEmpty(topology.id) && topology.components.length === 0)
  );
}

export function TopologyBreadcrumbs({ topology, topologyId, depth }) {
  const [_topology, setTopology] = useState(topology);

  useEffect(() => {
    if (isEmpty(topologyId) && isTopologyEmpty(_topology)) {
      return;
    }
    if (topologyId != null && _topology == null) {
      getTopology({ id: topologyId }).then((results) => {
        setTopology(results.data[0]);
      });
    }
  }, []);

  if (_topology == null && isEmpty(topologyId)) {
    return "";
  }
  if (_topology == null) {
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
      &nbsp;/&nbsp;
      <Link to={`/topology/${_topology.id}`} className="flex flex-nowrap">
        <Icon name={_topology.icon} size="xl" />
        {_topology.name || _topology.title}
      </Link>
    </>
  );
}
