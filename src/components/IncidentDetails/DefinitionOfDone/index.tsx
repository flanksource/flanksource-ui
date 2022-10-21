import { useEffect, useMemo, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsHourglassSplit } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";
import { RiFullscreenLine } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import { Evidence, updateEvidence } from "../../../api/services/evidence";
import { Hypothesis } from "../../../api/services/hypothesis";
import { Size } from "../../../types";
import { searchParamsToObj } from "../../../utils/common";
import { DeleteConfirmDialog } from "../../DeleteConfirmDialog";
import { EvidenceItem } from "../../Hypothesis/EvidenceSection";
import { Modal } from "../../Modal";
import { useIncidentQuery } from "../../query-hooks/useIncidentQuery";
import { EvidenceView } from "./EvidenceView";

type DefinitionOfDoneProps = {
  incidentId: string;
};

export function DefinitionOfDone({ incidentId }: DefinitionOfDoneProps) {
  const [size] = useState<Size>(Size.small);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [evidenceBeingRemoved, setEvidenceBeingRemoved] = useState<Evidence>();
  const [dodEvidences, setDODEvidences] = useState<Evidence[]>([]);
  const [dodModalOpen, setDODModalOpen] = useState(false);
  const [allEvidences, setAllEvidences] = useState<Evidence[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshEvidencesToken, setRefreshEvidencesToken] = useState<
    string | null
  >(null);
  const incidentQuery = useIncidentQuery(incidentId);
  const { refetch, isRefetching, isLoading } = incidentQuery;

  const incidentData = useMemo(() => incidentQuery.data, [incidentQuery.data]);

  const incident = useMemo(
    () => (incidentData?.length ? incidentData[0] : null),
    [incidentData]
  );

  useEffect(() => {
    if (!incident) {
      setDODEvidences([]);
      return;
    }
    const data: Evidence[] = [];
    incident.hypotheses.forEach((hypothesis: Hypothesis) => {
      hypothesis?.evidences?.forEach((evidence: Evidence) => {
        data.push(evidence);
      });
    });
    setDODEvidences(data.filter((evidence) => evidence.definition_of_done));
  }, [incident]);

  useEffect(() => {
    if (
      searchParams.get("refresh_evidences") === refreshEvidencesToken &&
      refreshEvidencesToken
    ) {
      return;
    }
    refetch();
  }, [refreshEvidencesToken, refetch, searchParams]);

  const initiateDeleteEvidenceFromDOD = async () => {
    if (!evidenceBeingRemoved) {
      return;
    }
    setOpenDeleteConfirmDialog(false);
    await removeEvidenceFromDOD(evidenceBeingRemoved);
  };

  const removeEvidenceFromDOD = (evidence: Evidence) => {
    return updateEvidence(evidence.id, {
      definition_of_done: false
    }).then(() => {
      allEvidences.forEach((item) => {
        if (evidence.id === item.id) {
          evidence.definition_of_done = false;
        }
      });
      setAllEvidences([...allEvidences]);
      assignNewEvidencesRefreshToken();
    });
  };

  const assignNewEvidencesRefreshToken = () => {
    const token = (+new Date()).toString();
    setRefreshEvidencesToken(token);
    setSearchParams({
      ...searchParamsToObj(searchParams),
      refresh_evidences: token
    });
  };

  return (
    <div className="w-full">
      <div className="flex mb-3 w-full">
        <h2 className="flex-1 inline-block text-sm font-bold text-dark-gray">
          Definition of Done
        </h2>
        <MdRefresh
          className="cursor-pointer mr-3 w-6 h-6"
          onClick={() => refetch()}
        />
        <RiFullscreenLine
          className="cursor-pointer w-5 h-5"
          onClick={() => setDODModalOpen(true)}
        />
      </div>
      <div className="flex max-h-96 overflow-y-auto py-2 overflow-x-hidden w-full">
        {isLoading || isRefetching ? (
          <div className="flex items-start py-2 pl-2 pr-2">
            <div className="text-sm text-gray-500">
              Loading evidences please wait...
            </div>
          </div>
        ) : (
          <div className="w-full">
            {dodEvidences.map((evidence, index) => {
              return (
                <div key={index} className="relative flex items-start py-2">
                  <div className="mr-2 flex h-5 items-center">
                    <input
                      defaultChecked
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      readOnly
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenDeleteConfirmDialog(true);
                        setEvidenceBeingRemoved(evidence);
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-2 text-sm">
                    <EvidenceView evidence={evidence} size={size} />
                  </div>
                  {evidence.done ? (
                    <AiFillCheckCircle className="mr-1 mt-1" />
                  ) : (
                    <BsHourglassSplit className="mr-1 mt-1" />
                  )}
                </div>
              );
            })}
            {!Boolean(dodEvidences.length) && (
              <div className="flex items-start py-2 pl-2 pr-2">
                <div className="text-sm text-gray-500">
                  There are no evidences marked to be part of defintion of done
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <DeleteConfirmDialog
        isOpen={openDeleteConfirmDialog}
        title="Remove from definition of done ?"
        description="Are you sure you want to remove the evidence from definition of done ?"
        deleteLabel="Remove"
        onClose={() => setOpenDeleteConfirmDialog(false)}
        onDelete={() => {
          initiateDeleteEvidenceFromDOD();
        }}
      />
      <Modal
        title="Definition of Done"
        onClose={() => {
          setDODModalOpen(false);
        }}
        open={dodModalOpen}
        bodyClass=""
      >
        <div
          style={{ maxHeight: "calc(100vh - 6rem)" }}
          className="py-4 px-8 overflow-y-auto overflow-x-hidden divide-y divide-gray-200"
        >
          {dodEvidences.map((evidence, index) => {
            return (
              <div key={index} className="py-6">
                <EvidenceItem evidence={evidence} />
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
