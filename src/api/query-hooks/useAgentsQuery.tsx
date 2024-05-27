import { AgentSummary } from "@flanksource-ui/components/Agents/AgentPage";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getAgentsList, getAgentsSummaryByID } from "../services/agents";
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

export function useAgentQuery(
  id: string,
  options?: UseQueryOptions<AgentSummary | undefined, Error>
) {
  return useQuery<AgentSummary | undefined, Error>(
    ["agents", id],
    () => getAgentsSummaryByID(id),
    options
  );
}
