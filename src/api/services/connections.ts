import { apiBase } from "../axios";

export async function testConnection(id: string) {
  return apiBase.post<{ message?: string; error?: string } | null>(
    `/connection/test/${id}`
  );
}
