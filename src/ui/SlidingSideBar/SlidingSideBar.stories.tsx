import { useCallback, useState } from "react";
import CollapsiblePanel from "../CollapsiblePanel/CollapsiblePanel";
import SlidingSideBar from "./index";

const data = Array.from(Array(100).keys());

export default {
  title: "SlidingSideBar"
};

function Template() {
  const [openedPanel, setOpenedPanel] = useState<"1" | "2" | "3" | undefined>(
    "1"
  );

  const panelCollapsedStatusChange = useCallback(
    (status: boolean, panel: "1" | "2" | "3") => {
      if (status) {
        setOpenedPanel(panel);
      } else {
        setOpenedPanel(undefined);
      }
    },
    []
  );

  return (
    <SlidingSideBar>
      <CollapsiblePanel
        isCollapsed={openedPanel !== "1"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "1")
        }
        dataCount={0}
        Header={<div>First Panel</div>}
      >
        {data.map((item) => {
          return <div key={item}>{item}</div>;
        })}
      </CollapsiblePanel>
      <CollapsiblePanel
        isCollapsed={openedPanel !== "2"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "2")
        }
        dataCount={0}
        Header={<div>Second Panel</div>}
      >
        {data.map((item) => {
          return <div key={item}>{item}</div>;
        })}
      </CollapsiblePanel>
      <CollapsiblePanel
        isCollapsed={openedPanel !== "3"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "3")
        }
        dataCount={0}
        Header={<div>Third Panel</div>}
      >
        {data.map((item) => {
          return <div key={item}>{item}</div>;
        })}
      </CollapsiblePanel>
    </SlidingSideBar>
  );
}

export const EqualAutoHeight = Template.bind({});
