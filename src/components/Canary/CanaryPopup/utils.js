import { merge } from "lodash";

export function getUptimePercentage(check) {
  const uptime = check?.uptime;
  const passed = uptime?.passed;
  const failed = uptime?.failed;
  const valid = !Number.isNaN(passed) && !Number.isNaN(failed);
  return valid ? (passed / (passed + failed)) * 100 : null;
}

export const setDeepWithString = (dotNotationKeyString, newValue, obj) => {
  const keys = dotNotationKeyString.split(".");
  let toMerge = null;
  keys.reverse().forEach((key) => {
    if (!toMerge) {
      toMerge = {};
      toMerge[key] = newValue;
    } else {
      const temp = {};
      temp[key] = toMerge;
      toMerge = temp;
    }
  });
  const newObj = { ...obj };
  merge(newObj, toMerge);
  return newObj;
};
