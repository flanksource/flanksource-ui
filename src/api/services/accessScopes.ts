import { AccessScopeDB, AccessScopeDisplay } from "../types/accessScopes";
import { AxiosResponse } from "axios";
import { IncidentCommander } from "../axios";
import { AVATAR_INFO } from "@flanksource-ui/constants";

// List AccessScopes with optional filters
export async function getAccessScopes(
  params?: any
): Promise<AxiosResponse<AccessScopeDisplay[]>> {
  return IncidentCommander.get("/access_scopes", {
    params: {
      ...params,
      select: `*,person:people!access_scopes_sub_person_id_fkey(id,email,name),team:teams(id,name),created_by(${AVATAR_INFO})`,
      deleted_at: "is.null"
    }
  });
}

// Get single AccessScope by ID
export async function getAccessScopeById(
  id: string
): Promise<AccessScopeDisplay> {
  const response = await IncidentCommander.get<AccessScopeDisplay[]>(
    "/access_scopes",
    {
      params: {
        id: `eq.${id}`,
        select: `*,person:people!access_scopes_sub_person_id_fkey(id,email,name),team:teams(id,name),created_by(${AVATAR_INFO})`
      }
    }
  );
  return response.data[0];
}

// Create AccessScope
export async function createAccessScope(
  data: Partial<AccessScopeDB>
): Promise<AxiosResponse<AccessScopeDB>> {
  return IncidentCommander.post("/access_scopes", data, {
    headers: { Prefer: "return=representation" }
  });
}

// Update AccessScope
export async function updateAccessScope(
  id: string,
  data: Partial<AccessScopeDB>
): Promise<AxiosResponse<AccessScopeDB>> {
  return IncidentCommander.patch(`/access_scopes?id=eq.${id}`, data, {
    headers: { Prefer: "return=representation" }
  });
}

// Delete AccessScope (soft delete)
export async function deleteAccessScope(
  id: string
): Promise<AxiosResponse<void>> {
  return IncidentCommander.patch(`/access_scopes?id=eq.${id}`, {
    deleted_at: new Date().toISOString()
  });
}
