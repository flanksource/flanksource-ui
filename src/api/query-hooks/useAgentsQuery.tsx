import { AgentSummary } from "@flanksource-ui/components/Agents/AgentPage";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAgentsList, getAgentsSummaryByID } from "../services/agents";
import { DatabaseResponse } from "./useNotificationsQuery";

export function useAgentsListQuery(
  pagingParams: { pageIndex?: number; pageSize?: number } = {},
  options?: UseQueryOptions<DatabaseResponse<AgentSummary>, Error>
) {
  const [searchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  return useQuery<DatabaseResponse<AgentSummary>, Error>(
    ["agents", "list", sortBy, sortOrder, pagingParams],
    () =>
      getAgentsList(
        {
          sortBy,
          sortOrder
        },
        pagingParams
      ),
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
