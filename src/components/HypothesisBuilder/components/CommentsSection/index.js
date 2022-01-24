import { ChatAltIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import React, { useState } from "react";

function getInitials(name) {
  const matches = name.match(/\b(\w)/g);
  return matches.slice(0, 2);
}

export function CommentsSection({
  comments,
  titlePrepend,
  onComment,
  ...rest
}) {
  const [commentTextValue, setCommentTextValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleComment = () => {
    if (commentTextValue) {
      setIsLoading(true);
      onComment(commentTextValue).finally(() => {
        setCommentTextValue("");
        setIsLoading(false);
      });
    }
  };

  return (
    <div className={rest.className} {...rest}>
      {titlePrepend}
      <div>
        <textarea
          disabled={isLoading}
          className="w-full text-sm p-2 border-gray-200 rounded-md h-20"
          onChange={(e) => setCommentTextValue(e.target.value)}
          value={commentTextValue}
          style={{ minHeight: "80px" }}
        />
        <div className="flex justify-end">
          <button
            disabled={isLoading || !commentTextValue}
            type="button"
            onClick={handleComment}
            className={`${
              isLoading || !commentTextValue
                ? "bg-gray-200  text-gray-400"
                : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
            } inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            Comment
          </button>
        </div>
      </div>
      {comments.length <= 0 ? (
        <div className="text-sm text-gray-400">No comments yet</div>
      ) : (
        <ul className="-mb-8">
          {comments.map((comment, commentIdx) => (
            <li key={comment.id}>
              <div className="relative pb-8">
                {commentIdx !== comments.length - 1 ? (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    {comment.imageUrl ? (
                      <img
                        className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                        src={comment.imageUrl}
                        alt=""
                      />
                    ) : (
                      <div
                        className="h-10 w-10 font-semibold rounded-full bg-gray-300 flex items-center justify-center ring-8 ring-white"
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
                        <span className="font-medium text-gray-900">
                          {comment.created_by.name}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400">
                        commented on{" "}
                        {dayjs(comment.created_at).format("DD-MM-YYYY, hh:mma")}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
