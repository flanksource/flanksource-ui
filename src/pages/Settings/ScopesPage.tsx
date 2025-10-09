import { useState } from "react";
import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import ScopesTable from "@flanksource-ui/components/Scopes/ScopesTable";
import ScopeForm from "@flanksource-ui/components/Scopes/Forms/ScopeForm";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { Head } from "@flanksource-ui/ui/Head";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import AddScopeButton from "@flanksource-ui/components/Scopes/Forms/AddScopeButton";

export default function ScopesPage() {
  const { data: scopes, isLoading, isError, error, refetch } = useScopesQuery();
  const [selectedScope, setSelectedScope] = useState<
    ScopeDisplay | undefined
  >();

  return (
    <>
      <Head prefix="Scopes" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/settings/scopes" key="scopes-root-item">
                Scopes
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                key={"add-button"}
                resource={tables.scopes}
                action="write"
              >
                <AddScopeButton />
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
      </SearchLayout>

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
