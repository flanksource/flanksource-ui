import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  isModal = false
) => {
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
        if (!isModal) {
          navigate(`/settings/${resourceInfo.table}`);
        }
      },
      onError: (ex: any) => {
        toastError(ex);
      }
    }
  );
};

export const useSettingsUpdateResource = (
  resourceInfo: Pick<SchemaResourceType, "api" | "table" | "name">,
  resource?: Record<string, any>,
  isModal = false
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
        if (!isModal) {
          navigate(`/settings/${resourceInfo.table}`);
        }
      },
      onError: (ex: any) => {
        toastError(ex);
      }
    }
  );
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
