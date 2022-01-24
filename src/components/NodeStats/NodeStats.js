import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../Icon";
import { NodeStatsChip } from "./components/NodeStatsChip";

export const NodeStats = ({ title, icon, chips, iconSize }) => (
  <div>
    <div className="flex mb-1.5">
      <Icon name={icon} className="mr-2" size={iconSize} />
      <h5 className="text-xs linear-1.21rel">{title}</h5>
    </div>
    <div className="grid gap-2 grid-cols-node-stats">
      {chips.map(({ number, id, color }) => (
        <NodeStatsChip key={id} text={number} color={color} />
      ))}
    </div>
  </div>
);

NodeStats.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconSize: PropTypes.string,
  chips: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

NodeStats.defaultProps = {
  iconSize: "sm"
};
