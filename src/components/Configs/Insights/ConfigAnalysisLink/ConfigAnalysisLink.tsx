import { useState } from "react";
import { ConfigAnalysis } from "../../../../api/types/configs";
import { ViewType } from "../../../../types";
import { ConfigIcon } from "../../../../ui/Icons/ConfigIcon";
import { DescriptionCard } from "../../../DescriptionCard";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import ConfigInsightsDetailsModal from "./ConfigInsightsDetailsModal";

type Props = {
  configAnalysis: Pick<
    ConfigAnalysis,
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
    <div className="flex cursor-pointer flex-col space-y-1" {...rest}>
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
            <div className="flex flex-row items-center gap-2">
              <ConfigIcon
                config={configAnalysis?.config}
                className="mr-1 h-5"
              />
              <span>{configAnalysis?.config?.name}</span>
              <span>/</span>
            </div>
          )}
          <div
            className="flex cursor-pointer flex-row items-center gap-1 overflow-hidden"
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
