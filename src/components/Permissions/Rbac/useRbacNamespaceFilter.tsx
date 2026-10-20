import { RBAC_SHIPPED_NAMESPACE } from "@flanksource-ui/api/types/rbacResources";
import TristateReactSelect, {
  parseTristateKeyState
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Objects shipped with Mission Control are hidden by default
const defaultNamespaceFilter = `${RBAC_SHIPPED_NAMESPACE}:-1`;

/**
 * Filters RBAC objects by namespace, using the include/exclude `namespace`
 * search param. Without the param, the built-in namespace is excluded; an
 * empty param shows every namespace.
 */
export function useRbacNamespaceFilter<T extends { namespace?: string | null }>(
  items: T[] | undefined
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get("namespace") ?? defaultNamespaceFilter;

  const filteredItems = useMemo(() => {
    const parsed = value
      .split(",")
      .map(parseTristateKeyState)
      .filter((v): v is { key: string; state: number } => Boolean(v));
    const includes = parsed.filter((p) => p.state === 1).map((p) => p.key);
    const excludes = parsed.filter((p) => p.state === -1).map((p) => p.key);
    return (items ?? []).filter((item) => {
      const namespace = item.namespace ?? "";
      if (includes.length > 0 && !includes.includes(namespace)) {
        return false;
      }
      return !excludes.includes(namespace);
    });
  }, [items, value]);

  const options = useMemo(() => {
    const namespaces = new Set([RBAC_SHIPPED_NAMESPACE]);
    (items ?? []).forEach(({ namespace }) => {
      if (namespace) {
        namespaces.add(namespace);
      }
    });
    return Array.from(namespaces)
      .sort()
      .map((namespace) => ({
        id: namespace,
        label: namespace,
        value: namespace
      }));
  }, [items]);

  const onChange = useCallback(
    (newValue?: string) => {
      // The dropdown reports its value on mount too, so skip unchanged values
      // to avoid adding the default filter to the URL
      if ((newValue ?? "") === value) {
        return;
      }
      setSearchParams((params) => {
        // Keep an empty param, so clearing the filter doesn't restore the default
        params.set("namespace", newValue ?? "");
        return params;
      });
    },
    [setSearchParams, value]
  );

  const namespaceFilter = (
    <TristateReactSelect
      label="Namespace"
      options={options}
      value={value || undefined}
      onChange={onChange}
    />
  );

  return { filteredItems, namespaceFilter };
}
