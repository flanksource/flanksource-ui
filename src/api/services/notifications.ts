import { NotificationRules } from "@flanksource-ui/components/Notifications/Rules/notificationsRulesTableColumns";
import { AVATAR_INFO } from "../../constants";
import { IncidentCommander, NotificationAPI } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import {
  NotificationSendHistoryApiResponse,
  NotificationSilenceItemApiResponse,
  SilenceNotificationResponse
} from "../types/notifications";

export function getPagingParams({
  pageIndex,
  pageSize
}: {
  pageIndex?: number;
  pageSize?: number;
}) {
  const pagingParams =
    pageIndex || pageSize
      ? `&limit=${pageSize}&offset=${pageIndex! * pageSize!}`
      : "";
  return pagingParams;
}

export const getNotificationsSummary = async ({
  pageIndex,
  pageSize
}: NotificationQueryFilterOptions) => {
  const pagingParams = getPagingParams({ pageIndex, pageSize });

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<NotificationRules[] | null>(
      `/notifications_summary?select=*,person:person_id(${AVATAR_INFO}),team:team_id(id,name,icon),created_by(${AVATAR_INFO})&order=created_at.desc${pagingParams}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getNotificationById = async (id: string) => {
  const res = await IncidentCommander.get<NotificationRules[] | null>(
    `/notifications?id=eq.${id}&select=*,person:person_id(${AVATAR_INFO}),team:team_id(id,name,icon),created_by(${AVATAR_INFO})`
  );
  return res.data ? res.data?.[0] : undefined;
};

export const silenceNotification = async (
  data: SilenceNotificationResponse
) => {
  const res = await NotificationAPI.post("/silence", data);
  return res.data;
};

export const getNotificationSendHistory = async ({
  pageIndex,
  pageSize
}: NotificationQueryFilterOptions) => {
  const pagingParams = getPagingParams({ pageIndex, pageSize });
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<NotificationSendHistoryApiResponse[] | null>(
      `/notification_send_history?select=*,person:person_id(${AVATAR_INFO})&order=created_at.desc${pagingParams}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export type NotificationQueryFilterOptions = {
  pageIndex: number;
  pageSize: number;
};

export const getNotificationSilences = async ({
  pageIndex,
  pageSize
}: NotificationQueryFilterOptions) => {
  const pagingParams = getPagingParams({ pageIndex, pageSize });
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<NotificationSilenceItemApiResponse[] | null>(
      `/notification_silences?select=*,checks:check_id(id,name,type,status),catalog:config_id(id,name,type,config_class),component:component_id(id,name,icon),createdBy:created_by(${AVATAR_INFO})&order=created_at.desc${pagingParams}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};
