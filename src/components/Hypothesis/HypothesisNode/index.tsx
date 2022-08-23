import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import {
  getHypothesisChildType,
  Hypothesis,
  HypothesisStatus
} from "../../../api/services/hypothesis";
import { HypothesisAPIs } from "../../../pages/incident/IncidentDetails";
import { HypothesisBar } from "../HypothesisBar";
import { HypothesisDetails } from "../HypothesisDetails";

interface IHypothesisNodeProps {
  hasParent?: boolean;
  node: Hypothesis;
  showComments: boolean;
  setSelectedNode: (v: Hypothesis) => void;
  setCreateHypothesisModalIsOpen: (v: boolean) => void;
  api: HypothesisAPIs;
}

export const HypothesisNode = (props: IHypothesisNodeProps) => {
  const {
    hasParent,
    node,
    showComments: parentShowComments,
    setSelectedNode,
    setCreateHypothesisModalIsOpen,
    api
  } = props;

  const [searchParams, setSearchParams] = useSearchParams();

  const isRoot = node?.type === "root" || node?.parent_id == null;

  const handlerOpenCreateHypothesisModal = () => {
    setSelectedNode(node);
    setCreateHypothesisModalIsOpen(true);
  };

  const [showComments, doSetShowComments] = useState(parentShowComments);

  const setShowComments = (showComments: boolean) => {
    doSetShowComments(showComments);
  };

  useEffect(() => {
    setShowComments(parentShowComments);
  }, [parentShowComments]);

  const showAllComments = searchParams.get("comments") === "true";
  const toggleComment = () => {
    const newParams = new URLSearchParams(
      showAllComments ? {} : { comments: "true" }
    );
    setSearchParams(newParams);
  };

  const chldButLast = (node?.children || []).slice(0, -1);
  const chldLast = (node?.children || []).slice(-1)[0];

  const showSideLine = !!node?.children?.length && (isRoot || showComments);

  return (
    <div>
      {isRoot && (
        <div className="flex items-center text-base font-semibold mb-5 justify-between">
          <div className="flex items-center">
            <h2 className="text-dark-gray mr-3 text-2xl">Action plan</h2>
          </div>
          <div className="flex items-center">
            <div className="pr-4">
              {showAllComments ? "Collapse" : "Expand"} All
            </div>
            <Switch
              checked={true}
              onChange={toggleComment}
              className={clsx(
                showAllComments ? "bg-blue-900" : "bg-gray-200",
                "relative inline-flex shrink-0 h-[30px] w-[50px] cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              )}
            >
              <span className="sr-only">Show Comments</span>
              <span
                aria-hidden="true"
                className={clsx(
                  showAllComments ? "translate-x-5" : "translate-x-0",
                  "h-[26px] w-[26px] pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
        </div>
      )}

      {Boolean(node) && (
        <div
          className={clsx(
            "relative pb-4",
            hasParent &&
              "before:content-[''] before:border-gray-200 before:absolute before:w-6 before:h-8 before:-ml-3 before:border-l-2 before:border-b-2 before:rounded-bl-2xl before:z-[-1]",
            !!showSideLine &&
              "relative after:content-[''] after:absolute after:border-l-2 after:border-gray-200 after:left-2 after:h-full after:z-[-1]"
          )}
        >
          <HypothesisBar
            hypothesis={node}
            api={api}
            showExpand={!isRoot}
            expanded={showComments}
            onToggleExpand={(show) => setShowComments(show)}
            onDisprove={() => {
              api.updateMutation.mutate({
                id: node.id,
                params: {
                  status: HypothesisStatus.Disproven
                }
              });
            }}
          />
        </div>
      )}

      {(isRoot || showComments) && (
        <>
          <div
            className={clsx(
              !!showSideLine &&
                "relative before:content-[''] before:absolute before:border-l-2 before:border-gray-200 before:left-2 before:h-full before:z-[-1]"
            )}
          >
            <div className="px-5">
              <HypothesisDetails node={node} api={api} />
            </div>
            {node?.type !== "solution" && (
              <div
                className="text-gray underline flex justify-center items-end cursor-pointer pb-4"
                onClick={handlerOpenCreateHypothesisModal}
              >
                <AiOutlinePlusCircle color="text-gray-600" />
                <span className="pl-1 text-sm block text-gray-600 ">
                  Add {getHypothesisChildType(node?.type)}
                </span>
              </div>
            )}

            {!!chldButLast.length && (
              <div className="pt-5 pl-5">
                {chldButLast.map((item) => (
                  <HypothesisNode
                    {...props}
                    showComments={showComments}
                    api={api}
                    hasParent
                    node={item}
                    key={item.id}
                  />
                ))}
              </div>
            )}
          </div>

          {!!chldLast && (
            <div className="pl-5">
              <HypothesisNode
                {...props}
                showComments={showComments}
                api={api}
                hasParent
                node={chldLast}
                key={chldLast.id}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
