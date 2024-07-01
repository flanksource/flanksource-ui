import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  deleteEvidence,
  updateEvidence
} from "../../../../api/services/evidence";
import { sortByCreatedAt } from "../../../../api/types/common";
import { Evidence } from "../../../../api/types/evidence";
import { Hypothesis } from "../../../../api/types/hypothesis";
import { Comment } from "../../../../api/types/incident";
import { useUser } from "../../../../context";
import { TreeNode } from "../../../../pages/incident/IncidentDetails";
import { useIncidentState } from "../../../../store/incident.state";
import { Modal } from "../../../../ui/Modal";
import { toastError } from "../../../Toast/toast";
import { EvidenceBuilder } from "../../EvidenceBuilder";
import { CommentsSection } from "../Comments";
import { ResponseLine } from "../ResponseLine";

type IProps = {
  node: TreeNode<Hypothesis>;
  api: any;
} & React.HTMLProps<HTMLDivElement>;

type Response = Evidence & Comment;

export function HypothesisDetails({ node, api, ...rest }: IProps) {
  const { refetchIncident } = useIncidentState(node.incident_id);
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
  const { user } = useUser();
  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    arrangeData(node);
  }, [node]);

  const arrangeData = (data: any) => {
    let responses = (data?.comments || [])
      .concat(data?.evidences || [])
      .sort(sortByCreatedAt);

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

  const handleComment = (value: string) => {
    return api.createComment
      .mutateAsync({
        user: user!,
        incidentId: node.incident_id,
        hypothesisId: node.id,
        comment: value
      })
      .catch((err: any) => {
        toastError(err);
        return Promise.resolve();
      })
      .then(() => {
        refetchIncident();
      });
  };

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
    refetchIncident();
  };

  return (
    <>
      <div className={clsx("pb-7", rest.className || "")} {...rest}>
        <ul className="pt-4">
          {responses.length > 0 &&
            responses.map((evidence) => (
              <ResponseLine
                key={evidence.id}
                created_at={evidence.created_at}
                created_by={evidence.created_by as any}
                response={evidence}
                onDelete={
                  evidence.type
                    ? () => deleteEvidenceCb(evidence.id)
                    : undefined
                }
                markAsDefinitionOfDone={
                  evidence.type
                    ? () => {
                        updateEvidenceCb(evidence);
                      }
                    : undefined
                }
              />
            ))}
        </ul>
        <CommentsSection
          comments={[]}
          onComment={(value) => {
            handleComment(value);
            return Promise.resolve();
          }}
        />
      </div>
      <Modal
        open={evidenceBuilderOpen}
        onClose={() => setEvidenceBuilderOpen(false)}
        size="medium"
        title=""
      >
        <EvidenceBuilder />
      </Modal>
    </>
  );
}
