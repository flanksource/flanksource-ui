import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import {
  FeatureFlag,
  PropertyDBObject
} from "@flanksource-ui/services/permissions/permissionsService";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteProperty,
  fetchFeatureFlagsAPI,
  fetchProperties,
  fetchProperty,
  saveProperty,
  updateProperty
} from "../services/properties";

export function useAllProperties() {
  return useQuery({
    queryKey: ["properties", "all"],
    queryFn: async () => {
      const res = await fetchProperties();
      return res.data ?? [];
    },
    enabled: true,
    cacheTime: 0,
    staleTime: 0
  });
}

export function useGetPropertyFromDB(featureFlag?: FeatureFlag) {
  return useQuery({
    queryKey: ["properties", featureFlag],
    queryFn: async () => {
      const res = await fetchProperty(featureFlag!.name, featureFlag!.value);
      return res.data?.[0] ?? null;
    },
    enabled: !!featureFlag,
    cacheTime: 0,
    staleTime: 0
  });
}

export function useGetFeatureFlagsFromAPI() {
  return useQuery({
    queryKey: ["feature-flags", "all", "api"],
    queryFn: async () => {
      const res = await fetchFeatureFlagsAPI();
      return res.data ?? [];
    },
    enabled: true,
    cacheTime: 0,
    staleTime: 0
  });
}

export function useAddFeatureFlag(onSuccess: () => void) {
  const user = useUser();

  return useMutation({
    mutationFn: async (data: Partial<PropertyDBObject>) => {
      const response = await saveProperty({
        ...data,
        created_by: user.user?.id
      });
      if (!response?.data) {
        throw new Error(response.error?.message);
      }
    },
    onSuccess: () => {
      toastSuccess("Feature flag added successfully");
      onSuccess();
    },
    onError: (error) => {
      toastError((error as Error).message);
    }
  });
}

export function useUpdateFeatureFlag(onSuccess: () => void) {
  const user = useUser();

  return useMutation({
    mutationFn: async (data: Partial<PropertyDBObject>) => {
      const response = await updateProperty({
        ...data,
        created_by: user.user?.id
      });
      if (!response?.data) {
        throw new Error(response.error?.message);
      }
    },
    onSuccess: () => {
      toastSuccess("Feature flag updated successfully");
      onSuccess();
    },
    onError: (error) => {
      toastError((error as Error).message);
    }
  });
}

export function useDeleteFeatureFlag(onSuccess: () => void) {
  return useMutation({
    mutationFn: async (data: Partial<PropertyDBObject>) => {
      const response = await deleteProperty(data);
      if (!response?.data) {
        throw new Error(response.error?.message);
      }
    },
    onSuccess: () => {
      toastSuccess("Feature flag removed successfully");
      onSuccess();
    },
    onError: (error) => {
      toastError((error as Error).message);
    }
  });
}
