import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { Agent } from "./AgentPage";

type AgentsBadgeProps = {
  agent?: Pick<Agent, "id" | "name">;
};

export default function AgentBadge({ agent }: AgentsBadgeProps) {
  if (!agent || agent.id === "00000000-0000-0000-0000-000000000000") {
    return null;
  }

  return <Badge text={agent.name} />;
}
