import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { EvidenceSection } from "./evidence-section";
import { Modal } from "../Modal";
import { EvidenceBuilder } from "../EvidenceBuilder";
import { CommentsSection } from "./comments";
import {
  getCommentsByHypothesis,
  createComment
} from "../../api/services/comments";
import { getAllEvidenceByHypothesis } from "../../api/services/evidence";
import { useUser } from "../../context";
import { toastError } from "../Toast/toast";

export function HypothesisDetails({ node, api, ...rest }) {
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
  const user = useUser();
  const [comments, setComments] = useState([]);
  const [evidence, setEvidence] = useState([]);

  const fetchEvidence = (hypothesisId) => {
    getAllEvidenceByHypothesis(hypothesisId).then((evidence) => {
      setEvidence(evidence?.data || []);
    });
  };

  const fetchComments = (id) =>
    getCommentsByHypothesis(id)
      .then((comments) => {
        setComments(comments?.data || []);
      })
      .catch((err) => console.error(err));

  const handleComment = (value) =>
    createComment(user, uuidv4(), node.incident_id, node.id, value)
      .catch(toastError)
      .then(() => {
        fetchComments(node.id);
      });

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
            evidence={evidence}
            titlePrepend={<HypothesisTitle>Evidence</HypothesisTitle>}
            onButtonClick={() => setEvidenceBuilderOpen(true)}
          />
        </div>
        {/* <div className="mb-6">
          <LinkedItems
            currentNode={node}
            currentNodePath={nodePath}
            fullTree={tree}
            titlePrepend={<HypothesisTitle>Linked Items</HypothesisTitle>}
            onLinksChange={(newItems) =>
              handleCurrentNodeValueChange("links", newItems)
            }
          />
        </div> */}
        <div className="">
          <CommentsSection
            comments={comments}
            onComment={(value) => handleComment(value)}
            titlePrepend={
              <HypothesisTitle className="mb-2.5">Comments</HypothesisTitle>
            }
          />
        </div>
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
