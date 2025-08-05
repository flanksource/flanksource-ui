import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getTokensList, Token } from "../services/tokens";

export function useTokensListQuery(options?: UseQueryOptions<Token[], Error>) {
  return useQuery<Token[], Error>(
    ["tokens", "list"],
    () => getTokensList(),
    options
  );
}
