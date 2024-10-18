import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../ui/Icons/Icon";
import { Chip } from "../../ui/Tags/Chip";

export type StatusInfo = {
  label: string | number;
  color: "red" | "green" | "orange" | "gray" | "yellow";
  icon?: string | React.ReactNode;
  url?: string;
};

export type StatusLineData = {
  icon?: string | React.ReactNode;
  label: string;
  url?: string;
  statuses: StatusInfo[];
};

export type StatusLineProps = React.HTMLProps<HTMLDivElement> &
  StatusLineData & {
    hideName?: boolean;
  };

interface RenderIconProps {
  icon: string | React.ReactNode;
}

const RenderIcon: React.FC<RenderIconProps> = ({ icon }) => {
  if (!icon) {
    return null;
  }
  if (typeof icon === "object") {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{icon}</>;
  } else if (typeof icon === "string") {
    return <Icon name={icon} className="h-4 w-4 min-w-max" />;
  }
  return null;
};

const StatusInfoEntry = ({
  statusInfo,
  target
}: {
  statusInfo: StatusInfo;
  target?: string;
}) => {
  if (statusInfo.url) {
    return (
      <Link
        className="inline-flex cursor-pointer space-x-1"
        key={statusInfo.url}
        to={statusInfo.url}
        target={target || ""}
      >
        {statusInfo.icon && <RenderIcon icon={statusInfo.icon} />}
        <Chip text={statusInfo.label} color={statusInfo.color} />
      </Link>
    );
  } else {
    return (
      <span className="inline-flex cursor-pointer space-x-1">
        {statusInfo.icon && <RenderIcon icon={statusInfo.icon} />}
        <Chip text={statusInfo.label} color={statusInfo.color} />
      </span>
    );
  }
};

export function StatusLine({
  icon,
  target = "",
  label,
  url,
  statuses,
  className = "py-0.5",
  hideName = false,
  ...rest
}: StatusLineProps) {
  return (
    <div
      className={clsx("flex flex-row items-center space-x-1", className)}
      {...rest}
    >
      {!hideName && (
        <>
          {icon && <RenderIcon icon={icon} />}
          {url && (
            <Link
              title={label}
              target={target || ""}
              className="h-4 cursor-pointer overflow-hidden truncate text-xs"
              to={url}
            >
              {label}
            </Link>
          )}
          {!url && (
            <span
              title={label}
              className="h-4 cursor-pointer overflow-hidden truncate text-xs"
            >
              {label}
            </span>
          )}
        </>
      )}
      <div className="flex flex-row space-x-1">
        {statuses.map((status, index) => {
          return <StatusInfoEntry statusInfo={status} key={index} />;
        })}
      </div>
    </div>
  );
}
