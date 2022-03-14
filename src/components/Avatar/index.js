import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useImage } from "react-image";
import { BsFillPersonFill } from "react-icons/all";
import clsx from "clsx";

export const Avatar = ({
  size,
  srcList,
  unload,
  alt,
  containerProps,
  imageProps,
  fallbackInitials
}) => {
  const { src, isLoading } = useImage({
    srcList: Array.isArray(srcList) ? srcList : [srcList],
    useSuspense: false
  });
  const sizeClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "w-6 h-6 text-xs";
      case "md":
      default:
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

  return (
    <div
      {...containerProps}
      className={clsx(
        "rounded-full overflow-hidden flex justify-center items-center leading-none",
        sizeClass,
        containerProps.className,
        !src && initials ? "bg-dark-blue text-white" : "bg-lighter-gray"
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          {...imageProps}
          className={clsx(
            "w-full h-full rounded-full overflow-hidden",
            imageProps.className
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
};

Avatar.propTypes = {
  size: PropTypes.string,
  srcList: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  unload: PropTypes.node,
  alt: PropTypes.string,
  containerProps: PropTypes.shape({}),
  imageProps: PropTypes.shape({}),
  fallbackInitials: PropTypes.string
};

Avatar.defaultProps = {
  size: "md",
  unload: undefined,
  alt: "",
  containerProps: {},
  imageProps: {},
  fallbackInitials: ""
};
