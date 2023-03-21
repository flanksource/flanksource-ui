import { useSearchParams } from "react-router-dom";
import Popover from "../Popover/Popover";
import { Toggle } from "../Toggle";

export function ConfigListToggledDeletedItems() {
  const [searchParams, setSearchParams] = useSearchParams({
    hideDeleted: "no"
  });

  return (
    <Popover className="flex items-center" title="Preferences">
      <div className="flex items-center p-4">
        <Toggle
          onChange={(value) => {
            if (value) {
              searchParams.set("hideDeleted", "yes");
            } else {
              searchParams.delete("hideDeleted");
            }
            // don't add a new history entry
            setSearchParams(searchParams, { replace: true });
          }}
          label="Hide Deleted Configs"
          value={searchParams.get("hideDeleted") === "yes"}
        />
      </div>
    </Popover>
  );
}
