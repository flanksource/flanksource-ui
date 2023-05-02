import { Property } from "../../services/permissions/permissionsService";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const fetchProperties = () => {
  return resolve<Property[]>(IncidentCommander.get("/properties"));
};

export const saveProperty = (property: Partial<Property>) => {
  return resolve<Property[]>(IncidentCommander.post("/properties", property));
};

export const updateProperty = (property: Partial<Property>) => {
  return resolve<Property[]>(
    IncidentCommander.patch(`/properties?name=eq.${property.name}`, property)
  );
};

export const deleteProperty = (property: Partial<Property>) => {
  return resolve<Property[]>(
    IncidentCommander.delete(`/properties?name=eq.${property.name}`)
  );
};
