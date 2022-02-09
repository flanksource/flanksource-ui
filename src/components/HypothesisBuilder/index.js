import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { minimalNodeTemplate, NestedHeirarchy } from "../NestedHeirarchy";
import { hypothesisInitialFields } from "./data";
import { Modal } from "../Modal";
import { HypothesisDetails } from "./components/HypothesisDetails";
import { HypothesisTree } from "./components/HypothesisTree";

const newTree = {
  title: "",
  ...hypothesisInitialFields,
  ...{ ...minimalNodeTemplate, id: uuidv4() }
};

export function HypothesisBuilder({
  showGeneratedOutput,
  initialTree,
  loadedTree,
  initialEditMode = false,
  api,
  ...rest
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState(null);
  const defaultEditMode = loadedTree ? false : initialEditMode;
  const [tree, setTree] = useState(null);

  useEffect(() => {
    setTree(loadedTree || newTree);
  }, [loadedTree]);

  return (
    <div {...rest}>
      <div className="w-full">
        {tree && (
          <NestedHeirarchy
            tree={tree}
            setTree={setTree}
            depthLimit={2}
            additionalNodeFields={hypothesisInitialFields}
          >
            <HypothesisTree
              setModalIsOpen={setModalIsOpen}
              setSelectedNodePath={setSelectedNodePath}
              defaultEditMode={defaultEditMode}
              api={api}
            />
          </NestedHeirarchy>
        )}
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        cardClass="w-full overflow-y-scroll"
        contentClass="h-full px-10"
        cardStyle={{
          maxWidth: "1024px",
          maxHeight: "calc(100vh - 4rem)"
        }}
        closeButtonStyle={{
          padding: "2.2rem 2.1rem 0 0"
        }}
        hideActions
      >
        <HypothesisDetails
          nodePath={selectedNodePath}
          tree={tree}
          setTree={setTree}
          api={api}
        />
      </Modal>

      {showGeneratedOutput && (
        <div className="w-full flex flex-col mt-4">
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
