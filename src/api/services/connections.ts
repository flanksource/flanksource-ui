import { Connection } from "@flanksource-ui/components/Connections/ConnectionFormModal";
import { AVATAR_INFO } from "@flanksource-ui/constants";
import { SortingState } from "@tanstack/react-table";
import { apiBase, IncidentCommander } from "../axios";

type ConnectionSummary = Pick<Connection, "id" | "name" | "namespace" | "type">;

export async function testConnection(id: string) {
  return apiBase.post<{
    message?: string;
    error?: string;
    payload?: unknown;
  } | null>(`/connection/test/${id}`);
}

/**
 * Lists connections from connection_details, which masks their credentials.
 * The connections table itself isn't readable through /db.
 */
export async function getConnections(sort?: SortingState) {
  const params = new URLSearchParams();
  // connection_details doesn't mask credential properties, so only the list's columns are read
  params.set(
    "select",
    `id,name,namespace,type,source,created_at,updated_at,created_by(${AVATAR_INFO})`
  );
  params.set(
    "order",
    sort && sort.length > 0
      ? `${sort[0].id}.${sort[0].desc ? "desc" : "asc"}`
      : "created_at.desc"
  );
  params.set("limit", "100");

  const res = await IncidentCommander.get<Connection[]>(
    `/connection_details?${params.toString()}`
  );
  return res.data ?? [];
}

/**
 * Lists connections' names and types, for pickers.
 */
export async function getConnectionNames() {
  const res = await IncidentCommander.get<ConnectionSummary[]>(
    `/connections_list?select=id,name,namespace,type&order=name.asc`
  );
  return res.data ?? [];
}

/**
 * Returns a connection with its credentials masked, including a password in its URL.
 */
export async function getConnection(id: string) {
  const res = await apiBase.get<Connection>(`/connection/${id}`);
  return res.data;
}

export async function createConnection(data: Connection) {
  const res = await apiBase.post<Connection>(`/connection`, data);
  return res.data;
}

/**
 * Updates a connection. Credentials left masked ("***") are kept unchanged.
 */
export async function updateConnection(id: string, data: Connection) {
  const res = await apiBase.put<Connection>(`/connection/${id}`, data);
  return res.data;
}

export async function deleteConnection(id: string) {
  return apiBase.delete(`/connection/${id}`);
}

export async function getConnectionByID(id: string) {
  const res = await IncidentCommander.get<ConnectionSummary[]>(
    `/connections_list?id=eq.${id}&select=id,name,namespace,type`
  );
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

  const res = await IncidentCommander.get<ConnectionSummary[]>(
    `/connections_list?${filters.join("&")}&select=id,name,namespace,type`
  );

  return res?.data?.[0] ?? null;
}
