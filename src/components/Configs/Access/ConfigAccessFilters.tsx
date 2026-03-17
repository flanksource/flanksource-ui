import {
  getConfigAccessSummaryCatalogFilter,
  getConfigAccessSummaryRolesFilter,
  getConfigAccessSummaryUsersFilter
} from "@flanksource-ui/api/services/configAccess";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { paramsToReset } from "./utils";

type ConfigAccessFilterKey = "config_id" | "user" | "role";

const filterCacheOptions = {
  staleTime: 10 * 60 * 1000,
  gcTime: 60 * 60 * 1000,
  refetchOnWindowFocus: false
} as const;

function useConfigAccessFacetScope(excludeFilter: ConfigAccessFilterKey) {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const configType = searchParams.get("configType") ?? undefined;

    const filterKeys: ConfigAccessFilterKey[] = ["config_id", "user", "role"];

    const arbitraryFilter = Object.fromEntries(
      filterKeys
        .filter((key) => key !== excludeFilter)
        .map((key) => [key, searchParams.get(key)])
        .filter(([, value]) => !!value)
    );

    return {
      configType,
      arbitraryFilter
    };
  }, [excludeFilter, searchParams]);
}

function CatalogDropdown() {
  const [field] = useField({ name: "config_id" });
  const scope = useConfigAccessFacetScope("config_id");

  const { data, isLoading } = useQuery({
    queryKey: ["config", "access-summary", "filter", "catalog", scope],
    queryFn: () => getConfigAccessSummaryCatalogFilter(scope),
    ...filterCacheOptions,
    select: useCallback(
      (
        items: Awaited<ReturnType<typeof getConfigAccessSummaryCatalogFilter>>
      ) =>
        items.map(
          (item) =>
            ({
              id: item.config_id,
              label: item.config_name,
              value: item.config_id
            }) satisfies TriStateOptions
        ),
      []
    )
  });

  return (
    <TristateReactSelect
      options={data ?? []}
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

function UserDropdown() {
  const [field] = useField({ name: "user" });
  const scope = useConfigAccessFacetScope("user");

  const { data, isLoading } = useQuery({
    queryKey: ["config", "access-summary", "filter", "user", scope],
    queryFn: () => getConfigAccessSummaryUsersFilter(scope),
    ...filterCacheOptions,
    select: useCallback(
      (items: Awaited<ReturnType<typeof getConfigAccessSummaryUsersFilter>>) =>
        items.map(
          (item) =>
            ({
              id: item.email ?? item.user,
              label: item.user,
              value: item.user
            }) satisfies TriStateOptions
        ),
      []
    )
  });

  return (
    <TristateReactSelect
      options={data ?? []}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="16rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: "user", value } });
        } else {
          field.onChange({ target: { name: "user", value: undefined } });
        }
      }}
      label="User"
    />
  );
}

function RoleDropdown() {
  const [field] = useField({ name: "role" });
  const scope = useConfigAccessFacetScope("role");

  const { data, isLoading } = useQuery({
    queryKey: ["config", "access-summary", "filter", "role", scope],
    queryFn: () => getConfigAccessSummaryRolesFilter(scope),
    ...filterCacheOptions,
    select: useCallback(
      (items: Awaited<ReturnType<typeof getConfigAccessSummaryRolesFilter>>) =>
        items.map(
          (item) =>
            ({
              id: item.role,
              label: item.role,
              value: item.role
            }) satisfies TriStateOptions
        ),
      []
    )
  });

  return (
    <TristateReactSelect
      options={data ?? []}
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

export function ConfigAccessFilters() {
  return (
    <FormikFilterForm
      paramsToReset={paramsToReset}
      filterFields={["config_id", "user", "role"]}
    >
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <CatalogDropdown />
        <UserDropdown />
        <RoleDropdown />
      </div>
    </FormikFilterForm>
  );
}
