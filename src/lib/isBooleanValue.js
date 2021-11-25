export function isBooleanValue(val) {
  // Need to decide here what kinds of values are representations of bools.
  // The loose comparison may be too permissive.
  if (typeof val === "boolean") {
    return true;
  }
  if (val == null || Array.isArray(val) === true) {
    return false;
  }
  const value = typeof val === "string" ? val.toLowerCase() : val;
  // eslint-disable-next-line eqeqeq
  if (value == "true" || value == "false") {
    return true;
  }
  // eslint-disable-next-line eqeqeq
  if (value == 0 || value == 1) {
    return true;
  }
  return false;
}
