import clsx from "clsx";
import React from "react";

interface Props {
  text: string;
  onClickTag?: (type: string, user: string) => void;
}

export function CommentText({ text, onClickTag }: Props) {
  const tags = (text?.match(/@\[.*?\]\(user:.*?\)/gi) || []).filter((v) => v);
  const otherText = text?.split(/@\[.*?\]\(user:.*?\)/gi) || [];
  return (
    <>
      {otherText[0] || ""}
      {tags.map((tag, idx) => {
        // @ts-ignore:next-line
        const tagDisplay = tag.match(/\[.*?\]/gi)[0]?.slice(1, -1);
        // @ts-ignore:next-line
        const tagId = tag.match(/\(user:.*?\)/gi)[0]?.slice(6, -1);

        return (
          <React.Fragment key={idx}>
            <button
              type="button"
              key={tagId}
              onClick={onClickTag && (() => onClickTag("user", tagId))}
              className={clsx(
                "bg-blue-200 rounded",
                !onClickTag && "btn-disabled"
              )}
            >
              {tagDisplay || ""}
            </button>
            {otherText[idx + 1] || ""}
          </React.Fragment>
        );
      })}
    </>
  );
}
