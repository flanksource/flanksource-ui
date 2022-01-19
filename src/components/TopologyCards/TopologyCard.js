import React from "react";
import PropTypes from "prop-types";
import { TopologyCardMedium, TopologyCardCompact } from "./index";

export const TopologyCard = ({ variant, name, properties, status }) => (
  <div>
    {variant === "compact" && (
      <TopologyCardCompact name={name} status={status} />
    )}
    {variant === "medium" && (
      <TopologyCardMedium name={name} status={status} properties={properties} />
    )}
    {variant === "full" && (
      <TopologyCardMedium name={name} status={status} properties={properties} />
    )}
  </div>
);

TopologyCard.propTypes = {
  variant: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  status: PropTypes.string.isRequired
};
