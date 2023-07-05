import { useEffect, useState } from "react";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import { useLoader } from "../../hooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import ConnectionForm, {
  Connection
} from "../../components/Connections/ConnectionForm";
import { ConnectionList } from "../../components/Connections/ConnectionsList";
import { AiFillPlusCircle } from "react-icons/ai";
import { getAll, updateResource } from "../../api/schemaResources";
import { toastError, toastSuccess } from "../../components/Toast/toast";
import { createResource } from "../../api/schemaResources";
import { deleteResource } from "../../api/schemaResources";
import { useUser } from "../../context";

export function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const { loading, setLoading } = useLoader();
  const [editedRow, setEditedRow] = useState<Connection>();

  async function fetchConnections() {
    setLoading(true);
    try {
      const response = await getAll({
        table: "connections",
        api: "canary-checker"
      });
      if (response.data) {
        setConnections(response.data as unknown as Connection[]);
        setLoading(false);
        return;
      }
      toastError(response.statusText);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setLoading(false);
  }

  async function onSubmit(data: Connection) {
    if (!editedRow?.id) {
      return createConnection(data);
    } else {
      return updateConnection({ ...data, id: editedRow.id });
    }
  }

  async function createConnection(data: Connection) {
    setLoading(true);
    try {
      const response = await createResource(
        {
          table: "connections",
          api: "canary-checker"
        },
        {
          ...data,
          created_by: user.user?.id
        }
      );
      if (response?.data) {
        fetchConnections();
        setIsOpen(false);
        setLoading(false);
        toastSuccess("Connection added successfully");
        return;
      }
      toastError(response?.statusText);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setLoading(false);
  }

  async function updateConnection(data: Connection) {
    setLoading(true);
    try {
      const response = await updateResource(
        {
          table: "connections",
          api: "canary-checker"
        },
        {
          ...data,
          created_by: user.user?.id
        }
      );
      if (response?.data) {
        fetchConnections();
        setIsOpen(false);
        setLoading(false);
        toastSuccess("Connection updated successfully");
        return;
      }
      toastError(response?.statusText);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setLoading(false);
  }

  async function onDelete(data: Connection) {
    setLoading(true);
    try {
      const response = await deleteResource(
        {
          table: "connections",
          api: "canary-checker"
        },
        data.id!
      );
      setEditedRow(undefined);
      if (response?.data) {
        fetchConnections();
        setIsOpen(false);
        setLoading(false);
        toastSuccess("Connection removed successfully");
        return;
      }
      toastError(response?.statusText);
    } catch (ex) {
      toastError((ex as Error).message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchConnections();
  }, []);

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
              <BreadcrumbRoot link="/settings/connections">
                Connections
              </BreadcrumbRoot>,
              <button
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
          fetchConnections();
        }}
        contentClass="p-0 h-full"
        loading={loading}
      >
        <div className="flex flex-col flex-1 px-6 pb-0 h-full max-w-screen-xl mx-auto">
          <ConnectionList
            className="mt-6 overflow-y-hidden"
            data={connections}
            isLoading={loading}
            onRowClick={(val) => {
              setIsOpen(true);
              setEditedRow(val);
            }}
          />
          <ConnectionForm
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
