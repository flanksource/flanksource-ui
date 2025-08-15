import React from "react";

interface BadgeCellProps {
  value: string;
  backgroundColor?: string;
}

const defaultColor = "#E5E7EB";

const BadgeCell: React.FC<BadgeCellProps> = ({ value, backgroundColor }) => {
  if (!value) return <span>-</span>;

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-800"
      style={{ backgroundColor: backgroundColor || defaultColor }}
    >
      {value}
    </span>
  );
};

export default BadgeCell;
