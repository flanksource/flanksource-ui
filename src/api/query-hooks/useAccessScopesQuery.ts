import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccessScopes,
  getAccessScopeById,
  createAccessScope,
  updateAccessScope,
  deleteAccessScope
} from "../services/accessScopes";
import { AccessScopeDB } from "../types/accessScopes";

export function useAccessScopesQuery(params?: any) {
  return useQuery({
    queryKey: ["access_scopes", params],
    queryFn: () => getAccessScopes(params).then((res) => res.data)
  });
}

export function useAccessScopeQuery(id?: string) {
  return useQuery({
    queryKey: ["access_scope", id],
    queryFn: () => getAccessScopeById(id!),
    enabled: !!id
  });
}

export function useCreateAccessScopeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccessScope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access_scopes"] });
    }
  });
}

export function useUpdateAccessScopeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccessScopeDB> }) =>
      updateAccessScope(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access_scopes"] });
    }
  });
}

export function useDeleteAccessScopeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccessScope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access_scopes"] });
    }
  });
}
