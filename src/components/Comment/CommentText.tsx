import React from "react";

interface Props {
  text: string;
  onClickTag: (type: string, user: string) => void;
}

export const CommentText = ({ text, onClickTag }: Props) => {
  const tags = text.match(/@\[.*?\]\(user:.*?\)/gi) || [];
  const otherText = text.split(/@\[.*?\]\(user:.*?\)/gi);

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
            {otherText[idx + 1] || ""}
            <button
              type="button"
              key={tagId}
              onClick={() => onClickTag("user", tagId)}
              className="bg-blue-200 rounded"
            >
              {tagDisplay || ""}
            </button>
          </React.Fragment>
        );
      })}
    </>
  );
};
