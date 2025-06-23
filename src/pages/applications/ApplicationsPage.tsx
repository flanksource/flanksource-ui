import {
  createResource,
  deleteResource,
  getAll,
  updateResource
} from "@flanksource-ui/api/schemaResources";
import ApplicationFormModal from "@flanksource-ui/components/Applications/ApplicationFormModal";
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
import { ApplicationsList } from "./ApplicationsList";

export interface Application {
  id: string;
  name: string;
  namespace?: string;
  description?: string;
  spec: any;
  labels?: any;
  source: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

const applicationsSchemaConnection: SchemaApi = {
  table: "applications",
  api: "config-db",
  name: "Applications"
};

export function ApplicationsPage() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<Application>();
  const [sortState] = useReactTableSortState();

  const {
    isLoading: loading,
    data: applications,
    refetch
  } = useQuery({
    queryKey: ["applications", "all", sortState],
    queryFn: async () => {
      const response = await getAll(applicationsSchemaConnection, sortState);
      return (response.data ?? []) as unknown as Application[];
    }
  });

  async function onSubmit(data: Application) {
    if (!editedRow?.id) {
      return createApplication(data);
    } else {
      return updateApplication({ ...data, id: editedRow.id });
    }
  }

  const { isLoading: isCreatingApplication, mutate: createApplication } =
    useMutation({
      mutationFn: async (data: Application) => {
        const response = await createResource(applicationsSchemaConnection, {
          ...data,
          created_by: user.user?.id
        });
        return response?.data;
      },
      onSuccess: () => {
        refetch();
        setIsOpen(false);
        toastSuccess("Application added successfully");
      },
      onError: (ex) => {
        toastError((ex as Error).message);
      }
    });

  const { isLoading: isUpdatingApplication, mutate: updateApplication } =
    useMutation({
      mutationFn: async (data: Application) => {
        const response = await updateResource(applicationsSchemaConnection, {
          ...data,
          created_by: user.user?.id
        });
        return response?.data;
      },
      onSuccess: () => {
        refetch();
        setIsOpen(false);
        toastSuccess("Application updated successfully");
      },
      onError: (ex) => {
        toastError((ex as Error).message);
      }
    });

  const { mutate: deleteApplication, isLoading: isDeleting } = useMutation({
    mutationFn: async (data: Application) => {
      const response = await deleteResource(
        applicationsSchemaConnection,
        data.id!
      );
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      toastSuccess("Application deleted successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const isSubmitting = isCreatingApplication || isUpdatingApplication;

  useEffect(() => {
    if (isOpen) {
      return;
    }
    setEditedRow(undefined);
  }, [isOpen]);

  return (
    <>
      <Head prefix="Applications" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="applications" link="/applications">
                Applications
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                resource={tables.database}
                action="write"
                key="add-application"
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
          <ApplicationsList
            className="mt-6 flex h-full flex-col overflow-y-auto py-1"
            data={applications ?? []}
            isLoading={loading}
            onRowClick={(val) => {
              setIsOpen(true);
              setEditedRow(val);
            }}
          />
        </div>
        <ApplicationFormModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onApplicationSubmit={onSubmit}
          onApplicationDelete={(data) => deleteApplication(data)}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          formValue={editedRow}
          key={editedRow?.id || "application-form"}
        />
      </SearchLayout>
    </>
  );
}
