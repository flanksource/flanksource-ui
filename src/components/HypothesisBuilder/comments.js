import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { getPersons } from "../../api/services/users";
import { CommentInput } from "../Comment";
import { DefaultCommentsTimeline } from "./default-comments-timeline";
import { TraditionalCommentsTimeline } from "./traditional-comments-timeline";

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
  const [commentsView, setCommentsView] = useState("Default");

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
    // eslint-disable-next-line no-console
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
      <div className="flex mb-6">
        <div className="mr-2">Comments view:</div>
        <div className="rounded-sm">
          {["Default", "Traditional"].map((view) => (
            <button
              className={clsx(
                "px-1 text-sm",
                commentsView === view ? "bg-blue-200" : "bg-gray-200"
              )}
              type="button"
              key={view}
              onClick={() => setCommentsView(view)}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
      {comments.length <= 0 ? (
        <div className="text-sm text-gray-400">No comments yet</div>
      ) : commentsView === "Default" ? (
        <DefaultCommentsTimeline
          comments={comments}
          onClickUserTag={onClickUserTag}
          getInitials={getInitials}
        />
      ) : (
        <TraditionalCommentsTimeline
          comments={comments}
          onClickUserTag={onClickUserTag}
          getInitials={getInitials}
        />
      )}
    </div>
  );
}
