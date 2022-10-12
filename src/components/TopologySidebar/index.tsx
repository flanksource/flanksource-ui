import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { Topology } from "../../context/TopologyPageContext";
import TopologyDetails from "../TopologyDetails";
import TopologySidebarIncidents from "../TopologySidebarIncidents";

type Props = {
  topology?: Pick<Topology, "properties">;
};

export default function TopologySidebar({ topology }: Props) {
  const [isPanelHidden, setIsPanelHidden] = useState<boolean>(false);
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <div
      className={`flex flex-col bg-white border-l transform origin-right duration-500 border-gray-200 w-full py-2 px-4  sticky top-0 ${
        isPanelHidden ? "w-3" : "w-[35rem]"
      }`}
    >
      <div
        className={`flex flex-col flex-1 py-4 overflow-y-auto divide-y divide-gray-200 divide-dashed space-y-12 ${
          isPanelHidden && "hidden"
        }`}
      >
        <TopologyDetails topology={topology} />
        <TopologySidebarIncidents topologyID={id} />
      </div>

      <button
        type="button"
        aria-label={isPanelHidden ? "Open Side Panel" : "Close Side Panel"}
        title={isPanelHidden ? "Open Side Panel" : "Close Side Panel"}
        className="absolute text-xl bg-white -left-6 top-6 border border-gray-300 rounded-full transform duration-500 m-2 p-1 hover:bg-gray-200 rotate-180"
        onClick={() => setIsPanelHidden(!isPanelHidden)}
      >
        {isPanelHidden ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
      </button>
    </div>
  );
}
