import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SchemaResourceType } from "../../../components/SchemaResourcePage/resourceTypes";
import { toastSuccess, toastError } from "../../../components/Toast/toast";
import {
  SchemaResourceI,
  deleteResource,
  updateResource
} from "../../schemaResources";
import { useNavigate } from "react-router-dom";

export const useSettingsDeleteResource = (resourceInfo: SchemaResourceType) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      await deleteResource(resourceInfo, id);
    },
    {
      onSuccess: () => {
        // force refetch of all resources
        queryClient.refetchQueries(["settings", "all", resourceInfo]);
        toastSuccess(`${resourceInfo.name} deleted successfully`);
        navigate(`/settings/${resourceInfo.table}`);
      },
      onError: (ex: any) => {
        toastError(ex);
      }
    }
  );
};

export const useSettingsUpdateResource = (
  resourceInfo: SchemaResourceType,
  resource?: Record<string, any>
) => {
  const navigate = useNavigate();

  return useMutation(
    async (props: Partial<SchemaResourceI>) => {
      await updateResource(resourceInfo, {
        ...resource,
        ...props
      });
    },
    {
      onSuccess: () => {
        toastSuccess(`${resourceInfo.name} updated successfully`);
        navigate(`/settings/${resourceInfo.table}`);
      },
      onError: (ex: any) => {
        toastError(ex);
      }
    }
  );
};
