import { ChatAltIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getPersons } from "../../api/services/users";
import { CommentInput, CommentText } from "../Comment";

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
  const [users, setUsers] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const handleComment = (event) => {
    // const key = event.keyCode || event.which;
    if (commentTextValue) {
      setIsLoading(true);
      onComment(commentTextValue).finally(() => {
        setCommentTextValue("");
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    getPersons().then(({ data }) => {
      const usersDate = data.map((user) => ({
        ...user,
        display: user.name,
        icon: user.avatar
      }));
      setUsers(usersDate);
    });
  }, []);

  const onClickUserTag = (type, id) => {
    console.log("type tag", type, "value", id);
  };

  return (
    <div className={rest.className} {...rest}>
      {titlePrepend}
      <div>
        <CommentInput
          data={users}
          value={commentTextValue}
          onChange={setCommentTextValue}
        />
        <div className="flex justify-end mt-2">
          <button
            disabled={isLoading || !commentTextValue}
            type="button"
            onClick={handleComment}
            className={
              isLoading || !commentTextValue ? "btn-disabled" : "btn-primary"
            }
          >
            Comment
          </button>
        </div>
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
      )}
    </div>
  );
}
