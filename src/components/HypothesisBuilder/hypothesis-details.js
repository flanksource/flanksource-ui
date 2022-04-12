import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { EvidenceSection } from "./evidence-section";
import { Modal } from "../Modal";
import { EvidenceBuilder } from "../EvidenceBuilder";
import { CommentsSection } from "./comments";
import { getAllEvidenceByHypothesis } from "../../api/services/evidence";

export function HypothesisDetails({
  node,
  api,
  comments,
  handleComment,
  ...rest
}) {
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
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

  useEffect(() => {
    fetchEvidence(node.id);
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
            isLoading={evidenceLoading}
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
