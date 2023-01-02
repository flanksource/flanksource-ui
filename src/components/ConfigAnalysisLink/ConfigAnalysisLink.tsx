import { useState, useEffect, useMemo } from "react";
import ReactTooltip from "react-tooltip";
import { EvidenceType } from "../../api/services/evidence";
import { formatISODate, formatLongDate } from "../../utils/date";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { ConfigTypeInsights } from "../ConfigInsights";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import { DescriptionCard } from "../DescriptionCard";
import { Icon } from "../Icon";
import { Modal } from "../Modal";

type Props = {
  configAnalysis: ConfigTypeInsights;
  viewType?: "summary" | "detailed";
} & React.HTMLProps<HTMLDivElement>;

export function ConfigAnalysisLink({
  configAnalysis,
  viewType = "summary",
  ...rest
}: Props) {
  const [attachEvidence, setAttachEvidence] = useState(false);
  const [open, setOpen] = useState(false);
  const properties = useMemo(() => {
    return [
      {
        label: "Type",
        value: (
          <>
            <Icon
              name={configAnalysis?.analysis_type}
              secondary="diff"
              className="w-5 h-auto pr-1"
            />
            {configAnalysis?.analysis_type}
          </>
        )
      },
      {
        label: "Date",
        value: formatISODate(configAnalysis?.created_at!)
      },
      {
        label: "Severity",
        value: configAnalysis?.severity! || "NA"
      },
      {
        label: "Source",
        value: configAnalysis?.source! || "NA"
      }
    ];
  }, [configAnalysis]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div
      className="flex flex-col cursor-pointer  space-y-1"
      {...rest}
      onClick={() => {
        setOpen(true);
      }}
    >
      <Modal
        title={
          <>
            <ConfigInsightsIcon analysis={configAnalysis} />
            {configAnalysis.analyzer}
          </>
        }
        open={open}
        onClose={(e) => {
          e?.stopPropagation();
          setOpen(false);
        }}
        size="large"
        bodyClass=""
      >
        {configAnalysis?.id && (
          <>
            <div className="flex flex-col px-4 py-4 space-y-6">
              <DescriptionCard
                items={properties}
                labelStyle="top"
                noOfCols={properties.length}
              />
              <DescriptionCard
                items={[
                  {
                    label: "",
                    value: (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: configAnalysis?.sanitizedMessageHTML!
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
              config_analysis_id={configAnalysis.id}
              config_id={configAnalysis.config_id}
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
      {viewType === "summary" && (
        <DescriptionCard
          items={[
            {
              label: (
                <div
                  className="overflow-hidden truncate cursor-pointer"
                  data-html={true}
                  data-tip={configAnalysis.sanitizedMessageTxt}
                  data-class="max-w-[20rem]"
                >
                  <ConfigInsightsIcon analysis={configAnalysis} />
                  {configAnalysis.analyzer}
                </div>
              ),
              value: (
                <div className="break-all">
                  identified at {formatLongDate(configAnalysis.first_observed)}
                </div>
              )
            }
          ]}
          labelStyle="top"
        />
      )}
      {viewType === "detailed" && (
        <DescriptionCard
          onClick={() => {
            setOpen(true);
          }}
          items={[
            {
              label: (
                <div className="text-base">
                  <ConfigInsightsIcon analysis={configAnalysis!} />
                  {configAnalysis?.analyzer}
                </div>
              ),
              value: (
                <div
                  className="pl-2"
                  dangerouslySetInnerHTML={{
                    __html: configAnalysis?.sanitizedMessageHTML!
                  }}
                ></div>
              )
            }
          ]}
          labelStyle="top"
        />
      )}
    </div>
  );
}
