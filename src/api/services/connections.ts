import { Connection } from "@flanksource-ui/components/Connections/ConnectionFormModal";
import { apiBase, IncidentCommander } from "../axios";

export async function testConnection(id: string) {
  return apiBase.post<{ message?: string; error?: string } | null>(
    `/connection/test/${id}`
  );
}

export async function getConnectionByID(id: string) {
  const res = await IncidentCommander.get<
    Pick<Connection, "id" | "name" | "type">[]
  >(`/connections?id=eq.${id}&select=id,name,type`);
  return res?.data?.[0] ?? undefined;
}
