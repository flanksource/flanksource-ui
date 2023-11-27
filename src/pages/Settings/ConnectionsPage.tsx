import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  createResource,
  deleteResource,
  getAll,
  updateResource
} from "../../api/schemaResources";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import ConnectionFormModal, {
  Connection
} from "../../components/Connections/ConnectionFormModal";
import { ConnectionList } from "../../components/Connections/ConnectionsList";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import { SchemaApi } from "../../components/SchemaResourcePage/resourceTypes";
import { toastError, toastSuccess } from "../../components/Toast/toast";
import { useUser } from "../../context";

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

  async function createConnection(data: Connection) {
    try {
      const response = await createResource(connectionsSchemaConnection, {
        ...data,
        created_by: user.user?.id
      });
      if (response?.data) {
        refetch();
        setIsOpen(false);

        toastSuccess("Connection added successfully");
        return;
      }
      toastError(response?.statusText);
    } catch (ex) {
      toastError((ex as Error).message);
    }
  }

  async function updateConnection(data: Connection) {
    try {
      const response = await updateResource(connectionsSchemaConnection, {
        ...data,
        created_by: user.user?.id
      });
      if (response?.data) {
        refetch();
        setIsOpen(false);
        toastSuccess("Connection updated successfully");
        return;
      }
      toastError(response?.statusText);
    } catch (ex) {
      toastError((ex as Error).message);
    }
  }

  async function onDelete(data: Connection) {
    try {
      const response = await deleteResource(
        connectionsSchemaConnection,
        data.id!
      );
      setEditedRow(undefined);
      if (response?.data) {
        refetch();
        setIsOpen(false);

        toastSuccess("Connection removed successfully");
        return;
      }
      toastError(response?.statusText);
    } catch (ex) {
      toastError((ex as Error).message);
    }
  }

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
              <button
                key="add-connection"
                type="button"
                className=""
                onClick={() => setIsOpen(true)}
              >
                <AiFillPlusCircle size={32} className="text-blue-600" />
              </button>
            ]}
          />
        }
        onRefresh={() => {
          refetch();
        }}
        contentClass="p-0 h-full"
        loading={loading}
      >
        <div className="flex flex-col flex-1 px-6 pb-0 h-full max-w-screen-xl mx-auto">
          <ConnectionList
            className="mt-6 overflow-y-hidden"
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
            onConnectionDelete={onDelete}
            formValue={editedRow}
            key={editedRow?.id || "connection-form"}
          />
        </div>
      </SearchLayout>
    </>
  );
}
