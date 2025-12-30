import { SortingState } from "@tanstack/react-table";
import { AVATAR_INFO } from "@flanksource-ui/constants";
import { User } from "@flanksource-ui/api/types/users";
import { ConfigDB } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";

export type ScrapePlugin = {
  id: string;
  name: string;
  namespace?: string;
  spec: Record<string, any>;
  source: string;
  created_by?: User;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export const getAllScrapePlugins = (
  sortBy?: SortingState,
  pageIndex?: number,
  pageSize?: number
) => {
  let url = `/scrape_plugins?select=*,created_by(${AVATAR_INFO})&deleted_at=is.null`;

  if (pageIndex !== undefined && pageSize !== undefined) {
    url += `&limit=${pageSize}&offset=${pageIndex * pageSize}`;
  }

  if (sortBy && sortBy.length > 0) {
    const sortFields = sortBy
      .map((sort) => `${sort.id}.${sort.desc ? "desc" : "asc"}`)
      .join(",");
    url += `&order=${encodeURIComponent(sortFields)}`;
  } else {
    url += `&order=${encodeURIComponent("created_at.desc")}`;
  }

  return resolvePostGrestRequestWithPagination<ScrapePlugin[]>(
    ConfigDB.get(url, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
};

export const createScrapePlugin = async (plugin: Partial<ScrapePlugin>) => {
  return ConfigDB.post("/scrape_plugins", plugin);
};

export const updateScrapePlugin = async (
  id: string,
  plugin: Partial<ScrapePlugin>
) => {
  return ConfigDB.patch(`/scrape_plugins?id=eq.${id}`, plugin);
};

export const deleteScrapePlugin = async (id: string) => {
  return ConfigDB.patch(`/scrape_plugins?id=eq.${id}`, {
    deleted_at: "now()"
  });
};
