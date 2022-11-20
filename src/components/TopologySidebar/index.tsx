import { useState } from "react";
import { useParams } from "react-router-dom";
import { Topology } from "../../context/TopologyPageContext";
import TopologyConfigChanges from "../TopologyConfigChanges";
import TopologyDetails from "../TopologyDetails";
import TopologyRelatedConfigs from "../TopologyRelatedConfigs";
import TopologySidebarIncidents from "../TopologySidebarIncidents";

type Props = {
  topology?: Pick<Topology, "properties">;
  refererId?: string;
};

export default function TopologySidebar({ topology, refererId }: Props) {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <div
      className={`flex flex-col bg-white border-l transform origin-right duration-500 border-gray-200 w-full py-6 px-4  ${"w-[35rem]"}`}
    >
      <div className={`flex flex-col overflow-y-auto space-y-8 sticky top-0`}>
        <TopologyDetails topology={topology} refererId={refererId} />
        <TopologySidebarIncidents topologyID={id} />
        <TopologyConfigChanges topologyID={id} />
        <TopologyRelatedConfigs topologyID={id} />
      </div>

      {/* <button
        type="button"
        aria-label={isPanelHidden ? "Open Side Panel" : "Close Side Panel"}
        title={isPanelHidden ? "Open Side Panel" : "Close Side Panel"}
        className="absolute  bg-white -right-6 top-6 border border-gray-300 rounded-full transform duration-500  p-1 hover:bg-gray-200 rotate-180"
        onClick={() => setIsPanelHidden(!isPanelHidden)}
      >
        {isPanelHidden ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
      </button> */}
    </div>
  );
}
