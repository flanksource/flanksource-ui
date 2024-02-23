import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import Popover from "../../../ui/Popover/Popover";
import { Toggle } from "../../Toggle";

export const areDeletedConfigsHidden = atomWithStorage<"yes" | "no">(
  "areDeletedConfigsHidden",
  "yes"
);

export function ConfigListToggledDeletedItems() {
  const [hideDeletedConfigs, setHideDeletedConfigs] = useAtom(
    areDeletedConfigsHidden
  );

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Popover className="flex flex-col items-center" title="Preferences">
        <div className="flex items-center p-4 w-80">
          <Toggle
            onChange={(value) => {
              if (value) {
                setHideDeletedConfigs("yes");
              } else {
                setHideDeletedConfigs("no");
              }
            }}
            label="Hide Deleted Catalog"
            value={hideDeletedConfigs === "yes"}
          />
        </div>
      </Popover>
    </div>
  );
}
