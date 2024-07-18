import { CSSProperties, useMemo } from "react";

function getColor(value: number): string {
  if (value > 90) {
    return "red";
  } else if (value > 75) {
    return "orange";
  } else {
    return "green";
  }
}

interface Props {
  value: number;
  className?: string;
}

export default function ProgressBar({ value, className = "h-1.5" }: Props) {
  // should be between 5 and 100, for visual purpose, any less and the progress
  // bar is behaving weirdly
  const normalizedValue = Math.min(Math.max(value, 5), 100);

  const barStyle: CSSProperties = {
    width: `${normalizedValue}%`,
    // if the value is less than 1, we don't want to show the bar
    backgroundColor: value >= 1 ? getColor(value) : undefined
  };

  const roundingClassName = useMemo(() => {
    if (normalizedValue < 5) {
      return "rounded-l-3xl";
    }
    if (normalizedValue < 10) {
      return "rounded-l-sm";
    }
    if (normalizedValue < 25) {
      return "rounded-l-md";
    }
    if (normalizedValue > 50) {
      return "rounded-full";
    }
    return "rounded-l-xl rounded-r-xl";
  }, [normalizedValue]);

  return (
    <div className={`relative rounded-full bg-gray-400 ${className}`}>
      <div
        className={`absolute left-0 top-0 h-full ${roundingClassName}`}
        style={barStyle}
      ></div>
    </div>
  );
}
