import { FaExclamationTriangle } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { NodePodPropToLabelMap } from "../../constants";
import { Topology } from "../../context/TopologyPageContext";
import CollapsiblePanel from "../CollapsiblePanel";
import { Icon } from "../Icon";
import { CardMetrics } from "../TopologyCard/CardMetrics";
import { FormatProperty } from "../TopologyCard/Property";

type Props = {
  topology?: Pick<Topology, "properties">;
};

export default function TopologyDetails({ topology }: Props) {
  const topologyProperties = topology?.properties ?? [];

  console.log(topologyProperties);

  const headline = topologyProperties?.filter((property) => property.headline);

  return (
    <div className="flex flex-col space-y-2">
      {headline && headline?.length > 0 && (
        <div className="flex flex-col p-4">
          <div className="flex flex-row divide-x divide-solid space-x-4 px-4 py-6 border border-gray-300 rounded-lg">
            <CardMetrics
              items={headline}
              showLabelIcons
              containerClasses="flex flex-col flex-1 space-y-3 items-center justify-center"
              labelClasses="text-gray-color"
              metricsClasses="font-semibold"
            />
          </div>
        </div>
      )}
      <CollapsiblePanel
        Header={
          <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
            <TbListDetails className="text-gray-400" />
            <span>Details</span>
          </h3>
        }
      >
        <div className="flex flex-col">
          {topologyProperties?.length > 0 ? (
            <table className="table-auto shadow-none">
              {topologyProperties
                .filter((property) => !property.headline)
                .map((property) => (
                  <tr>
                    <th className="text-gray-400 font-medium text-left overflow-auto">
                      {property.name ? (
                        <>
                          {/* @ts-ignore */}
                          {NodePodPropToLabelMap[property.name] ||
                            property.name}
                          :
                        </>
                      ) : (
                        <Icon
                          name={property.icon}
                          secondary={property.name}
                          size="xs"
                        />
                      )}
                    </th>
                    <td className="text-base border-none">
                      <FormatProperty property={property} />
                    </td>
                  </tr>
                ))}
            </table>
          ) : (
            <div className="flex flex-col items-center text-center space-x-2 text-gray-400">
              <div className="block text-center p-4">
                <FaExclamationTriangle className="inline-block align-middle" />{" "}
                <label className="inline-block align-middle">
                  No details found
                </label>
              </div>
            </div>
          )}
        </div>
      </CollapsiblePanel>
    </div>
  );
}
