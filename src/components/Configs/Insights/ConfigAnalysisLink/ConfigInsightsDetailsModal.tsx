import { useQuery } from "@tanstack/react-query";
import { sanitize } from "dompurify";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiCircle,
  FiExternalLink,
  FiXCircle
} from "react-icons/fi";
import { getConfigInsightsByID } from "../../../../api/services/configs";
import { EvidenceType } from "../../../../api/types/evidence";
import { Property } from "../../../../api/types/topology";
import { Badge, badgeVariants } from "../../../ui/badge";
import { cn } from "../../../../lib/utils";
import { JSONViewer } from "../../../../ui/Code/JSONViewer";
import { Modal } from "../../../../ui/Modal";
import Age from "../../../../ui/Age/Age";
import { Tab, Tabs } from "../../../../ui/Tabs/Tabs";
import { DescriptionCard } from "../../../DescriptionCard";
import AttachAsEvidenceButton from "../../../Incidents/AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import ConfigLink from "../../ConfigLink/ConfigLink";
import ConfigInsightsIcon from "../ConfigInsightsIcon";

const statusConfig: Record<string, { icon: React.ReactNode }> = {
  open: { icon: <FiCircle size={13} className="text-blue-500" /> },
  resolved: { icon: <FiCheckCircle size={13} className="text-green-500" /> },
  closed: { icon: <FiXCircle size={13} className="text-gray-400" /> }
};

const severityBadgeClass: Record<string, string> = {
  info: "bg-gray-100 border-gray-300 text-gray-700",
  low: "bg-green-50 border-green-300 text-green-700",
  medium: "bg-yellow-50 border-yellow-300 text-yellow-700",
  warning: "bg-yellow-100 border-yellow-400 text-yellow-800",
  high: "bg-orange-50 border-orange-300 text-orange-700",
  blocker: "bg-red-50 border-red-300 text-red-700",
  critical: "bg-red-100 border-red-400 text-red-800"
};

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

  useEffect(() => {
    if (isOpen) {
      setActiveTab("message");
    }
  }, [isOpen]);

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
            {configInsight.analysis_type
              ? configInsight.analysis_type.charAt(0).toUpperCase() +
                configInsight.analysis_type.slice(1)
              : ""}
          </div>
        )
      },
      {
        label: "First Observed",
        value: <Age from={configInsight.first_observed} />
      },
      {
        label: "Last Observed",
        value: <Age from={configInsight.last_observed} />
      },
      {
        label: "Severity",
        value: configInsight?.severity ? (
          <Badge
            variant="outline"
            className={cn(
              severityBadgeClass[configInsight.severity] ??
                "border-gray-300 bg-gray-100 text-gray-700"
            )}
          >
            {configInsight.severity.charAt(0).toUpperCase() +
              configInsight.severity.slice(1)}
          </Badge>
        ) : (
          ""
        )
      },
      ...(configInsight?.config != null
        ? [
            {
              label: "Config",
              value: (
                <ConfigLink
                  className="overflow-hidden overflow-ellipsis whitespace-nowrap"
                  config={configInsight.config}
                />
              )
            }
          ]
        : []),
      {
        label: "Status",
        value: configInsight?.status
          ? (() => {
              const cfg = statusConfig[configInsight.status];
              return (
                <div className="flex items-center gap-1">
                  {cfg?.icon}
                  <span>
                    {configInsight.status.charAt(0).toUpperCase() +
                      configInsight.status.slice(1)}
                  </span>
                </div>
              );
            })()
          : ""
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
        isLoading ? (
          <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
        ) : (
          <div className="flex flex-grow-0 flex-row items-center gap-1 whitespace-nowrap">
            {configInsight ? (
              <ConfigInsightsIcon analysis={configInsight} />
            ) : null}
            <span>{configInsight?.analyzer}</span>
          </div>
        )
      }
      open={isOpen}
      onClose={onClose}
    >
      {isLoading ? (
        <div className="flex animate-pulse flex-col gap-4 px-4 py-4">
          {/* properties grid */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="h-3 w-16 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-100" />
              </div>
            ))}
          </div>
          {/* summary */}
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          {/* tabs */}
          <div className="flex gap-4 border-b border-gray-200 pb-2">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>
          {/* content */}
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-3 rounded bg-gray-100"
                style={{ width: `${80 - i * 8}%` }}
              />
            ))}
          </div>
        </div>
      ) : !configInsight ? null : (
        <>
          <div className="flex flex-col space-y-6 px-4 py-4">
            <DescriptionCard
              items={descriptionItems}
              labelStyle="top"
              columns={4}
            />
            {configInsight.properties &&
              configInsight.properties.length > 0 && (
                <AnalysisBadges properties={configInsight.properties} />
              )}
            {configInsight.summary && (
              <p className="text-sm text-blue-600">
                {configInsight.summary.charAt(0).toUpperCase() +
                  configInsight.summary.slice(1)}
              </p>
            )}
            {(sanitizedMessageHTML || analysisDetails) && (
              <div>
                <Tabs
                  activeTab={resolvedActiveTab}
                  onSelectTab={setActiveTab}
                  contentClassName="flex flex-col flex-1 bg-white"
                >
                  {[
                    ...(sanitizedMessageHTML
                      ? [
                          <Tab key="message" label="Message" value="message">
                            <div
                              className="pt-3 text-sm text-gray-700"
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
