import React from "react";
import PropTypes from "prop-types";
import {
  TopologyCardMedium,
  TopologyCardCompact,
  TopologyCardFull
} from "./index";

const variantToComponentMapping = {
  compact: TopologyCardCompact,
  medium: TopologyCardMedium,
  full: TopologyCardFull,
  fallback: TopologyCardCompact
};

export const TopologyCard = ({ variant, ...rest }) => {
  const Component =
    variantToComponentMapping[variant] || variantToComponentMapping.fallback;
  return <Component {...rest} />;
};

TopologyCard.propTypes = {
  variant: PropTypes.oneOf(["compact", "medium", "full"]).isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  status: PropTypes.string.isRequired
};
