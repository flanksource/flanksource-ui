import React, { useEffect, useState } from "react";
import Randomstring from "randomstring";
import { Modal } from "../../components/Modal";
import {
  minimalNodeTemplate,
  NestedHeirarchy
} from "../../components/NestedHeirarchy";
import {
  hypothesisInitialFields,
  HypothesisNode
} from "../../components/NestedHeirarchy/HypothesisNode";
import { HypothesisDetails } from "../../components/NestedHeirarchy/HypothesisDetails";

export function HeirarchyTestPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [tree, setTree] = useState({
    ...minimalNodeTemplate,
    ...hypothesisInitialFields,
    id: Randomstring.generate(16)
  });

  useEffect(() => {
    console.log("selectedNode", selectedNode);
  }, [selectedNode]);

  return (
    <div className="max-w-screen-xl mx-auto flex justify-center">
      <div className="mt-12 w-full px-4">
        <NestedHeirarchy
          tree={tree}
          setTree={setTree}
          depthLimit={2}
          additionalNodeFields={hypothesisInitialFields}
        >
          <HypothesisNode
            setModalIsOpen={setModalIsOpen}
            setSelectedNode={setSelectedNode}
          />
        </NestedHeirarchy>
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        hideActions
      >
        <HypothesisDetails node={selectedNode} tree={tree} setTree={setTree} />
      </Modal>
    </div>
  );
}
