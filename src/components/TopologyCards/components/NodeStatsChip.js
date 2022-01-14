import React from "react";
import { chipBackgroundColor } from "../utils/chipBackgroundColor";

export const NodeStatsChip = ({ text, color }) => (
  <div
    className={`${chipBackgroundColor(
      color
    )} text-center align-baseline min-w-8 min-h-8 text-2xs font-inter rounded-4px font-bold break-all`}
  >
    {text}
  </div>
);

NodeStatsChip.propTypes = {};
