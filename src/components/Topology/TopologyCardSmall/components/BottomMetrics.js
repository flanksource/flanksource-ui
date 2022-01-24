import React from "react";
import PropTypes from "prop-types";

export const BottomMetrics = ({ items }) => {
  const [firstItem, secondItem, thirdItem] = items;

  return (
    <div className="grid grid-cols-small-card-metrics bg-lightest-gray px-2 py-4 rounded-b-8px divide-x leading-none">
      <div>
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium leading-1.21rel">
            {firstItem.name}
          </span>
          <p className="font-bold text-sm leading-1.21rel">{firstItem.value}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium leading-1.21rel">
            {secondItem.name}
          </span>
          <p className="font-bold text-sm leading-1.21rel">
            {secondItem.value}
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2">
          <span className="text-gray-color text-xs font-medium leading-1.21rel">
            {thirdItem.name}
          </span>
          <p className="font-bold text-sm leading-1.21rel">{thirdItem.value}</p>
        </div>
      </div>
    </div>
  );
};

BottomMetrics.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
};
