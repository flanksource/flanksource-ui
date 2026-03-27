import { useQuery } from "@tanstack/react-query";
import { sanitize } from "dompurify";
import { useMemo, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { getConfigInsightsByID } from "../../../../api/services/configs";
import { EvidenceType } from "../../../../api/types/evidence";
import { Property } from "../../../../api/types/topology";
import { Badge, badgeVariants } from "../../../ui/badge";
import { cn } from "../../../../lib/utils";
import { JSONViewer } from "../../../../ui/Code/JSONViewer";
import { Modal } from "../../../../ui/Modal";
import ModalTitleListItems from "../../../../ui/Modal/ModalTitleListItems";
import TextSkeletonLoader from "../../../../ui/SkeletonLoader/TextSkeletonLoader";
import { formatISODate, isValidDate } from "../../../../utils/date";
import { Tab, Tabs } from "../../../../ui/Tabs/Tabs";
import { DescriptionCard } from "../../../DescriptionCard";
import AttachAsEvidenceButton from "../../../Incidents/AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import ConfigLink from "../../ConfigLink/ConfigLink";
import ConfigInsightsIcon from "../ConfigInsightsIcon";

/** A single badge-type property rendered as an inline pill. */
function AnalysisBadge({ property }: { property: Property }) {
  const primaryLink = property.links?.[0]?.url;

  let displayText: string | undefined;
  if (property.value != null && property.max != null) {
    // Normalise both CVSS (75/100) and OpenSSF (7/10) to a /10 display.
    const scaled = (Number(property.value) / Number(property.max)) * 10;
    const formatted = Number.isInteger(scaled)
      ? String(scaled)
      : scaled.toFixed(1);
    displayText = `${formatted}/10`;
  } else if (property.value != null) {
    displayText = String(property.value);
  } else {
    displayText = property.text;
  }

  if (!displayText) return null;

  const colorClass =
    property.color ?? "bg-gray-100 border-gray-200 text-gray-700";

  const pill = (
    <Badge variant="outline" className={cn("gap-1 font-normal", colorClass)}>
      <span className="font-medium opacity-70">{property.name}:</span>
      <span>{displayText}</span>
      {primaryLink && <FiExternalLink size={9} className="opacity-50" />}
    </Badge>
  );

  return primaryLink ? (
    <a
      href={primaryLink}
      target="_blank"
      rel="noreferrer"
      className={cn(
        badgeVariants({ variant: "outline" }),
        "gap-1 font-normal transition-opacity hover:opacity-75",
        colorClass
      )}
    >
      <span className="font-medium opacity-70">{property.name}:</span>
      <span>{displayText}</span>
      <FiExternalLink size={9} className="opacity-50" />
    </a>
  ) : (
    pill
  );
}

/** All badge-type properties rendered as a flex-wrap row of pills. */
function AnalysisBadges({ properties }: { properties: Property[] }) {
  const badges = properties.filter((p) => p.type === "badge");
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((property, idx) => (
        <AnalysisBadge key={property.name ?? idx} property={property} />
      ))}
    </div>
  );
}

type Props = {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ConfigInsightsDetailsModal({
  id,
  isOpen,
  onClose
}: Props) {
  const [activeTab, setActiveTab] = useState<"message" | "analysis">("message");

  const { data: configInsight, isLoading } = useQuery(
    ["config", "insights", id],
    () => getConfigInsightsByID(id!),
    {
      enabled: isOpen && !!id,
      onError: () => onClose()
    }
  );

  const descriptionItems = useMemo(() => {
    if (!configInsight) {
      return [];
    }
    // Find the URL property to link the source field.
    const urlProp = configInsight?.properties?.find((p) => p.type === "url");
    const sourceHref = urlProp?.links?.[0]?.url ?? urlProp?.text;

    return [
      {
        label: "Type",
        value: (
          <div className="flex flex-row gap-2">
            <ConfigInsightsIcon analysis={configInsight} />
            {configInsight.analysis_type}
          </div>
        )
      },
      {
        label: "First Observed",
        value: isValidDate(configInsight.first_observed)
          ? formatISODate(configInsight.first_observed)
          : ""
      },
      {
        label: "Last Observed",
        value: isValidDate(configInsight.last_observed)
          ? formatISODate(configInsight.last_observed)
          : ""
      },
      {
        label: "Severity",
        value: configInsight?.severity ?? ""
      },
      {
        label: "Source",
        value: sourceHref ? (
          <a
            href={sourceHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            {configInsight?.source}
            <FiExternalLink size={12} />
          </a>
        ) : (
          (configInsight?.source ?? "")
        )
      }
    ];
  }, [configInsight]);

  const sanitizedMessageHTML = useMemo(() => {
    return sanitize(configInsight?.message ?? "");
  }, [configInsight]);

  // Render the analysis object as YAML if it exists and is non-empty
  const analysisDetails = useMemo(() => {
    const analysis = configInsight?.analysis;
    if (!analysis) {
      return null;
    }
    if (typeof analysis === "string") {
      try {
        const parsed = JSON.parse(analysis);
        if (
          !parsed ||
          (typeof parsed === "object" && Object.keys(parsed).length === 0)
        ) {
          return null;
        }
        return JSON.stringify(parsed);
      } catch {
        return null;
      }
    }
    if (typeof analysis === "object" && Object.keys(analysis).length === 0) {
      return null;
    }
    return JSON.stringify(analysis);
  }, [configInsight?.analysis]);

  // If there's no message but there is analysis, default to the analysis tab
  const resolvedActiveTab = useMemo(() => {
    if (activeTab === "message" && !sanitizedMessageHTML && analysisDetails) {
      return "analysis" as const;
    }
    return activeTab;
  }, [activeTab, sanitizedMessageHTML, analysisDetails]);

  if (!isOpen || !id) {
    return null;
  }

  return (
    <Modal
      title={
        <ModalTitleListItems
          items={[
            <div
              className="flex flex-grow-0 flex-row items-center gap-1 whitespace-nowrap"
              key="analyzer"
            >
              {configInsight ? (
                <ConfigInsightsIcon analysis={configInsight} />
              ) : null}
              <span>{configInsight?.analyzer}</span>
            </div>,
            configInsight?.config != null ? (
              <ConfigLink
                className="overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-semibold text-blue-600"
                config={configInsight.config}
                key="config"
              />
            ) : null
          ]}
        />
      }
      open={isOpen}
      onClose={onClose}
    >
      {isLoading ? (
        <TextSkeletonLoader />
      ) : !configInsight ? null : (
        <>
          <div className="flex flex-col space-y-6 px-4 py-4">
            <DescriptionCard
              items={descriptionItems}
              labelStyle="top"
              columns={3}
            />
            {configInsight.properties &&
              configInsight.properties.length > 0 && (
                <AnalysisBadges properties={configInsight.properties} />
              )}
            {configInsight.summary && (
              <p className="text-sm text-gray-700">{configInsight.summary}</p>
            )}
            {(sanitizedMessageHTML || analysisDetails) && (
              <div>
                <Tabs
                  activeTab={resolvedActiveTab}
                  onSelectTab={setActiveTab}
                  contentClassName="flex flex-col flex-1 bg-white pt-4"
                >
                  {[
                    ...(sanitizedMessageHTML
                      ? [
                          <Tab key="message" label="Message" value="message">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: sanitizedMessageHTML
                              }}
                            />
                          </Tab>
                        ]
                      : []),
                    ...(analysisDetails
                      ? [
                          <Tab key="analysis" label="Analysis" value="analysis">
                            <JSONViewer
                              code={analysisDetails}
                              format="json"
                              convertToYaml
                              minHeight={80}
                              maxHeight={400}
                            />
                          </Tab>
                        ]
                      : [])
                  ]}
                </Tabs>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-end rounded bg-gray-100 px-4 py-2">
            <AttachAsEvidenceButton
              config_analysis_id={configInsight.id}
              config_id={configInsight.config_id}
              evidence={{}}
              type={EvidenceType.ConfigAnalysis}
            />
          </div>
        </>
      )}
    </Modal>
  );
}
