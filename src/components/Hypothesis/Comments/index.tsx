import clsx from "clsx";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

import { CommentInput } from "../../Comment";
import { Comment } from "../../../api/services/comments";
import { ResponseLine } from "../ResponseLine";

interface Props {
  comments: Comment[];
  titlePrepend: React.ReactElement;
  onComment: (str: string) => Promise<void>;
}

export function CommentsSection({
  comments,
  titlePrepend,
  onComment,
  ...rest
}: Props & React.HTMLProps<HTMLDivElement>) {
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

  const onClickUserTag = (type: string, id: string) => {
    // eslint-disable-next-line no-console
    console.log("type tag", type, "value", id);
  };

  return (
    <div className={rest.className} {...rest}>
      {titlePrepend}
      {!!comments?.length && (
        <div>
          {comments.map(({ id, created_by, created_at, ...comment }) => (
            <ResponseLine
              key={id}
              created_by={created_by}
              created_at={created_at}
              response={comment}
            />
          ))}
        </div>
      )}
      <div className="relative">
        <CommentInput
          singleLine
          value={commentTextValue}
          onChange={setCommentTextValue}
          onEnter={() => handleComment()}
        />
        <div className="flex h-full absolute top-0 right-0">
          <button
            disabled={isLoading || !commentTextValue}
            type="button"
            onClick={handleComment}
            className={clsx(
              "p-1 pl-2",
              isLoading || !commentTextValue ? "btn-disabled" : "btn-primary",
              "rounded-l-none"
            )}
          >
            <IoMdSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
