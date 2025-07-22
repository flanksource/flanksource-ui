import { ConfigDB } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { ViewResult } from "../../pages/audit-report/types";

export type View = {
  id: string;
  name: string;
  namespace: string;
  title: string;
  icon?: string | null;
  last_ran?: string | null;
};

export const getViewById = (id: string) =>
  resolvePostGrestRequestWithPagination<View[]>(
    ConfigDB.get(`/views_summary?id=eq.${id}&select=*`)
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
    throw new Error(
      `Failed to fetch view data: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const getViewsForSidebar = async () => {
  const res = await resolvePostGrestRequestWithPagination<View[]>(
    ConfigDB.get(
      `/views_summary?select=id,name,namespace,title,icon&order=title.asc`
    )
  );
  return res.data ?? [];
};
