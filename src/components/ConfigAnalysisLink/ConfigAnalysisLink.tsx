import { useState, useEffect, useMemo } from "react";
import ReactTooltip from "react-tooltip";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { EvidenceType } from "../../api/services/evidence";
import { ViewType } from "../../types";
import { formatISODate } from "../../utils/date";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { ConfigTypeInsights } from "../ConfigInsights";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import ConfigLink from "../ConfigLink/ConfigLink";
import { DescriptionCard } from "../DescriptionCard";
import { Icon } from "../Icon";
import { Modal } from "../Modal";

type Props = {
  configAnalysis: ConfigTypeInsights;
  viewType?: ViewType;
  showConfigLogo?: boolean;
} & React.HTMLProps<HTMLDivElement>;

export function ConfigAnalysisLink({
  configAnalysis,
  viewType = ViewType.summary,
  showConfigLogo,
  ...rest
}: Props) {
  const [attachEvidence, setAttachEvidence] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: config } = useGetConfigByIdQuery(configAnalysis?.config_id);
  console.log(config);
  const properties = useMemo(() => {
    return [
      {
        label: "Type",
        value: (
          <>
            <ConfigInsightsIcon analysis={configAnalysis!} />
            {configAnalysis?.analysis_type}
          </>
        )
      },
      {
        label: "First Observed",
        value: formatISODate(configAnalysis?.first_observed!)
      },
      {
        label: "Last Observed",
        value: formatISODate(configAnalysis?.last_observed!)
      },
      {
        label: "Severity",
        value: configAnalysis?.severity! || ""
      },
      {
        label: "Source",
        value: configAnalysis?.source! || ""
      }
    ];
  }, [configAnalysis]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="flex flex-col cursor-pointer  space-y-1" {...rest}>
      <Modal
        title={
          config && (
            <>
              <ConfigLink
                className="text-blue-600 text-xl font-semibold whitespace-nowrap mr-1"
                configId={config.id}
                configName={config.name}
                configType={config.external_type}
                configTypeSecondary={config.config_type}
              />
              &nbsp;/&nbsp;
              <ConfigInsightsIcon analysis={configAnalysis} />
              {configAnalysis.analyzer}
            </>
          )
        }
        open={open}
        onClose={(e) => {
          // this is added to fix modal not being closed issue when we open a modal on top of another modal
          e?.stopPropagation();
          setOpen(false);
        }}
        size="full"
        bodyClass=""
      >
        {configAnalysis?.id && (
          <>
            <div className="flex flex-col px-4 py-4 space-y-6">
              <DescriptionCard
                items={properties}
                labelStyle="top"
                columns={3}
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
      {viewType === ViewType.summary && (
        <div
          className="inline-block"
          onClick={() => {
            setOpen(true);
          }}
        >
          {showConfigLogo && (
            <>
              <Icon
                name={config?.external_type || config?.config_type}
                className="w-5 mr-1"
              />
              <span>{config?.name}</span>
              &nbsp;/&nbsp;
            </>
          )}
          <span
            className="overflow-hidden truncate cursor-pointer"
            data-html={true}
            data-tip={configAnalysis.sanitizedMessageTxt}
            data-class="max-w-[20rem]"
          >
            <ConfigInsightsIcon analysis={configAnalysis} />
            {configAnalysis.analyzer}
          </span>
        </div>
      )}
      {viewType === ViewType.detailed && (
        <DescriptionCard
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
