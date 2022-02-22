import React from "react";
import PropTypes from "prop-types";

export const IncidentDetailsRow = ({ title, value }) => (
  <div className="grid grid-cols-1-to-2 gap-6 pb-4 items-center">
    <div>
      <h6 className="text-dark-gray text-sm font-medium">{title}</h6>
    </div>
    <div>{value}</div>
  </div>
);

IncidentDetailsRow.propTypes = {
  title: PropTypes.string.isRequired
};
