import { ChatAltIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import { CommentText } from "../Comment";

export const DefaultCommentsTimeline = ({
  comments,
  onClickUserTag,
  getInitials
}) => (
  <ul className="-mb-8 mt-5">
    {comments.map((comment) => (
      <li key={comment.id}>
        <div className="relative pb-8">
          <div className="relative flex items-start space-x-3">
            <div className="relative">
              {comment.imageUrl ? (
                <img
                  className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center"
                  src={comment.imageUrl}
                  alt=""
                />
              ) : (
                <div
                  className="h-10 w-10 font-semibold rounded-full bg-gray-300 flex items-center justify-center"
                  src={comment.imageUrl}
                  alt=""
                >
                  {getInitials(comment.created_by.name)}
                </div>
              )}

              <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                <ChatAltIcon
                  className="h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div>
                <div className="text-sm">
                  <span className="text-gray-900 text-sm leading-5 font-medium">
                    {comment.created_by.name}
                  </span>
                </div>
                <p className="mt-0.5 text-gray-500 text-sm leading-5 font-normal">
                  commented {dayjs(comment.created_at).fromNow()}
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <p className="whitespace-pre">
                  <CommentText
                    text={comment.comment}
                    onClickTag={onClickUserTag}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    ))}
  </ul>
);
