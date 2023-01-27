import { isPlainObject } from "../../lib/isPlainObject";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback } from "react";

const cleaner = (key: string, value: string) =>
  // See re prototype pollution: https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution
  key === "__proto__" || key === "constructor" ? undefined : value;

export function encodeObjectToUrlSearchParams(object: Record<string, any>) {
  const encoded = Object.entries(object).map(([k, v]) => {
    if (Array.isArray(v) || isPlainObject(v)) {
      return [k, encodeURIComponent(JSON.stringify(v))];
    }
    return [k, v];
  });
  return new URLSearchParams(encoded).toString();
}

export function encodeObjectToUrlSearchParamsObject(
  object: Record<string, any>
) {
  const encoded = Object.entries(object).map(([k, v]) => {
    if (Array.isArray(v) || isPlainObject(v)) {
      return [k, encodeURIComponent(JSON.stringify(v))];
    }
    return [k, v];
  });
  return new URLSearchParams(encoded);
}

export function decodeUrlSearchParams(url: string) {
  const params = new URLSearchParams(decodeURIComponent(url));
  const decoded: Record<string, any> = Object.create({});
  for (const [k, v] of params.entries()) {
    try {
      decoded[k] = JSON.parse(v, cleaner);
    } catch {
      decoded[k] = v;
    }
  }
  return decoded;
}

export const useUpdateParams = () => {
  const navigate = useNavigate();
  const [_, setSearchParams] = useSearchParams();

  return useCallback(
    (params: Record<string, any>) => {
      const decoded = decodeUrlSearchParams(window.location.search);
      const encoded = encodeObjectToUrlSearchParamsObject({
        ...decoded,
        ...params
      });
      setSearchParams(encoded);
    },
    [navigate]
  );
};
