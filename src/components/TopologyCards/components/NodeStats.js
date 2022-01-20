import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../../Icon";
import { NodeStatsChip } from "./NodeStatsChip";

export const NodeStats = ({ title, icon, chips }) => (
  <div>
    <div className="flex">
      <Icon name={icon} className="mr-2" />
      <h5 className="mb-2 text-xs">{title}</h5>
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
  chips: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
