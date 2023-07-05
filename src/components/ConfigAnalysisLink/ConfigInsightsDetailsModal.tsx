import { sanitize } from "dompurify";
import { useMemo, useState } from "react";
import { getConfigInsightsByID } from "../../api/services/configs";
import { EvidenceType } from "../../api/services/evidence";
import { formatISODate, isValidDate } from "../../utils/date";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import ConfigLink from "../ConfigLink/ConfigLink";
import { DescriptionCard } from "../DescriptionCard";
import { Modal } from "../Modal";
import { Loading } from "../Loading";
import { JSONViewer } from "../JSONViewer";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { Tab, Tabs } from "../Tabs/Tabs";
import { useQuery } from "@tanstack/react-query";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";

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
  const subNav = [
    {
      label: "Summary",
      value: "Summary"
    },
    {
      label: "Raw",
      value: "Raw"
    }
  ];

  const [attachEvidence, setAttachEvidence] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(subNav[0]?.value);

  const { data: configInsight, isLoading } = useQuery(
    ["config", "insights", id],
    () => getConfigInsightsByID(id!),
    {
      enabled: isOpen && !!id
    }
  );

  const properties = useMemo(() => {
    return [
      {
        label: "Type",
        value: (
          <>
            <ConfigInsightsIcon analysis={configInsight!} />
            {configInsight?.analysis_type}
          </>
        )
      },
      {
        label: "First Observed",
        value: isValidDate(configInsight?.first_observed)
          ? formatISODate(configInsight?.first_observed)
          : ""
      },
      {
        label: "Last Observed",
        value: isValidDate(configInsight?.last_observed)
          ? formatISODate(configInsight?.last_observed)
          : ""
      },
      {
        label: "Severity",
        value: configInsight?.severity! || ""
      },
      {
        label: "Source",
        value: configInsight?.source! || ""
      }
    ];
  }, [configInsight]);

  const { isLoading: isConfigLoading, data: configDetails } =
    useGetConfigByIdQuery(configInsight?.config_id!);

  const configCode = useMemo(() => {
    if (!configDetails?.config) {
      return "";
    }
    if (configDetails?.config?.content != null) {
      return configDetails?.config.content;
    }

    const ordered = Object.keys(configDetails.config)
      .sort()
      .reduce((obj: Record<string, any>, key) => {
        obj[key] = configDetails.config[key];
        return obj;
      }, {});

    return configDetails?.config && JSON.stringify(ordered, null, 2);
  }, [configDetails]);

  const format = useMemo(
    () =>
      configDetails?.config.format != null
        ? configDetails?.config.format
        : "yaml",
    [configDetails]
  );

  const sanitizedMessageHTML = useMemo(() => {
    return sanitize(configInsight?.message! || "");
  }, [configInsight]);

  if (!configInsight) {
    return null;
  }

  const onSubNavClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Modal
      title={
        <div className="flex flex-row items-center">
          <ConfigLink
            className="text-blue-600 text-xl font-semibold whitespace-nowrap mr-1"
            configId={configInsight.config!.id}
            configName={configInsight.config!.name}
            configType={configInsight.config!.type}
            configTypeSecondary={configInsight.config!.config_class}
          />
          {" / "}
          <ConfigInsightsIcon analysis={configInsight} />
          {configInsight.analyzer}
        </div>
      }
      open={isOpen}
      onClose={() => {
        onSubNavClick(subNav[0]?.value);
        onClose();
      }}
      size="full"
      bodyClass=""
    >
      {isLoading ? (
        <TextSkeletonLoader />
      ) : (
        <>
          <div className="flex flex-col px-4 py-4 space-y-6">
            <DescriptionCard items={properties} labelStyle="top" columns={3} />
            {configCode !== null && configCode !== "{}" ? (
              <Tabs
                activeTab={activeTab}
                onSelectTab={(tab) => onSubNavClick(tab)}
              >
                {subNav?.map((nav) => {
                  return (
                    <Tab key={nav.label} label={nav.label} value={nav.value}>
                      {nav.label === "Summary" && (
                        <DescriptionCard
                          items={[
                            {
                              label: "",
                              value: (
                                <div
                                  className="p-3"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizedMessageHTML
                                  }}
                                ></div>
                              )
                            }
                          ]}
                          labelStyle="top"
                        />
                      )}
                      {nav.label === "Raw" && (
                        <DescriptionCard
                          items={[
                            {
                              value: (
                                <div className="w-full min-h-12 max-h-modal-body-md  p-3 overflow-y-auto overflow-x-auto">
                                  {isConfigLoading ? (
                                    <Loading />
                                  ) : (
                                    <JSONViewer
                                      code={configCode}
                                      format={format}
                                      convertToYaml
                                      showLineNo
                                    />
                                  )}
                                </div>
                              )
                            }
                          ]}
                          labelStyle="top"
                          className="mt-4"
                        />
                      )}
                    </Tab>
                  );
                })}
              </Tabs>
            ) : (
              <DescriptionCard
                items={[
                  {
                    label: "",
                    value: (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sanitizedMessageHTML
                        }}
                      ></div>
                    )
                  }
                ]}
                labelStyle="top"
              />
            )}
          </div>
          <div className="flex items-center justify-end mt-4 py-2 px-4 rounded bg-gray-100">
            <button
              type="button"
              onClick={() => {
                setAttachEvidence(true);
              }}
              className="btn-primary"
            >
              Attach as Evidence
            </button>
          </div>
          <AttachEvidenceDialog
            key={`attach-evidence-dialog`}
            isOpen={attachEvidence}
            onClose={() => setAttachEvidence(false)}
            config_analysis_id={configInsight.id}
            config_id={configInsight.config_id}
            evidence={{}}
            type={EvidenceType.ConfigAnalysis}
            callback={(success: boolean) => {
              if (success) {
                setAttachEvidence(false);
              }
            }}
          />
        </>
      )}
    </Modal>
  );
}
