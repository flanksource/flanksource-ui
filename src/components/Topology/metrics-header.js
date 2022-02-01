import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { FormatProperty } from "./property";

export const MetricsHeader = ({ items }) => (
  <div
    className={clsx(
      "grid rounded-b-8px divide-x flex-1",
      `grid-cols-${items.length}`
    )}
  >
    {items.map((item) => (
      <div
        key={item.name}
        className="text-gray-800 px-2 align-middle text-center flex flex-col"
      >
        <h6 className="text-gray-color text-xs mb-0.5">{item.name}</h6>
        <span className="font-bold text-xs leading-1.21rel">
          {" "}
          <FormatProperty property={item} short />
        </span>
      </div>
    ))}
  </div>
);

// MetricsHeader.propTypes = {
//   items: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       value: PropTypes.string.isRequired
//     })
//   ).isRequired
// };
