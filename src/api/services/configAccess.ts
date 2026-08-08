import { tristateOutputToQueryParamValue } from "@flanksource-ui/lib/tristate";
import { UUID_PATTERN } from "@flanksource-ui/utils/uuid";
import { ConfigDB } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import {
  ConfigAccessLog,
  ConfigAccessSummary,
  ConfigAccessSummaryByConfig,
  ConfigAccessSummaryByUser,
  ExternalUser
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
    "config_id,config_name,config_type,external_user_id,user,email,role,user_type,external_group_id,last_signed_in_at,last_reviewed_at,created_at"
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
  configType?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const getConfigAccessSummaryByUser = ({
  configType,
  pageIndex,
  pageSize,
  sortBy = "access_count",
  sortOrder = "desc"
}: GetConfigAccessGroupedParams = {}) => {
  const queryParams = new URLSearchParams();

  queryParams.set(
    "select",
    "external_user_id,user,email,access_count,distinct_roles,distinct_configs,last_signed_in_at,latest_grant"
  );

  applyConfigAccessSummaryFilters(queryParams, { configType });

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
  configType,
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

  applyConfigAccessSummaryFilters(queryParams, { configType });

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

export type SearchExternalUsersParams = {
  query?: string;
  excludeId?: string;
  limit?: number;
};

function quotePostgrestValue(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function postgresTextArray(value: string) {
  const element = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `{"${element}"}`;
}

function escapePostgresLikePattern(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/_/g, "\\_");
}

export async function searchExternalUsers({
  query = "",
  excludeId,
  limit = 20
}: SearchExternalUsersParams = {}): Promise<ExternalUser[]> {
  const queryParams = new URLSearchParams({
    select: "id,name,email,aliases,user_type",
    deleted_at: "is.null",
    order: "name.asc.nullslast,email.asc.nullslast",
    limit: limit.toString()
  });

  if (excludeId) {
    queryParams.set("id", `neq.${excludeId}`);
  }

  // PostgREST's logical-filter syntax treats these characters as grammar.
  // Removing them keeps free-text searches from producing malformed filters.
  const rawSearch = query.trim();
  const search = rawSearch
    .replace(/[*,()%"{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (rawSearch && !search) return [];

  if (search) {
    const ilikePattern = quotePostgrestValue(
      `*${escapePostgresLikePattern(search)}*`
    );
    const filters = [
      `name.ilike.${ilikePattern}`,
      `email.ilike.${ilikePattern}`
    ];
    if (!/\s/.test(search)) {
      const alias = postgresTextArray(search.toLowerCase());
      filters.push(`aliases.cs.${quotePostgrestValue(alias)}`);
    }
    if (UUID_PATTERN.test(search)) {
      filters.push(`id.eq.${search}`);
    }
    queryParams.set("or", `(${filters.join(",")})`);
  }

  const response = await ConfigDB.get<ExternalUser[]>(
    `/external_users?${queryParams.toString()}`
  );
  return response.data ?? [];
}

export type AddExternalUserAliasParams = {
  externalUserId: string;
  alias: string;
  createdBy?: string;
};

export async function addExternalUserAlias({
  externalUserId,
  alias,
  createdBy
}: AddExternalUserAliasParams) {
  const payload: Record<string, string> = {
    p_external_user_id: externalUserId,
    p_alias: alias.trim().toLowerCase()
  };
  if (createdBy) payload.p_created_by = createdBy;

  const response = await ConfigDB.post("/rpc/add_external_user_alias", payload);
  return response.data;
}

export type MergeExternalUsersParams = {
  primaryId: string;
  duplicateId: string;
  createdBy?: string;
};

export async function mergeExternalUsers({
  primaryId,
  duplicateId,
  createdBy
}: MergeExternalUsersParams) {
  const payload: Record<string, string> = {
    p_primary_id: primaryId,
    p_duplicate_id: duplicateId
  };
  if (createdBy) payload.p_created_by = createdBy;

  const response = await ConfigDB.post("/rpc/merge_external_users", payload);
  return response.data;
}

export type ConfigAccessFilterOptionsParams = {
  configId?: string;
  configType?: string;
  userId?: string;
  role?: string;
  userType?: string;
};

export type ConfigAccessFilterOptions = {
  catalogs: { config_id: string; config_name: string; config_type: string }[];
  users: {
    external_user_id: string;
    user: string;
    email?: string | null;
  }[];
  roles: { role: string }[];
  user_types: { user_type: string }[];
};

const emptyFilterOptions: ConfigAccessFilterOptions = {
  catalogs: [],
  users: [],
  roles: [],
  user_types: []
};

export const getConfigAccessFilterOptions = async (
  params: ConfigAccessFilterOptionsParams = {}
): Promise<ConfigAccessFilterOptions> => {
  const queryParams = new URLSearchParams();

  if (params.configId) queryParams.set("p_config_id", params.configId);
  if (params.configType) queryParams.set("p_config_type", params.configType);
  if (params.userId) queryParams.set("p_user_id", params.userId);
  if (params.role) queryParams.set("p_role", params.role);
  if (params.userType) queryParams.set("p_user_type", params.userType);

  const res = await ConfigDB.get<ConfigAccessFilterOptions>(
    `/rpc/config_access_filter_options?${queryParams.toString()}`
  );

  return res.data ?? emptyFilterOptions;
};
