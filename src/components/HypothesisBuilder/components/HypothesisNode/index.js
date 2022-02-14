import React from "react";
import { BsPlusLg } from "react-icons/all";
import clsx from "clsx";
import { HypothesisBar } from "../HypothesisBar";
import { HypothesisBlockHeader } from "../HypothesisBlockHeader";

const UNKNOWN_TYPE = "unknown_type";

export const HypothesisNode = (props) => {
  const { node, parentArray, setModalIsOpen, setSelectedNodePath, depthLimit } =
    props;

  const isRoot = parentArray?.length <= 0;
  const type = node.type || UNKNOWN_TYPE;

  const handleOpenModal = () => {
    setSelectedNodePath([...parentArray, node.id]);
    setModalIsOpen(true);
  };

  const isDeepLimitNotReached = depthLimit > parentArray?.length;
  const nodeChildrenExist = !!node.children?.length;

  return (
    <div>
      {isRoot && (
        <div className="flex items-center text-base font-semibold mb-6 mb-5">
          <h2 className="text-dark-gray mr-3 text-2xl">Action plan</h2>
          <button
            type="button"
            className="btn-round btn-round-primary btn-round-xs"
          >
            <BsPlusLg />
          </button>
        </div>
      )}

      <div className="w-full">
        <div className="w-full mb-0.5">
          <HypothesisBar hypothesis={node} onTitleClick={handleOpenModal} />
        </div>

        {(nodeChildrenExist || isDeepLimitNotReached) && (
          <div
            className={clsx({
              "bg-light-blue p-5 mt-3 rounded-8px border border-dashed": isRoot,
              "pl-7 my-2.5": !isRoot
            })}
          >
            {isDeepLimitNotReached && (
              <HypothesisBlockHeader
                title="Node"
                noResults={!nodeChildrenExist}
                noResultsTitle="No nodes created yet"
                onButtonClick={() => {}}
                className="mb-2.5"
                {...(type === "root"
                  ? {
                      title: "Issues",
                      noResultsTitle: "No issues created yet"
                    }
                  : {})}
                {...(type === "factor"
                  ? {
                      title: "Potential Solution",
                      noResultsTitle: "No potential solutions created yet"
                    }
                  : {})}
              />
            )}

            {nodeChildrenExist &&
              node.children.map((item) => (
                <HypothesisNode
                  {...props}
                  node={item}
                  parentArray={[...parentArray, node.id]}
                  key={item.id}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
