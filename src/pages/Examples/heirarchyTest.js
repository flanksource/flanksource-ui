import React, { useState } from "react";
import Randomstring from "randomstring";
import { Modal } from "../../components/Modal";
import {
  minimalNodeTemplate,
  NestedHeirarchy
} from "../../components/NestedHeirarchy";
import { HypothesisNode } from "../../components/NestedHeirarchy/components/HypothesisNode";
import { HypothesisDetails } from "../../components/NestedHeirarchy/components/HypothesisDetails";
import { hypothesisInitialFields } from "../../components/NestedHeirarchy/data";

const testTree = {
  id: "HFLK0kTVGuxCwKa5",
  children: [
    {
      id: "Bn1MoSdY566btHPS",
      children: [
        {
          id: "OKvja5AcPCbct2ng",
          children: [],
          state: null,
          evidences: [],
          links: [],
          comments: [],
          depth: 2,
          parentArray: ["HFLK0kTVGuxCwKa5", "Bn1MoSdY566btHPS"],
          description: "asd3"
        }
      ],
      state: null,
      evidences: [],
      links: [],
      comments: [],
      depth: 1,
      parentArray: ["HFLK0kTVGuxCwKa5"],
      description: "asd2"
    }
  ],
  state: "possible",
  evidences: [],
  links: [],
  comments: [],
  depth: 0,
  parentArray: [],
  description: "asd"
};

const useExistingTree = true;

export function HeirarchyTestPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState(null);
  const [tree, setTree] = useState(
    useExistingTree
      ? testTree
      : {
          ...minimalNodeTemplate,
          ...hypothesisInitialFields,
          depth: 0,
          id: Randomstring.generate(16),
          parentArray: []
        }
  );

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
            defaultEditMode={!useExistingTree}
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
        {/* generated tree: {JSON.stringify(tree)} */}
      </div>
    </div>
  );
}
