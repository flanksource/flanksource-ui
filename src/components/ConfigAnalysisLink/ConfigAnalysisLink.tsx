import { useState } from "react";
import { ViewType } from "../../types";
import { ConfigTypeInsights } from "../ConfigInsights";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import { DescriptionCard } from "../DescriptionCard";
import { Icon } from "../Icon";
import ConfigInsightsDetailsModal from "./ConfigInsightsDetailsModal";

type Props = {
  configAnalysis: Pick<
    ConfigTypeInsights,
    | "id"
    | "analyzer"
    | "config"
    | "severity"
    | "analysis_type"
    | "sanitizedMessageTxt"
    | "sanitizedMessageHTML"
  >;
  viewType?: ViewType;
  showConfigLogo?: boolean;
} & React.HTMLProps<HTMLDivElement>;

export function ConfigAnalysisLink({
  configAnalysis,
  viewType = ViewType.summary,
  showConfigLogo,
  ...rest
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col cursor-pointer  space-y-1" {...rest}>
      {open && (
        <ConfigInsightsDetailsModal
          id={configAnalysis.id}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
      {viewType === ViewType.summary && (
        <div
          className="flex flex-row items-center"
          onClick={() => {
            setOpen(true);
          }}
        >
          {showConfigLogo && (
            <div className="flex flex-row gap-2 items-center">
              <Icon
                name={configAnalysis?.config?.type}
                secondary={configAnalysis?.config?.config_class}
                className="w-5 h-5"
              />
              <span>{configAnalysis?.config?.name}</span>
              <span>/</span>
            </div>
          )}
          <div
            className="flex flex-row items-center gap-1 overflow-hidden cursor-pointer"
            data-html={true}
            data-class="max-w-[20rem]"
          >
            <ConfigInsightsIcon analysis={configAnalysis} />
            <span>{configAnalysis.analyzer}</span>
          </div>
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
