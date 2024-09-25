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
import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

const connectionsSchemaConnection: SchemaApi = {
  table: "connections",
  api: "canary-checker",
  name: "Connections"
};

export function ConnectionsPage() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<Connection>();
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

  async function onSubmit(data: Connection) {
    if (!editedRow?.id) {
      return createConnection(data);
    } else {
      return updateConnection({ ...data, id: editedRow.id });
    }
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
        setIsOpen(false);
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
        setIsOpen(false);
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
      setIsOpen(false);
      toastSuccess("Connection deleted successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const isSubmitting = isCreatingConnection || isUpdatingConnection;

  useEffect(() => {
    if (isOpen) {
      return;
    }
    setEditedRow(undefined);
  }, [isOpen]);

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
                <button
                  type="button"
                  className=""
                  onClick={() => setIsOpen(true)}
                >
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
            onRowClick={(val) => {
              setIsOpen(true);
              setEditedRow(val);
            }}
          />
        </div>
        <ConnectionFormModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onConnectionSubmit={onSubmit}
          onConnectionDelete={(data) => deleteConnection(data)}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          formValue={editedRow}
          key={editedRow?.id || "connection-form"}
        />
      </SearchLayout>
    </>
  );
}
