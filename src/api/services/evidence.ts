import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { Evidence } from "../types/evidence";

export const getEvidence = async (id: string) =>
  resolve(IncidentCommander.get(`/evidences?id=eq.${id}`));

export const createEvidence = async (
  args: Omit<Evidence, "created_by" | "created_at" | "hypothesis_id" | "id">
) => {
  const {
    user,
    hypothesisId,
    evidence,
    config_id,
    config_change_id,
    config_analysis_id,
    component_id,
    check_id,
    type,
    description,
    properties,
    definition_of_done,
    done,
    script
  } = args;

  return resolve(
    IncidentCommander.post<Evidence[]>(`/evidences`, {
      config_id,
      config_analysis_id,
      config_change_id,
      component_id,
      check_id,
      created_by: user?.id,
      hypothesis_id: hypothesisId,
      evidence,
      type,
      description,
      properties,
      definition_of_done,
      done,
      script
    })
  );
};

export const updateEvidence = async (id: string, params: Partial<Evidence>) =>
  resolve(
    IncidentCommander.patch<Evidence[] | null>(`/evidences?id=eq.${id}`, {
      ...params
    })
  );

export const deleteEvidence = async (id: string) =>
  resolve(IncidentCommander.delete(`/evidences?id=eq.${id}`));

export const deleteEvidenceBulk = async (idList: string[]) => {
  let ids = "";
  idList.forEach((id, index) => {
    ids += `"${id}"`;
    if (index < idList.length - 1) {
      ids += ",";
    }
  });
  return resolve(IncidentCommander.delete(`/evidences?id=in.(${ids})`));
};
