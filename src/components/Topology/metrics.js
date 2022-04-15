import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { FormatProperty } from "./property";

export const Metrics = ({ items, row }) => (
  <div className="flex rounded-b-8px divide-x flex-1 justify-between items-center">
    {items.map((item) => (
      <div
        key={item.name}
        className={clsx(
          "text-gray-800 px-2 align-middle text-center flex flex-1",
          {
            "flex-col": !row,
            "flex-row items-center justify-center": row
          }
        )}
      >
        <h6 className="text-gray-color text-xs mb-0.5">
          {item.name}
          {row && ":"}
        </h6>
        <span
          className={clsx(
            "font-bold text-xs leading-1.21rel",
            `text-${item.color}-500`,
            { "pl-1": row }
          )}
        >
          <FormatProperty property={item} short />
        </span>
      </div>
    ))}
  </div>
);

Metrics.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string
    })
  ).isRequired,
  row: PropTypes.bool
};

Metrics.defaultProps = {
  row: false
};
