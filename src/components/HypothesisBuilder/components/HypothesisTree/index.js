import React from "react";
import { BsPlusLg } from "react-icons/all";
import { HypothesisBar } from "../HypothesisBar";
import { HypothesisRootChildrenList } from "../HypothesisRootChildrenList";

export const HypothesisTree = ({
  node,
  parentArray,
  setModalIsOpen,
  setSelectedNodePath
}) => {
  const handleOpenModal = () => {
    setSelectedNodePath([...parentArray, node.id]);
    setModalIsOpen(true);
  };

  return (
    <div>
      <div className="flex items-center text-base font-semibold mb-6">
        <h2 className="text-dark-gray mr-3 text-2xl">Action plan</h2>
        <button
          type="button"
          className="btn-round btn-round-primary btn-round-xs"
        >
          <BsPlusLg />
        </button>
      </div>
      <div className="w-full mt-5">
        <div className="w-full bg-white rounded-8px">
          <div className="w-full flex justify-between">
            <HypothesisBar hypothesis={node} onTitleClick={handleOpenModal} />
          </div>
          <div className="bg-light-blue p-5 mt-3 rounded-8px border border-dashed">
            <HypothesisRootChildrenList
              node={node}
              onTitleClick={handleOpenModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
