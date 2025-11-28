import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Tag } from "./Tag";

/**
 * Base64 encodes tag values to avoid tristate parsing issues.
 */
function encodeTagValue(value: string): string {
  return Buffer.from(value).toString("base64");
}

/**
 * Decodes a base64 encoded tag value.
 */
function decodeTagValue(value: string): string {
  return Buffer.from(value, "base64").toString();
}

type TagsFilterCellProps = {
  tags: Record<string, any>;
  filterByTagParamKey?: string;
  /**
   * When true, base64 encodes tag keys and values to avoid tristate parsing
   * issues with special characters like ':' and ','.
   */
  useBase64Encoding?: boolean;
};

export default function TagsFilterCell({
  tags,
  filterByTagParamKey = "labels",
  useBase64Encoding = false
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
        const rawTagKey = value.split("____")[0];
        const tagKey = useBase64Encoding
          ? decodeTagValue(rawTagKey)
          : rawTagKey;
        const tagAction = value.split(":")[1] === "1" ? "include" : "exclude";

        if (tagKey === tag.key && tagAction !== action) {
          return false;
        }
        return true;
      });

      // Append the new value, but for same tags, don't allow including and excluding at the same time
      const keyPart = useBase64Encoding ? encodeTagValue(tag.key) : tag.key;
      const valuePart = useBase64Encoding
        ? encodeTagValue(tag.value)
        : tag.value;
      const updatedValue = currentTagsArray
        .concat(`${keyPart}____${valuePart}:${action === "include" ? 1 : -1}`)
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(",");

      // Update the URL
      params.set(filterByTagParamKey, updatedValue);
      setParams(params);
    },
    [filterByTagParamKey, params, setParams, useBase64Encoding]
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
