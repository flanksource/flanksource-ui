import { useQuery } from "@tanstack/react-query";
import { getAgentByID } from "../../api/services/agents";
import { Badge } from "../Badge";
import { ComponentProps } from "react";
import { AgentItem } from "../../api/types/common";

type TopologyCardAgentProps = {
  agent?: AgentItem;
  agentId?: string;
  className?: string;
  size?: ComponentProps<typeof Badge>["size"];
};

export default function AgentName({
  agent: propAgent,
  agentId,
  className = "bg-gray-100 text-gray-800",
  size = "xs"
}: TopologyCardAgentProps) {
  const { data: dbAgent } = useQuery(
    ["db", "agent", agentId],
    () => getAgentByID(agentId!),
    {
      enabled: !!agentId && propAgent === undefined
    }
  );

  const agent = propAgent ?? dbAgent;

  if (!agent) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Badge
        colorClass={className}
        size={size}
        title={agent.description}
        text={agent.name}
      />
    </div>
  );
}
