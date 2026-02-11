import axios from "axios";
import { ScrapePlugin } from "../types/plugins";

const API_BASE = "/api/plugins";

export async function getScrapePlugins(): Promise<ScrapePlugin[]> {
  const { data } = await axios.get<ScrapePlugin[]>(API_BASE);
  return data;
}

export async function createScrapePlugin(plugin: Partial<ScrapePlugin>): Promise<ScrapePlugin> {
  const { data } = await axios.post<ScrapePlugin>(API_BASE, plugin);
  return data;
}

export async function updateScrapePlugin(id: string, plugin: Partial<ScrapePlugin>): Promise<ScrapePlugin> {
  const { data } = await axios.put<ScrapePlugin>(`${API_BASE}/${id}`, plugin);
  return data;
}

export async function deleteScrapePlugin(id: string): Promise<{ id: string }> {
  const { data } = await axios.delete<{ id: string }>(`${API_BASE}/${id}`);
  return data;
}