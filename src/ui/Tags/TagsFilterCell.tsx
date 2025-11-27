import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Tag } from "./Tag";

type TagsFilterCellProps = {
  tags: Record<string, any>;
  filterByTagParamKey?: string;
};

export default function TagsFilterCell({
  tags,
  filterByTagParamKey = "labels"
}: TagsFilterCellProps) {
  const [params, setParams] = useSearchParams();

  const tagEntries = Object.entries(tags).filter(([key]) => key !== "toString");

  const onFilterByTag = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement>,
      tag: {
        key: string;
        value: string;
      },
      action: "include" | "exclude"
    ) => {
      e.preventDefault();
      e.stopPropagation();

      // Get the current tags from the URL
      const currentTags = params.get(filterByTagParamKey);
      const currentTagsArray = (
        currentTags ? currentTags.split(",") : []
      ).filter((value) => {
        const tagKey = value.split("____")[0];
        const tagAction = value.split(":")[1] === "1" ? "include" : "exclude";

        if (tagKey === tag.key && tagAction !== action) {
          return false;
        }
        return true;
      });

      // Append the new value, but for same tags, don't allow including and excluding at the same time
      const updatedValue = currentTagsArray
        .concat(`${tag.key}____${tag.value}:${action === "include" ? 1 : -1}`)
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(",");

      // Update the URL
      params.set(filterByTagParamKey, updatedValue);
      setParams(params);
    },
    [filterByTagParamKey, params, setParams]
  );

  if (tagEntries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tagEntries.map(([key, value]) => (
        <Tag
          key={key}
          tag={{ key, value: String(value) }}
          variant="gray"
          onFilterByTag={onFilterByTag}
        >
          {key}: {String(value)}
        </Tag>
      ))}
    </div>
  );
}
