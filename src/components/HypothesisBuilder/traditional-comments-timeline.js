import dayjs from "dayjs";
import { CommentText } from "../Comment";

export const TraditionalCommentsTimeline = ({
  comments,
  onClickUserTag,
  getInitials
}) => (
  <ul className="-mb-8 mt-5">
    {comments.map((comment) => (
      <li key={comment.id}>
        <div className="pb-2">
          <div className="flex items-center">
            <div className="text-sm">
              <span className="text-yellow-800 text-sm leading-5 font-medium">
                {`[${comment?.subject || "No subject"}]`}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-blue-900 text-sm leading-5 font-medium">
                {`[${comment.created_by.name}]`}
              </span>
            </div>
            <div className="ml-1.5">
              {comment.imageUrl ? (
                <img
                  className="h-5 w-5 rounded-full bg-gray-400 flex items-center justify-center"
                  src={comment.imageUrl}
                  alt=""
                />
              ) : (
                <div
                  className="h-4 w-4 font-semibold text-xs rounded-full bg-gray-300 flex items-center justify-center"
                  src={comment.imageUrl}
                  alt=""
                >
                  {getInitials(comment.created_by.name)}
                </div>
              )}
            </div>
            <div className="min-w-0 ml-1.5">
              <div className="text-sm text-gray-700">
                <p>
                  <CommentText
                    text={comment.comment}
                    onClickTag={onClickUserTag}
                  />
                </p>
              </div>
            </div>
            <div className="ml-2.5">
              <p className="text-gray-400 text-xs leading-5 font-normal">
                {dayjs(comment.created_at).fromNow()}
              </p>
            </div>
          </div>
        </div>
      </li>
    ))}
  </ul>
);
