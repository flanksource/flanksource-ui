import React from "react";
import PropTypes from "prop-types";
import { TopologyColumnHeader } from "./TopologyColumnHeader";

export const TopologyColumn = ({ title, cards }) => (
  <div className="p-3 bg-column-background border border-column-background rounded-md" style={{ width: '580px' }}>
    <TopologyColumnHeader className="mb-4" name={title} />
    <div>{cards}</div>
  </div>
);

TopologyColumn.propTypes = {
  title: PropTypes.string.isRequired
};
