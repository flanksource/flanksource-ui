import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import { Chip } from "../Chip";
import { Icon } from "../Icon";

export type StatusInfo = {
  label: string;
  color: "red" | "green" | "orange" | "gray";
  url?: string;
};

export type StatusLineProps = React.HTMLProps<HTMLDivElement> & {
  icon?: string | React.ReactNode;
  label: string;
  url?: string;
  statuses: StatusInfo[];
};

const StatusInfoEntry = ({ statusInfo }: { statusInfo: StatusInfo }) => {
  if (statusInfo.url) {
    return (
      <Link key={statusInfo.url} to={statusInfo.url}>
        <Chip text={statusInfo.label} color={statusInfo.color} />
      </Link>
    );
  } else {
    return (
      <span className="inline-block m-1">
        <Chip text={statusInfo.label} color={statusInfo.color} />
      </span>
    );
  }
};

export function StatusLine({
  icon,
  label,
  url,
  statuses,
  className = "py-1",
  ...rest
}: StatusLineProps) {
  const renderIcon = (icon: string | React.ReactNode) => {
    if (!icon) {
      return null;
    }
    if (typeof icon === "object") {
      return icon;
    } else if (typeof icon === "string") {
      return <Icon name={icon} className="w-4" />;
    }
  };

  return (
    <div className={clsx("flex", className)} {...rest}>
      {icon && <div className="mr-1 inline-block">{renderIcon(icon)}</div>}
      {url && (
        <Link className="text-xs linear-1.21rel mr-1 cursor-pointer" to={url}>
          {label}
        </Link>
      )}
      {!url && (
        <span className="inline-block text-xs linear-1.21rel mr-1 cursor-pointer">
          {label}
        </span>
      )}
      <div className="flex space-x-1">
        {statuses.map((status, index) => {
          return <StatusInfoEntry statusInfo={status} key={index} />;
        })}
      </div>
    </div>
  );
}
