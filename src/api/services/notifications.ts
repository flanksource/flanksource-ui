import { tristateOutputToQueryFilterParam } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { AVATAR_INFO } from "../../constants";
import { IncidentCommander, NotificationAPI } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import {
  NotificationRules,
  NotificationSendHistoryApiResponse,
  NotificationSilenceItem,
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

export function appendPagingParamsToSearchParams(
  params: URLSearchParams,
  {
    pageIndex,
    pageSize
  }: {
    pageIndex?: number;
    pageSize?: number;
  }
) {
  if (pageIndex || pageSize) {
    params.append("limit", pageSize!.toString());
    params.append("offset", (pageIndex! * pageSize!).toString());
  }
}

export const getNotificationsSummary = async ({
  pageIndex,
  pageSize,
  sortBy,
  sortOrder
}: NotificationQueryFilterOptions) => {
  const pagingParams = getPagingParams({ pageIndex, pageSize });

  const selectColumns = [
    "*",
    `person:person_id(${AVATAR_INFO})`,
    `team:team_id(id,name,icon)`,
    `created_by(${AVATAR_INFO})`
  ].join(",");

  const sortParams = sortBy
    ? `&order=${sortBy}.${sortOrder}`
    : "&order=created_at.desc";

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<NotificationRules[] | null>(
      `/notifications_summary?select=${selectColumns}${sortParams}${pagingParams}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getNotificationById = async (id: string) => {
  const selectColumns = [
    "*",
    `person:person_id(${AVATAR_INFO})`,
    `team:team_id(id,name,icon)`,
    `created_by(${AVATAR_INFO})`
  ].join(",");
  const res = await IncidentCommander.get<NotificationRules[] | null>(
    `/notifications?id=eq.${id}&select=${selectColumns}`
  );
  return res.data ? res.data?.[0] : undefined;
};

export const silenceNotification = async (
  data: SilenceNotificationResponse
) => {
  const res = await NotificationAPI.post("/silence", data);
  return res.data;
};

export const updateNotificationSilence = async (
  data: Omit<NotificationSilenceItem, "created_at">
) => {
  const res = await IncidentCommander.patch(
    `/notification_silences?id=eq.${data.id}`,
    data
  );
  return res.data;
};

export const getNotificationSendHistory = async ({
  pageIndex,
  pageSize,
  resourceType,
  status
}: NotificationQueryFilterOptions & {
  status?: string;
  resourceType?: string;
}) => {
  const pagingParams = getPagingParams({ pageIndex, pageSize });

  const resourceTypeParam = resourceType
    ? tristateOutputToQueryFilterParam(resourceType, "resource_type")
    : "";

  const statusParam = status
    ? tristateOutputToQueryFilterParam(status, "status")
    : "";

  const selectColumns = [
    "*"
    // `person:person_id(${AVATAR_INFO})`
  ].join(",");

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<NotificationSendHistoryApiResponse[] | null>(
      // currently, this isn't deployed to production
      `/notification_send_history_summary?select=${selectColumns}&order=created_at.desc${pagingParams}${resourceTypeParam}${statusParam}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getNotificationSendHistoryById = async (id: string) => {
  const selectColumns = [
    "*"
    // `notification:notification_id(*,notification_type)`
  ].join(",");

  const res = await IncidentCommander.get<NotificationSendHistoryApiResponse[]>(
    `/notification_send_history_summary?id=eq.${id}&select=${selectColumns}`
  );
  return res.data?.[0];
};

export type NotificationQueryFilterOptions = {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const getNotificationSilences = async ({
  pageIndex,
  pageSize,
  sortBy,
  sortOrder
}: NotificationQueryFilterOptions) => {
  const pagingParams = getPagingParams({ pageIndex, pageSize });

  const selectColumns = [
    "*",
    "checks:check_id(id,name,type,status)",
    "catalog:config_id(id,name,type,config_class)",
    "component:component_id(id,name,icon)",
    `createdBy:created_by(${AVATAR_INFO})`
  ].join(",");

  const sortParams = sortBy ? `&order=${sortBy}.${sortOrder}` : "";

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<NotificationSilenceItemApiResponse[] | null>(
      `/notification_silences?select=${selectColumns}&order=created_at.desc${pagingParams}&deleted_at=is.null&${sortParams}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getNotificationSilencesByID = async (id: string) => {
  const selectColumns = ["*"].join(",");

  const res = await IncidentCommander.get<NotificationSilenceItem[] | null>(
    `/notification_silences?select=${selectColumns}&order=created_at.desc&id=eq.${id}`,
    {
      headers: {
        Prefer: "count=exact"
      }
    }
  );
  return res.data?.[0] ?? undefined;
};

export const deleteNotificationSilence = async (id: string) => {
  return IncidentCommander.patch<NotificationSilenceItem>(
    `/notification_silences?id=eq.${id}`,
    {
      deleted_at: "now()"
    }
  );
};
