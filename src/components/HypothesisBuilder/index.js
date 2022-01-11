import React, { useState } from "react";
import Randomstring from "randomstring";
import { minimalNodeTemplate, NestedHeirarchy } from "../NestedHeirarchy";
import { hypothesisInitialFields } from "./data";
import { HypothesisNode } from "./components/HypothesisNode";
import { Modal } from "../Modal";
import { HypothesisDetails } from "./components/HypothesisDetails";

export function HypothesisBuilder({
  showGeneratedOutput,
  initialTree = null,
  initialEditMode = true,
  ...rest
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState(null);
  const [tree, setTree] = useState(
    initialTree || {
      ...minimalNodeTemplate,
      ...hypothesisInitialFields,
      id: Randomstring.generate(16)
    }
  );

  return (
    <div {...rest}>
      <div className="w-full">
        <NestedHeirarchy
          tree={tree}
          setTree={setTree}
          depthLimit={2}
          additionalNodeFields={hypothesisInitialFields}
        >
          <HypothesisNode
            setModalIsOpen={setModalIsOpen}
            setSelectedNodePath={setSelectedNodePath}
            defaultEditMode={initialEditMode}
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

      {showGeneratedOutput && (
        <div className="w-full px-2 flex flex-col">
          generated tree:
          <textarea
            readOnly
            className="text-xs"
            contentEditable={false}
            style={{ minHeight: "200px" }}
            value={JSON.stringify(tree, undefined, 4)}
          />
        </div>
      )}
    </div>
  );
}
