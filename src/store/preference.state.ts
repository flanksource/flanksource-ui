import { atomWithStorage } from "jotai/utils";

export enum DateTimePreferenceOptions {
  Short = "short", // 1h
  Medium = "medium", // '10:30', Mon 10:30, Jan 1 10:30, Jan 2 2025 10:30
  Full = "long", // Jan 1 10:30:01.999
  Timestamp = "timestamp" // 2025-01-01 10:30:01.999
}

export const datetimePreferenceAtom =
  atomWithStorage<DateTimePreferenceOptions>(
    "datetime_preference",
    DateTimePreferenceOptions.Timestamp,
    undefined,
    {
      getOnInit: true
    }
  );

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
