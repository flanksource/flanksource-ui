import { sanitize } from "dompurify";
import { useMemo, useState } from "react";
import { ConfigItem } from "../../api/services/configs";
import { EvidenceType } from "../../api/services/evidence";
import { formatISODate, isValidDate } from "../../utils/date";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { ConfigTypeInsights } from "../ConfigInsights";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import ConfigLink from "../ConfigLink/ConfigLink";
import { DescriptionCard } from "../DescriptionCard";
import { Modal } from "../Modal";
import { Loading } from "../Loading";
import { JSONViewer } from "../JSONViewer";
import { useGetConfigByIdQuery } from "../../api/query-hooks";

type Props = {
  configInsight?: ConfigTypeInsights & { config?: ConfigItem };
  isOpen: boolean;
  onClose: () => void;
};

export default function ConfigInsightsDetailsModal({
  configInsight,
  isOpen,
  onClose
}: Props) {
  const [attachEvidence, setAttachEvidence] = useState(false);

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

  const { isLoading, data: configDetails } = useGetConfigByIdQuery(
    configInsight?.config_id!
  );

  const code = useMemo(() => {
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

  return (
    <Modal
      title={
        <>
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
        </>
      }
      open={isOpen}
      onClose={() => {
        onClose();
      }}
      size="full"
      bodyClass=""
    >
      {configInsight?.id && (
        <>
          <div className="flex flex-col px-4 py-4 space-y-6">
            <DescriptionCard items={properties} labelStyle="top" columns={3} />
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
            <DescriptionCard
              items={[
                {
                  label: "Config",
                  value: (
                    <div className="w-full min-h-12 max-h-56 p-3 overflow-y-auto overflow-x-auto border border-gray-200 rounded">
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <JSONViewer
                          code={code}
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
