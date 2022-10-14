import { FaExclamationTriangle } from "react-icons/fa";
import { ImStatsDots } from "react-icons/im";
import { NodePodPropToLabelMap } from "../../constants";
import { Topology } from "../../context/TopologyPageContext";
import CollapsiblePanel from "../CollapsiblePanel";
import { Icon } from "../Icon";
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
            {headline?.map((property) => (
              <div className="flex flex-col w-1/4 space-y-2 items-center justify-center">
                <div className="flex flex-row space-x-2 items-center justify-center font-semibold text-gray-400">
                  <Icon
                    name={property.icon}
                    size="xxl"
                    secondary={property.name}
                  />
                  <span>{property.name}</span>
                </div>
                <div
                  className={`font-semibold ${
                    property.color ? `text-${property.color}-500` : "text-black"
                  } `}
                >
                  <FormatProperty property={property} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <CollapsiblePanel
        Header={<h3 className="text-xl font-semibold">Details</h3>}
      >
        <div className="flex flex-col px-4">
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
                  No details found for this topology
                </label>
              </div>
            </div>
          )}
        </div>
      </CollapsiblePanel>
    </div>
  );
}
