import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoleBindingNamedSubject } from "../types/roleBindings";
import {
  createRoleBinding,
  getRoleBindings,
  updateRoleBinding
} from "../services/roleBindings";

export function useRoleBindingsQuery(subject?: RoleBindingNamedSubject) {
  return useQuery({
    queryKey: ["role-bindings", subject?.field, subject?.name],
    queryFn: () => getRoleBindings(subject)
  });
}

export function useCreateRoleBindingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoleBinding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-bindings"] });
    }
  });
}

export function useUpdateRoleBindingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoleBinding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-bindings"] });
    }
  });
}
