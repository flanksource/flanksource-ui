import { useMemo } from "react";
import { AiFillWarning } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { ConfigTypeAnalysis } from "../ConfigAnalysis";

type Props = {
  analysis: Pick<ConfigTypeAnalysis, "severity" | "analysis_type">;
};

/**
 * AnalysisIcon
 *
 * Given an analysis_type and severity, return the appropriate icon and icon
 * color.
 *
 */
export default function AnalysisIcon({ analysis }: Props) {
  const colorClass = useMemo(() => {
    if (analysis.severity === "critical") {
      return "text-red-500";
    }
    if (analysis.severity === "warning") {
      return "text-yellow-500";
    }
    return "text-gray-500";
  }, [analysis.severity]);

  switch (analysis.analysis_type) {
    case "cost":
      return (
        <BiDollarCircle
          className={`${colorClass} inline-block`}
          size="20"
          title="Cost"
        />
      );
    case "availability":
      return (
        <ImHeartBroken
          className={`${colorClass} inline-block`}
          size="20"
          title="Availability"
        />
      );
    case "performance":
      return (
        <IoMdSpeedometer
          className={`${colorClass} inline-block`}
          size="20"
          title="Performance"
        />
      );
    case "security":
      return (
        <MdSecurity
          className={`${colorClass} inline-block`}
          size="20"
          title="Security"
        />
      );
    case "integration":
      return (
        <GrIntegration
          className={`${colorClass} inline-block`}
          size="20"
          title="Integration"
        />
      );
    case "compliance":
      return (
        <FaTasks
          className={`${colorClass} inline-block`}
          size="20"
          title="Compliance"
        />
      );
    case "technicalDebt":
      return (
        <GrWorkshop
          className={`${colorClass}`}
          size="20"
          title="Technical Debt"
        />
      );
  }
  return <AiFillWarning className={`${colorClass} inline-block`} size="20" />;
}
