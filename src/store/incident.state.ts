import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useIncidentQuery } from "../api/query-hooks";
import { Incident } from "../api/types/incident";

export const viewedIncidentAtom = atom<Incident | null>(null);

export function useIncidentState(incidentId: string) {
  const setIncident = useSetAtom(viewedIncidentAtom);
  const incident = useAtomValue(viewedIncidentAtom);
  const { data, isLoading, isRefetching, refetch } =
    useIncidentQuery(incidentId);

  useEffect(() => {
    setIncident(data as Incident);
  }, [data, setIncident]);

  return {
    incident,
    setIncident,
    isLoading,
    isRefetching,
    refetchIncident: refetch
  };
}
