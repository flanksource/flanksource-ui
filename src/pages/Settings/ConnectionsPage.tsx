import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  createResource,
  deleteResource,
  getAll,
  updateResource
} from "../../api/schemaResources";
import ConnectionFormModal, {
  Connection
} from "../../components/Connections/ConnectionFormModal";
import { ConnectionList } from "../../components/Connections/ConnectionsList";
import { SchemaApi } from "../../components/SchemaResourcePage/resourceTypes";
import { toastError, toastSuccess } from "../../components/Toast/toast";
import { useUser } from "../../context";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";

const connectionsSchemaConnection: SchemaApi = {
  table: "connections",
  api: "canary-checker",
  name: "Connections"
};

export function ConnectionsPage() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<Connection>();

  const {
    isLoading: loading,
    data: connections,
    refetch
  } = useQuery({
    queryKey: ["connections", "all"],
    queryFn: async () => {
      const response = await getAll(connectionsSchemaConnection);
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
        <div className="flex flex-col px-6 pb-0 h-full max-w-screen-xl mx-auto overflow-y-auto">
          <ConnectionList
            className="flex flex-col h-full py-1 mt-6 overflow-y-auto"
            data={connections ?? []}
            isLoading={loading}
            onRowClick={(val) => {
              setIsOpen(true);
              setEditedRow(val);
            }}
          />

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
        </div>
      </SearchLayout>
    </>
  );
}
