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
  const [attachEvidence, setAttachEvidence] = useState(false);

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

  const sanitizedMessageHTML = useMemo(() => {
    return sanitize(configInsight?.message! || "");
  }, [configInsight]);

  if (!configInsight) {
    return null;
  }

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
