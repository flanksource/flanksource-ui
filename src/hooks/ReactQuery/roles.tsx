import { fetchPeopleRoles } from "@flanksource-ui/api/services/users";
import { Roles } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { useQuery } from "@tanstack/react-query";

export function usePeopleRoles(userId?: string) {
  return useQuery({
    queryKey: ["people-roles", "roles", userId],
    queryFn: async () => {
      const roles = await fetchPeopleRoles([userId!]);
      return roles.data || [];
    },
    cacheTime: 0,
    staleTime: 0,
    enabled: !!userId,
    select: (data) => {
      const roles = data.find((item) => item.id === userId)?.roles || [];
      if (!roles.length) {
        return [Roles.viewer];
      }
      return roles;
    }
  });
}
