import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { Modal } from "../../Modal";
import { Comment, createComment } from "../../../api/services/comments";
import { deleteEvidence, Evidence } from "../../../api/services/evidence";
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

interface IProps {
  node: TreeNode<Hypothesis>;
  api: any;
}

type Response = Evidence | Comment;

export function HypothesisDetails({ node, api, ...rest }: IProps) {
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<Response[]>([]);

  const fetchResponses = async (id: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await getHypothesisResponse(id);
      if (error) {
        toastError(`Error fetching hypothesis responses: ${error?.message}`);
      }

      const responses = (data.comments || [])
        .concat(data.evidences || [])
        .sort((a: Response, b: Response) => {
          if (a.created_at > b.created_at) return 1;
          return -1;
        });

      responses.forEach((response) => {
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
    } finally {
      setIsLoading(false);
    }
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
      return;
    }

    setResponses((ls) => ls.filter((e) => e.id !== id));
  };

  useEffect(() => {
    node?.id && fetchResponses(node.id);
  }, [node?.id]);

  return (
    <>
      <div className={clsx("pb-7", rest.className || "")} {...rest}>
        <ul className="pt-4">
          {responses.length > 0 &&
            responses.map(({ id, created_by, created_at, ...evidence }) => (
              <ResponseLine
                key={id}
                created_at={created_at}
                created_by={created_by}
                response={evidence}
                onDelete={evidence.type ? () => deleteEvidenceCb(id) : null}
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
