import React from "react";
import PropTypes from "prop-types";
import {
  TopologyCardMedium,
  TopologyCardCompact,
  TopologyCardFull
} from "./index";

const sizeToComponentMapping = {
  compact: TopologyCardCompact,
  medium: TopologyCardMedium,
  full: TopologyCardFull,
  fallback: TopologyCardCompact
};

export const TopologyCard = ({ size, ...rest }) => {
  const Component =
    sizeToComponentMapping[size] || sizeToComponentMapping.fallback;
  return <Component {...rest} />;
};

TopologyCard.propTypes = {
  size: PropTypes.oneOf(["compact", "medium", "full"]).isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  status: PropTypes.string.isRequired
};
