import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../../Icon";
import { NodeStatsChip } from "./NodeStatsChip";

export const NodeStats = ({ title, icon, chips }) => (
  <div className="">
    <div className="flex">
      <Icon name={icon} className="mr-2" />
      <p className="mb-2 text-xs">{title}</p>
    </div>
    <div className="grid gap-2 grid-cols-4minmax">
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
