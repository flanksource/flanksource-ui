import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import AddPermissionButton from "@flanksource-ui/components/Permissions/ManagePermissions/Forms/AddPermissionButton";
import PermissionsView, {
  permissionsActionsList
} from "@flanksource-ui/components/Permissions/PermissionsView";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useMemo, useRef, useState } from "react";
import { parseTristateKeyState } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useSearchParams } from "react-router-dom";
import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";

export function PermissionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const refetchFunctionRef = useRef<(() => void) | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const rawActionFilter = searchParams.get("action") ?? "all";

  const actionFilter = useMemo(() => {
    if (!rawActionFilter || rawActionFilter === "all") {
      return "all";
    }

    if (!rawActionFilter.includes(":")) {
      return rawActionFilter;
    }

    const parts = rawActionFilter.split(",");
    const parsed = parts
      .map((item) => parseTristateKeyState(item))
      .filter((v): v is { key: string; state: number } => Boolean(v));

    const includes = parsed.filter((p) => p.state === 1);
    const excludes = parsed.filter((p) => p.state === -1);

    if (includes.length === 1 && excludes.length === 0) {
      return includes[0].key.replaceAll("____", ":").replaceAll("||||", ",");
    }

    return "all";
  }, [rawActionFilter]);

  const actionOptions = useMemo(
    () => [
      { id: "all", value: "all", description: "All", label: "All" },
      ...permissionsActionsList.map((item) => {
        const label = String(item.label ?? item.value);
        return {
          id: item.value,
          value: item.value,
          description: label,
          label
        };
      })
    ],
    []
  );

  return (
    <>
      <Head prefix="Permissions" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot
                link="/settings/permissions"
                key="permissions-root-item"
              >
                Permissions
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                key={"add-button"}
                resource={tables.permissions}
                action="write"
              >
                <AddPermissionButton />
              </AuthorizationAccessCheck>
            ]}
          />
        }
        onRefresh={() => refetchFunctionRef.current?.()}
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <div className="flex flex-row flex-wrap items-center justify-between gap-2 py-4">
            <ReactSelectDropdown
              name="permissions-action-filter"
              items={actionOptions}
              value={actionFilter}
              onChange={(value) => {
                const nextParams = new URLSearchParams(searchParams);
                if (!value || value === "all") {
                  nextParams.delete("action");
                } else {
                  nextParams.set("action", value);
                }
                setSearchParams(nextParams);
              }}
              className="min-w-[180px]"
              dropDownClassNames="w-[260px] left-0"
              hideControlBorder
              prefix={<span className="text-xs text-gray-500">Action:</span>}
            />
          </div>
          <div className="flex h-full flex-col overflow-y-auto p-2">
            <PermissionsView
              permissionRequest={{
                ...(rawActionFilter !== "all"
                  ? { action: rawActionFilter }
                  : {})
              }}
              setIsLoading={setIsLoading}
              onRefetch={(refetch) => {
                refetchFunctionRef.current = refetch;
              }}
            />
          </div>
        </div>
      </SearchLayout>
    </>
  );
}
