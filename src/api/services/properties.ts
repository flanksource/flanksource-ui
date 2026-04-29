import { AVATAR_INFO } from "@flanksource-ui/constants";
import {
  DebugProperty,
  FeatureFlag,
  PropertyDBObject
} from "../../services/permissions/permissionsService";
import { Config, IncidentCommander, apiBase } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";

export const fetchProperties = () => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject[]>(
    IncidentCommander.get(`/properties?select=*,created_by(${AVATAR_INFO})`)
  );
};

export const fetchProperty = (name: string, value: string) => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject[]>(
    IncidentCommander.get(
      `/properties?select=*,created_by(${AVATAR_INFO})&name=eq.${name}&value=eq.${value}`
    )
  );
};

export const fetchFeatureFlagsAPI = () => {
  return resolvePostGrestRequestWithPagination<FeatureFlag[]>(
    apiBase.get(`/properties`)
  );
};

export const fetchDebugProperties = async (): Promise<
  Record<string, DebugProperty>
> => {
  const results: Record<string, DebugProperty> = {};
  try {
    const [mcRes, configRes] = await Promise.allSettled([
      apiBase.get<Record<string, DebugProperty>>("/debug/properties"),
      Config.get<Record<string, DebugProperty>>("/debug/properties")
    ]);
    if (mcRes.status === "fulfilled" && mcRes.value.data) {
      Object.assign(results, mcRes.value.data);
    }
    if (configRes.status === "fulfilled" && configRes.value.data) {
      Object.assign(results, configRes.value.data);
    }
  } catch (_e) {
    // ignore errors - debug properties are optional
  }
  return results;
};

export const saveProperty = (property: Partial<PropertyDBObject>) => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject[]>(
    IncidentCommander.post("/properties", property)
  );
};

export const updateProperty = (property: Partial<PropertyDBObject>) => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject[]>(
    IncidentCommander.patch(`/properties?name=eq.${property.name}`, property)
  );
};

export const deleteProperty = (property: Partial<PropertyDBObject>) => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject[]>(
    IncidentCommander.delete(`/properties?name=eq.${property.name}`)
  );
};
