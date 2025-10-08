import { useState } from "react";
import { useAccessScopesQuery } from "@flanksource-ui/api/query-hooks/useAccessScopesQuery";
import AccessScopesTable from "@flanksource-ui/components/AccessScopes/AccessScopesTable";
import AccessScopeForm from "@flanksource-ui/components/AccessScopes/Forms/AccessScopeForm";
import { AccessScopeDisplay } from "@flanksource-ui/api/types/accessScopes";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Head } from "@flanksource-ui/ui/Head";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";

export default function AccessScopesPage() {
  const {
    data: accessScopes,
    isLoading,
    isError,
    error
  } = useAccessScopesQuery();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccessScope, setEditingAccessScope] = useState<
    AccessScopeDisplay | undefined
  >();

  const handleEdit = (accessScope: AccessScopeDisplay) => {
    setEditingAccessScope(accessScope);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingAccessScope(undefined);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <Head prefix="Settings - Access Scopes" />
      <div className="flex flex-col px-6 pb-4 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Access Scopes</h1>
            <p className="mt-1 text-sm text-gray-600">
              Define visibility boundaries for users and teams. Access Scopes
              control what resources people can see.
            </p>
          </div>
          <AuthorizationAccessCheck
            resource={tables.access_scopes}
            action="write"
          >
            <Button
              text="Add Access Scope"
              className="btn-primary"
              onClick={() => setIsFormOpen(true)}
            />
          </AuthorizationAccessCheck>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden px-6">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="mb-2 font-medium text-red-600">
                Error loading access scopes
              </p>
              <p className="text-sm text-gray-600">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </div>
          </div>
        ) : !isLoading && (!accessScopes || accessScopes.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="mb-2 font-medium text-gray-600">
                No access scopes found
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Create your first access scope to define visibility boundaries
                for users and teams.
              </p>
              <AuthorizationAccessCheck
                resource={tables.access_scopes}
                action="write"
              >
                <Button
                  text="Add Access Scope"
                  className="btn-primary"
                  onClick={() => setIsFormOpen(true)}
                />
              </AuthorizationAccessCheck>
            </div>
          </div>
        ) : (
          <AccessScopesTable
            data={accessScopes || []}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        )}
      </div>

      <AccessScopeForm
        isOpen={isFormOpen}
        onClose={handleClose}
        data={editingAccessScope}
      />
    </div>
  );
}
