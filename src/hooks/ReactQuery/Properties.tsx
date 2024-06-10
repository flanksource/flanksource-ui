import { fetchFeatureFlagsAPI } from "@flanksource-ui/api/services/properties";
import { useQuery } from "@tanstack/react-query";

export function useUISnippets() {
  return useQuery({
    queryKey: ["ui-snippets", "properties"],
    queryFn: async () => {
      const featureFlags = await fetchFeatureFlagsAPI();
      return featureFlags.data?.find((flag) => {
        return flag.name === "flanksource.ui.snippets";
      });
    }
  });
}
