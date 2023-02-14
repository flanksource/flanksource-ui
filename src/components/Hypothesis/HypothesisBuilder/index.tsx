import { useEffect, useState } from "react";

import { HypothesisNode } from "../HypothesisNode";
import { CreateHypothesis } from "../CreateHypothesis";
import { HypothesisAPIs } from "../../../pages/incident/IncidentDetails";
import { Hypothesis } from "../../../api/services/hypothesis";
import { useSearchParams } from "react-router-dom";

interface IProps {
  loadedTree: unknown;
  initialEditMode: boolean;
  api: HypothesisAPIs;
}

export function HypothesisBuilder({ loadedTree, api }: IProps) {
  const [searchParams] = useSearchParams();
  const [selectedNode, setSelectedNode] = useState<Hypothesis | null>(null);
  const [createHypothesisModalIsOpen, setCreateHypothesisModalIsOpen] =
    useState(false);
  const [tree, setTree] = useState<any>(null);

  const showAllComments = searchParams.get("comments") === "true";

  useEffect(() => {
    setTree(loadedTree);
  }, [loadedTree]);

  if (!tree) {
    return null;
  }

  return (
    <div className="w-full">
      <HypothesisNode
        showComments={showAllComments}
        node={tree}
        setSelectedNode={setSelectedNode}
        setCreateHypothesisModalIsOpen={setCreateHypothesisModalIsOpen}
        api={api}
      />
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
