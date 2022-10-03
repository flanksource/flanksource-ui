import dayjs from "dayjs";
import { useEffect, useState } from "react";
import AnalysisIcon from "../AnalysisIcon";

export type ConfigTypeRelationships = {
  config_id: string;
  related_id: string;
  property: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  selector_id: string;
};

type Props = {
  configID: string;
};

export default function ConfigRelated({ configID }: Props) {
  const [configRelationships, setConfigRelationships] = useState<
    ConfigTypeRelationships[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigAnalysis(configID: string) {
      setIsLoading(true);
      const res = await fetch(
        `/api/configs_db/config_relationships?config_id=eq.${configID}`
      );
      const data = (await res.json()) as ConfigTypeRelationships[];
      await Promise.all(
        data.map(async (relationship) => {
          const res = await fetch(
            `/api/configs_db/configs?id=eq.${relationship.related_id}`
          );
          const data = await res.json();
          return console.log(data);
        })
      );
      setConfigRelationships(data);
      setIsLoading(false);
    }

    fetchConfigAnalysis(configID);
  }, [configID]);

  if (isLoading) {
    return null;
  }

  if (configRelationships.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 w-full px-2 py-4 shadow-lg rounded-md  bg-white">
      <h3 className="font-semibold text-xl py-4 border-b">Analysis</h3>
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
          {configRelationships.map((analysis) => (
            <tr key={analysis.related_id}>
              {/* <td className="p-2 font-medium text-black whitespace-nowrap">
                {analysis.property ? analysis.summary : ""}
              </td>
              <td className="p-2 ">
                {dayjs(analysis.first_observed).fromNow()}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
