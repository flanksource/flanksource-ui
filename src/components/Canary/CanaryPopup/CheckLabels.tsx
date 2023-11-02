import { useLayoutEffect, useMemo, useState } from "react";
import { HealthCheck } from "../../../api/types/health";
import Popover from "../../Popover/Popover";
import { TagItem, TagList } from "../../TagList/TagList";

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
    <div className="flex flex-row gap-2 mb-4 items-center w-full">
      <Popover
        menuClass="w-auto top-6"
        toggle={
          <div className="flex flex-row flex-1 gap-1 items-center">
            <div
              id="labels-container"
              className="flex w-auto flex-row flex-shrink overflow-hidden h-7 gap-1 flex-wrap cursor-pointer"
            >
              {checkLabels.map((item) => (
                <TagItem
                  className="bg-blue-100 text-blue-800"
                  key={item.key}
                  tag={item}
                />
              ))}
            </div>
            {isOverflowing && (
              <div className="w-auto gap-2 underline decoration-solid justify-left text-xs cursor-pointer">
                +{checkLabels.length - 1} more
              </div>
            )}
          </div>
        }
        placement="left"
      >
        <div className="flex flex-col p-1">
          <div className="flex flex-col items-stretch max-h-96 overflow-y-auto">
            <TagList
              className="flex flex-col flex-1"
              tags={checkLabels}
              minimumItemsToShow={checkLabels.length}
              childClassName="bg-blue-100 text-blue-800"
            />
          </div>
        </div>
      </Popover>
    </div>
  );
}
