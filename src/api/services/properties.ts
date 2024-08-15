import { AVATAR_INFO } from "@flanksource-ui/constants";
import {
  FeatureFlag,
  PropertyDBObject
} from "../../services/permissions/permissionsService";
import { IncidentCommander, apiBase } from "../axios";
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
