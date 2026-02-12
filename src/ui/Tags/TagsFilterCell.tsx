import { useCallback } from "react";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { fromBase64, toBase64 } from "../../utils/common";
import { Tag } from "./Tag";

type TagsFilterCellProps = {
  tags: Record<string, any>;
  filterByTagParamKey?: string;
  /**
   * When true, base64 encodes tag keys and values to avoid tristate parsing
   * issues with special characters like ':' and ','.
   */
  useBase64Encoding?: boolean;
  /**
   * Optional prefix to namespace the search params.
   */
  paramPrefix?: string;
};

export default function TagsFilterCell({
  tags,
  filterByTagParamKey = "labels",
  useBase64Encoding = false,
  paramPrefix
}: TagsFilterCellProps) {
  const [params, setParams] = usePrefixedSearchParams(paramPrefix, false);

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

      setParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        // Get the current tags from the URL
        const currentTags = nextParams.get(filterByTagParamKey);
        const currentTagsArray = (
          currentTags ? currentTags.split(",") : []
        ).filter((value) => {
          const rawTagKey = value.split("____")[0];
          const tagKey = useBase64Encoding ? fromBase64(rawTagKey) : rawTagKey;
          const tagAction = value.split(":")[1] === "1" ? "include" : "exclude";

          if (tagKey === tag.key && tagAction !== action) {
            return false;
          }
          return true;
        });

        // Append the new value, but for same tags, don't allow including and excluding at the same time
        const keyPart = useBase64Encoding ? toBase64(tag.key) : tag.key;
        const valuePart = useBase64Encoding ? toBase64(tag.value) : tag.value;
        const updatedValue = currentTagsArray
          .concat(`${keyPart}____${valuePart}:${action === "include" ? 1 : -1}`)
          .filter((value, index, self) => self.indexOf(value) === index)
          .join(",");

        // Update the URL
        nextParams.set(filterByTagParamKey, updatedValue);
        return nextParams;
      });
    },
    [filterByTagParamKey, setParams, useBase64Encoding]
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
