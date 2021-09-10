import { isPlainObject } from "../../lib/isPlainObject";

const cleaner = (key, value) =>
  // See re prototype pollution: https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution
  key === "__proto__" || key === "constructor" ? undefined : value;

export function encodeObjectToUrlSearchParams(object) {
  const encoded = Object.entries(object).map(([k, v]) => {
    if (Array.isArray(v) || isPlainObject(v)) {
      return [k, encodeURIComponent(JSON.stringify(v))];
    }
    return [k, v];
  });
  return new URLSearchParams(encoded).toString();
}

export function decodeUrlSearchParams(url) {
  const params = new URLSearchParams(decodeURIComponent(url));
  const decoded = Object.create(null);
  for (const [k, v] of params.entries()) {
    try {
      decoded[k] = JSON.parse(v, cleaner);
    } catch {
      decoded[k] = v;
    }
  }
  return decoded;
}
