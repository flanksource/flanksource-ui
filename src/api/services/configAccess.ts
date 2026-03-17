import { tristateOutputToQueryParamValue } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { ConfigDB } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import {
  ConfigAccessLog,
  ConfigAccessSummary,
  ConfigAccessSummaryByConfig,
  ConfigAccessSummaryByUser
} from "../types/configs";

export type GetConfigAccessSummaryParams = {
  configId?: string;
  configType?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  arbitraryFilter?: Record<string, string>;
};

export type ConfigAccessSummaryFilterParams = Pick<
  GetConfigAccessSummaryParams,
  "configType" | "arbitraryFilter"
>;

function applyConfigAccessSummaryFilters(
  queryParams: URLSearchParams,
  { configType, arbitraryFilter }: ConfigAccessSummaryFilterParams = {}
) {
  if (configType) {
    queryParams.set("config_type", `eq.${configType}`);
  }

  if (arbitraryFilter) {
    Object.entries(arbitraryFilter).forEach(([key, value]) => {
      const filterExpression = tristateOutputToQueryParamValue(value);

      if (filterExpression) {
        queryParams.set(`${key}.filter`, filterExpression);
      }
    });
  }
}

export const getConfigAccessSummary = ({
  configId,
  configType,
  pageIndex,
  pageSize,
  sortBy = "user",
  sortOrder = "asc",
  arbitraryFilter
}: GetConfigAccessSummaryParams = {}) => {
  const queryParams = new URLSearchParams();

  queryParams.set(
    "select",
    "config_id,config_name,config_type,user,email,role,user_type,external_group_id,last_signed_in_at,last_reviewed_at,created_at"
  );

  if (configId) {
    queryParams.set("config_id", `eq.${configId}`);
  }

  applyConfigAccessSummaryFilters(queryParams, { configType, arbitraryFilter });

  if (pageIndex !== undefined && pageSize !== undefined) {
    queryParams.set("limit", pageSize.toString());
    queryParams.set("offset", `${pageIndex * pageSize}`);
  }

  const sortableFieldMap: Record<string, string> = {
    config: "config_name",
    config_name: "config_name",
    config_type: "config_type",
    user: "user",
    email: "email",
    role: "role",
    user_type: "user_type",
    access: "external_group_id",
    external_group_id: "external_group_id",
    last_signed_in_at: "last_signed_in_at",
    last_reviewed_at: "last_reviewed_at",
    created_at: "created_at"
  };

  const safeSortBy = sortableFieldMap[sortBy] ?? "user";
  queryParams.set("order", `${safeSortBy}.${sortOrder}`);

  return resolvePostGrestRequestWithPagination<ConfigAccessSummary[]>(
    ConfigDB.get(`/config_access_summary?${queryParams.toString()}`, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
};

export type GetConfigAccessGroupedParams = {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const getConfigAccessSummaryByUser = ({
  pageIndex,
  pageSize,
  sortBy = "access_count",
  sortOrder = "desc"
}: GetConfigAccessGroupedParams = {}) => {
  const queryParams = new URLSearchParams();

  queryParams.set(
    "select",
    "user,email,access_count,distinct_roles,distinct_configs,last_signed_in_at,latest_grant"
  );

  if (pageIndex !== undefined && pageSize !== undefined) {
    queryParams.set("limit", pageSize.toString());
    queryParams.set("offset", `${pageIndex * pageSize}`);
  }

  const sortableFieldMap: Record<string, string> = {
    user: "user",
    email: "email",
    access_count: "access_count",
    distinct_roles: "distinct_roles",
    distinct_configs: "distinct_configs",
    last_signed_in_at: "last_signed_in_at",
    latest_grant: "latest_grant"
  };

  const safeSortBy = sortableFieldMap[sortBy] ?? "access_count";
  queryParams.set("order", `${safeSortBy}.${sortOrder}`);

  return resolvePostGrestRequestWithPagination<ConfigAccessSummaryByUser[]>(
    ConfigDB.get(`/config_access_summary_by_user?${queryParams.toString()}`, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
};

export const getConfigAccessSummaryByConfig = ({
  pageIndex,
  pageSize,
  sortBy = "access_count",
  sortOrder = "desc"
}: GetConfigAccessGroupedParams = {}) => {
  const queryParams = new URLSearchParams();

  queryParams.set(
    "select",
    "config_id,config_name,config_type,access_count,distinct_users,distinct_roles,last_signed_in_at,latest_grant"
  );

  if (pageIndex !== undefined && pageSize !== undefined) {
    queryParams.set("limit", pageSize.toString());
    queryParams.set("offset", `${pageIndex * pageSize}`);
  }

  const sortableFieldMap: Record<string, string> = {
    config_name: "config_name",
    config_type: "config_type",
    access_count: "access_count",
    distinct_users: "distinct_users",
    distinct_roles: "distinct_roles",
    last_signed_in_at: "last_signed_in_at",
    latest_grant: "latest_grant"
  };

  const safeSortBy = sortableFieldMap[sortBy] ?? "access_count";
  queryParams.set("order", `${safeSortBy}.${sortOrder}`);

  return resolvePostGrestRequestWithPagination<ConfigAccessSummaryByConfig[]>(
    ConfigDB.get(`/config_access_summary_by_config?${queryParams.toString()}`, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
};

export const getConfigAccessLogs = (configId: string) =>
  resolvePostGrestRequestWithPagination<ConfigAccessLog[]>(
    ConfigDB.get(
      `/config_access_logs?config_id=eq.${encodeURIComponent(
        configId
      )}&select=*,external_users(name,user_email:email)&order=${encodeURIComponent(
        "created_at.desc"
      )}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );

export type ConfigAccessSummaryCatalogFilterItem = {
  config_id: string;
  config_name: string;
  config_type: string;
};

export const getConfigAccessSummaryCatalogFilter = async (
  params: ConfigAccessSummaryFilterParams = {}
) => {
  const queryParams = new URLSearchParams();

  queryParams.set("select", "config_id,config_name,config_type");
  queryParams.set("order", "config_name.asc");
  applyConfigAccessSummaryFilters(queryParams, params);

  const res = await ConfigDB.get<ConfigAccessSummaryCatalogFilterItem[] | null>(
    `/config_access_summary?${queryParams.toString()}`
  );

  const deduped = new Map<string, ConfigAccessSummaryCatalogFilterItem>();

  (res.data ?? []).forEach((item) => {
    if (!item.config_id || !item.config_name) {
      return;
    }

    if (!deduped.has(item.config_id)) {
      deduped.set(item.config_id, item);
    }
  });

  return Array.from(deduped.values());
};

export type ConfigAccessSummaryUserFilterItem = {
  user: string;
  email?: string | null;
};

export const getConfigAccessSummaryUsersFilter = async (
  params: ConfigAccessSummaryFilterParams = {}
) => {
  const queryParams = new URLSearchParams();

  queryParams.set("select", "user,email");
  queryParams.set("order", "user.asc");
  applyConfigAccessSummaryFilters(queryParams, params);

  const res = await ConfigDB.get<ConfigAccessSummaryUserFilterItem[] | null>(
    `/config_access_summary?${queryParams.toString()}`
  );

  const deduped = new Map<string, ConfigAccessSummaryUserFilterItem>();

  (res.data ?? []).forEach((item) => {
    if (!item.user) {
      return;
    }

    const key = `${item.user}__${item.email ?? ""}`;

    if (!deduped.has(key)) {
      deduped.set(key, item);
    }
  });

  return Array.from(deduped.values());
};

export type ConfigAccessSummaryRoleFilterItem = {
  role: string;
};

export const getConfigAccessSummaryRolesFilter = async (
  params: ConfigAccessSummaryFilterParams = {}
) => {
  const queryParams = new URLSearchParams();

  queryParams.set("select", "role");
  queryParams.set("role", "not.is.null");
  queryParams.set("order", "role.asc");
  applyConfigAccessSummaryFilters(queryParams, params);

  const res = await ConfigDB.get<ConfigAccessSummaryRoleFilterItem[] | null>(
    `/config_access_summary?${queryParams.toString()}`
  );

  const deduped = new Set<string>();

  (res.data ?? []).forEach((item) => {
    if (item.role) {
      deduped.add(item.role);
    }
  });

  return Array.from(deduped).map((role) => ({ role }));
};
