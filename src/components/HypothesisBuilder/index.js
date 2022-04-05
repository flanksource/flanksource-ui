import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { HypothesisDetails } from "./hypothesis-details";
import { HypothesisNode } from "./hypothesis-node";
import { CreateHypothesis } from "./create-hypothesis";
import { HypothesisTitle } from "./hypothesis-title";

export function HypothesisBuilder({
  initialTree,
  loadedTree,
  initialEditMode = false,
  api,
  ...rest
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [createHypothesisModalIsOpen, setCreateHypothesisModalIsOpen] =
    useState(false);
  const defaultEditMode = loadedTree ? false : initialEditMode;
  const [tree, setTree] = useState(null);

  useEffect(() => {
    setTree(loadedTree);
  }, [loadedTree]);
  return (
    <div {...rest}>
      <div className="w-full">
        <HypothesisNode
          node={tree}
          setModalIsOpen={setModalIsOpen}
          setSelectedNode={setSelectedNode}
          defaultEditMode={defaultEditMode}
          setCreateHypothesisModalIsOpen={setCreateHypothesisModalIsOpen}
          api={api}
        />
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        size="medium"
        title={<HypothesisTitle node={selectedNode} api={api} />}
      >
        <HypothesisDetails node={selectedNode} api={api} />
      </Modal>
      <Modal
        open={createHypothesisModalIsOpen}
        onClose={() => {
          setCreateHypothesisModalIsOpen(false);
        }}
        size="medium"
      >
        <CreateHypothesis
          node={selectedNode}
          api={api}
          onHypothesisCreated={() => {
            setCreateHypothesisModalIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
