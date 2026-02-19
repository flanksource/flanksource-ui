import {
  createResource,
  deleteResource,
  getAll,
  updateResource
} from "@flanksource-ui/api/schemaResources";
import ConnectionFormModal, {
  Connection
} from "@flanksource-ui/components/Connections/ConnectionFormModal";
import { ConnectionList } from "@flanksource-ui/components/Connections/ConnectionsList";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { SchemaApi } from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";

const connectionsSchemaConnection: SchemaApi = {
  table: "connections",
  api: "canary-checker",
  name: "Connections"
};

export function ConnectionsPage() {
  const user = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const connectionId = searchParams.get("id") ?? undefined;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortState] = useReactTableSortState();

  const {
    isLoading: loading,
    data: connections,
    refetch
  } = useQuery({
    queryKey: ["connections", "all", sortState],
    queryFn: async () => {
      const response = await getAll(connectionsSchemaConnection, sortState);
      return (response.data ?? []) as unknown as Connection[];
    }
  });

  const selectedConnection = useMemo(() => {
    if (!connectionId) {
      return undefined;
    }

    return connections?.find((connection) => connection.id === connectionId);
  }, [connectionId, connections]);

  const isOpen = isCreateModalOpen || !!selectedConnection;

  const clearSelectedConnectionFromURL = () => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete("id");
      return nextParams;
    });
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    clearSelectedConnectionFromURL();
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    clearSelectedConnectionFromURL();
  };

  const openConnectionModal = (connection: Connection) => {
    if (!connection.id) {
      return;
    }

    const connectionID = connection.id;

    setIsCreateModalOpen(false);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set("id", connectionID);
      return nextParams;
    });
  };

  async function onSubmit(data: Connection) {
    if (!selectedConnection?.id || isCreateModalOpen) {
      return createConnection(data);
    }

    return updateConnection({ ...data, id: selectedConnection.id });
  }

  const { isLoading: isCreatingConnection, mutate: createConnection } =
    useMutation({
      mutationFn: async (data: Connection) => {
        const response = await createResource(connectionsSchemaConnection, {
          ...data,
          created_by: user.user?.id
        });
        return response?.data;
      },
      onSuccess: () => {
        refetch();
        closeModal();
        toastSuccess("Connection added successfully");
      },
      onError: (ex) => {
        toastError((ex as Error).message);
      }
    });

  const { isLoading: isUpdatingConnection, mutate: updateConnection } =
    useMutation({
      mutationFn: async (data: Connection) => {
        const response = await updateResource(connectionsSchemaConnection, {
          ...data,
          created_by: user.user?.id
        });
        return response?.data;
      },
      onSuccess: () => {
        refetch();
        closeModal();
        toastSuccess("Connection updated successfully");
      },
      onError: (ex) => {
        toastError((ex as Error).message);
      }
    });

  const { mutate: deleteConnection, isLoading: isDeleting } = useMutation({
    mutationFn: async (data: Connection) => {
      const response = await deleteResource(
        connectionsSchemaConnection,
        data.id!
      );
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      closeModal();
      toastSuccess("Connection deleted successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const isSubmitting = isCreatingConnection || isUpdatingConnection;

  return (
    <>
      <Head prefix="Connections" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="connections" link="/settings/connections">
                Connections
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                resource={tables.connections}
                action="write"
                key="add-connection"
              >
                <button type="button" className="" onClick={openCreateModal}>
                  <AiFillPlusCircle size={32} className="text-blue-600" />
                </button>
              </AuthorizationAccessCheck>
            ]}
          />
        }
        onRefresh={() => {
          refetch();
        }}
        contentClass="p-0 h-full"
        loading={loading}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <ConnectionList
            className="mt-6 flex h-full flex-col overflow-y-auto py-1"
            data={connections ?? []}
            isLoading={loading}
            onRowClick={openConnectionModal}
          />
        </div>
        <ConnectionFormModal
          isOpen={isOpen}
          setIsOpen={(open) => {
            if (open) {
              return;
            }

            closeModal();
          }}
          onConnectionSubmit={onSubmit}
          onConnectionDelete={(data) => deleteConnection(data)}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          formValue={isCreateModalOpen ? undefined : selectedConnection}
          key={selectedConnection?.id || "connection-form"}
        />
      </SearchLayout>
    </>
  );
}
