import { ConfigDB, ViewAPI } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { ViewResult, ViewColumnDef } from "../../pages/audit-report/types";
import { tristateOutputToQueryFilterParam } from "../../ui/Dropdowns/TristateReactSelect";

export type View = {
  id: string;
  name: string;
  namespace?: string;
  spec: any;
  source: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  last_ran?: string;
  error?: string;
};

export type ViewSummary = {
  id: string;
  namespace?: string;
  name: string;
  title?: string;
  icon?: string;
  ordinal?: number;
  sidebar?: boolean;
  last_ran?: string;
};

export type ViewListItem = {
  id: string;
  name: string;
  namespace?: string;
  title?: string;
  icon?: string;
};

export const getAllViews = (
  sortBy?: any,
  pageIndex?: number,
  pageSize?: number
) => {
  let url = `/views?select=*&deleted_at=${encodeURIComponent("is.null")}`;

  if (pageIndex !== undefined && pageSize !== undefined) {
    url += `&limit=${pageSize}&offset=${pageIndex * pageSize}`;
  }

  if (sortBy && sortBy.length > 0) {
    const sortFields = sortBy
      .map((sort: any) => `${sort.id}.${sort.desc ? "desc" : "asc"}`)
      .join(",");
    url += `&order=${encodeURIComponent(sortFields)}`;
  } else {
    url += `&order=${encodeURIComponent("created_at.desc")}`;
  }

  return resolvePostGrestRequestWithPagination<View[]>(
    ConfigDB.get(url, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
};

/**
 * Get the data for a view by its id.
 */
export const getViewDataById = async (
  viewId: string,
  variables?: Record<string, string>,
  headers?: Record<string, string>
): Promise<ViewResult> => {
  const body: { variables?: Record<string, string> } = {
    variables: variables
  };

  const response = await fetch(`/api/view/${viewId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

export const createView = async (view: Partial<View>) => {
  const response = await ConfigDB.post("/views", view);
  return response;
};

export const updateView = async (id: string, view: Partial<View>) => {
  const response = await ConfigDB.patch(`/views?id=eq.${id}`, view);
  return response;
};

export const deleteView = async (id: string) => {
  const response = await ConfigDB.delete(`/views?id=eq.${id}`);
  return response;
};

export const queryViewTable = async (
  namespace: string,
  name: string,
  columns: ViewColumnDef[],
  searchParams: URLSearchParams,
  requestFingerprint: string
) => {
  const cleanNamespace = namespace.replace(/-/g, "_");
  const cleanName = name.replace(/-/g, "_");
  const tableName = `view_${cleanNamespace}_${cleanName}`;

  let queryString = `?select=*`;

  const pageIndex = parseInt(searchParams.get("pageIndex") ?? "0");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "50");
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  queryString += `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  // Add sorting support
  if (sortBy) {
    const orderClause =
      sortOrder === "desc"
        ? `${sortBy}.${sortOrder}.nullslast`
        : `${sortBy}.${sortOrder}`;
    queryString += `&order=${encodeURIComponent(orderClause)}`;
  }

  for (const [key, value] of searchParams.entries()) {
    if (
      key !== "filter" &&
      key !== "pageIndex" &&
      key !== "pageSize" &&
      key !== "sortBy" &&
      key !== "sortOrder" &&
      value &&
      value.trim()
    ) {
      const filterParam = tristateOutputToQueryFilterParam(value, key);
      if (filterParam) {
        queryString += filterParam;
      }
    }
  }

  // Add requestFingerprint as a filter if provided
  queryString += `&request_fingerprint=eq.${encodeURIComponent(requestFingerprint)}`;

  const response = await resolvePostGrestRequestWithPagination(
    ConfigDB.get(`/${tableName}${queryString}`, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );

  if (response.error) {
    throw response.error;
  }

  const data = response.data;

  // Convert PostgREST object rows to array rows based on column order
  // Example:
  // data = [{"name": "John", "age": 30, "city": "New York"}]
  // columns = [{name: "name"}, {name: "age"}, {name: "city"}]
  // convertedRows = [["John", 30, "New York"]]
  const convertedRows =
    Array.isArray(data) && data.length > 0
      ? data.map((rowObj) => {
          return columns.map((column) => rowObj[column.name]);
        })
      : data || [];

  return {
    data: convertedRows,
    totalEntries: response.totalEntries
  };
};

export const getViewsForSidebar = async () => {
  const res = await resolvePostGrestRequestWithPagination<ViewSummary[]>(
    ConfigDB.get(
      `/views_summary?sidebar=eq.true&select=id,name,namespace,title,icon,ordinal&order=ordinal.asc,title.asc`
    )
  );
  return res.data ?? [];
};

export const getViewsByConfigId = async (configId: string) => {
  const res = await ViewAPI.get<ViewListItem[]>(`/list?config_id=${configId}`);
  return res.data ?? [];
};

export const getViewIdByNamespaceAndName = async (
  namespace: string,
  name: string
) => {
  const res = await resolvePostGrestRequestWithPagination<ViewSummary[]>(
    ConfigDB.get(
      `/views_summary?namespace=eq.${encodeURIComponent(namespace)}&name=eq.${encodeURIComponent(name)}&select=id`
    )
  );
  return res.data?.[0]?.id;
};

export const getViewIdByName = async (name: string) => {
  const res = await resolvePostGrestRequestWithPagination<ViewSummary[]>(
    ConfigDB.get(`/views_summary?name=eq.${encodeURIComponent(name)}&select=id`)
  );
  return res.data?.[0]?.id;
};
