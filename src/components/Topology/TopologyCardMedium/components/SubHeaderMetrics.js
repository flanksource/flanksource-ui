import React from "react";
import PropTypes from "prop-types";

export const SubHeaderMetrics = ({ items }) => {
  const [firstItem, secondItem, thirdItem] = items;

  return (
    <div className="grid grid-cols-medium-card-metrics rounded-b-8px divide-x flex-1">
      <div>
        <div className="text-gray-800 flex flex-col">
          <h6 className="text-gray-color text-2xs font-bold leading-1.21rel mb-0.5">
            {firstItem.name}
          </h6>
          <span className="font-bold text-xs leading-1.21rel">
            {firstItem.value}
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2 align-middle flex flex-col">
          <h6 className="text-gray-color text-2xs font-bold leading-1.21rel mb-0.5">
            {secondItem.name}
          </h6>
          <span className="font-bold text-xs leading-1.21rel">
            {secondItem.value}
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-gray-800 px-2 align-middle flex flex-col">
          <h6 className="text-gray-color text-2xs font-bold leading-1.21rel mb-0.5">
            {thirdItem.name}
          </h6>
          <span className="font-bold text-xs leading-1.21rel">
            {thirdItem.value}
          </span>
        </div>
      </div>
    </div>
  );
};

SubHeaderMetrics.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
};
