import React, { useEffect, useState } from "react";

import { Modal } from "../../Modal";
import { HypothesisNode } from "../HypothesisNode";
import { HypothesisTitle } from "../HypothesisTitle";
import { HypothesisDetails } from "../HypothesisDetails";
import { CreateHypothesis } from "../CreateHypothesis";

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
        size="full"
        title={<HypothesisTitle node={selectedNode} api={api} />}
      >
        <HypothesisDetails node={selectedNode} api={api} />
      </Modal>
      <CreateHypothesis
        node={selectedNode}
        api={api}
        isOpen={createHypothesisModalIsOpen}
        onHypothesisCreated={() => {
          setCreateHypothesisModalIsOpen(false);
        }}
      />
    </div>
  );
}
