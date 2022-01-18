import React from "react";
import PropTypes from "prop-types";
import { ChipsView } from "./ChipsView";
import { colorHandler } from "../../../utils/common";

export const Chips = ({ title, icon, chips }) => (
  <ChipsView
    chips={chips}
    icon={icon}
    title={title}
    colorHandler={colorHandler}
  />
);

Chips.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  chips: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
