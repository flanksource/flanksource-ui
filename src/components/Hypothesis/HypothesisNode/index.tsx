import clsx from "clsx";
import { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  getHypothesisChildType,
  Hypothesis,
  HypothesisStatus
} from "../../../api/services/hypothesis";
import { IncidentStatus } from "../../../api/services/incident";
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
  checkStatus?: IncidentStatus | undefined;
}

export const HypothesisNode = (props: IHypothesisNodeProps) => {
  const {
    hasParent,
    node,
    showComments: parentShowComments,
    setSelectedNode,
    setCreateHypothesisModalIsOpen,
    api,
    checkStatus
  } = props;

  const isRoot = node?.type === "root" || node?.parent_id == null;

  const currentStatus = checkStatus;

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

  const chldButLast = (node?.children || []).slice(0, -1);
  const chldLast = (node?.children || []).slice(-1)[0];

  const showSideLine = !!node?.children?.length && (isRoot || showComments);

  return (
    <div>
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
            checkStatus={checkStatus}
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
              <HypothesisDetails
                node={node}
                api={api}
                currentStatus={currentStatus}
              />
            </div>
            {node?.type !== "solution" && currentStatus !== "closed" && (
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
