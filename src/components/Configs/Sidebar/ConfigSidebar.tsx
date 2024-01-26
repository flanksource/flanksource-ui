import { useParams } from "react-router-dom";
import SlidingSideBar from "../../SlidingSideBar";
import { ConfigDetails } from "./ConfigDetails";

export default function ConfigSidebar() {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <SlidingSideBar>
      <ConfigDetails configId={id} />
    </SlidingSideBar>
  );
}
