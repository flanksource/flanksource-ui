import React, { useEffect, useMemo } from "react";
import { useImage } from "react-image";
import { BsFillPersonFill } from "react-icons/bs";
import clsx from "clsx";
import ReactTooltip from "react-tooltip";
import { User } from "../../api/services/users";

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
  circular = false
}: IProps) {
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

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <div
      {...containerProps}
      className={clsx(
        `overflow-hidden justify-center items-center leading-none 
        ${inline ? "inline-flex" : "flex"} `,
        sizeClass,
        containerProps?.className,
        !src && initials ? "bg-dark-blue text-white" : "bg-lighter-gray",
        circular ? "rounded-full" : "rounded-md"
      )}
      data-tip={user?.name}
    >
      {srcList && src ? (
        <img
          src={src}
          alt={alt}
          {...imageProps}
          className={clsx(
            "w-full h-full overflow-hidden",
            imageProps?.className,
            circular ? "rounded-full" : "rounded-md"
          )}
        />
      ) : (
        initials ||
        (!isLoading && unload ? (
          unload
        ) : (
          <BsFillPersonFill className="text-warmer-gray" />
        ))
      )}
    </div>
  );
}
