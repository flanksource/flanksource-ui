import { useQuery } from "@tanstack/react-query";

export default function useConfigRelationshipsCount(configId: string) {
  return useQuery({
    queryKey: ["configRelationshipsCount", configId],
    queryFn: () => {
      // we want to return the count of relationships for this config
    }
  });
}
