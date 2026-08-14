import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@flanksource-ui/components/ui/popover";
import { IconButton } from "@flanksource-ui/ui/Buttons/IconButton";
import { useCallback } from "react";
import {
  PiMagnifyingGlassMinusThin,
  PiMagnifyingGlassPlusThin
} from "react-icons/pi";
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
  /** Maximum number of tags shown before the remainder moves into a popover. */
  maxVisibleTags?: number;
};

export default function TagsFilterCell({
  tags,
  filterByTagParamKey = "labels",
  useBase64Encoding = false,
  paramPrefix,
  maxVisibleTags
}: TagsFilterCellProps) {
  const [, setParams] = usePrefixedSearchParams(paramPrefix, false);

  const tagEntries = Object.entries(tags).filter(([key]) => key !== "toString");
  const visibleTagEntries =
    maxVisibleTags === undefined
      ? tagEntries
      : tagEntries.slice(0, maxVisibleTags);
  const hiddenTagEntries = tagEntries.slice(visibleTagEntries.length);

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
    <div
      className={
        maxVisibleTags === undefined
          ? "flex flex-wrap gap-1"
          : "flex min-w-0 flex-nowrap items-center gap-1 overflow-hidden"
      }
    >
      {visibleTagEntries.map(([key, value]) => (
        <Tag
          key={key}
          tag={{ key, value: String(value) }}
          variant="gray"
          onFilterByTag={onFilterByTag}
          className={
            maxVisibleTags === undefined
              ? undefined
              : "flex min-w-0 flex-row overflow-hidden text-ellipsis whitespace-nowrap rounded-md bg-gray-100 px-1 py-0.5 text-xs"
          }
        >
          <span className="overflow-hidden text-ellipsis">
            {key}: {String(value)}
          </span>
        </Tag>
      ))}
      {hiddenTagEntries.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="shrink-0 cursor-pointer whitespace-nowrap text-xs text-gray-600 underline decoration-dotted underline-offset-2"
              aria-label={`${hiddenTagEntries.length} more tags`}
              onClick={(event) => event.stopPropagation()}
            >
              +{hiddenTagEntries.length} more
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-auto min-w-72 max-w-[32rem] bg-white p-2 text-gray-900 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-1 px-1.5 text-xs font-semibold text-gray-700">
              More tags
            </div>
            <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
              {hiddenTagEntries.map(([key, value]) => {
                const tag = { key, value: String(value) };

                return (
                  <div
                    key={key}
                    className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 hover:bg-gray-50"
                  >
                    <span className="min-w-0 flex-1 break-all rounded-md bg-gray-100 px-1 py-0.5 text-xs text-gray-600">
                      {key}: {String(value)}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <IconButton
                        className="rounded p-1 text-gray-600 hover:bg-gray-200"
                        onClick={(event) =>
                          onFilterByTag(event, tag, "include")
                        }
                        icon={<PiMagnifyingGlassPlusThin size={18} />}
                        title="Include"
                        aria-label={`Include ${key}: ${String(value)}`}
                      />
                      <IconButton
                        className="rounded p-1 text-gray-600 hover:bg-gray-200"
                        onClick={(event) =>
                          onFilterByTag(event, tag, "exclude")
                        }
                        icon={<PiMagnifyingGlassMinusThin size={18} />}
                        title="Exclude"
                        aria-label={`Exclude ${key}: ${String(value)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
