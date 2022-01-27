import { isArray, flattenDepth } from "lodash";
import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopologyCard } from "../components/Topology";
import { getTopology } from "../api/services/topology";
import { Loading } from "../components/Loading";
import { SearchLayout } from "../components/Layout";

function unroll(topology, depth) {
  if (topology == null) {
    return [];
  }
  topology = flattenDepth([topology], 3);
  if (depth === 0) {
    return topology;
  }

  const items = [];

  if (isArray(topology)) {
    items.push(topology);

    for (const item of topology) {
      items.push(...unroll(item.components, depth - 1));
    }
  }
  return flattenDepth(items, 3);
}

export function TopologyPage() {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  let [topology, setTopology] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    getTopology(id).then((res) => {
      setTopology(res.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || topology == null) {
    return <Loading text="Loading topology..." />;
  }
  topology = unroll(topology, id == null ? 0 : 3);
  return (
    <SearchLayout title="Topology">
      <div className="font-inter flex leading-1.21rel">
        <div className="flex-none flex-wrap space-x-2 space-y-2">
          {topology.map((item, index) => (
            <TopologyCard key={item.id} topology={item} size="medium" />
          ))}
        </div>
      </div>
    </SearchLayout>
  );
}
