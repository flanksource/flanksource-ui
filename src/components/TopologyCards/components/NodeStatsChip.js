import React from "react";
import { chipBackgroundColor } from "../utils/chipBackgroundColor";
import cx from "clsx";

export const NodeStatsChip = ({ text, color }) => (
  <div
    className={cx(
      "text-center align-baseline min-w-8 min-h-8 text-2xs font-inter rounded-4px font-bold break-all",
      chipBackgroundColor(color)
    )}
  >
    {text}
  </div>
);

NodeStatsChip.propTypes = {};
