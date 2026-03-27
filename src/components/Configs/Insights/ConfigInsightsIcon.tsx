import clsx from "clsx";
import {
  CiBandage,
  CiClock2,
  CiDollar,
  CiLink,
  CiStopwatch
} from "react-icons/ci";
import { ConfigAnalysis } from "../../../api/types/configs";
import {
  PiBankThin,
  PiHeartStraightBreakThin,
  PiLightbulbThin,
  PiShieldCheckeredFill,
  PiWarning
} from "react-icons/pi";

type Props = {
  analysis: Pick<ConfigAnalysis, "severity" | "analysis_type">;
  size?: number;
};

type InsightTypeToIconProps = {
  type: string;
  size?: number;
  colorClass?: string;
};

export function InsightTypeToIcon({
  type,
  size = 20,
  colorClass = "text-gray-500"
}: InsightTypeToIconProps) {
  switch (type) {
    case "cost":
      return (
        <CiDollar
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Cost"
        />
      );
    case "availability":
      return (
        <PiHeartStraightBreakThin
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Availability"
        />
      );
    case "performance":
      return (
        <CiStopwatch
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Performance"
        />
      );
    case "security":
      return (
        <PiShieldCheckeredFill
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Security"
        />
      );
    case "integration":
      return (
        <CiLink
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Integration"
        />
      );
    case "compliance":
      return (
        <PiBankThin
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Compliance"
        />
      );
    case "reliability":
      return (
        <CiClock2
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Reliability"
        />
      );
    case "technicalDebt":
      return (
        <CiBandage
          className={`${colorClass}`}
          size={size}
          title="Technical Debt"
        />
      );
    case "recommendation":
      return (
        <PiLightbulbThin
          className={clsx(colorClass, "inline-block")}
          size={size}
          title="Recommendation"
        />
      );
  }
  return <PiWarning className={clsx(colorClass, "inline-block")} size={size} />;
}

/**
 * AnalysisIcon
 *
 * Given an analysis_type and severity, return the appropriate icon and icon
 * color.
 *
 */
export default function ConfigInsightsIcon({ analysis, size = 22 }: Props) {
  return <InsightTypeToIcon type={analysis.analysis_type} size={size} />;
}
