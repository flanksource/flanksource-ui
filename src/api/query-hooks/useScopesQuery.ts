import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getScopes,
  getScopeById,
  createScope,
  updateScope,
  deleteScope
} from "../services/scopes";
import { ScopeDB } from "../types/scopes";

export function useScopesQuery(params?: any) {
  return useQuery({
    queryKey: ["scopes", params],
    queryFn: () => getScopes(params).then((res) => res.data)
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
    mutationFn: ({ id, data }: { id: string; data: Partial<ScopeDB> }) =>
      updateScope(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scopes"] });
    }
  });
}

export function useDeleteScopeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scopes"] });
    }
  });
}
