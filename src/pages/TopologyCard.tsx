import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getTopology } from "../api/services/topology";
import { InfoMessage } from "../components/InfoMessage";
import { TopologyCard } from "../components/Topology/TopologyCard";
import { Head } from "../ui/Head";

export function TopologyCardPage() {
  const { id, size } = useParams();

  const { data } = useQuery({
    queryKey: ["topology", id],
    queryFn: () => getTopology({ id: id })
  });
  if (!data || !data.components || data.components?.length === 0) {
    return <InfoMessage message="Component not found" />;
  }

  const topology = data.components[0];
  return (
    <>
      <Head prefix={topology.name || ""} suffix=""></Head>

      <div className="m-2">
        <TopologyCard
          topology={topology}
          size={size || "large"}
          target="_blank"
          hideMenu
        />
      </div>
    </>
  );
}
