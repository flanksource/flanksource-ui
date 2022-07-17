import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

export type CustomScrollProps = {
  maxHeight: string;
  children: JSX.Element | JSX.Element[];
  showMoreClass?: string;
} & React.HTMLProps<HTMLDivElement>;

export const CustomScroll = ({
  showMoreClass,
  maxHeight,
  children,
  style,
  className,
  ...rest
}: CustomScrollProps) => {
  const ref: any = useRef();
  const [showMore, setShowMore] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const mHeight = parseInt(ref.current.style.maxHeight, 10);
    const height = ref.current.getBoundingClientRect().height;
    if (height >= mHeight) {
      setHasScroll(true);
    } else {
      setHasScroll(false);
    }
  }, [children]);

  useEffect(() => {
    setShowMore(hasScroll);
  }, [hasScroll]);

  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        className,
        hasScroll && !showMore ? "hover:overflow-scroll" : ""
      )}
      style={{ ...style, maxHeight, height: "min-content" }}
      {...rest}
      ref={ref}
    >
      {children}
      {showMore && (
        <div
          onClick={() => {
            setShowMore(false);
          }}
          className={clsx(
            "absolute bottom-0 m-auto w-full bg-half-black text-center text-white bg-black p-1 z-10 hover:underline",
            showMoreClass
          )}
        >
          show more
        </div>
      )}
    </div>
  );
};
