import { EvidenceType } from "../../api/services/evidence";
import { EvidenceWithEvidenceItems } from "../../api/services/IncidentsHistory";
import LogItem from "../../types/Logs";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import { Icon } from "../Icon";

type ChangelogEvidenceContentProps = {
  evidence: EvidenceWithEvidenceItems;
};

const evidenceChangelogContent = new Map<
  `${EvidenceType}`,
  React.FC<ChangelogEvidenceContentProps>
>([
  [
    "check",
    ({ evidence }) => {
      const check = evidence.checks;
      if (!check) {
        return null;
      }
      return (
        <>
          <Icon icon={check.icon} name={check.name} />
          {check.name}
        </>
      );
    }
  ],
  [
    "config",
    ({ evidence }) => {
      const config = evidence.configs;
      if (!config) {
        return null;
      }
      return <> {config.name}</>;
    }
  ],
  [
    "log",
    ({ evidence }) => {
      const log = evidence.evidence as LogItem;
      if (!log) {
        return null;
      }
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{log.message}</>;
    }
  ],
  [
    "config_analysis",
    ({ evidence }) => {
      const configAnalysis = evidence.config_analysis;
      if (!configAnalysis) {
        return null;
      }
      return (
        <>
          <ConfigInsightsIcon analysis={configAnalysis} />
          {configAnalysis.analyzer}
        </>
      );
    }
  ],
  [
    "config_change",
    ({ evidence }) => {
      const configChange = evidence.config_changes;
      if (!configChange) {
        return null;
      }
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{configChange.change_type}</>;
    }
  ],
  [
    "topology",
    ({ evidence }) => {
      const topology = evidence.components;
      if (!topology) {
        return null;
      }
      return (
        <>
          <Icon icon={topology.icon} name={topology.name} />
          {topology.name}
        </>
      );
    }
  ]
]);

export default function EvidenceChangelogContent({
  evidence
}: Partial<ChangelogEvidenceContentProps>) {
  const Component = evidenceChangelogContent.get(evidence?.type!);

  if (!Component || !evidence) {
    return null;
  }

  return <Component evidence={evidence} />;
}
