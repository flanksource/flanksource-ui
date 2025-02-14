import { IncidentCommander } from "../axios";
import { HealthCheck } from "../types/health";

export const getHealthCheckByID = async (checkID: string) => {
  if (checkID === "") {
    return Promise.resolve({ data: [] }); // Ensure consistent return type
  }

  return IncidentCommander.get<HealthCheck[]>(`/checks?id=eq.${checkID}`);
};
