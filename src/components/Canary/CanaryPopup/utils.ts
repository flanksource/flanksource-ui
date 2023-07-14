import { merge } from "lodash";

export function getUptimePercentage(check?: {
  uptime: { passed: number; failed: number };
}) {
  const uptime = check?.uptime;
  const passed = uptime?.passed ?? 0;
  const failed = uptime?.failed ?? 0;
  const valid = !Number.isNaN(passed) && !Number.isNaN(failed);
  return valid ? (passed / (passed + failed)) * 100 : null;
}

export const setDeepWithString = (
  dotNotationKeyString: string,
  newValue: string,
  obj: Record<string, any>
) => {
  const keys = dotNotationKeyString.split(".");
  let toMerge: Record<string, any> | null = null;
  keys.reverse().forEach((key) => {
    if (!toMerge) {
      toMerge = {};
      toMerge[key] = newValue;
    } else {
      const temp: Record<string, any> = {};
      temp[key] = toMerge;
      toMerge = temp;
    }
  });
  const newObj = { ...obj };
  merge(newObj, toMerge);
  return newObj;
};
