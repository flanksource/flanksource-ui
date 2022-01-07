import React, { useState } from "react";
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
  const [selectedNodePath, setSelectedNodePath] = useState(null);
  const [tree, setTree] = useState({
    ...minimalNodeTemplate,
    ...hypothesisInitialFields,
    depth: 0,
    id: Randomstring.generate(16),
    parentArray: []
  });

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
      <div className="mt-12 w-full px-4">
        <NestedHeirarchy
          tree={tree}
          setTree={setTree}
          depthLimit={2}
          additionalNodeFields={hypothesisInitialFields}
        >
          <HypothesisNode
            setModalIsOpen={setModalIsOpen}
            setSelectedNodePath={setSelectedNodePath}
          />
        </NestedHeirarchy>
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        cardClass="w-full"
        contentClass="h-full px-8"
        cardStyle={{
          maxWidth: "820px"
        }}
        closeButtonStyle={{ padding: "2.2rem 2.1rem 0 0" }}
        hideActions
      >
        <HypothesisDetails
          nodePath={selectedNodePath}
          tree={tree}
          setTree={setTree}
        />
      </Modal>

      <div className="mt-12 w-full px-4">
        generated tree: {JSON.stringify(tree)}
      </div>
    </div>
  );
}
