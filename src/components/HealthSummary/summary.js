import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../Icon";
import { Chip } from "../Chip";

function getChipsFromSummary(summary) {
  const chips = [];
  if (summary.healthy > 0) {
    chips.push(
      <Chip
        text={summary.healthy}
        key="healthy"
        label="Healthy"
        color="green"
      />
    );
  }
  if (summary.unhealthy > 0) {
    chips.push(
      <Chip
        text={summary.unhealthy}
        key="unhealthy"
        label="Unhealthy"
        color="red"
      />
    );
  }
  if (summary.warning > 0) {
    chips.push(
      <Chip
        text={summary.warning}
        key="warning"
        label="Warning"
        color="orange"
      />
    );
  }
  if (summary.unknown > 0) {
    chips.push(
      <Chip text={summary.unknown} key="unknown" label="Unknown" color="gray" />
    );
  }
  return chips;
}

export const HealthSummary = ({ component, iconSize }) => {
  const { name, icon, summary } = component;
  return (
    <div>
      <div className="flex mb-1.5">
        <Icon name={icon} className="mr-1" size={iconSize} />
        <h5 className="text-xs linear-1.21rel mr-1">{name}</h5>
        <div className="flex gap-2">{getChipsFromSummary(summary)}</div>
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
