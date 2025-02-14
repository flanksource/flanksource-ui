import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { LoadingBarRef } from "react-top-loading-bar";
import { getTopology } from "../services/topology";

export default function useTopologyPageQuery() {
  const { id } = useParams();

  const [searchParams] = useSearchParams({
    sortBy: "status",
    sortOrder: "desc"
  });

  const selectedLabel = searchParams.get("labels") ?? "All";
  const team = searchParams.get("team") ?? "All";
  const topologyType = searchParams.get("type") ?? "All";
  const healthStatus = searchParams.get("status") ?? "All";
  const sortBy = searchParams.get("sortBy") ?? "status";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const agentId = searchParams.get("agent_id") ?? undefined;
  const showHiddenComponents =
    searchParams.get("showHiddenComponents") ?? undefined;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  return useQuery(
    [
      "topologies",
      id,
      healthStatus,
      team,
      selectedLabel,
      topologyType,
      showHiddenComponents,
      sortBy,
      sortOrder,
      agentId
    ],
    () => {
      loadingBarRef.current?.continuousStart();
      const apiParams = {
        id,
        status: healthStatus,
        type: topologyType,
        team: team,
        labels: selectedLabel,
        sortBy,
        sortOrder,
        // only flatten, if topology type is set
        ...(topologyType &&
          topologyType.toString().toLowerCase() !== "all" && {
            flatten: true
          }),
        hidden: showHiddenComponents === "no" ? false : undefined,
        agent_id: agentId
      };
      return getTopology(apiParams);
    },
    {
      onSettled: () => {
        loadingBarRef.current?.complete();
      }
    }
  );
}
