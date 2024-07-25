import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

type TagEntry = {
  key: string;
  value: string;
};

/**
 * Sort tags by account, namespace, name, and then the rest
 */
export function sortTags(tags: TagEntry[]) {
  return tags.sort((a, b) => {
    const aKey = a.key.toLowerCase();
    const bKey = b.key.toLowerCase();
    if (aKey === "account") {
      return -1;
    }
    if (bKey === "account") {
      return 1;
    }
    if (aKey === "namespace") {
      return -1;
    }
    if (bKey === "namespace") {
      return 1;
    }
    if (aKey === "name") {
      return -1;
    }
    if (bKey === "name") {
      return 1;
    }
    return aKey?.localeCompare(bKey);
  });
}

type TagListProps = React.HTMLProps<HTMLDivElement> & {
  tags: TagEntry[];
  minimumItemsToShow?: number;
  childClassName?: string;
  keyClassName?: string;
  valueClassName?: string;
};

type TagItemProps = {
  containerWidth?: string;
  className?: string;
  tag: {
    key: string;
    value: string;
  };
  keyClassName?: string;
  valueClassName?: string;
};

export function TagItem({
  tag: { key, value },
  containerWidth,
  className = "bg-gray-200 text-gray-600 mx-1",
  keyClassName = "",
  valueClassName = "font-light"
}: TagItemProps) {
  return (
    <div
      className={`flex flex-row rounded-md p-[0.15rem] ${className}`}
      data-tooltip-id={`tag-item-tooltip-${key}-${value}`}
      data-tooltip-content={`${key}:${value}`}
    >
      <div
        className="flex break-inside-avoid-column flex-row space-x-1 whitespace-nowrap p-[0.2rem] text-xs font-semibold"
        style={containerWidth ? { width: containerWidth } : {}}
      >
        <span className={keyClassName}>{key}:</span>
        <span className={valueClassName}>{value}</span>
      </div>
    </div>
  );
}

export function TagList({
  tags,
  minimumItemsToShow = 1,
  className = `flex flex-row text-left items-start flex-1`,
  childClassName = "bg-gray-200 text-gray-600 mx-1",
  keyClassName = "",
  valueClassName = "font-light",
  ...rest
}: TagListProps) {
  const [showAll, setShowAll] = useState(false);

  const outerContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerWidth = `${
    (innerContainerRef.current?.clientWidth || 0) - 10
  }px`;

  useEffect(() => {
    const handleResize = () => {
      if (outerContainerRef.current && innerContainerRef.current) {
        const isOverflowing =
          innerContainerRef.current.scrollHeight >
          outerContainerRef.current.scrollHeight;
        setIsOverflowing(isOverflowing);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedTags = useMemo(() => sortTags(tags), [tags]);

  return (
    <div ref={outerContainerRef} className={className} {...rest}>
      {isOverflowing && (
        <button
          onClick={(e) => {
            setShowAll((showMore) => !showMore);
          }}
          className="text-sm focus:outline-none"
        >
          {showAll ? (
            <IoMdArrowDropdown size={24} />
          ) : (
            <IoMdArrowDropright size={24} />
          )}
        </button>
      )}

      <div
        ref={innerContainerRef}
        className={clsx(
          `flex h-auto flex-1 flex-col space-y-2`,
          !showAll ? `overflow-y-hidden` : ""
        )}
        style={
          !showAll
            ? {
                maxHeight: `${2.25 * minimumItemsToShow}rem`
              }
            : {}
        }
      >
        {sortedTags.map(({ key, value }) => (
          <TagItem
            key={key}
            tag={{ key, value }}
            className={childClassName}
            containerWidth={containerWidth}
            keyClassName={keyClassName}
            valueClassName={valueClassName}
          />
        ))}
      </div>
    </div>
  );
}
