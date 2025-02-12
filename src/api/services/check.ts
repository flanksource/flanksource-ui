import { IncidentCommander } from "../axios";
import { HealthCheck } from "../types/health";

export const getHealthCheckByID = async (checkID: string) => {
  if (checkID === "") {
    return null;
  }

  return IncidentCommander.get<HealthCheck[]>(`/checks?id=eq.${checkID}`);
};
