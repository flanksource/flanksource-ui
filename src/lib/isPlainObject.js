export function isPlainObject(obj) {
  // See for design: https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript/
  // See also: https://github.com/lodash/lodash/blob/master/isPlainObject.js
  if (
    obj == null ||
    typeof obj !== "object" ||
    Array.isArray(obj) !== false ||
    Object.prototype.toString.call(obj) !== "[object Object]"
  ) {
    return false;
  }

  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
