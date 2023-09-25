import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  GenerateAgent,
  GeneratedAgent,
  addAgent,
  deleteAgent,
  updateAgent
} from "../../services/agents";
import { Agent } from "../../../components/Agents/AgentPage";

export function useAddAgentMutations(
  options?: UseMutationOptions<GeneratedAgent, Error, GenerateAgent>
) {
  return useMutation({
    ...options,
    mutationFn: async (agent: GenerateAgent) => addAgent(agent)
  });
}

export function useUpdateAgentMutations(
  options?: UseMutationOptions<Agent, Error, GenerateAgent>
) {
  return useMutation({
    ...options,
    mutationFn: async (
      agent: GenerateAgent & {
        id: string;
      }
    ) => updateAgent(agent)
  });
}

type DeleteAgentProps = {
  id: string;
  cleanup: boolean;
};

export function useDeleteAgentMutations(
  options?: UseMutationOptions<Agent, Error, DeleteAgentProps>
) {
  return useMutation({
    ...options,
    mutationFn: async ({ id, cleanup }: DeleteAgentProps) =>
      deleteAgent(id, cleanup)
  });
}
