import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { EvidenceItem, EvidenceSection } from "../EvidenceSection";
import { Modal } from "../../Modal";
import {
  getCommentsByHypothesis,
  createComment
} from "../../../api/services/comments";
import {
  getAllEvidenceByHypothesis,
  deleteEvidence
} from "../../../api/services/evidence";
import { useUser } from "../../../context";
import { toastError } from "../../Toast/toast";
import { EvidenceBuilder } from "../../EvidenceBuilder";
import { CommentsSection } from "../Comments";
import { CommentText } from "../../Comment";
import { Avatar } from "../../Avatar";
import { ResponseLine } from "../ResponseLine";

export function HypothesisDetails({ node, api, ...rest }) {
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [evidenceLoading, setEvidenceLoading] = useState(true);

  const fetchEvidence = (hypothesisId) => {
    getAllEvidenceByHypothesis(hypothesisId)
      .then((evidence) => {
        setEvidence(evidence?.data || []);
      })
      .finally(() => {
        setEvidenceLoading(false);
      });
  };

  const fetchComments = (id) =>
    getCommentsByHypothesis(id).then((comments) => {
      setComments(comments?.data || []);
    });

  const handleComment = (value) =>
    createComment({
      user,
      incidentId: node.incident_id,
      hypothesisId: node.id,
      comment: value
    })
      .catch(toastError)
      .then(() => {
        fetchComments(node.id);
      });

  const deleteEvidenceCb = async (id: string) => {
    const { error } = await deleteEvidence(id);

    if (error) {
      console.error("delete failed", error);
      return;
    }

    setEvidence((evidence) => evidence.filter((e) => e.id !== id));
  };

  useEffect(() => {
    fetchEvidence(node.id);
    fetchComments(node.id);
  }, [node.id]);

  return (
    <>
      <div className={clsx("mb-7", rest.className || "")} {...rest}>
        <ul className="mt-4">
          {evidence.length > 0 &&
            evidence.map(({ id, created_by, created_at, ...evidence }) => (
              <ResponseLine
                key={id}
                created_at={created_at}
                created_by={created_by}
                response={evidence}
              />
            ))}
        </ul>
        <CommentsSection
          comments={comments}
          onComment={(value) => handleComment(value)}
        />
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

function HypothesisTitle({ className, ...rest }) {
  return (
    <div
      className={clsx(
        "text-lg font-medium text-gray-900 font-semibold",
        className
      )}
      {...rest}
    >
      {rest.children}
    </div>
  );
}
