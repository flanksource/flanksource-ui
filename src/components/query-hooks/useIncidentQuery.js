import { useQuery } from "react-query";
import { getIncident } from "../../api/services/incident";

const createIncidentQueryKey = (id) => ["getIncident", id];

const useIncidentQuery = (id) =>
  useQuery(createIncidentQueryKey(id), () => getIncident(id));

export { useIncidentQuery, createIncidentQueryKey };
