import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { EvidenceSection } from "../EvidenceSection";
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
      <div className={clsx("pb-7", rest.className || "")} {...rest}>
        <div className="mb-8 mt-4">
          <EvidenceSection
            hypothesis={node}
            evidenceList={evidence}
            titlePrepend={<HypothesisTitle>Evidence</HypothesisTitle>}
            onButtonClick={() => setEvidenceBuilderOpen(true)}
            onDeleteEvidence={deleteEvidenceCb}
            isLoading={evidenceLoading}
          />
        </div>
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
