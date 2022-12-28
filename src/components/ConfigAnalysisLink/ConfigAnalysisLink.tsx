import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { EvidenceType } from "../../api/services/evidence";
import { formatISODate, formatLongDate } from "../../utils/date";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { ConfigTypeInsights } from "../ConfigInsights";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import { Description } from "../Description/description";
import { Icon, Avatar } from "../Icon";
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
            <div className="flex flex-col px-4 py-4 text-gray-500 space-y-2">
              <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-4">
                  <div className="sm:col-span-1">
                    <Description
                      label="Type"
                      value={
                        <>
                          <Icon
                            name={configAnalysis?.analysis_type}
                            secondary="diff"
                            className="w-5 h-auto pr-1"
                          />
                          {configAnalysis?.analysis_type}
                        </>
                      }
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Description
                      label="Date"
                      value={formatISODate(configAnalysis?.created_at!)}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Description
                      label="Severity"
                      value={configAnalysis?.severity! || "NA"}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Description
                      label="Source"
                      value={configAnalysis?.source! || "NA"}
                    />
                  </div>
                </div>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: configAnalysis?.sanitizedMessageHTML!
                  }}
                ></div>
              </div>
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
        <>
          <div className="flex-1 text-sm">
            <div
              className="overflow-hidden truncate cursor-pointer"
              data-html={true}
              data-tip={configAnalysis.sanitizedMessageTxt}
              data-class="max-w-[20rem]"
            >
              <ConfigInsightsIcon analysis={configAnalysis} />
              {configAnalysis.analyzer}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-700 font-light text-left break-all">
              identified at {formatLongDate(configAnalysis.first_observed)}
            </div>
          </div>
        </>
      )}
      {viewType === "detailed" && (
        <div
          className="flex flex-col"
          onClick={() => {
            setOpen(true);
          }}
        >
          <div className="text-base">
            <ConfigInsightsIcon analysis={configAnalysis!} />
            {configAnalysis?.analyzer}
          </div>
          <div
            className="text-sm pl-2"
            dangerouslySetInnerHTML={{
              __html: configAnalysis?.sanitizedMessageHTML!
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
