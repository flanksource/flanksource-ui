import { RbacManifest } from "../types/rbacResources";
import { ScopeDB, ScopeDisplay, ScopeSpec } from "../types/scopes";
import { createRbacObject, updateRbacObject } from "./rbacResources";
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

// Scopes are written through /api/rbac/scopes, which validates them and refuses writes through /db.
export async function createScope(
  manifest: RbacManifest<ScopeSpec>
): Promise<ScopeDB> {
  return createRbacObject<ScopeDB>("scopes", manifest);
}

export async function updateScope(
  manifest: RbacManifest<ScopeSpec>
): Promise<ScopeDB> {
  return updateRbacObject<ScopeDB>("scopes", manifest);
}
