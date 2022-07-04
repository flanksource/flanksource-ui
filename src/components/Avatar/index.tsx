import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useImage } from "react-image";
import { BsFillPersonFill } from "react-icons/bs";
import clsx from "clsx";
import ReactTooltip from "react-tooltip";

const AvatarFC = ({ user, size, unload, alt, containerProps, imageProps }) => {
  const srcList = user?.avatar;
  const fallbackInitials = user?.name || "?";

  const { src, isLoading } = useImage({
    srcList: Array.isArray(srcList) ? srcList : [srcList],
    useSuspense: false
  });
  const sizeClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "w-6 h-6 text-xs";
      case "lg":
        return "w-12 h-12 text-base";
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

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <div
      {...containerProps}
      className={clsx(
        "overflow-hidden rounded-md flex justify-center items-center leading-none",
        sizeClass,
        containerProps.className,
        !src && initials ? "bg-dark-blue text-white" : "bg-lighter-gray"
      )}
      data-tip={user?.name}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          {...imageProps}
          className={clsx(
            "w-full h-full rounded-md overflow-hidden",
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

AvatarFC.propTypes = {
  size: PropTypes.string,
  user: PropTypes.shape({}),
  unload: PropTypes.node,
  alt: PropTypes.string,
  containerProps: PropTypes.shape({}),
  imageProps: PropTypes.shape({})
};

AvatarFC.defaultProps = {
  size: "md",
  unload: undefined,
  user: null,
  alt: "",
  containerProps: {},
  imageProps: {}
};

export const Avatar = React.memo(AvatarFC);
