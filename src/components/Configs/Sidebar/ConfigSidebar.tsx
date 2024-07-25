import { Button } from "@flanksource-ui/ui/Buttons/Button";
import FloatableSlidingSideBar from "@flanksource-ui/ui/SlidingSideBar/FloatableSlidingSideBar";
import { useState } from "react";
import { MdMenu } from "react-icons/md";
import { useParams } from "react-router-dom";
import ConfigActionBar from "./ConfigActionBar";
import { ConfigDetails } from "./ConfigDetails";

export default function ConfigSidebar() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!id) {
    return null;
  }

  return (
    <>
      <div className="fixed right-2 top-20 flex flex-col lg:hidden">
        <Button
          title="Show Sidebar"
          className="btn-text"
          icon={<MdMenu />}
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        />
      </div>
      <FloatableSlidingSideBar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={setIsSidebarOpen}
      >
        <ConfigActionBar configId={id!} />
        <ConfigDetails configId={id} />
      </FloatableSlidingSideBar>
    </>
  );
}
