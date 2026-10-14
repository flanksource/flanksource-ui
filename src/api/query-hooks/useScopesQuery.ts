import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getScopes,
  getScopeById,
  createScope,
  updateScope
} from "../services/scopes";

export function useScopesQuery(params?: any, enabled = true) {
  return useQuery({
    queryKey: ["scopes", params],
    queryFn: () => getScopes(params).then((res) => res.data),
    enabled
  });
}

export function useScopeQuery(id?: string) {
  return useQuery({
    queryKey: ["scope", id],
    queryFn: () => getScopeById(id!),
    enabled: !!id
  });
}

export function useCreateScopeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createScope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scopes"] });
    }
  });
}

export function useUpdateScopeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateScope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scopes"] });
    }
  });
}
