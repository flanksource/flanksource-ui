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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function PermissionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const client = useQueryClient();

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
        onRefresh={() =>
          client.refetchQueries({
            queryKey: ["permissions"]
          })
        }
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <div className="flex h-full flex-col overflow-y-auto py-6">
            <PermissionsView
              permissionRequest={{}}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </SearchLayout>
    </>
  );
}
