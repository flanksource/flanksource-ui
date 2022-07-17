import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { Chip } from "../Chip";

function getChipsFromSummary(component, summary) {
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

export const HealthSummary = ({ component, iconSize }) => {
  const { name, icon, summary } = component;
  return (
    <div className="flex mb-3">
      <Icon name={icon} className="mr-1" size={iconSize} />
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
};

HealthSummary.propTypes = {
  iconSize: PropTypes.string,
  component: PropTypes.shape({}).isRequired
};

HealthSummary.defaultProps = {
  iconSize: "sm"
};
