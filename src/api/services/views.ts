import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { ViewResult } from "../../pages/audit-report/types";

export type View = {
  id: string;
  name: string;
  namespace: string;
  title?: string;
  icon?: string;
  ordinal?: number;
  sidebar?: boolean;
  last_ran?: string;
};

export const getViewById = (id: string) =>
  resolvePostGrestRequestWithPagination<View[]>(
    IncidentCommander.get(`/views_summary?id=eq.${id}&select=*`)
  );

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
  const res = await resolvePostGrestRequestWithPagination<View[]>(
    IncidentCommander.get(
      `/views_summary?sidebar=eq.true&select=id,name,namespace,title,icon,ordinal&order=ordinal.asc,title.asc`
    )
  );
  return res.data ?? [];
};
