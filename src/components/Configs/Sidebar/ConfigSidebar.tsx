import { useParams } from "react-router-dom";
import SlidingSideBar from "../../SlidingSideBar";
import ConfigActionBar from "./ConfigActionBar";
import { ConfigDetails } from "./ConfigDetails";

export default function ConfigSidebar() {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <SlidingSideBar>
      <ConfigActionBar configId={id!} />
      <ConfigDetails configId={id} />
    </SlidingSideBar>
  );
}
