import { ConfigDB, ViewAPI } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { ViewResult } from "../../pages/audit-report/types";

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

export const getAllViews = (sortBy?: any) => {
  let url = `/views?select=*`;

  if (sortBy && sortBy.length > 0) {
    const sortFields = sortBy
      .map((sort: any) => `${sort.id}.${sort.desc ? "desc" : "asc"}`)
      .join(",");
    url += `&order=${sortFields}`;
  } else {
    url += `&order=created_at.desc`;
  }

  return resolvePostGrestRequestWithPagination<View[]>(ConfigDB.get(url));
};

export const getViewById = (id: string) =>
  resolvePostGrestRequestWithPagination<ViewSummary[]>(
    ConfigDB.get(`/views_summary?id=eq.${id}&select=*`)
  );

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

export const getViewData = async (
  namespace: string,
  name: string,
  headers?: Record<string, string>
): Promise<ViewResult> => {
  const response = await fetch(`/api/view/${namespace}/${name}`, {
    credentials: "include",
    headers
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
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
