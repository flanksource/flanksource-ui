import {
  ConfigAccessFilterOptions,
  ConfigAccessFilterOptionsParams,
  getConfigAccessFilterOptions
} from "@flanksource-ui/api/services/configAccess";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { useMemo } from "react";
import { useCatalogAccessUrlState } from "@flanksource-ui/hooks/useCatalogAccessUrlState";
import {
  decodeTristateKey,
  parseTristateKeyState
} from "@flanksource-ui/lib/tristate";
import { paramsToReset } from "./utils";

const filterCacheOptions = {
  staleTime: 10 * 60 * 1000,
  cacheTime: 60 * 60 * 1000,
  refetchOnWindowFocus: false
} as const;

/**
 * Extracts the plain value from a tristate-encoded URL param (e.g. "someValue:1")
 * Only returns the value for "include" state (1).
 */
function extractIncludeValue(
  tristateParam: string | undefined
): string | undefined {
  if (!tristateParam) return undefined;
  const parsed = parseTristateKeyState(tristateParam);
  if (!parsed || parsed.state !== 1) return undefined;
  return decodeTristateKey(parsed.key);
}

/**
 * Shared hook that fetches all filter options via a single RPC call.
 * The RPC handles faceted exclusion server-side: each facet is computed
 * without its own filter so that selecting a value in one dropdown
 * does not remove it from its own option list.
 */
function useConfigAccessFilterOptions() {
  const { configType, filters } = useCatalogAccessUrlState();

  const params = useMemo<ConfigAccessFilterOptionsParams>(() => {
    const result: ConfigAccessFilterOptionsParams = {};
    if (configType) result.configType = configType;
    const configId = extractIncludeValue(filters.config_id);
    if (configId) result.configId = configId;
    const userId = extractIncludeValue(filters.external_user_id);
    if (userId) result.userId = userId;
    const role = extractIncludeValue(filters.role);
    if (role) result.role = role;
    const userType = extractIncludeValue(filters.user_type);
    if (userType) result.userType = userType;
    return result;
  }, [configType, filters]);

  return useQuery({
    queryKey: ["config", "access-summary", "filter-options", params],
    queryFn: () => getConfigAccessFilterOptions(params),
    ...filterCacheOptions
  });
}

function useCatalogOptions(data: ConfigAccessFilterOptions | undefined) {
  return useMemo<TriStateOptions[]>(
    () =>
      (data?.catalogs ?? []).map((item) => ({
        id: item.config_id,
        label: item.config_name,
        value: item.config_id
      })),
    [data?.catalogs]
  );
}

function useUserOptions(data: ConfigAccessFilterOptions | undefined) {
  return useMemo<TriStateOptions[]>(
    () =>
      (data?.users ?? []).map((item) => ({
        id: item.external_user_id,
        label: item.email ? `${item.user} (${item.email})` : item.user,
        value: item.external_user_id
      })),
    [data?.users]
  );
}

function useRoleOptions(data: ConfigAccessFilterOptions | undefined) {
  return useMemo<TriStateOptions[]>(
    () =>
      (data?.roles ?? []).map((item) => ({
        id: item.role,
        label: item.role,
        value: item.role
      })),
    [data?.roles]
  );
}

function useTypeOptions(data: ConfigAccessFilterOptions | undefined) {
  return useMemo<TriStateOptions[]>(
    () =>
      (data?.user_types ?? []).map((item) => ({
        id: item.user_type,
        label: item.user_type,
        value: item.user_type
      })),
    [data?.user_types]
  );
}

function CatalogDropdown({
  data,
  isLoading
}: {
  data: ConfigAccessFilterOptions | undefined;
  isLoading: boolean;
}) {
  const [field] = useField({ name: "config_id" });
  const options = useCatalogOptions(data);

  return (
    <TristateReactSelect
      options={options}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="20rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: "config_id", value } });
        } else {
          field.onChange({ target: { name: "config_id", value: undefined } });
        }
      }}
      label="Catalog"
    />
  );
}

function UserDropdown({
  data,
  isLoading
}: {
  data: ConfigAccessFilterOptions | undefined;
  isLoading: boolean;
}) {
  const [field] = useField({ name: "external_user_id" });
  const options = useUserOptions(data);

  return (
    <TristateReactSelect
      options={options}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="16rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: "external_user_id", value } });
        } else {
          field.onChange({
            target: { name: "external_user_id", value: undefined }
          });
        }
      }}
      label="User"
    />
  );
}

function RoleDropdown({
  data,
  isLoading
}: {
  data: ConfigAccessFilterOptions | undefined;
  isLoading: boolean;
}) {
  const [field] = useField({ name: "role" });
  const options = useRoleOptions(data);

  return (
    <TristateReactSelect
      options={options}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="16rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: "role", value } });
        } else {
          field.onChange({ target: { name: "role", value: undefined } });
        }
      }}
      label="Role"
    />
  );
}

function TypeDropdown({
  data,
  isLoading
}: {
  data: ConfigAccessFilterOptions | undefined;
  isLoading: boolean;
}) {
  const [field] = useField({ name: "user_type" });
  const options = useTypeOptions(data);

  return (
    <TristateReactSelect
      options={options}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="12rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: "user_type", value } });
        } else {
          field.onChange({ target: { name: "user_type", value: undefined } });
        }
      }}
      label="Type"
    />
  );
}

export function ConfigAccessFilters() {
  const { data, isLoading } = useConfigAccessFilterOptions();

  return (
    <FormikFilterForm
      paramsToReset={paramsToReset}
      filterFields={["config_id", "external_user_id", "role", "user_type"]}
    >
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <CatalogDropdown data={data} isLoading={isLoading} />
        <UserDropdown data={data} isLoading={isLoading} />
        <RoleDropdown data={data} isLoading={isLoading} />
        <TypeDropdown data={data} isLoading={isLoading} />
      </div>
    </FormikFilterForm>
  );
}
