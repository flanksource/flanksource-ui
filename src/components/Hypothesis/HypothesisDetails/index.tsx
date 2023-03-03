import { useEffect, useState } from "react";
import clsx from "clsx";

import { Modal } from "../../Modal";
import { Comment, createComment } from "../../../api/services/comments";
import {
  deleteEvidence,
  Evidence,
  updateEvidence
} from "../../../api/services/evidence";
import { useUser } from "../../../context";
import { toastError } from "../../Toast/toast";
import { EvidenceBuilder } from "../../EvidenceBuilder";
import { CommentsSection } from "../Comments";
import { ResponseLine } from "../ResponseLine";
import { Hypothesis } from "../../../api/services/hypothesis";
import { TreeNode } from "../../../pages/incident/IncidentDetails";
import {
  useGetHypothesisQuery,
  useIncidentQuery
} from "../../../api/query-hooks";
import { IncidentStatus } from "../../../api/services/incident";

interface IProps {
  node: TreeNode<Hypothesis>;
  api: any;
  currentStatus?: IncidentStatus;
}

type Response = Evidence & Comment;

export function HypothesisDetails({
  node,
  api,
  currentStatus,
  ...rest
}: IProps) {
  const incidentQuery = useIncidentQuery(node.incident_id);
  const { data: hypothesis, refetch: refetchHypothesis } =
    useGetHypothesisQuery(node.id, {});
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
  const { user } = useUser();
  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    if (!hypothesis?.data) {
      return;
    }
    arrangeData(hypothesis.data);
  }, [hypothesis]);

  useEffect(() => {
    if (!node) {
      return;
    }
    refetchHypothesis();
  }, [node, refetchHypothesis]);

  const arrangeData = (data: any) => {
    let responses = (data?.comments || [])
      .concat(data?.evidences || [])
      .sort((a: Response, b: Response) => {
        if (a.created_at > b.created_at) return 1;
        return -1;
      });

    responses = responses.map((response: any) => {
      response.created_by = response.external_created_by
        ? {
            name: response.external_created_by,
            avatar: null,
            team: {
              icon: response.responder_id?.team_id?.icon,
              name: response.responder_id?.team_id?.name
            }
          }
        : response.created_by;
      return response;
    });
    setResponses(responses);
  };

  const handleComment = (value: string) =>
    createComment({
      user,
      incidentId: node.incident_id,
      hypothesisId: node.id,
      comment: value
    })
      .catch(toastError)
      .then(() => {
        incidentQuery.refetch();
        refetchHypothesis();
      });

  const deleteEvidenceCb = async (id: string) => {
    const { error } = await deleteEvidence(id);

    if (error) {
      console.error("delete failed", error);
      toastError("Evidence delete failed");
      return;
    }

    setResponses((ls) => ls.filter((e) => e.id !== id));
  };

  const updateEvidenceCb = async (evidence: Evidence) => {
    const { error } = await updateEvidence(evidence.id, {
      definition_of_done: !evidence.definition_of_done
    });

    if (error) {
      const message = evidence.definition_of_done
        ? "Removing evidence from definition of done failed"
        : "Marking evidence as part of definition of done failed";
      toastError(message);
      return;
    }
    incidentQuery.refetch();
    refetchHypothesis();
  };

  useEffect(() => {
    arrangeData(node);
    refetchHypothesis();
  }, []);

  return (
    <>
      <div className={clsx("pb-7", rest.className || "")} {...rest}>
        <ul className="pt-4">
          {responses.length > 0 &&
            responses.map((evidence) => (
              <ResponseLine
                key={evidence.id}
                created_at={evidence.created_at}
                created_by={evidence.created_by}
                response={evidence}
                onDelete={
                  evidence.type ? () => deleteEvidenceCb(evidence.id) : null
                }
                markAsDefinitionOfDone={
                  evidence.type
                    ? () => {
                        updateEvidenceCb(evidence);
                      }
                    : undefined
                }
                currentStatus={currentStatus}
              />
            ))}
        </ul>
        <CommentsSection onComment={(value) => handleComment(value)} />
      </div>
      <Modal
        open={evidenceBuilderOpen}
        onClose={() => setEvidenceBuilderOpen(false)}
        size="medium"
      >
        <EvidenceBuilder />
      </Modal>
    </>
  );
}
