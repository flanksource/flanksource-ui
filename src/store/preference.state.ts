import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useSearchParams } from "react-router-dom";

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

export function useShowDeletedConfigs() {
  const [searchParams] = useSearchParams();
  return searchParams.get("showDeletedConfigs") === "true";
}
