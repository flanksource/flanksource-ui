import { useQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import { getAgentByID, Local } from "../../api/services/agents";
import { AgentItem } from "../../api/types/common";
import { Badge } from "../../ui/Badge";

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

  if (!agent || agent.id === Local) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Badge
        className={className}
        size={size}
        title={agent.description}
        text={agent.name}
      />
    </div>
  );
}
