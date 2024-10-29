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
    cacheTime: 600 * 1000,
    staleTime: 3600 * 1000,
    enabled: !!userId,
    select: (data) => {
      const roles = data.find((item) => item.id === userId)?.roles || [];
      if (!roles.length) {
        return {
          isLoaded: true,
          roles: [Roles.viewer]
        };
      }
      return {
        isLoaded: true,
        roles: roles
      };
    }
  });
}
