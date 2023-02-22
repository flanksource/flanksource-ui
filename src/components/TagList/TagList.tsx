import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

type TagEntry = {
  key: string;
  value: string;
};

type TagListProps = {
  tags: TagEntry[];
  minimumItemsToShow?: number;
};

export function TagList({ tags, minimumItemsToShow = 1 }: TagListProps) {
  const [showAll, setShowAll] = useState(false);

  const outerContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);

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

  return (
    <div
      ref={outerContainerRef}
      className={`flex flex-row text-left items-start h-full`}
    >
      {isOverflowing && (
        <button
          onClick={(e) => {
            /* Don't trigger click for parent. E.g without stopPropagation,
           handleRowClick would be called. */
            e.stopPropagation();
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
          `flex flex-wrap flex-1 h-auto`,
          !showAll ? `overflow-y-hidden` : ""
        )}
        style={
          !showAll
            ? {
                maxHeight: `${1.75 * minimumItemsToShow}rem`
              }
            : {}
        }
      >
        {tags.map(({ key, value }) => (
          <div className="flex flex-row p-[0.15rem] max-w-full" key={key}>
            <div className="flex flex-row max-w-full space-x-1 font-semibold p-[0.2rem] bg-gray-200 text-gray-600 rounded-md text-xs">
              <span className="inline text-ellipsis overflow-hidden">
                {key}:
              </span>
              <span className="inline text-ellipsis overflow-hidden font-light">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
