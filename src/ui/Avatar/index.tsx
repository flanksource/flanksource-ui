import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { useImage } from "react-image";
import { Tooltip } from "react-tooltip";
import { User } from "../../api/types/users";

interface IProps {
  size?: "sm" | "lg" | "md";
  circular?: boolean;
  inline?: boolean;
  alt?: string;
  user?: Partial<User>;
  imageProps?: React.ComponentPropsWithoutRef<"img">;
  containerProps?: React.ComponentPropsWithoutRef<"div">;
  unload?: boolean;
}

export function Avatar({
  user,
  size = "sm",
  unload,
  alt,
  containerProps,
  imageProps,
  inline = false,
  circular = true
}: IProps) {
  const [textSize, setTextSize] = useState(() => {
    if (size !== "sm") {
      return "16px";
    }
    return "14px";
  });
  const srcList = user?.avatar;
  const fallbackInitials = user?.name || "?";

  const { src, isLoading } = useImage({
    srcList: (Array.isArray(srcList) ? srcList : [srcList]).filter(Boolean),
    useSuspense: false
  });
  const sizeClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "w-6 h-6 text-xs";
      case "lg":
        return "w-12 h-12 text-base";
      case "md":
        return "w-8 h-8 text-base";
    }
  }, [size]);

  const initials = useMemo(
    () =>
      (fallbackInitials || "")
        .split(" ")
        .map((i) => i.charAt(0).toUpperCase())
        .slice(0, 2)
        .join(""),
    [fallbackInitials]
  );

  const determineTextSize = useCallback(
    (node: HTMLSpanElement | null) => {
      if (node?.clientWidth && size !== "lg") {
        if (node.clientWidth > 20) {
          setTextSize(() => {
            if (size === "sm") {
              return "10px";
            }
            return "12px";
          });
        } else if (node.clientWidth > 18) {
          setTextSize(() => {
            if (size === "sm") {
              return "12px";
            }
            return "14px";
          });
        }
      }
    },
    [size]
  );

  return (
    <>
      <div
        {...containerProps}
        className={clsx(
          `items-center justify-center overflow-hidden leading-none ${inline ? "inline-flex" : "flex"} `,
          sizeClass,
          containerProps?.className,
          !src && initials ? "bg-dark-blue text-white" : "bg-lighter-gray",
          circular ? "rounded-full" : "rounded-md"
        )}
        data-tooltip-id="user-name"
        data-tooltip-content={user?.name}
      >
        {srcList && src ? (
          <img
            src={src}
            alt={alt}
            {...imageProps}
            className={clsx(
              "h-full w-full overflow-hidden",
              imageProps?.className,
              circular ? "rounded-full" : "rounded-md"
            )}
          />
        ) : initials ? (
          <span
            style={{
              fontSize: textSize
            }}
            ref={determineTextSize}
          >
            {initials}
          </span>
        ) : !isLoading && unload ? (
          unload
        ) : (
          <BsFillPersonFill className="text-warmer-gray" />
        )}
      </div>
      <Tooltip id="user-name" />
    </>
  );
}
