export function isPlainObject(obj) {
  // See for design: https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript/
  return (
    typeof obj === "object" &&
    obj != null &&
    Array.isArray(obj) === false &&
    Object.prototype.toString.call(obj) === "[object Object]"
  );
}
