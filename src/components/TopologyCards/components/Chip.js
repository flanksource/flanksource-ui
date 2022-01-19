import React from "react";

export const Chip = ({ text, color }) => (
  <div
    className={`${color} text-center align-baseline min-w-8 min-h-8 text-2xs font-inter rounded-4px font-bold break-all`}
  >
    {text}
  </div>
);

Chip.propTypes = {};
