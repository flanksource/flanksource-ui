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

  const handleComment = (event) => {
    const key = event.keyCode || event.which;
    if (commentTextValue && key === 13) {
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
          className="w-full border-gray-200 resize-none rounded-6px text-base leading-6 font-normal font-inter outline-none text-dark-gray mb-2"
          onChange={(e) => setCommentTextValue(e.target.value)}
          placeholder="Type something"
          value={commentTextValue}
          style={{ minHeight: "70px" }}
          onKeyPress={(event) => handleComment(event)}
        />
      </div>
      {comments.length <= 0 ? (
        <div className="text-sm text-gray-400">No comments yet</div>
      ) : (
        <ul className="-mb-8">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="relative pb-8">
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
                        commented {dayjs(comment.created_at).fromNow()}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p className="whitespace-pre">{comment.comment}</p>
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
