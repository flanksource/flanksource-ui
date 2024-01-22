import Popover from "../../Popover/Popover";
import { Toggle } from "../../Toggle";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const areDeletedConfigsHidden = atomWithStorage<"yes" | "no">(
  "areDeletedConfigsHidden",
  "yes"
);

export function ConfigListToggledDeletedItems() {
  const [hideDeletedConfigs, setHideDeletedConfigs] = useAtom(
    areDeletedConfigsHidden
  );

  return (
    <Popover className="flex items-center" title="Preferences">
      <div className="flex items-center p-4">
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
  );
}
