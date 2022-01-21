import React from "react";
import PropTypes from "prop-types";
import {
  TopologyCardMedium,
  TopologyCardSmall,
  TopologyCardLarge
} from "./index";

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
  name: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  status: PropTypes.string.isRequired
};
