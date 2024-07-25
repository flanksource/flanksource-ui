import clsx from "clsx";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  Hypothesis,
  HypothesisStatus,
  getHypothesisChildType
} from "../../../../api/types/hypothesis";
import { HypothesisAPIs } from "../../../../pages/incident/IncidentDetails";
import { recentlyAddedHypothesisIdAtom } from "../../../../store/hypothesis.state";
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

  const isRoot = node?.type === "root" || node?.parent_id == null;

  const handlerOpenCreateHypothesisModal = () => {
    setSelectedNode(node);
    setCreateHypothesisModalIsOpen(true);
  };

  const [showComments, doSetShowComments] = useState(parentShowComments);
  const recentlyAddedHypothesisId = useAtomValue(recentlyAddedHypothesisIdAtom);
  const setRecentlyAddedHypothesisId = useSetAtom(
    recentlyAddedHypothesisIdAtom
  );

  const setShowComments = (showComments: boolean) => {
    doSetShowComments(showComments);
  };

  useEffect(() => {
    setShowComments(parentShowComments);
  }, [parentShowComments]);

  useEffect(() => {
    if (!recentlyAddedHypothesisId) {
      return;
    }
    if (node.id === recentlyAddedHypothesisId) {
      setShowComments(node.id === recentlyAddedHypothesisId);
      setRecentlyAddedHypothesisId(null);
    }
  }, [recentlyAddedHypothesisId, setRecentlyAddedHypothesisId, node.id]);

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
              "before:absolute before:z-[-1] before:-ml-3 before:h-8 before:w-6 before:rounded-bl-2xl before:border-b-2 before:border-l-2 before:border-gray-200 before:content-['']",
            !!showSideLine &&
              "relative after:absolute after:left-2 after:z-[-1] after:h-full after:border-l-2 after:border-gray-200 after:content-['']"
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
                "relative before:absolute before:left-2 before:z-[-1] before:h-full before:border-l-2 before:border-gray-200 before:content-['']"
            )}
          >
            <div className="px-5">
              <HypothesisDetails node={node} api={api} />
            </div>
            {node?.type !== "solution" && (
              <div
                className="text-gray flex cursor-pointer items-end justify-center pb-4 underline"
                onClick={handlerOpenCreateHypothesisModal}
              >
                <AiOutlinePlusCircle color="text-gray-600" />
                <span className="block pl-1 text-sm text-gray-600">
                  Add {getHypothesisChildType(node?.type)}
                </span>
              </div>
            )}

            {!!chldButLast.length && (
              <div className="pl-5 pt-5">
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
