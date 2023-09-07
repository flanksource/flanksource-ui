import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getNotificationById,
  getNotificationsSummary
} from "../services/notifications";
import {
  NewNotification,
  Notification,
  UpdateNotification
} from "../../components/Notifications/notificationsTableColumns";
import { createResource, updateResource } from "../schemaResources";
import { toastError, toastSuccess } from "../../components/Toast/toast";
import { useUser } from "../../context";

type Response =
  | { error: Error; data: null; totalEntries: undefined }
  | {
      data: Notification[] | null;
      totalEntries?: number | undefined;
      error: null;
    };

export function useNotificationsSummaryQuery(
  options?: UseQueryOptions<Response, Error>
) {
  return useQuery<Response, Error>(
    ["notifications", "settings"],
    () => getNotificationsSummary(),
    options
  );
}

export function useGetNotificationsByIDQuery(
  id: string,
  options?: UseQueryOptions<Notification | undefined, Error>
) {
  return useQuery<Notification | undefined, Error>(
    ["notifications", "settings", id],
    () => getNotificationById(id),
    options
  );
}

export const useUpdateNotification = (onSuccess = () => {}) => {
  return useMutation(
    async (props: Partial<UpdateNotification>) => {
      const payload = {
        ...props,
        // we want to remove person id, team id and custom services if they are
        // empty and only be left with one of them
        person_id: props.person_id ?? null,
        team_id: props.team_id ?? null,
        custom_services: props.custom_services ?? null
      };

      await updateResource(
        {
          api: "config-db",
          table: "notifications"
        },
        payload
      );
    },
    {
      onSuccess: () => {
        toastSuccess(`Notification updated successfully`);
        onSuccess();
      },
      onError: (ex: any) => {
        toastError(ex);
      }
    }
  );
};

export const useCreateNotification = (onSuccess = () => {}) => {
  const { user } = useUser();

  return useMutation(
    async (data: Partial<NewNotification>) => {
      await createResource(
        {
          api: "config-db",
          table: "notifications"
        },
        {
          ...data,
          created_by: user?.id
        }
      );
    },
    {
      onSuccess: onSuccess,
      onError: (ex: any) => {
        toastError(ex);
      }
    }
  );
};
