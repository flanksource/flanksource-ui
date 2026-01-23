import {
  tristateOutputToQueryFilterParam,
  tristateOutputToQueryParamValue,
  tristateToTagSelector
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { AVATAR_INFO } from "../../constants";
import { apiBase, IncidentCommander, NotificationAPI } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import {
  NotificationRules,
  NotificationSendHistoryApiResponse,
  NotificationSendHistoryDetailApiResponse,
  NotificationSendHistorySummary,
  NotificationSilenceItem,
  NotificationSilenceItemApiResponse,
  SilenceSaveRequest
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

type NotificationSendHistorySummaryRequest = {
  status?: string;
  resourceType?: string;
  resourceKind?: string;
  search?: string;
  tags?: string;
  includeDeletedResources?: boolean;
  pageIndex?: number;
  pageSize?: number;
};

type NotificationSendHistorySummaryResponse = {
  total: number;
  results: NotificationSendHistorySummary[];
};

export const getNotificationSendHistorySummary = async ({
  pageIndex,
  pageSize,
  resourceType,
  resourceKind,
  status,
  search,
  tags,
  includeDeletedResources
}: NotificationQueryFilterOptions & {
  status?: string;
  resourceType?: string;
  resourceKind?: string;
  search?: string;
  tags?: string;
  includeDeletedResources?: boolean;
}) => {
  const payload: NotificationSendHistorySummaryRequest = {
    search: search,
    includeDeletedResources: includeDeletedResources,
    pageIndex: pageIndex,
    pageSize: pageSize
  };

  if (status) {
    payload.status = tristateOutputToQueryParamValue(status);
  }

  if (resourceType) {
    const resourceTypeValue = tristateOutputToQueryParamValue(resourceType);
    if (resourceTypeValue) {
      payload.resourceType = resourceTypeValue.replaceAll("__", "::");
    }
  }

  if (resourceKind) {
    payload.resourceKind = tristateOutputToQueryParamValue(resourceKind);
  }

  if (tags) {
    payload.tags = tristateToTagSelector(tags);
  }

  const res = await apiBase.post<NotificationSendHistorySummaryResponse>(
    `/notification/summary`,
    payload,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return res.data;
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
  return res.data ? res.data?.[0] : null;
};

export const silenceNotification = async (data: SilenceSaveRequest) => {
  const res = await NotificationAPI.post("/silence", data);
  return res.data;
};

export const updateNotificationSilence = async (
  data: Omit<NotificationSilenceItem, "created_at">
) => {
  if (data.until === "indefinitely") {
    data["until"] = null;
  }

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
  resourceKind,
  status,
  resourceID,
  search
}: NotificationQueryFilterOptions & {
  status?: string;
  resourceID?: string;
  resourceType?: string;
  resourceKind?: string;
  search?: string;
}) => {
  const pagingParams = getPagingParams({ pageIndex, pageSize });

  const resourceTypeParam = resourceType
    ? tristateOutputToQueryFilterParam(
        resourceType,
        "resource_type"
      ).replaceAll("__", "::")
    : "";

  const resourceKindParam = resourceKind
    ? tristateOutputToQueryFilterParam(resourceKind, "resource_kind")
    : "";

  const statusParam = status
    ? tristateOutputToQueryFilterParam(status, "status")
    : "";

  const selectColumns = [
    "*"
    // `person:person_id(${AVATAR_INFO})`
  ].join(",");

  const searchFilter = search ? `&resource->>name.filter=${search}` : "";

  const resourceIDFilter = resourceID ? `&resource_id=eq.${resourceID}` : "";

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<NotificationSendHistoryApiResponse[] | null>(
      `/notification_send_history_summary?select=${selectColumns}&order=created_at.desc${pagingParams}${resourceTypeParam}${resourceKindParam}${statusParam}${searchFilter}${resourceIDFilter}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export type NotificationResourceTypeItem = {
  resource_type: string;
  count?: number;
};

export const getNotificationResourceTypes = async () => {
  const res = await IncidentCommander.get<
    NotificationResourceTypeItem[] | null
  >(`/notification_send_history_resource_types?select=resource_type`);

  return (res.data ?? [])
    .map((item) => item.resource_type)
    .filter((value): value is string => Boolean(value))
    .map((resource_type) => ({ resource_type }));
};

export type NotificationResourceTagItem = {
  key: string;
  value: string;
};

export const getNotificationResourceTags = async () => {
  const res = await IncidentCommander.get<NotificationResourceTagItem[] | null>(
    `/notification_send_history_resource_tags?select=key,value`
  );
  return res.data ?? [];
};

export const getNotificationSendHistoryById = async (id: string) => {
  const res =
    await NotificationAPI.get<NotificationSendHistoryDetailApiResponse>(
      `/send_history/${id}`
    );
  return res.data;
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
  return res.data?.[0] ?? null;
};

export const getNotificationSilencesHistory = async ({
  pageIndex = 0,
  pageSize = 10,
  component_id,
  config_id,
  check_id,
  canary_id,
  filter,
  selectors
}: {
  pageIndex?: number;
  pageSize?: number;
  component_id?: string;
  config_id?: string;
  check_id?: string;
  canary_id?: string;
  filter?: string;
  selectors?: string;
}) => {
  const pagingParams = getPagingParams({ pageIndex, pageSize });

  const selectColumns = [
    "*",
    "checks:check_id(id,name,type,status)",
    "catalog:config_id(id,name,type,config_class)",
    "component:component_id(id,name,icon)",
    `createdBy:created_by(${AVATAR_INFO})`
  ].join(",");

  // Filter for past 15 days
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  const dateFilter = `&created_at=gte.${fifteenDaysAgo.toISOString()}`;

  // Build filters based on provided criteria
  let filters = "";
  if (component_id) {
    filters += `&component_id=eq.${component_id}`;
  }
  if (config_id) {
    filters += `&config_id=eq.${config_id}`;
  }
  if (check_id) {
    filters += `&check_id=eq.${check_id}`;
  }
  if (canary_id) {
    filters += `&canary_id=eq.${canary_id}`;
  }
  if (filter) {
    filters += `&filter=eq.${encodeURIComponent(filter)}`;
  }
  if (selectors) {
    filters += `&selectors=eq.${encodeURIComponent(selectors)}`;
  }

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<NotificationSilenceItemApiResponse[] | null>(
      `/notification_silences?select=${selectColumns}&order=created_at.desc${pagingParams}&deleted_at=is.null${dateFilter}${filters}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getNotificationSilencePreview = async ({
  resource_id,
  filter,
  selector,
  recursive
}: {
  resource_id?: string;
  filter?: string;
  selector?: string;
  recursive?: boolean;
}) => {
  const params = new URLSearchParams();

  if (resource_id) {
    params.append("id", resource_id);
  }
  if (filter) {
    params.append("filter", filter);
  }
  if (selector) {
    params.append("selectors", selector);
  }
  if (recursive) {
    params.append("recursive", "true");
  }

  const res = await NotificationAPI.get(
    `/silence_preview?${params.toString()}`
  );
  return res.data;
};

export const deleteNotificationSilence = async (id: string) => {
  return IncidentCommander.patch<NotificationSilenceItem>(
    `/notification_silences?id=eq.${id}`,
    {
      deleted_at: "now()"
    }
  );
};
