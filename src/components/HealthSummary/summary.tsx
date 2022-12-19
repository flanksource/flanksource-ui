import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { Chip } from "../Chip";
import clsx from "clsx";
import { useMemo, useState } from "react";

type TopologyComponentProp = {
  id: string;
  name: string;
  icon: string;
  summary: { [key: string]: number };
  components?: TopologyComponentProp[];
} & { [key: string]: any };

type HealthSummaryProps = {
  component: TopologyComponentProp;
  iconSize?: "2xs" | "2xsi" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  viewType?: "individual_level" | "children_level";
} & React.HTMLProps<HTMLDivElement>;

function getChipsFromSummary(
  component: TopologyComponentProp,
  summary: { [key: string]: number }
) {
  if (!summary) {
    return [];
  }
  const chips = [];
  if (summary.healthy > 0) {
    chips.push(
      <Link
        key={`${component.id}-healthy`}
        to={`/topology/${component.id}?status=healthy`}
      >
        <Chip
          text={summary.healthy}
          key="healthy"
          label="Healthy"
          color="green"
        />
      </Link>
    );
  }
  if (summary.unhealthy > 0) {
    chips.push(
      <Link
        key={`${component.id}-unhealthy`}
        to={`/topology/${component.id}?status=unhealthy`}
      >
        <Chip
          text={summary.unhealthy}
          key="unhealthy"
          label="Unhealthy"
          color="red"
        />
      </Link>
    );
  }
  if (summary.warning > 0) {
    chips.push(
      <Link
        key={`${component.id}-warning`}
        to={`/topology/${component.id}?status=warning`}
      >
        <Chip
          text={summary.warning}
          key="warning"
          label="Warning"
          color="orange"
        />
      </Link>
    );
  }
  if (summary.unknown > 0) {
    chips.push(
      <Link
        key={`${component.id}-unknown`}
        to={`/topology/${component.id}?status=unknown`}
      >
        <Chip
          text={summary.unknown}
          key="unknown"
          label="Unknown"
          color="gray"
        />
      </Link>
    );
  }
  return chips;
}

export const HealthSummary = ({
  component,
  iconSize = "sm",
  viewType = "individual_level",
  className,
  ...rest
}: HealthSummaryProps) => {
  const { name, icon, summary } = component;
  const [noSummary, setNoSummary] = useState(false);
  const childrenSummary: { [key: string]: number } = useMemo(() => {
    const value = {
      healthy: 0,
      unhealthy: 0,
      warning: 0
    };
    component.components?.forEach((component) => {
      value.healthy += component.summary?.healthy || 0;
      value.unhealthy += component.summary?.unhealthy || 0;
      value.warning += component.summary?.warning || 0;
    });
    setNoSummary(!(value.healthy || value.unhealthy || value.warning));
    return value;
  }, [component]);

  if (viewType === "individual_level") {
    return (
      <div className={clsx("flex", className)} {...rest}>
        <Icon name={icon} className="mr-1 w-4" />
        <Link
          className="text-xs linear-1.21rel mr-1 cursor-pointer"
          to={`/topology/${component.id}`}
        >
          {name}
        </Link>
        <div className="flex gap-2 ">
          {getChipsFromSummary(component, summary)}
        </div>
      </div>
    );
  } else if (viewType === "children_level") {
    return (
      <div className={clsx("flex", className)} {...rest}>
        <span className="inline-block m-1">
          Health Summary: {noSummary ? "NA" : ""}
        </span>
        {childrenSummary.healthy > 0 && (
          <span className="inline-block m-1">
            <Chip
              text={childrenSummary.healthy}
              key="healthy"
              label="Healthy"
              color="green"
            />
          </span>
        )}
        {childrenSummary.unhealthy > 0 && (
          <span className="inline-block m-1">
            <Chip
              text={childrenSummary.unhealthy}
              key="unhealthy"
              label="Unhealthy"
              color="red"
            />
          </span>
        )}
        {childrenSummary.warning > 0 && (
          <span className="inline-block m-1">
            <Chip
              text={childrenSummary.warning}
              key="warning"
              label="Warning"
              color="orange"
            />
          </span>
        )}
      </div>
    );
  }
  return null;
};
