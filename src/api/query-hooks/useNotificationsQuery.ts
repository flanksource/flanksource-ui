import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  NewNotificationRule,
  NotificationRules,
  UpdateNotificationRule
} from "../../components/Notifications/Rules/notificationsRulesTableColumns";
import { toastError, toastSuccess } from "../../components/Toast/toast";
import { useUser } from "../../context";
import { createResource, updateResource } from "../schemaResources";
import {
  getNotificationById,
  getNotificationsSummary
} from "../services/notifications";

export type DatabaseResponse<T extends Record<string, any>> =
  | { error: Error; data: null; totalEntries: undefined }
  | {
      data: T[] | null;
      totalEntries?: number | undefined;
      error: null;
    };

export function useNotificationsSummaryQuery(
  options?: UseQueryOptions<DatabaseResponse<NotificationRules>, Error>
) {
  return useQuery<DatabaseResponse<NotificationRules>, Error>(
    ["notifications", "settings"],
    () => getNotificationsSummary(),
    options
  );
}

export function useGetNotificationsByIDQuery(
  id: string,
  options?: UseQueryOptions<NotificationRules | undefined, Error>
) {
  return useQuery<NotificationRules | undefined, Error>(
    ["notifications", "settings", id],
    () => getNotificationById(id),
    options
  );
}

export const useUpdateNotification = (onSuccess = () => {}) => {
  return useMutation(
    async (props: Partial<UpdateNotificationRule>) => {
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
          table: "notifications",
          name: "Notifications"
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
    async (data: Partial<NewNotificationRule>) => {
      await createResource(
        {
          api: "config-db",
          table: "notifications",
          name: "Notifications"
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
