import React, { useEffect, useState } from "react";
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
import {
  getHypothesisResponse,
  Hypothesis
} from "../../../api/services/hypothesis";
import { TreeNode } from "../../../pages/incident/IncidentDetails";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObj } from "../../../utils/common";

interface IProps {
  node: TreeNode<Hypothesis>;
  api: any;
}

type Response = Evidence & Comment;

export function HypothesisDetails({ node, api, ...rest }: IProps) {
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<Response[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshEvidencesToken, setRefreshEvidencesToken] = useState<
    string | null
  >(null);

  const fetchResponses = async (id: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await getHypothesisResponse(id);
      if (error) {
        toastError(`Error fetching hypothesis responses: ${error?.message}`);
      }
      arrangeData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const arrangeData = (data: any) => {
    const responses = (data?.comments || [])
      .concat(data?.evidences || [])
      .sort((a: Response, b: Response) => {
        if (a.created_at > b.created_at) return 1;
        return -1;
      });

    responses.forEach((response: any) => {
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
        fetchResponses(node.id);
      });

  const deleteEvidenceCb = async (id: string) => {
    const { error } = await deleteEvidence(id);

    if (error) {
      console.error("delete failed", error);
      toastError("Evidence delete failed");
      return;
    }

    setResponses((ls) => ls.filter((e) => e.id !== id));
    assignNewEvidencesRefreshToken();
  };

  const updateEvidenceCb = async (evidence: Evidence) => {
    const { error } = await updateEvidence(evidence.id, {
      definition_of_done: !evidence.definition_of_done
    });

    if (error) {
      const message = evidence.definition_of_done
        ? "Removing evidence from definition of done failed"
        : "Marking evidence as part of definition of done failed";
      console.error("update failed", error);
      toastError(message);
      return;
    }
    responses.forEach((response: any) => {
      if (response.id === evidence.id) {
        response.definition_of_done = !response.definition_of_done;
      }
    });
    setResponses([...responses]);
    assignNewEvidencesRefreshToken();
  };

  const assignNewEvidencesRefreshToken = () => {
    const token = (+new Date()).toString();
    setRefreshEvidencesToken(token);
    setSearchParams({
      ...searchParamsToObj(searchParams),
      refresh_evidences: token
    });
  };

  useEffect(() => {
    if (
      searchParams.get("refresh_evidences") === refreshEvidencesToken &&
      refreshEvidencesToken
    ) {
      return;
    }
    arrangeData(node);
    node?.id && fetchResponses(node.id);
  }, [node?.id, searchParams]);

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
