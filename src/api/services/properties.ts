import {
  FeatureFlag,
  PropertyDBObject
} from "../../services/permissions/permissionsService";
import { apiBase } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";

export const fetchProperties = () => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject[]>(
    apiBase.get("/property")
  );
};

export const fetchProperty = (name: string) => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject>(
    apiBase.get(`/property/${encodeURIComponent(name)}`)
  );
};

export const fetchFeatureFlagsAPI = () => {
  return resolvePostGrestRequestWithPagination<FeatureFlag[]>(
    apiBase.get(`/properties`)
  );
};

export const saveProperty = (property: Partial<PropertyDBObject>) => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject>(
    apiBase.post("/property", {
      name: property.name,
      value: property.value
    })
  );
};

export const updateProperty = (property: Partial<PropertyDBObject>) => {
  return resolvePostGrestRequestWithPagination<PropertyDBObject>(
    apiBase.put(`/property/${encodeURIComponent(property.name!)}`, {
      value: property.value
    })
  );
};

export const deleteProperty = (property: Partial<PropertyDBObject>) => {
  return resolvePostGrestRequestWithPagination<void>(
    apiBase.delete(`/property/${encodeURIComponent(property.name!)}`)
  );
};
