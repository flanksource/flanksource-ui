import clsx from "clsx";
import React, { useEffect, useState } from "react";

export type CustomScrollProps = {
  maxHeight: string;
  children: React.ReactNode;
  showMoreClass?: string;
  minChildCount: number;
} & React.HTMLProps<HTMLDivElement>;

export const CustomScroll = ({
  showMoreClass,
  maxHeight,
  children,
  style,
  className,
  minChildCount,
  ...rest
}: CustomScrollProps) => {
  const items = React.Children.toArray(children);
  const [showMore, setShowMore] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    setShowMore(minChildCount < items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const getCount = () => {
    if (!showMore) {
      return items.length;
    }
    return minChildCount || items.length;
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        className,
        hasScroll && !showMore ? "hover:overflow-y-scroll" : ""
      )}
      style={{ ...style, maxHeight, height: "min-content" }}
      {...rest}
    >
      {items.slice(0, getCount()).map((child, index) => {
        return <React.Fragment key={index}>{child}</React.Fragment>;
      })}
      {showMore && (
        <div
          onClick={() => {
            setShowMore(false);
            setHasScroll(true);
          }}
          className={clsx(
            "bottom-0 m-auto w-full hover:underline",
            showMoreClass
          )}
        >
          show more ...
        </div>
      )}
    </div>
  );
};
