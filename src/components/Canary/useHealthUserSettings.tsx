import { HEALTH_SETTINGS } from "@flanksource-ui/constants";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const healthSettingsAtom = atomWithStorage<
  Record<string, string | undefined>
>(
  HEALTH_SETTINGS,
  {
    hidePassing: "true",
    tabBy: "namespace",
    groupBy: "canary_name"
  },
  undefined,
  {
    getOnInit: true
  }
);

export function useHealthUserSettings() {
  const [settings] = useAtom(healthSettingsAtom);
  return settings;
}
