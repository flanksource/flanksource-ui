import { useQuery } from "@tanstack/react-query";
import { sanitize } from "dompurify";
import { useMemo } from "react";
import { getConfigInsightsByID } from "../../../../api/services/configs";
import { EvidenceType } from "../../../../api/types/evidence";
import { Modal } from "../../../../ui/Modal";
import ModalTitleListItems from "../../../../ui/Modal/ModalTitleListItems";
import TextSkeletonLoader from "../../../../ui/SkeletonLoader/TextSkeletonLoader";
import { formatISODate, isValidDate } from "../../../../utils/date";
import { DescriptionCard } from "../../../DescriptionCard";
import AttachAsEvidenceButton from "../../../Incidents/AttachEvidenceDialog/AttachAsEvidenceDialogButton";
import ConfigLink from "../../ConfigLink/ConfigLink";
import ConfigInsightsIcon from "../ConfigInsightsIcon";

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
          <div className="flex flex-row gap-2">
            <ConfigInsightsIcon analysis={configInsight!} />
            {configInsight?.analysis_type}
          </div>
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
        <ModalTitleListItems
          items={[
            <div
              className="flex flex-grow-0 flex-row items-center gap-1 whitespace-nowrap"
              key={"analyzer"}
            >
              <ConfigInsightsIcon analysis={configInsight} />
              <span>{configInsight.analyzer}</span>
            </div>,
            configInsight.config != null ? (
              <ConfigLink
                className="overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-semibold text-blue-600"
                config={configInsight.config}
                key={"config"}
              />
            ) : null
          ]}
        />
      }
      open={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      {isLoading ? (
        <TextSkeletonLoader />
      ) : (
        <>
          <div className="flex flex-col space-y-6 px-4 py-4">
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
