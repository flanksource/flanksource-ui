import { useParams } from "react-router-dom";
import ConfigChanges from "../ConfigChanges";
import ConfigCosts from "../ConfigCosts";
import ConfigInsights from "../ConfigInsights";
import Configs from "../Sidebars/configs";
import Incidents from "../Sidebars/incidents";
import SlidingSideBar from "../SlidingSideBar";
import { ConfigDetails } from "./ConfigDetails";
import ConfigActionBar from "./ConfigActionBar";

export default function ConfigSidebar() {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <SlidingSideBar hideToggle>
      <ConfigActionBar configId={id} />
      <ConfigDetails configId={id} />
      <Incidents configId={id} />
      <ConfigInsights configID={id} />
      <ConfigCosts configID={id} />
      <ConfigChanges configID={id} />
      <Configs configId={id} />
    </SlidingSideBar>
  );
}
