import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import AddPermissionButton from "@flanksource-ui/components/Permissions/ManagePermissions/Forms/AddPermissionButton";
import PermissionsView from "@flanksource-ui/components/Permissions/PermissionsView";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export function PermissionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const refetchFunctionRef = useRef<(() => void) | null>(null);

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
          <div className="flex h-full flex-col overflow-y-auto py-6">
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Permissions define what actions users can
                perform. For controlling what resources users can see, use{" "}
                <Link
                  to="/settings/access-scopes"
                  className="font-medium underline"
                >
                  Access Scopes
                </Link>
                .
              </p>
            </div>
            <PermissionsView
              permissionRequest={{}}
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
