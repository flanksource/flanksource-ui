import { Toggle } from "@flanksource-ui/components/Toggle";
import Popover from "@flanksource-ui/ui/Popover/Popover";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const areDeletedConfigChangesHidden = atomWithStorage<"yes" | "no">(
  "areDeletedConfigChangesHidden",
  "yes"
);

export function ConfigChangesToggledDeletedItems() {
  const [hideDeletedConfigChanges, setHideDeletedConfigsChanges] = useAtom(
    areDeletedConfigChangesHidden
  );

  return (
    <div className="flex flex-col items-center justify-center h-full">
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
