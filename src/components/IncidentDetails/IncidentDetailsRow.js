import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

export const IncidentDetailsRow = ({ title, value, className }) => (
  <div className={clsx("grid grid-cols-1-to-2 gap-6 items-center", className)}>
    <div>
      <h6 className="text-dark-gray text-sm font-medium">{title}</h6>
    </div>
    <div>{value}</div>
  </div>
);

IncidentDetailsRow.propTypes = {
  title: PropTypes.string.isRequired
};
