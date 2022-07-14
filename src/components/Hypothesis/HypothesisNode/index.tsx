import clsx from "clsx";
import { BsPlusLg } from "react-icons/bs";
import { Switch } from "@headlessui/react";
import { useSearchParams } from "react-router-dom";

import { HypothesisBar } from "../HypothesisBar";
import { HypothesisStatus } from "../../../api/services/hypothesis";
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
  hasParent: boolean;
  node: IHypothesisNode;
  setModalIsOpen: (v: boolean) => void;
  setSelectNode: (v: IHypothesisNode) => void;
  setCreateHypothesisModalIsOpen: (v: boolean) => void;
  api: { [k: string]: any };
}

export const HypothesisNode = (props: IHypothesisNodeProps) => {
  const {
    hasParent,
    node,
    setModalIsOpen,
    setSelectedNode,
    setCreateHypothesisModalIsOpen,
    api
  } = props;

  const [searchParams, setSearchParams] = useSearchParams();

  const isRoot = node?.type === "root" || node?.parent_id == null;

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
              onClick={handlerOpenCreateHypothesisModal}
              className="btn-round btn-round-primary btn-round-sm"
            >
              <BsPlusLg />
            </button>
          </div>
          <div className="flex items-center">
            <div className="pr-4">Show Comments</div>
            <Switch
              checked={true}
              onChange={toggleComment}
              className={clsx(
                showComments ? "bg-blue-900" : "bg-gray-200",
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

      <div
        className={clsx(
          "relative before:content-[''] before:absolute before:border-l-2 before:border-gray-200 before:left-2 before:h-full before:z-[-1]"
        )}
      >
        {Boolean(node) && (
          <div
            className={clsx(
              "relative",
              hasParent &&
                "before:content-[''] before:border-gray-200 before:z-0 before:absolute before:w-6 before:h-8 before:-ml-3 before:border-l-2 before:border-b-2 before:rounded-bl-2xl before:z-[-1]"
            )}
          >
            <HypothesisBar
              hypothesis={node}
              onTitleClick={handleOpenModal}
              api={api}
              onDisprove={() => {
                props.api.updateMutation.mutate({
                  id: node.id,
                  params: {
                    status: HypothesisStatus.Disproven
                  }
                });
              }}
            />
          </div>
        )}

        <div>
          {!!node && showComments && (
            <div className="px-5">
              <HypothesisDetails node={node} api={api} />
            </div>
          )}
          <div className={clsx("mt-10", isRoot ? "pl-5" : "pl-7")}>
            {(node?.children || []).map((item) => (
              <HypothesisNode
                {...props}
                api={api}
                hasParent
                node={item}
                key={item.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
