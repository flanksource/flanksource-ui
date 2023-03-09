import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Comment } from "../../../api/services/comments";
import { dateSortHelper, relativeDateTime } from "../../../utils/date";
import { CommentInput, CommentText } from "../../Comment";
import { Icon } from "../../Icon";
import { Avatar } from "../../Avatar";
import { CreatedBy } from "../ResponseLine";
import { Tag } from "../../Tag/Tag";
import { SortOrders } from "../../../constants";
import { Hypothesis } from "../../../api/services/hypothesis";
import {
  HypothesisAPIs,
  TreeNode
} from "../../../pages/incident/IncidentDetails";
import { Evidence } from "../../../api/services/evidence";
import { EvidenceItem } from "../EvidenceSection";
import { useUser } from "../../../context";
import { toastError } from "../../Toast/toast";
import { useIncidentQuery } from "../../../api/query-hooks";
import clsx from "clsx";
import { IoMdSend } from "react-icons/io";
import { OptionItem, SearchSelect } from "../../SearchSelect";
import useRunTaskOnPropChange from "../../../hooks/useRunTaskOnPropChange";

interface IProps {
  incidentId: string;
  loadedTrees: TreeNode<Hypothesis>[] | null;
  api: HypothesisAPIs;
}

enum CommentViewEntryTypes {
  comment = "comment",
  evidence = "evidence"
}

type CommentViewEntry = {
  type: CommentViewEntryTypes;
  hypothesis: string;
  data: Comment & Evidence;
};

export function HypothesisCommentsViewContainer({
  incidentId,
  loadedTrees,
  api
}: IProps) {
  const incidentQuery = useIncidentQuery(incidentId);
  const [commentTextValue, setCommentTextValue] = useState("");
  const [selectedHypothesis, setSelectedHypothesis] =
    useState<OptionItem | null>(null);
  const [allHypothesises, setAllHypothesises] = useState<OptionItem[]>([]);
  const { user } = useUser();
  const commentRef = useRef<HTMLDivElement>(null);
  const clientHeight = window.document.body.clientHeight;

  const comments = useMemo(() => {
    let data: CommentViewEntry[] = [];
    const hypothesis: OptionItem[] = [];
    function collectCommentsAndEvidences(trees: any[]) {
      for (let j = 0; j < trees.length; j++) {
        const tree = trees[j];
        hypothesis.push({
          label: tree.title,
          value: tree.id
        });
        const comments = tree.comments.map((comment: Comment) => {
          return {
            type: CommentViewEntryTypes.comment,
            data: comment,
            hypothesis: tree.title
          };
        });
        data = [...data, ...comments];
        const evidences = tree.evidences.map((evidence: Evidence) => {
          return {
            type: CommentViewEntryTypes.evidence,
            data: evidence,
            hypothesis: tree.title
          };
        });
        data = [...data, ...evidences];
        for (let i = 0; i < tree.children?.length; i++) {
          collectCommentsAndEvidences([tree.children[i]]);
        }
      }
    }
    collectCommentsAndEvidences(loadedTrees || []);
    data.sort((v1, v2) => {
      return dateSortHelper(
        SortOrders.asc,
        v1.data.created_at,
        v2.data.created_at
      );
    });
    setAllHypothesises(hypothesis);
    const rootHypothesisId = loadedTrees?.find(
      (item) => item.type === "root"
    )?.id;
    setSelectedHypothesis(
      hypothesis.find((item) => item.value === rootHypothesisId)!
    );
    return data;
  }, [loadedTrees]);

  const clientTopFn = useCallback(() => {
    return commentRef?.current?.getBoundingClientRect()?.top || 0;
  }, []);

  const scrollHeightFn = useCallback(() => {
    return commentRef.current?.firstElementChild?.scrollHeight || 0;
  }, []);

  useRunTaskOnPropChange<number>(clientTopFn, () => {
    if (!commentRef.current) {
      return;
    }
    const data = commentRef.current.getBoundingClientRect();
    const totalHeight = clientHeight;
    const commentBoxContainerHeight = 100;
    const height = `${totalHeight - data.top - commentBoxContainerHeight}px`;
    commentRef.current.style.setProperty("height", height);
  });

  useRunTaskOnPropChange<number>(scrollHeightFn, () => {
    if (commentRef.current?.firstElementChild) {
      commentRef.current.firstElementChild.scrollTop =
        2 * commentRef.current.firstElementChild.scrollHeight;
    }
  });

  const handleComment = () => {
    if (!selectedHypothesis) {
      toastError("Please select any hypothesis");
      return;
    }
    if (!commentTextValue) {
      toastError("Please add comment details");
      return;
    }
    api.createComment
      .mutateAsync({
        user: user!,
        incidentId: incidentId,
        hypothesisId: selectedHypothesis.value!,
        comment: commentTextValue
      })
      .catch((err) => {
        toastError(err);
        return Promise.resolve();
      })
      .then(() => {
        incidentQuery.refetch();
        setCommentTextValue("");
      });
  };

  if (!comments.length) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      <div ref={commentRef} className="flex flex-col justify-end">
        <div className="flex flex-col overflow-y-auto p-4">
          {comments.map(({ data, hypothesis, type }, index) => (
            <HypothesisCommentViewEntry
              type={
                data.type
                  ? CommentViewEntryTypes.evidence
                  : CommentViewEntryTypes.comment
              }
              key={index}
              hypothesis={hypothesis}
              created_by={data.created_by as CreatedBy}
              created_at={data.created_at}
              data={data}
              lastComment={index === comments.length - 1}
              className="w-full"
            />
          ))}
        </div>
      </div>
      <div className="border-b my-1 w-full"></div>
      <div className="relative flex items-start space-x-3 w-full p-4">
        <div className="relative">
          <Avatar user={user!} circular />
        </div>
        <div className="min-w-0 flex-1 flex flex-col space-y-4">
          <div id="comment-box" className="flex flex-col flex-1 space-y-4">
            <div className="relative">
              <CommentInput
                isSingleLine
                value={commentTextValue}
                onChange={setCommentTextValue}
                onEnter={() => {
                  handleComment();
                  setCommentTextValue("");
                }}
                inputStyle={{
                  paddingRight: 180,
                  zIndex: 0,
                  maxWidth: "100%"
                }}
              />
              <div className="right-[40px] top-0 absolute">
                <SearchSelect
                  options={allHypothesises}
                  name=""
                  onChange={(val) => {
                    setSelectedHypothesis(val);
                  }}
                  selected={selectedHypothesis!}
                  selectContainerClassName="bg-white shadow-card rounded-md -mt-20 absolute z-20 w-72 -ml-36"
                  toggleBtn={
                    <Tag
                      className="whitespace-nowrap w-32 text-ellipsis overflow-hidden cursor-pointer bg-blue-100 text-blue-800 px-2 z-100 my-2 ml-2"
                      data-tip={selectedHypothesis?.label}
                    >
                      {selectedHypothesis?.label}
                    </Tag>
                  }
                  menuPlacement="top"
                />
              </div>
              <div className="flex h-full absolute top-0 right-0 z-100">
                <button
                  disabled={!commentTextValue}
                  type="button"
                  onClick={handleComment}
                  className={clsx(
                    "p-1 pl-2",
                    !commentTextValue ? "btn-disabled" : "btn-primary",
                    "rounded-l-none"
                  )}
                >
                  <IoMdSend size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HypothesisCommentViewEntry({
  type,
  created_by,
  created_at,
  data,
  hypothesis,
  lastComment,
  className
}: {
  type: CommentViewEntryTypes;
  created_by: CreatedBy;
  hypothesis: string;
  created_at: string;
  data: Comment & Evidence;
  lastComment: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("relative", !lastComment && "pb-8", className)}>
      {!lastComment && (
        <span
          className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        ></span>
      )}
      <div className="relative flex items-start space-x-3">
        <div className="relative">
          {created_by?.team ? (
            <Icon className="rounded-full" name={created_by.team.icon} />
          ) : (
            <Avatar user={created_by} circular />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div>
            <div className="flex flex-row">
              <div className="flex-1 text-sm font-medium text-gray-900">
                {created_by?.team
                  ? `${created_by.team.name} (${created_by?.name})`
                  : created_by?.name}
                <span className="inline-block pl-1 text-xs text-gray-500">
                  {relativeDateTime(created_at)}{" "}
                  {type === CommentViewEntryTypes.comment && "commented"}
                  {type === CommentViewEntryTypes.evidence && "added evidence"}
                </span>
              </div>
              <div className="flex flex-1 justify-end">
                <Tag className="bg-blue-100 text-blue-800 inline-flex px-2">
                  {hypothesis}
                </Tag>
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {type === CommentViewEntryTypes.comment && (
              <CommentText text={data.comment} />
            )}
            {type === CommentViewEntryTypes.evidence && (
              <EvidenceItem evidence={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
