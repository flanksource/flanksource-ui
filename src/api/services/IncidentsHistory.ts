import { IncidentCommander } from "../axios";
import { IncidentHistory } from "../types/incident";

export const getIncidentHistory = async (incidentID: string) => {
  const res = await IncidentCommander.get<IncidentHistory[]>(
    `/incident_histories?incident_id=eq.${incidentID}&select=*,evidence:evidences(id,description,type,components(id,name,icon),configs(id,name),config_changes(id,change_type),config_analysis(id,analyzer,message,analysis),checks(id,icon,name)),hypothesis:hypotheses(id,title),responder:responders(id,person:person_id(id,name,avatar),team:team_id(id,name,icon)),comment:comments(id,comment),created_by(id,name,avatar))&order=created_at.desc`
  );
  return res.data;
};
