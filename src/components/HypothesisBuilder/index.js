import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { minimalNodeTemplate, NestedHeirarchy } from "../NestedHeirarchy";
import { hypothesisInitialFields } from "./data";
import { Modal } from "../Modal";
import { HypothesisDetails } from "./components/HypothesisDetails";
import { HypothesisNode } from "./components/HypothesisNode";
import { CreateHypothesis } from "./components/CreateHypothesis";

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
  const [createHypothesisModalIsOpen, setCreateHypothesisModalIsOpen] =
    useState(false);
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
            {(heirarchyProps) => (
              <>
                <HypothesisNode
                  {...heirarchyProps}
                  setModalIsOpen={setModalIsOpen}
                  setSelectedNodePath={setSelectedNodePath}
                  defaultEditMode={defaultEditMode}
                  setCreateHypothesisModalIsOpen={
                    setCreateHypothesisModalIsOpen
                  }
                  api={api}
                />
              </>
            )}
          </NestedHeirarchy>
        )}
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
        }}
        cardClass="w-full overflow-y-auto"
        contentClass="h-full px-10"
        cardStyle={{
          maxWidth: "605px",
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
      <Modal
        open={createHypothesisModalIsOpen}
        onClose={() => {
          setCreateHypothesisModalIsOpen(false);
        }}
        cardClass="w-full overflow-y-auto"
        contentClass="h-full p-10"
        cardStyle={{
          maxWidth: "605px",
          maxHeight: "calc(100vh - 4rem)"
        }}
        closeButtonStyle={{
          padding: "1.7rem 2.9rem 0 0"
        }}
        hideActions
      >
        <CreateHypothesis
          nodePath={selectedNodePath}
          tree={tree}
          setTree={setTree}
          api={api}
          onHypothesisCreated={() => {
            setCreateHypothesisModalIsOpen(false);
          }}
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
