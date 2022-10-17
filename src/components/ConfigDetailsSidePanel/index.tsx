import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import ConfigChanges from "../ConfigChanges";
import ConfigInsights from "../ConfigInsights";
import ConfigRelated from "../ConfigRelated";
import ConfigComponents from "../ConfigComponents";
import ConfigIncidents from "../ConfigIncidents";

export default function ConfigDetailsSidePanel() {
  const [isPanelHidden, setIsPanelHidden] = useState<boolean>(false);
  const { id } = useParams();

  return (
    <div
      className={`flex flex-col bg-white border-l transform origin-right duration-500 border-gray-200 w-full py-2 px-4 min-h-full h-auto sticky top-0 ${
        isPanelHidden ? "w-3" : "w-[35rem]"
      }`}
    >
      <div
        className={`flex flex-col flex-1 space-y-6  sticky top-0 ${
          isPanelHidden && "hidden"
        }`}
      >
        <ConfigInsights configID={id!} />
        <ConfigChanges configID={id!} />
        <ConfigRelated configID={id!} />
        <ConfigComponents configID={id!} />
        <ConfigIncidents configID={id!} />
      </div>

      <button
        type="button"
        aria-label={isPanelHidden ? "Open Side Panel" : "Close Side Panel"}
        title={isPanelHidden ? "Open Side Panel" : "Close Side Panel"}
        className="absolute bg-white -left-5 top-6 border border-gray-300 rounded-full transform duration-500 m-2 p-1 hover:bg-gray-200 rotate-180"
        onClick={() => setIsPanelHidden(!isPanelHidden)}
      >
        {isPanelHidden ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
      </button>
    </div>
  );
}
