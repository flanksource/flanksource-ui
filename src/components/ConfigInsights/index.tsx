import { useEffect, useState } from "react";
import { MdOutlineInsights } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import { relativeDateTime } from "../../utils/date";
import CollapsiblePanel from "../CollapsiblePanel";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import EmptyState from "../EmptyState";
import { Loading } from "../Loading";
import Title from "../Title/title";
import { Modal } from "../Modal";
import {
  sanitizeHTMLContent,
  sanitizeHTMLContentToText,
  truncateText
} from "../../utils/common";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { EvidenceType } from "../../api/services/evidence";
import { useGetConfigInsights } from "../../api/query-hooks";

export type ConfigTypeInsights = {
  id: string;
  config_id: string;
  analyzer: string;
  analysis_type: string;
  severity: string;
  summary: string;
  status: string;
  message: string;
  sanitizedMessageHTML?: string;
  sanitizedMessageTxt?: string;
  analysis: string;
  first_observed: string;
  last_observed: string;
};

type Props = {
  configID: string;
};

function ConfigInsightsDetails({ configID }: Props) {
  const [configInsights, setConfigInsights] = useState<ConfigTypeInsights[]>(
    []
  );
  const [attachEvidence, setAttachEvidence] = useState(false);
  const [open, setOpen] = useState(false);
  const [configAnalysis, setConfigAnalysis] = useState<ConfigTypeInsights>();
  const { data: response = [], isLoading } =
    useGetConfigInsights<ConfigTypeInsights[]>(configID);

  useEffect(() => {
    const data = response?.map((item) => {
      return {
        ...item,
        sanitizedMessageHTML: sanitizeHTMLContent(item.message),
        sanitizedMessageTxt: truncateText(
          sanitizeHTMLContentToText(item.message)!,
          500
        )
      };
    });
    setConfigInsights(data);
  }, [response]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="flex flex-col space-y-2">
      <Modal
        title={"Config Analysis description"}
        open={open}
        onClose={() => {
          setOpen(false);
          setConfigAnalysis(undefined);
        }}
        size="slightly-small"
        bodyClass=""
      >
        {configAnalysis?.id && (
          <>
            <div className="flex flex-col px-8 py-6 text-gray-500 space-y-2">
              <div className="flex flex-col">
                <div className="text-base">
                  <ConfigInsightsIcon analysis={configAnalysis} />
                  {configAnalysis.analyzer}
                </div>
                <div
                  className="text-sm pl-2"
                  dangerouslySetInnerHTML={{
                    __html: configAnalysis?.sanitizedMessageHTML!
                  }}
                ></div>
              </div>
              <div className="flex justify-end flex-wrap">
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
      {isLoading ? (
        <Loading />
      ) : configInsights.length > 0 ? (
        <table className="w-full text-sm text-left">
          <thead className="text-sm uppercase text-gray-600">
            <tr>
              <th scope="col" className="p-2">
                Name
              </th>
              <th scope="col" className="p-2">
                Age
              </th>
            </tr>
          </thead>
          <tbody>
            {configInsights.map((insight) => (
              <tr key={insight.id}>
                <td
                  data-html={true}
                  data-tip={insight.sanitizedMessageTxt}
                  data-class="max-w-[20rem]"
                  className="p-2 font-medium text-black whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    setConfigAnalysis(insight);
                    setOpen(true);
                  }}
                >
                  <ConfigInsightsIcon analysis={insight} />
                  {insight.analyzer}
                </td>
                <td className="p-2 ">
                  {relativeDateTime(insight.first_observed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default function ConfigInsights(props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <Title
          title="Insights"
          icon={<MdOutlineInsights className="w-6 h-auto" />}
        />
      }
    >
      <ConfigInsightsDetails {...props} />
    </CollapsiblePanel>
  );
}
