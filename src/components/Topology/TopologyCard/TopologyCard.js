import React from "react";
import PropTypes from "prop-types";
import {
  TopologyCardMedium,
  TopologyCardSmall,
  TopologyCardLarge
} from "./index";
import { topologyCardCommonPropTypes } from "../prop-types";

const sizeToComponentMapping = {
  small: TopologyCardSmall,
  medium: TopologyCardMedium,
  large: TopologyCardLarge,
  fallback: TopologyCardSmall
};

export const TopologyCard = ({ size, ...rest }) => {
  const Component =
    sizeToComponentMapping[size] || sizeToComponentMapping.fallback;
  return <Component {...rest} />;
};

TopologyCard.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]).isRequired,
  ...topologyCardCommonPropTypes
};
