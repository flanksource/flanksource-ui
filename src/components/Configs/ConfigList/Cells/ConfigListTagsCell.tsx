import { CellContext } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { ConfigItem } from "../../../../api/types/configs";
import Popover from "../../../Popover/Popover";
import { TagItem, TagList } from "../../../TagList/TagList";

export default function ConfigListTagsCell({
  getValue,
  hideGroupByView = false
}: CellContext<ConfigItem, any> & {
  hideGroupByView?: boolean;
}): JSX.Element | null {
  const [params] = useSearchParams();

  const tagMap = getValue<ConfigItem["tags"]>() || {};
  const tagKeys = Object.keys(tagMap)
    .sort()
    .filter((key) => key !== "toString");
  const groupByProp = decodeURIComponent(params.get("groupByProp") ?? "");

  if (tagKeys.length === 0) {
    return null;
  }

  if (!hideGroupByView && groupByProp) {
    if (!tagMap[groupByProp]) {
      return null;
    }

    return (
      <div className="font-mono flex flex-wrap w-full max-w-full pl-1 space-y-1">
        <div
          className="max-w-full overflow-hidden text-ellipsis bg-gray-200 border border-gray-300 px-1 py-0.75 mr-1 rounded-md text-gray-600 font-semibold text-xs"
          key={groupByProp}
        >
          {groupByProp}:{" "}
          <span className="font-light">{tagMap[groupByProp]}</span>
        </div>
      </div>
    );
  }

  const tags = tagKeys.map((key) => {
    return {
      key,
      value: tagMap[key]
    };
  });

  return (
    <Popover
      toggle={
        <div className="flex flex-row items-center">
          <div className="flex-shrink overflow-x-hidden cursor-pointer">
            <TagItem tag={tags[0]!} />
          </div>
          {tags.length > 1 && (
            <div className="flex-shrink space-x-2 underline decoration-solid justify-left text-xs cursor-pointer">
              +{tags.length - 1} more
            </div>
          )}
        </div>
      }
      title="Tags"
      placement="left"
      menuClass="top-8"
    >
      <div className="flex flex-col p-3">
        <div className="flex flex-col items-stretch max-h-64 overflow-y-auto">
          <TagList
            className="flex flex-col flex-1"
            tags={tags}
            minimumItemsToShow={tags.length}
          />
        </div>
      </div>
    </Popover>
  );
}
