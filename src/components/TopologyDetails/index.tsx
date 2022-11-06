import { map } from "lodash";
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

  const headline = topologyProperties?.filter((property) => property.headline);

  return (
    <div className="flex flex-col space-y-2">
      <CollapsiblePanel
        Header={
          <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
            <TbListDetails className="text-gray-400" />
            <span>Details</span>
          </h3>
        }
      >
        <div className="flex flex-col">
          {headline && headline?.length > 0 && (
            <div className="flex flex-col p-4">
              <div className="flex flex-row divide-x divide-solid space-x-2  py-2">
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

          {topologyProperties?.length > 0 ? (
            <table className="table-auto shadow-none">
              {topologyProperties
                .filter(
                  (property) =>
                    !property.headline &&
                    (property.text != null || property.value != null)
                )
                .map((property) => (
                  <tr>
                    <th className="text-gray-500 font-light text-left overflow-auto">
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
                          // secondary={property.name}
                          size="sm"
                        >
                          {" "}
                          {property.name}
                        </Icon>
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

          <span className="text-gray-500 font-light text-left overflow-auto">
            Labels
          </span>

          {topology.labels &&
            map(topology.labels, (v, k) => (
              <div
                data-tip={`${k}: ${v}`}
                className="max-w-full overflow-hidden text-ellipsi px-1 py-0.75 mr-1 mb-1 rounded-md text-gray-600 font-semibold text-xs"
                key={k}
              >
                {k}: <span className="font-light">{v}</span>
              </div>
            ))}
        </div>
      </CollapsiblePanel>
    </div>
  );
}
