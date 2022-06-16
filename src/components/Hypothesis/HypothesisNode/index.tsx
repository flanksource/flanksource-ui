import { BsPlusLg } from "react-icons/bs";
import clsx from "clsx";
import { HypothesisBar } from "../HypothesisBar";
import { HypothesisBlockHeader } from "../../HypothesisBuilder/hypothesis-header";

const propsByType = (type: string) => {
  if (!type) {
    return {
      title: "Add main issue",
      noResultsTitle: "No root issue created yet."
    };
  }
  if (type === "root") {
    return {
      title: "Add new issue",
      noResultsTitle: "No issues created yet"
    };
  }
  if (type === "factor") {
    return {
      title: "Add new potential solution",
      noResultsTitle: "No potential solutions created yet"
    };
  }

  return {};
};

export const HypothesisNode = (props) => {
  const {
    node,
    setModalIsOpen,
    setSelectedNode,
    setCreateHypothesisModalIsOpen
  } = props;

  const isRoot = node?.type === "root" || node?.parent_id == null;
  const type = node?.type;

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
          {Boolean(node) && (
            <HypothesisBar hypothesis={node} onTitleClick={handleOpenModal} />
          )}
        </div>

        <div
          className={clsx({
            "bg-light-blue p-5 mt-3 rounded-8px border border-dashed": isRoot,
            "pl-7 my-2.5": !isRoot
          })}
        >
          {(node?.children || []).map((item) => (
            <HypothesisNode {...props} node={item} key={item.id} />
          ))}
          <HypothesisBlockHeader
            onButtonClick={handlerOpenCreateHypothesisModal}
            className="mb-2.5"
            {...propsByType(type)}
          />
        </div>
      </div>
    </div>
  );
};
