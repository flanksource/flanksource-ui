import { useState } from "react";
import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import ScopesTable from "@flanksource-ui/components/Scopes/ScopesTable";
import ScopeForm from "@flanksource-ui/components/Scopes/Forms/ScopeForm";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import AddScopeButton from "@flanksource-ui/components/Scopes/Forms/AddScopeButton";

export default function ScopesPage() {
  const { data: scopes, isLoading, isError, error, refetch } = useScopesQuery();
  const [selectedScope, setSelectedScope] = useState<
    ScopeDisplay | undefined
  >();

  return (
    <>
      <PermissionsTabsLinks
        activeTab="Scopes"
        loading={isLoading}
        onRefresh={() => refetch()}
        headerAction={
          // Scopes are written through /api/rbac, which requires update on rbac
          <AuthorizationAccessCheck
            key={"add-button"}
            resource={tables.rbac}
            action="write"
          >
            <AddScopeButton />
          </AuthorizationAccessCheck>
        }
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <div className="flex h-full flex-col overflow-y-auto py-6">
            {isError ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <p className="mb-2 font-medium text-red-600">
                    Error loading scopes
                  </p>
                  <p className="text-sm text-gray-600">
                    {error instanceof Error
                      ? error.message
                      : "An error occurred"}
                  </p>
                </div>
              </div>
            ) : (
              <ScopesTable
                data={scopes || []}
                isLoading={isLoading}
                handleRowClick={(row) => setSelectedScope(row)}
              />
            )}
          </div>
        </div>
      </PermissionsTabsLinks>

      {selectedScope && (
        <ScopeForm
          isOpen={!!selectedScope}
          onClose={() => {
            setSelectedScope(undefined);
            refetch();
          }}
          data={selectedScope}
        />
      )}
    </>
  );
}
