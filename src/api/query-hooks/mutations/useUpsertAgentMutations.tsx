import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  GenerateAgent,
  GeneratedAgent,
  addAgent,
  deleteAgent,
  deleteAgentToken,
  generateAgentToken,
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

type DeleteAgentTokenProps = {
  agentId: string;
  tokenId: string;
};

export function useDeleteAgentTokenMutation(
  options?: UseMutationOptions<void, Error, DeleteAgentTokenProps>
) {
  return useMutation({
    ...options,
    mutationFn: async ({ agentId, tokenId }: DeleteAgentTokenProps) =>
      deleteAgentToken(agentId, tokenId)
  });
}

export function useGenerateAgentTokenMutation(
  options?: UseMutationOptions<GeneratedAgent, Error, string>
) {
  return useMutation({
    ...options,
    mutationFn: async (agentName: string) => generateAgentToken(agentName)
  });
}
