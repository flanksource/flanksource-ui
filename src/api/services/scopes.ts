import { ScopeDB, ScopeDisplay } from "../types/scopes";
import { AxiosResponse } from "axios";
import { IncidentCommander } from "../axios";
import { AVATAR_INFO } from "@flanksource-ui/constants";

// List Scopes with optional filters
export async function getScopes(
  params?: any
): Promise<AxiosResponse<ScopeDisplay[]>> {
  return IncidentCommander.get("/scopes", {
    params: {
      ...params,
      select: `*,created_by(${AVATAR_INFO})`,
      deleted_at: "is.null"
    }
  });
}

// Get single Scope by ID
export async function getScopeById(id: string): Promise<ScopeDisplay> {
  const response = await IncidentCommander.get<ScopeDisplay[]>("/scopes", {
    params: {
      id: `eq.${id}`,
      select: `*,created_by(${AVATAR_INFO})`
    }
  });
  return response.data[0];
}

// Create Scope
export async function createScope(
  data: Partial<ScopeDB>
): Promise<AxiosResponse<ScopeDB>> {
  return IncidentCommander.post("/scopes", data, {
    headers: { Prefer: "return=representation" }
  });
}

// Update Scope
export async function updateScope(
  id: string,
  data: Partial<ScopeDB>
): Promise<AxiosResponse<ScopeDB>> {
  return IncidentCommander.patch(`/scopes?id=eq.${id}`, data, {
    headers: { Prefer: "return=representation" }
  });
}

// Delete Scope (soft delete)
export async function deleteScope(id: string): Promise<AxiosResponse<void>> {
  return IncidentCommander.patch(`/scopes?id=eq.${id}`, {
    deleted_at: new Date().toISOString()
  });
}
