import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import Popover from "@flanksource-ui/ui/Popover/Popover";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const areDeletedConfigChangesHidden = atomWithStorage<"yes" | "no">(
  "areDeletedConfigChangesHidden",
  "yes",
  undefined,
  {
    getOnInit: true
  }
);

export function useHideDeletedConfigChanges() {
  const [hideDeletedConfigChanges] = useAtom(areDeletedConfigChangesHidden);
  return hideDeletedConfigChanges === "yes" ? true : false;
}

export function ConfigChangesToggledDeletedItems() {
  const [hideDeletedConfigChanges, setHideDeletedConfigsChanges] = useAtom(
    areDeletedConfigChangesHidden
  );

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Popover
        className="flex flex-col items-center"
        title="Preferences"
        menuClass=""
      >
        <div className="flex items-center p-4">
          <Toggle
            onChange={(value) => {
              if (value) {
                setHideDeletedConfigsChanges("yes");
              } else {
                setHideDeletedConfigsChanges("no");
              }
            }}
            label="Hide Deleted Config Changes"
            value={hideDeletedConfigChanges === "yes"}
          />
        </div>
      </Popover>
    </div>
  );
}
