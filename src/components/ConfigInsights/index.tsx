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
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [configAnalysis, setConfigAnalysis] = useState<ConfigTypeInsights>();

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/db/config_analysis?config_id=eq.${configID}`
      );
      let data = (await res.json()) as ConfigTypeInsights[];
      data = data.map((item) => {
        item.sanitizedMessageHTML = sanitizeHTMLContent(item.message);
        item.sanitizedMessageTxt = truncateText(
          sanitizeHTMLContentToText(item.message)!,
          500
        );
        return item;
      });
      setConfigInsights(data);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="flex flex-col space-y-2">
      <Modal
        title={"Config Analysis description"}
        open={open}
        onClose={() => setOpen(false)}
        size="slightly-small"
        bodyClass=""
      >
        <div
          className="p-8 text-sm text-gray-500"
          dangerouslySetInnerHTML={{
            __html: configAnalysis?.sanitizedMessageHTML!
          }}
        ></div>
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
