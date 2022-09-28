import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { FC, memo, ReactNode } from "react";

type GaugeProps = {
  /** value of the gauge */
  value: number;
  /** Units of the value */
  units?: string;
  /** minimum value of the gauge */
  minValue: number;
  /** maximum value of the gauge */
  maxValue: number;
  /** width of the gauge, use rem or em to make it responsive */
  width?: string;
  /** color of the filled value inside gauge */
  arcColor?: string;
  /** background color for the gauge arc */
  arcBgColor?: string;
  /** jsx to be used as a label */
  label?: ReactNode;
};

export const Gauge: FC<GaugeProps> = memo(
  ({
    value,
    minValue,
    maxValue,
    units = "",
    arcColor = "green",
    arcBgColor = "#d4d4d4",
    width = "12em",
    label
  }) => {
    const backgroundArc = arc()({
      innerRadius: 0.7,
      outerRadius: 1,
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2
    });

    const filledPercent = scaleLinear().domain([minValue, maxValue])(value);
    const filledAngle = scaleLinear()
      .domain([0, 1])
      .range([-Math.PI / 2, Math.PI / 2])
      .clamp(true)(filledPercent);

    const filledArc = arc()({
      innerRadius: 0.7,
      outerRadius: 1,
      startAngle: -Math.PI / 2,
      endAngle: filledAngle
    });

    return (
      <div className="inline-block m-2">
        <svg viewBox="-1 -1 2 1" width={width}>
          <path d={backgroundArc || ""} fill={arcBgColor} />
          <path d={filledArc || ""} fill={arcColor} />
        </svg>
        {label || (
          <h3 className="font-bold text-2xl text-center -mt-6">
            {value}
            {units}
          </h3>
        )}
      </div>
    );
  }
);

Gauge.displayName = "Gauge";
