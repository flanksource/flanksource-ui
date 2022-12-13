import { useMemo } from "react";
import { AiFillWarning } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { ConfigTypeInsights } from "../ConfigInsights";

type Props = {
  analysis: Pick<ConfigTypeInsights, "severity" | "analysis_type">;
};

/**
 * AnalysisIcon
 *
 * Given an analysis_type and severity, return the appropriate icon and icon
 * color.
 *
 */
export default function ConfigInsightsIcon({ analysis }: Props) {
  const size = 22;
  const colorClass = useMemo(() => {
    if (analysis.severity === "critical") {
      return "text-red-500 mr-1";
    }
    if (analysis.severity === "warning") {
      return "text-yellow-500 mr-1";
    }
    return "text-gray-500 mr-1";
  }, [analysis.severity]);

  switch (analysis.analysis_type) {
    case "cost":
      return (
        <BiDollarCircle
          className={`${colorClass} inline-block`}
          size={size}
          title="Cost"
        />
      );
    case "availability":
      return (
        <ImHeartBroken
          className={`${colorClass} inline-block`}
          size={size}
          title="Availability"
        />
      );
    case "performance":
      return (
        <IoMdSpeedometer
          className={`${colorClass} inline-block`}
          size={size}
          title="Performance"
        />
      );
    case "security":
      return (
        <MdSecurity
          className={`${colorClass} inline-block`}
          size={size}
          title="Security"
        />
      );
    case "integration":
      return (
        <GrIntegration
          className={`${colorClass} inline-block`}
          size={size}
          title="Integration"
        />
      );
    case "compliance":
      return (
        <FaTasks
          className={`${colorClass} inline-block`}
          size={size}
          title="Compliance"
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
  return <AiFillWarning className={`${colorClass} inline-block`} size="20" />;
}
