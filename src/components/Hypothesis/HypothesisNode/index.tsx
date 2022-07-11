import clsx from "clsx";
import { BsPlusLg } from "react-icons/bs";
import { Switch } from "@headlessui/react";
import { useSearchParams } from "react-router-dom";

import { HypothesisBar } from "../HypothesisBar";
import { HypothesisBlockHeader } from "../../HypothesisBuilder/hypothesis-header";
import { HypothesisStatus } from "../../../api/services/hypothesis";
import { HypothesisTitle } from "../HypothesisTitle";
import { HypothesisDetails } from "../HypothesisDetails";

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

interface IHypothesisNode {
  [k: string]: any;
}

interface IHypothesisNodeProps {
  node: IHypothesisNode;
  setModalIsOpen: (v: boolean) => void;
  setSelectNode: (v: IHypothesisNode) => void;
  setCreateHypothesisModalIsOpen: (v: boolean) => void;
  api: { [k: string]: any };
}

export const HypothesisNode = (props: IHypothesisNodeProps) => {
  const {
    node,
    setModalIsOpen,
    setSelectedNode,
    setCreateHypothesisModalIsOpen,
    api
  } = props;

  const [searchParams, setSearchParams] = useSearchParams();

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
  const showComments = searchParams.get("comments") === "true";

  const toggleComment = () => {
    const newParams = new URLSearchParams(
      showComments ? {} : { comments: "true" }
    );
    setSearchParams(newParams);
  };

  return (
    <div>
      {isRoot && (
        <div className="flex items-center text-base font-semibold mb-5 justify-between">
          <div className="flex items-center">
            <h2 className="text-dark-gray mr-3 text-2xl">Action plan</h2>
            <button
              type="button"
              className="btn-round btn-round-primary btn-round-sm"
            >
              <BsPlusLg />
            </button>
          </div>
          <div className="flex items-center py-16">
            <div className="pr-4">Show Comments</div>
            <Switch
              checked={true}
              onChange={toggleComment}
              className={clsx(
                showComments ? "bg-teal-900" : "bg-gray-200",
                "relative inline-flex shrink-0 h-[30px] w-[50px] cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              )}
            >
              <span className="sr-only">Show Comments</span>
              <span
                aria-hidden="true"
                className={clsx(
                  showComments ? "translate-x-5" : "translate-x-0",
                  "h-[26px] w-[26px] pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
        </div>
      )}

      <div className="w-full bg-white rounded-8px shadow">
        <div className="w-full mb-0.5">
          {Boolean(node) && (
            <HypothesisBar
              hypothesis={node}
              onTitleClick={handleOpenModal}
              onDisprove={() => {
                props.api.updateMutation.mutate({
                  id: node.id,
                  params: {
                    status: HypothesisStatus.Disproven
                  }
                });
              }}
            />
          )}
        </div>

        <div>
          {!!node && showComments && (
            <div className="px-4">
              <HypothesisDetails node={node} api={api} />
            </div>
          )}
          <div
            className={clsx({
              "bg-light-blue p-5 mt-3 rounded-8px border border-dashed": isRoot,
              "pl-7 my-2.5": !isRoot
            })}
          >
            {(node?.children || []).map((item) => (
              <HypothesisNode {...props} node={item} key={item.id} />
            ))}
            {false && (
              <HypothesisBlockHeader
                onButtonClick={handlerOpenCreateHypothesisModal}
                className="mb-2.5"
                {...propsByType(type)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
