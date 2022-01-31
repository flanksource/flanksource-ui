import { React, useEffect, useState } from "react";
import { TopologyColumn, TopologyCard } from ".";
import { getTopology } from "../../api/services/topology";
import { Loading } from "../Loading";

export function TopologyViewer() {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [topology, setTopology] = useState([]);
  const [topologyModalIsOpen, setTopologyModalIsOpen] = useState(false);

  const load = () => {
    setIsLoading(true);
    getTopology().then((res) => {
      setTopology(res.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) {
    return <Loading text="Loading topology..." />;
  }
  return (
    <div className="font-inter flex leading-tightly">
      <div className="flex-auto">
        <TopologyColumn
          title=""
          cards={topology.map((item, index) => (
            <TopologyCard key={item.name} topology={item} size="medium" />
          ))}
        />
      </div>
    </div>
  );
}
