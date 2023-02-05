import { useMemo, useState } from "react";
import { Comment } from "../../../api/services/comments";
import { dateSortHelper, relativeDateTime } from "../../../utils/date";
import { CommentText } from "../../Comment";
import { Icon } from "../../Icon";
import { Avatar } from "../../Avatar";
import { CreatedBy } from "../ResponseLine";
import { Tag } from "../../Tag/Tag";
import { BsSortUp, BsSortDown } from "react-icons/bs";
import { SortOrders } from "../../../constants";
import { Hypothesis } from "../../../api/services/hypothesis";
import { TreeNode } from "../../../pages/incident/IncidentDetails";

interface IProps {
  loadedTrees: TreeNode<Hypothesis>[] | null;
}

export function HypothesisCommentsContainer({ loadedTrees }: IProps) {
  const [sortOrder, setSortOrder] = useState(SortOrders.desc);

  const comments = useMemo(() => {
    let data: any[] = [];
    function collectComments(trees: any[]) {
      for (let j = 0; j < trees.length; j++) {
        const tree = trees[j];
        const comments = tree.comments.map((comment: Comment) => {
          return {
            ...comment,
            hypothesis: tree.title
          };
        });
        data = [...data, ...comments];
        for (let i = 0; i < tree.children?.length; i++) {
          collectComments([tree.children[i]]);
        }
      }
    }
    collectComments(loadedTrees || []);
    data.sort((v1, v2) => {
      return dateSortHelper(sortOrder, v1.created_at, v2.created_at);
    });
    return data;
  }, [loadedTrees, sortOrder]);

  if (!comments.length) {
    return null;
  }

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex justify-end">
        <div className="flex cursor-pointer md:mt-0 md:items-center border border-gray-300 bg-white rounded-md shadow-sm px-2 py-1">
          {sortOrder === SortOrders.asc && (
            <BsSortUp
              className="w-3 h-3 text-gray-700 hover:text-gray-900"
              onClick={() => setSortOrder(SortOrders.desc)}
            />
          )}
          {sortOrder === SortOrders.desc && (
            <BsSortDown
              className="w-3 h-3 text-gray-700 hover:text-gray-900"
              onClick={() => setSortOrder(SortOrders.asc)}
            />
          )}
          <span className="flex ml-2 text-xs text-gray-700 capitalize bold hover:text-gray-900">
            comments
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        {comments.map(
          ({ id, created_by, created_at, hypothesis, ...data }, index) => (
            <HypothesisComment
              key={id}
              hypothesis={hypothesis}
              created_by={created_by}
              created_at={created_at}
              data={data}
              lastComment={index === comments.length - 1}
            />
          )
        )}
      </div>
    </div>
  );
}

export function HypothesisComment({
  created_by,
  created_at,
  data,
  hypothesis,
  lastComment
}: {
  created_by: CreatedBy;
  hypothesis: string;
  created_at: string;
  data: Comment;
  lastComment: boolean;
}) {
  return (
    <div className="relative pb-8">
      {!lastComment && (
        <span
          className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        ></span>
      )}
      <div className="relative flex items-start space-x-3">
        <div className="relative">
          {created_by.team ? (
            <Icon className="rounded-full" name={created_by.team.icon} />
          ) : (
            <Avatar user={created_by} circular />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div>
            <div className="flex flex-row">
              <div className="flex-1 text-sm font-medium text-gray-900">
                {created_by.team
                  ? `${created_by.team.name} (${created_by?.name})`
                  : created_by?.name}
              </div>
              <div className="flex flex-1 justify-end">
                <Tag className="bg-blue-100 text-blue-800 inline-flex px-2">
                  {hypothesis}
                </Tag>
              </div>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              commented {relativeDateTime(created_at)}
            </p>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <CommentText text={data.comment} />
          </div>
        </div>
      </div>
    </div>
  );
}
