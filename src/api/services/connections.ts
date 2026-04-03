import { Connection } from "@flanksource-ui/components/Connections/ConnectionFormModal";
import { apiBase, IncidentCommander } from "../axios";

export async function testConnection(id: string) {
  return apiBase.post<{
    message?: string;
    error?: string;
    payload?: unknown;
  } | null>(`/connection/test/${id}`);
}

export async function getConnectionByID(id: string) {
  const res = await IncidentCommander.get<
    Pick<Connection, "id" | "name" | "type">[]
  >(`/connections?id=eq.${id}&select=id,name,type`);
  return res?.data?.[0] ?? null;
}

export async function getConnectionByNamespaceName(
  name: string,
  namespace?: string
) {
  const filters = [`name=eq.${name}`];

  if (namespace) {
    filters.push(`namespace=eq.${namespace}`);
  }

  const res = await IncidentCommander.get<
    Pick<Connection, "id" | "name" | "type">[]
  >(`/connections?${filters.join("&")}&select=id,name,type`);

  return res?.data?.[0] ?? null;
}
