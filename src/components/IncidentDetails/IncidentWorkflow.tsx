import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useIncidentQuery } from "../../api/query-hooks";
import { Evidence, updateEvidence } from "../../api/services/evidence";
import { Hypothesis } from "../../api/services/hypothesis";
import { IncidentStatus, updateIncident } from "../../api/services/incident";
import { incidentStatusItems } from "../Incidents/data";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { toastError, toastSuccess } from "../Toast/toast";
import EvidenceSelectionModal from "./DefinitionOfDone/EvidenceSelectionModal";

type IncidentWorkflowProps = {
  name: string;
  label: string;
  control: any;
  className: string;
  incidentId: string;
  value: IncidentStatus;
};

const statusesForWhichFactorsNeeedToBeCaptured = [
  IncidentStatus.Mitigated,
  IncidentStatus.Resolved
];

const IncidentStatusWorkflowMap = {
  [IncidentStatus.New]: [
    IncidentStatus.New,
    IncidentStatus.Open,
    IncidentStatus.Investigating,
    IncidentStatus.Mitigated,
    IncidentStatus.Resolved,
    IncidentStatus.Closed
  ],
  [IncidentStatus.Open]: [
    IncidentStatus.Open,
    IncidentStatus.Investigating,
    IncidentStatus.Mitigated,
    IncidentStatus.Resolved,
    IncidentStatus.Closed
  ],
  [IncidentStatus.Investigating]: [
    IncidentStatus.Investigating,
    IncidentStatus.Mitigated,
    IncidentStatus.Resolved,
    IncidentStatus.Closed
  ],
  [IncidentStatus.Mitigated]: [
    IncidentStatus.Mitigated,
    IncidentStatus.Resolved,
    IncidentStatus.Closed
  ],
  [IncidentStatus.Resolved]: [IncidentStatus.Resolved, IncidentStatus.Closed],
  [IncidentStatus.Closed]: [IncidentStatus.Closed, IncidentStatus.Open]
};

export function IncidentWorkflow({
  name,
  label,
  value,
  control,
  className = "w-full",
  incidentId
}: IncidentWorkflowProps) {
  const [statusToUpdate, setStatusToUpdate] = useState<{
    val: IncidentStatus;
    changeFn: (val: IncidentStatus) => void;
  }>();
  const [addToDODModalOpen, setAddToDODModalOpen] = useState(false);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const incidentQuery = useIncidentQuery(incidentId);
  const incident = useMemo(() => incidentQuery.data, [incidentQuery.data]);
  const nextStatusItems = useMemo(() => {
    const data: any = {};
    const keys: IncidentStatus[] =
      IncidentStatusWorkflowMap[value ?? IncidentStatus.New];
    keys.forEach((key: IncidentStatus) => {
      data[key] = incidentStatusItems[key];
    });
    return data;
  }, [value, incidentStatusItems]);

  useEffect(() => {
    if (!incident) {
      setEvidences([]);
      return;
    }
    const data: Evidence[] = [];
    incident.hypotheses.forEach((hypothesis: Hypothesis) => {
      hypothesis?.evidences?.forEach((evidence: Evidence) => {
        data.push(evidence);
      });
    });
    setEvidences(data);
  }, [incident]);

  const handleIncidentWorkflow = async (
    status: IncidentStatus,
    changeFn: any
  ) => {
    if (statusesForWhichFactorsNeeedToBeCaptured.includes(status)) {
      setAddToDODModalOpen(true);
      setStatusToUpdate({
        val: status,
        changeFn
      });
      return;
    }
    await udpateIncidentStatus(status);
    changeFn(status);
  };

  const udpateIncidentStatus = async (status: IncidentStatus) => {
    try {
      await updateIncident(incidentId, { status });
      toastSuccess(`Incident status updated successfully`);
    } catch (ex) {
      toastSuccess(`Incident status updated failed`);
    }
  };

  const addSelectedEvidencesToDOD = async (
    selectedEvidences: Evidence[] = []
  ) => {
    if (!selectedEvidences.length) {
      toastError(`Please select atleast one evidence`);
      return;
    }
    for (const element of selectedEvidences) {
      try {
        await updateEvidence(element.id, {
          definition_of_done: true
        });
      } catch (ex) {}
    }
    await udpateIncidentStatus(statusToUpdate?.val!);
    statusToUpdate?.changeFn(statusToUpdate?.val!);
    setStatusToUpdate(undefined);
    resetModalState();
  };

  const skip = async () => {
    await udpateIncidentStatus(statusToUpdate?.val!);
    statusToUpdate?.changeFn(statusToUpdate?.val!);
    setStatusToUpdate(undefined);
    resetModalState();
  };

  const resetModalState = () => {
    setAddToDODModalOpen(false);
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { isDirty } }) => {
          const { onChange, value } = field;
          return (
            <ReactSelectDropdown
              label={label}
              name={name}
              className={className}
              items={nextStatusItems}
              value={value}
              onChange={(value) => {
                handleIncidentWorkflow(value as IncidentStatus, onChange);
              }}
            />
          );
        }}
      />
      <EvidenceSelectionModal
        title="Add contributing factors to definition of done"
        open={addToDODModalOpen}
        evidences={evidences}
        actionHandler={(actionType, data) => {
          if (actionType === "close") {
            resetModalState();
          } else if (actionType === "skip") {
            skip();
          } else if (actionType === "submit") {
            addSelectedEvidencesToDOD(data);
            if (data.length) {
              setAddToDODModalOpen(false);
            }
          }
        }}
        enableButtons={{
          cancel: true,
          skip: true,
          submit: true
        }}
        noEvidencesMsg="There are no evidences provided for this incident"
      />
    </>
  );
}
