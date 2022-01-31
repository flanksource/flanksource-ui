import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopologyCard } from "../components/Topology";
import { getTopology } from "../api/services/topology";
import { Loading } from "../components/Loading";
import { SearchLayout } from "../components/Layout";

export function TopologyPage() {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [topology, setTopology] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    getTopology(id, id == null ? 0 : 3).then((res) => {
      setTopology(res.data);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading || topology == null) {
    return <Loading text="Loading topology..." />;
  }
  return (
    <SearchLayout title="Topology">
      <div className="font-inter flex leading-1.21rel">
        <div className="flex-none flex-wrap space-x-2 space-y-2">
          {topology.map((item) => (
            <TopologyCard key={item.id} topology={item} size="medium" />
          ))}
        </div>
      </div>
    </SearchLayout>
  );
}
