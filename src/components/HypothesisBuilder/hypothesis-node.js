import React from "react";
import { BsPlusLg } from "react-icons/all";
import clsx from "clsx";
import { HypothesisBar } from "./hypothesis-bar";
import { HypothesisBlockHeader } from "./hypothesis-header";

const UNKNOWN_TYPE = "unknown_type";

export const HypothesisNode = (props) => {
  const {
    node,
    setModalIsOpen,
    setSelectedNode,
    setCreateHypothesisModalIsOpen
  } = props;

  if (node == null) {
    return <div>empty</div>;
  }
  const isRoot = node.type === "root" || node.parent_id == null;
  const type = node.type || UNKNOWN_TYPE;

  const handleOpenModal = () => {
    setSelectedNode(node);
    setModalIsOpen(true);
  };
  const handlerOpenCreateHypothesisModal = () => {
    setSelectedNode(node);
    setCreateHypothesisModalIsOpen(true);
  };

  return (
    <div>
      {isRoot && (
        <div className="flex items-center text-base font-semibold mb-5">
          <h2 className="text-dark-gray mr-3 text-2xl">Action plan</h2>
          <button
            type="button"
            className="btn-round btn-round-primary btn-round-sm"
          >
            <BsPlusLg />
          </button>
        </div>
      )}

      <div className="w-full">
        <div className="w-full mb-0.5">
          <HypothesisBar hypothesis={node} onTitleClick={handleOpenModal} />
        </div>

        <div
          className={clsx({
            "bg-light-blue p-5 mt-3 rounded-8px border border-dashed": isRoot,
            "pl-7 my-2.5": !isRoot
          })}
        >
          {node.children.map((item) => (
            <HypothesisNode {...props} node={item} key={item.id} />
          ))}
          <HypothesisBlockHeader
            title=""
            onButtonClick={handlerOpenCreateHypothesisModal}
            className="mb-2.5"
            {...(type === "root"
              ? {
                  title: "Add new issue",
                  noResultsTitle: "No issues created yet"
                }
              : {})}
            {...(type === "factor"
              ? {
                  title: "Add new potential solution",
                  noResultsTitle: "No potential solutions created yet"
                }
              : {})}
          />
        </div>
      </div>
    </div>
  );
};
