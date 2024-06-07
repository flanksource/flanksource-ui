import {
  EvidenceType,
  EvidenceWithEvidenceItems
} from "../../../api/types/evidence";
import { Icon } from "../../../ui/Icons/Icon";
import ConfigInsightsIcon from "../../Configs/Insights/ConfigInsightsIcon";

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
          <Icon name={check.icon} secondary={check.type} />
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
      const component = evidence.components;
      if (!component) {
        return null;
      }
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{component.name}</>;
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
          <Icon name={topology.icon} secondary={topology.type} />
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
