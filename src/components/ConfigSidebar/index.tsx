import { useParams } from "react-router-dom";
import ConfigChanges from "../ConfigChanges";
import ConfigCosts from "../ConfigCosts";
import ConfigInsights from "../ConfigInsights";
import Configs from "../Sidebars/configs";
import Incidents from "../Sidebars/incidents";
import { ConfigDetails } from "./ConfigDetails";

export default function ConfigSidebar() {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <div
      className={`flex flex-col bg-white border-l transform origin-right duration-500 border-gray-200 w-full py-6 px-4  ${"w-[35rem]"}`}
    >
      <div className={`flex flex-col overflow-y-auto space-y-8 sticky top-0`}>
        <ConfigDetails configId={id} />
        <Incidents configId={id} />
        <ConfigInsights configID={id} />
        <ConfigCosts configID={id} />
        <ConfigChanges configID={id} />
        <Configs configId={id} />
      </div>
    </div>
  );
}
