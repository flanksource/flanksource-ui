import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../../Icon";

export const ChipsView = ({ title, icon, chips, colorHandler }) => (
  <div className="">
    <div className="flex">
      <Icon name={icon} />
      <h1 className="ml-2 mb-2 text-xs">{title}</h1>
    </div>
    <div className="grid grid-flow-col">
      {chips.map(({ number, id, color }) => (
        <div
          className={`${colorHandler(
            "bg",
            color
          )} mr-2 text-center w-8 text-ten font-inter rounded-4px py-3px px-6px font-bold`}
          key={id}
        >
          {number}
        </div>
      ))}
    </div>
  </div>
);

ChipsView.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  chips: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  colorHandler: PropTypes.func.isRequired
};
