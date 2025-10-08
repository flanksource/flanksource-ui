import { useState } from "react";
import { useAccessScopesQuery } from "@flanksource-ui/api/query-hooks/useAccessScopesQuery";
import AccessScopesTable from "@flanksource-ui/components/AccessScopes/AccessScopesTable";
import AccessScopeForm from "@flanksource-ui/components/AccessScopes/Forms/AccessScopeForm";
import { AccessScopeDisplay } from "@flanksource-ui/api/types/accessScopes";
import { Head } from "@flanksource-ui/ui/Head";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import AddAccessScopeButton from "@flanksource-ui/components/AccessScopes/Forms/AddAccessScopeButton";

export default function AccessScopesPage() {
  const {
    data: accessScopes,
    isLoading,
    isError,
    error,
    refetch
  } = useAccessScopesQuery();
  const [selectedAccessScope, setSelectedAccessScope] = useState<
    AccessScopeDisplay | undefined
  >();

  return (
    <>
      <Head prefix="Access Scopes" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot
                link="/settings/access-scopes"
                key="access-scopes-root-item"
              >
                Access Scopes
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                key={"add-button"}
                resource={tables.access_scopes}
                action="write"
              >
                <AddAccessScopeButton />
              </AuthorizationAccessCheck>
            ]}
          />
        }
        onRefresh={() => refetch()}
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <div className="flex h-full flex-col overflow-y-auto py-6">
            {isError ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <p className="mb-2 font-medium text-red-600">
                    Error loading access scopes
                  </p>
                  <p className="text-sm text-gray-600">
                    {error instanceof Error
                      ? error.message
                      : "An error occurred"}
                  </p>
                </div>
              </div>
            ) : (
              <AccessScopesTable
                data={accessScopes || []}
                isLoading={isLoading}
                handleRowClick={(row) => setSelectedAccessScope(row)}
              />
            )}
          </div>
        </div>
      </SearchLayout>

      {selectedAccessScope && (
        <AccessScopeForm
          isOpen={!!selectedAccessScope}
          onClose={() => {
            setSelectedAccessScope(undefined);
            refetch();
          }}
          data={selectedAccessScope}
        />
      )}
    </>
  );
}
