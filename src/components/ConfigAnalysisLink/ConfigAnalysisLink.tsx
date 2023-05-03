import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { ViewType } from "../../types";
import { ConfigTypeInsights } from "../ConfigInsights";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import { DescriptionCard } from "../DescriptionCard";
import { Icon } from "../Icon";
import ConfigInsightsDetailsModal from "./ConfigInsightsDetailsModal";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="flex flex-col cursor-pointer  space-y-1" {...rest}>
      <ConfigInsightsDetailsModal
        configInsight={configAnalysis}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
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
                name={
                  configAnalysis?.config?.type ||
                  configAnalysis?.config?.config_class
                }
                className="w-5 h-5 mr-1"
              />
              <span>{configAnalysis?.config?.name}</span>
              &nbsp;/&nbsp;
            </>
          )}
          <div
            className="overflow-hidden cursor-pointer"
            data-html={true}
            data-tip={configAnalysis.sanitizedMessageTxt}
            data-class="max-w-[20rem]"
          >
            <ConfigInsightsIcon analysis={configAnalysis} />
            {configAnalysis.analyzer}
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
