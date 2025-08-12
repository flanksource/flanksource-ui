import React from "react";

interface BadgeCellProps {
  value: string;
}

// Medium saturation color palette suitable for badge backgrounds
const BADGE_COLOR_BANK = [
  "#BBDEFB",
  "#C8E6C9",
  "#FFE0B2",
  "#F8BBD9",
  "#E1BEE7",
  "#B2DFDB",
  "#FFF9C4",
  "#FFCDD2",
  "#B3E5FC",
  "#DCEDC8",
  "#FFE082",
  "#F0F4C3",
  "#C5CAE9",
  "#D7CCC8",
  "#E0E0E0",
  "#B3E5FC",
  "#C8E6C9",
  "#FFCC80",
  "#F48FB1",
  "#CE93D8"
];

// Global map to track assigned colors and ensure uniqueness
const colorAssignments = new Map<string, string>();
let nextColorIndex = 0;

const BadgeCell: React.FC<BadgeCellProps> = ({ value }) => {
  if (!value) return <span>-</span>;

  let backgroundColor = colorAssignments.get(value);
  if (!backgroundColor) {
    backgroundColor =
      BADGE_COLOR_BANK[nextColorIndex % BADGE_COLOR_BANK.length];
    colorAssignments.set(value, backgroundColor);
    nextColorIndex++;
  }

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-800"
      style={{ backgroundColor }}
    >
      {value}
    </span>
  );
};

export default BadgeCell;
