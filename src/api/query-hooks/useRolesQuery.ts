import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRole,
  getRoleBindingNamesForRole,
  getRoles,
  updateRole
} from "../services/roles";

export function useRolesQuery(enabled = true) {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled
  });
}

export function useRoleBindingNamesForRoleQuery(
  namespace?: string | null,
  role?: string
) {
  return useQuery({
    queryKey: ["role-bindings", "by-role", namespace, role],
    queryFn: () => getRoleBindingNamesForRole(namespace!, role!),
    enabled: !!namespace && !!role
  });
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    }
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    }
  });
}
