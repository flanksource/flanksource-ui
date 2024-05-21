import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Toggle } from "../../../ui/FormControls/Toggle";
import Popover from "../../../ui/Popover/Popover";

export const areDeletedConfigsHidden = atomWithStorage<"yes" | "no">(
  "areDeletedConfigsHidden",
  "yes",
  undefined,
  {
    getOnInit: true
  }
);

export function useHideDeletedConfigs() {
  const [hideDeletedConfigs] = useAtom(areDeletedConfigsHidden);
  return hideDeletedConfigs === "yes" ? true : false;
}

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
