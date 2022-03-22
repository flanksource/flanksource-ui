import React from "react";

export const swapTags = (text, onClickTag) => {
  // markup @[__display__](user:__id__)
  const tags = text.match(/@\[.*?\]\(user:.*?\)/gi) || [];
  const otherText = text.split(/@\[.*?\]\(user:.*?\)/gi);
  return tags.reduce(
    (display, myTag, index) => {
      const tagDisplay = myTag.match(/\[.*?\]/gi)[0].slice(1, -1);
      const tagData = myTag.match(/\(user:.*?\)/gi)[0].slice(6, -1);
      return [
        ...display,
        <button
          type="button"
          key={tagData}
          onClick={() => onClickTag("user", tagData)}
          className="bg-blue-200 rounded"
        >
          {tagDisplay}
        </button>,
        otherText[index + 1]
      ];
    },
    [otherText[0]]
  );
};
