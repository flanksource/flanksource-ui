import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { MdOutlineInsights } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import CollapsiblePanel from "../CollapsiblePanel";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import EmptyState from "../EmptyState";
import { Loading } from "../Loading";
import Title from "../Title/title";

export type ConfigTypeInsights = {
  id: string;
  config_id: string;
  analyzer: string;
  analysis_type: string;
  severity: string;
  summary: string;
  status: string;
  message: string;
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

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/db/config_analysis?config_id=eq.${configID}`
      );
      const data = (await res.json()) as ConfigTypeInsights[];
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
                  data-tip={insight.message}
                  data-class="max-w-[20rem]"
                  className="p-2 font-medium text-black whitespace-nowrap"
                >
                  <ConfigInsightsIcon analysis={insight} />
                  {insight.analyzer}
                </td>
                <td className="p-2 ">
                  {dayjs(insight.first_observed).fromNow()}
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
