import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoleBinding,
  getRoleBindings,
  updateRoleBinding
} from "../services/roleBindings";

export function useRoleBindingsQuery() {
  return useQuery({
    queryKey: ["role-bindings"],
    queryFn: getRoleBindings
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
