import hash from "object-hash";

/**
 * Generates a unique URL parameter prefix for a view based on its namespace and name.
 * Uses MD5-like hashing via object-hash to create a consistent, compact prefix.
 *
 * @param namespace - The view namespace
 * @param name - The view name
 * @returns A unique prefix string, e.g., "viewvar_a1b2c3d4"
 */
export const getViewPrefix = (
  namespace: string | undefined,
  name: string
): string => {
  const key = `${namespace || "default"}_${name}`;
  const hashValue = hash(key, { algorithm: "md5" }).substring(0, 8);
  return `viewvar_${hashValue}`;
};
