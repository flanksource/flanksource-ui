import { IncidentCommander } from "./axios";

export const getUser = async () =>
  IncidentCommander.get(`/person?limit=1`).then((res) => res.data[0]);
