import React from "react";
import PropTypes from "prop-types";
import { chipBackgroundColor } from "../../../utils/common";
import { Icon } from "../../Icon";
import { Chip } from "./Chip";

export const Chips = ({ title, icon, chips }) => (
  <div className="">
    <div className="flex">
      <Icon name={icon} className="mr-2" />
      <h1 className="mb-2 text-xs">{title}</h1>
    </div>
    <div className="grid gap-2 grid-cols-4minmax">
      {chips.map(({ number, id, color }) => (
        <Chip key={id} text={number} color={chipBackgroundColor(color)} />
      ))}
    </div>
  </div>
);

Chips.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  chips: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
