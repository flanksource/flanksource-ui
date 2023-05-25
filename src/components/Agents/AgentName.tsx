import { useQuery } from "@tanstack/react-query";
import { getAgentByID } from "../../api/services/topology";

type TopologyCardAgentProps = {
  agentId?: string;
};

export default function AgentName({ agentId }: TopologyCardAgentProps) {
  const { data: agent } = useQuery(
    ["db", "agent", agentId],
    () => getAgentByID(agentId!),
    {
      enabled: !!agentId && agentId !== "00000000-0000-0000-0000-000000000000"
    }
  );

  if (!agent) {
    return null;
  }

  return <div className="text-gray-400 text-sm">{agent.name}</div>;
}
