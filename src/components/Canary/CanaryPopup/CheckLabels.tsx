import { useLayoutEffect, useMemo, useState } from "react";
import { HealthCheck } from "../../../api/types/health";
import Popover from "../../../ui/Popover/Popover";
import { TagItem, TagList } from "../../../ui/Tags/TagList";

type Props = {
  check: Partial<Pick<HealthCheck, "labels">>;
};

export default function CheckLabels({ check }: Props) {
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkLabels = useMemo(() => {
    if (check?.labels) {
      return Object.entries(check.labels).map(([key, value]) => ({
        key,
        value
      }));
    }
    return [];
  }, [check?.labels]);

  useLayoutEffect(() => {
    if (isOverflowing) {
      return;
    }
    const node = document.getElementById("labels-container");
    if (node) {
      const isOverflowing =
        node.scrollWidth > node.clientWidth ||
        node.scrollHeight > node.clientHeight;

      if (isOverflowing) {
        const childNodes = Array.from(node.childNodes) as HTMLDivElement[];
        let width = 0;

        childNodes.forEach((childNode) => {
          width += childNode.clientWidth;
          if (width > node.clientWidth) {
            childNode.style.display = "none";
          }
        });
      }
      setIsOverflowing(isOverflowing);
    }
  }, [checkLabels, isOverflowing]);

  if (checkLabels.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex w-full flex-row items-center gap-2">
      <Popover
        menuClass="w-auto top-6"
        toggle={
          <div className="flex flex-1 flex-row items-center gap-1">
            <div
              id="labels-container"
              className="flex h-7 w-auto flex-shrink cursor-pointer flex-row flex-wrap gap-1 overflow-hidden"
            >
              {checkLabels.map((item) => (
                <TagItem
                  className="bg-blue-100 text-blue-800"
                  key={item.key}
                  tag={item}
                  keyClassName="text-gray-500"
                  valueClassName="text-gray-800"
                />
              ))}
            </div>
            {isOverflowing && (
              <div className="justify-left w-auto cursor-pointer gap-2 text-xs underline decoration-solid">
                +{checkLabels.length - 1} more
              </div>
            )}
          </div>
        }
        placement="left"
      >
        <div className="flex flex-col p-1">
          <div className="flex max-h-96 flex-col items-stretch overflow-y-auto">
            <TagList
              className="flex flex-1 flex-col"
              tags={checkLabels}
              minimumItemsToShow={checkLabels.length}
              childClassName="bg-blue-100 text-blue-800"
              keyClassName="text-gray-500"
              valueClassName="text-gray-800"
            />
          </div>
        </div>
      </Popover>
    </div>
  );
}
