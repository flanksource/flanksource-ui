import { FaExclamationTriangle } from "react-icons/fa";
import { ImStatsDots } from "react-icons/im";
import { NodePodPropToLabelMap } from "../../constants";
import { Topology } from "../../context/TopologyPageContext";
import CollapsiblePanel from "../CollapsiblePanel";
import { FormatProperty } from "../TopologyCard/Property";

type Props = {
  topology?: Pick<Topology, "properties">;
};

export default function TopologyDetails({ topology }: Props) {
  const filteredTopologyProperties = topology?.properties?.filter(
    (property) => property.name && property.text
  );

  const headline = filteredTopologyProperties?.filter(
    (property) => property.headline
  );

  console.log(headline);

  return (
    <div className="flex flex-col space-y-4">
      {headline && headline?.length > 0 && (
        <div className="flex flex-col p-4">
          <div className="flex flex-row divide-x divide-solid space-x-4 px-4 py-6 border border-gray-300 rounded-lg">
            {headline?.map(({ icon, name }) => (
              <div className="flex flex-col w-1/4 space-y-4 items-center justify-center">
                <ImStatsDots className="text-blue-500" size={20} />
                <label className="font-semibold text-gray-500">{name}</label>
              </div>
            ))}
          </div>
        </div>
      )}
      <CollapsiblePanel
        Header={<h3 className="text-xl font-semibold">Details</h3>}
      >
        <div className="flex flex-col px-4">
          {filteredTopologyProperties &&
          filteredTopologyProperties?.length > 0 ? (
            <table className="table-auto shadow-none">
              {filteredTopologyProperties.map((property) => (
                <tr>
                  <th className="text-gray-400 font-medium text-left overflow-auto">
                    {/* @ts-ignore */}
                    {NodePodPropToLabelMap[property.name] || property.name}:
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
