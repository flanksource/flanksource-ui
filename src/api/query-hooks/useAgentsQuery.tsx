import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AgentSummary } from "../../components/Agents/AgentPage";
import { getAgentsList } from "../services/agents";
import { DatabaseResponse } from "./useNotificationsQuery";

export function useAgentsListQuery(
  params: { sortBy?: string; sortOrder?: string } = {},
  pagingParams: { pageIndex?: number; pageSize?: number } = {},
  options?: UseQueryOptions<DatabaseResponse<AgentSummary>, Error>
) {
  return useQuery<DatabaseResponse<AgentSummary>, Error>(
    ["agents", "list"],
    () => getAgentsList(params, pagingParams),
    options
  );
}
