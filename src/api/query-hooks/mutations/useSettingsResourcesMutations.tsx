import {
  UseMutationOptions,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import {
  SchemaApi,
  SchemaResourceType
} from "../../../components/SchemaResourcePage/resourceTypes";
import { toastError, toastSuccess } from "../../../components/Toast/toast";
import { useUser } from "../../../context";
import {
  SchemaResourceI,
  createResource,
  deleteResource,
  updateResource
} from "../../schemaResources";

export const useSettingsDeleteResource = (
  resourceInfo: Pick<SchemaResourceType, "name" | "table" | "api">,
  options: Omit<UseMutationOptions<void, Error, any>, "mutationFn"> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    onError: (ex: any) => {
      toastError(ex);
    },
    ...options,
    mutationFn: async (id: string) => {
      await deleteResource(resourceInfo, id);
    },
    // Callers' onSuccess replaces the toast, but the lists must refresh either way
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ["settings"] });
      if (options.onSuccess) {
        return options.onSuccess(...args);
      }
      toastSuccess(`${resourceInfo.name} deleted successfully`);
    }
  });
};

export const useSettingsUpdateResource = (
  resourceInfo: Pick<SchemaResourceType, "api" | "table" | "name">,
  resource?: Record<string, any>,
  options: Omit<
    UseMutationOptions<void, any, Partial<SchemaResourceI>>,
    "mutationFn"
  > = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    onError: (ex: any) => {
      toastError(ex);
    },
    ...options,
    mutationFn: async (props: Partial<SchemaResourceI>) => {
      await updateResource(resourceInfo, {
        ...resource,
        ...props
      });
    },
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ["settings"] });
      if (options.onSuccess) {
        return options.onSuccess(...args);
      }
      toastSuccess(`${resourceInfo.name} updated successfully`);
    }
  });
};

export const useSettingsCreateResource = (
  resourceInfo: SchemaApi,
  onSuccess = () => {}
) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation(
    async (data: Partial<SchemaResourceI>) => {
      await createResource(resourceInfo, {
        ...data,
        created_by: user?.id
      });
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ["settings"] });
        onSuccess();
      },
      onError: (ex: any) => {
        toastError(ex);
      }
    }
  );
};
