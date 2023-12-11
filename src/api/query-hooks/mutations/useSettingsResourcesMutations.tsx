import { UseMutationOptions, useMutation } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteResource(resourceInfo, id);
    },
    onSuccess: () => {
      toastSuccess(`${resourceInfo.name} deleted successfully`);
    },
    onError: (ex: any) => {
      toastError(ex);
    },
    ...options
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
  return useMutation({
    mutationFn: async (props: Partial<SchemaResourceI>) => {
      await updateResource(resourceInfo, {
        ...resource,
        ...props
      });
    },
    onSuccess: () => {
      toastSuccess(`${resourceInfo.name} updated successfully`);
    },
    onError: (ex: any) => {
      toastError(ex);
    },
    ...options
  });
};

export const useSettingsCreateResource = (
  resourceInfo: SchemaApi,
  onSuccess = () => {}
) => {
  const { user } = useUser();

  return useMutation(
    async (data: Partial<SchemaResourceI>) => {
      await createResource(resourceInfo, {
        ...data,
        created_by: user?.id
      });
    },
    {
      onSuccess: onSuccess,
      onError: (ex: any) => {
        toastError(ex);
      }
    }
  );
};
