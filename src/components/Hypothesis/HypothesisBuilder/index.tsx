import { useEffect, useState } from "react";

import { Modal } from "../../Modal";
import { HypothesisNode } from "../HypothesisNode";
import { HypothesisTitle } from "../HypothesisTitle";
import { HypothesisDetails } from "../HypothesisDetails";
import { CreateHypothesis } from "../CreateHypothesis";
import { HypothesisAPIs } from "../../../pages/incident/IncidentDetails";
import { Hypothesis } from "../../../api/services/hypothesis";

interface IProps {
  loadedTree: unknown;
  initialEditMode: boolean;
  api: HypothesisAPIs;
}

export function HypothesisBuilder({ loadedTree, api }: IProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Hypothesis | null>(null);
  const [createHypothesisModalIsOpen, setCreateHypothesisModalIsOpen] =
    useState(false);
  const [tree, setTree] = useState(null);

  useEffect(() => {
    setTree(loadedTree);
  }, [loadedTree]);

  if (!tree) {
    return null;
  }

  return (
    <>
      <div className="w-full">
        <HypothesisNode
          showComments={true}
          node={tree}
          setModalIsOpen={setModalIsOpen}
          setSelectedNode={setSelectedNode}
          setCreateHypothesisModalIsOpen={setCreateHypothesisModalIsOpen}
          api={api}
        />
      </div>
      {!!selectedNode && (
        <Modal
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          size="full"
          title={<HypothesisTitle node={selectedNode} api={api} />}
        >
          <HypothesisDetails node={selectedNode} api={api} />
        </Modal>
      )}
      <CreateHypothesis
        node={selectedNode}
        api={api}
        isOpen={createHypothesisModalIsOpen}
        onHypothesisCreated={() => {
          setCreateHypothesisModalIsOpen(false);
        }}
      />
    </>
  );
}
