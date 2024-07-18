import clsx from "clsx";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

import { Comment } from "../../../../api/types/incident";
import { CommentInput } from "../../../../ui/Comment";
import { ResponseLine } from "../ResponseLine";

interface Props {
  comments: Comment[];
  titlePrepend?: React.ReactNode;
  onComment?: (str: string) => Promise<void>;
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
      onComment?.(commentTextValue).finally(() => {
        setCommentTextValue("");
        setIsLoading(false);
      });
    }
  };

  return (
    <div className={rest.className} {...rest}>
      {titlePrepend}
      {!!comments?.length && (
        <div>
          {comments.map(({ id, created_by, created_at, ...comment }) => (
            <ResponseLine
              key={id}
              created_by={created_by as any}
              created_at={created_at}
              response={comment as any}
            />
          ))}
        </div>
      )}
      <div className="relative">
        <CommentInput
          isSingleLine
          value={commentTextValue}
          onChange={setCommentTextValue}
          onEnter={() => handleComment()}
        />
        <div className="absolute right-0 top-0 flex h-full">
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
