import { useMemo } from "react";
import { AiFillWarning } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { ConfigTypeInsights } from "../ConfigInsights";
import clsx from "clsx";

type Props = {
  analysis: Pick<ConfigTypeInsights, "severity" | "analysis_type">;
  size?: number;
};

function insightSeverityToColorMap(severity: string) {
  if (severity === "critical") {
    return "text-red-500";
  }
  if (severity === "warning") {
    return "text-yellow-500";
  }
  return "text-gray-500";
}

export function insightTypeToIconMap(
  type: string,
  size = 22,
  colorClass?: string
) {
  const adjustedSize = size + 2;

  switch (type) {
    case "cost":
      return (
        <BiDollarCircle
          className={clsx(colorClass, "inline-block")}
          size={adjustedSize}
          title="Cost"
        />
      );
    case "availability":
      return (
        <ImHeartBroken
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Availability"
        />
      );
    case "performance":
      return (
        <IoMdSpeedometer
          className={clsx(colorClass, "inline-block")}
          size={adjustedSize}
          title="Performance"
        />
      );
    case "security":
      return (
        <MdSecurity
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Security"
        />
      );
    case "integration":
      return (
        <GrIntegration
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Integration"
        />
      );
    case "compliance":
      return (
        <FaTasks
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Compliance"
        />
      );
    case "reliability":
      return (
        <FaRegClock
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Reliability"
        />
      );
    case "technicalDebt":
      return (
        <GrWorkshop
          className={`${colorClass}`}
          size={size}
          title="Technical Debt"
        />
      );
  }
  return (
    <AiFillWarning
      className={clsx(colorClass, "inline-block")}
      size={adjustedSize}
    />
  );
}

/**
 * AnalysisIcon
 *
 * Given an analysis_type and severity, return the appropriate icon and icon
 * color.
 *
 */
export default function ConfigInsightsIcon({ analysis, size = 22 }: Props) {
  const colorClass = useMemo(() => {
    return insightSeverityToColorMap(analysis.severity);
  }, [analysis.severity]);
  return insightTypeToIconMap(
    analysis.analysis_type,
    size,
    `${colorClass} mr-1`
  );
}
