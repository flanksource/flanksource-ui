import React, { useEffect, useState } from "react";
import Randomstring from "randomstring";
import { minimalNodeTemplate, NestedHeirarchy } from "../NestedHeirarchy";
import { hypothesisInitialFields } from "./data";
import { HypothesisNode } from "./components/HypothesisNode";
import { Modal } from "../Modal";
import { HypothesisDetails } from "./components/HypothesisDetails";

export function HypothesisBuilder({
  showGeneratedOutput,
  initialTree,
  loadedTree,
  initialEditMode = true,
  ...rest
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState(null);
  const defaultEditMode = loadedTree ? false : initialEditMode;
  const [tree, setTree] = useState(
    initialTree || {
      ...minimalNodeTemplate,
      ...hypothesisInitialFields,
      id: Randomstring.generate(16)
    }
  );

  useEffect(() => {
    if (loadedTree) {
      setTree(loadedTree);
    }
  }, [loadedTree]);

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
            defaultEditMode={defaultEditMode}
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
        <div className="w-full flex flex-col mt-4">
          generated tree:
          <textarea
            readOnly
            className="text-xs mt-2"
            contentEditable={false}
            style={{ minHeight: "200px" }}
            value={JSON.stringify(tree, undefined, 4)}
          />
        </div>
      )}
    </div>
  );
}
