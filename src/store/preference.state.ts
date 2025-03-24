import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const datetimePreferenceAtom = atomWithStorage<
  "short" | "medium" | "full" | "timestamp"
>("datetime_preference", "timestamp", undefined, {
  getOnInit: true
});

export const displayTimezonePreferenceAtom = atomWithStorage<string>(
  "display_timezone_preference",
  "Browser",
  undefined,
  {
    getOnInit: true
  }
);

export const cardPreferenceAtom = atomWithStorage<string>(
  "topology_card_width",
  "554px",
  undefined,
  {
    getOnInit: true
  }
);

export const showDeletedItemsPreferenceAtom = atomWithStorage<"yes" | "no">(
  "show_deleted_items_preference",
  "no",
  undefined,
  {
    getOnInit: true
  }
);

export function useShowDeletedConfigs() {
  const [showDeletedItems] = useAtom(showDeletedItemsPreferenceAtom);
  return showDeletedItems === "yes";
}
