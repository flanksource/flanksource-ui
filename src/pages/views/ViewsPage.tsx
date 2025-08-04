import ViewFormModal from "@flanksource-ui/components/Views/ViewFormModal";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
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
import { ViewsList } from "./ViewsList";
import {
  View,
  getAllViews,
  createView as createViewAPI,
  updateView as updateViewAPI,
  deleteView as deleteViewAPI
} from "@flanksource-ui/api/services/views";

export function ViewsPage() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<View>();
  const [sortState] = useReactTableSortState();

  const {
    isLoading: loading,
    data: views,
    refetch
  } = useQuery({
    queryKey: ["views", "all", sortState],
    queryFn: async () => {
      const response = await getAllViews(sortState);
      return response.data ?? [];
    }
  });

  async function onSubmit(data: View) {
    if (!editedRow?.id) {
      return createView(data);
    } else {
      return updateView({ ...data, id: editedRow.id });
    }
  }

  const { isLoading: isCreatingView, mutate: createView } = useMutation({
    mutationFn: async (data: View) => {
      const response = await createViewAPI({
        ...data,
        created_by: user.user?.id,
        source: data.source || "UI"
      });
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      toastSuccess("View added successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const { isLoading: isUpdatingView, mutate: updateView } = useMutation({
    mutationFn: async (data: View) => {
      const response = await updateViewAPI(data.id, {
        ...data,
        updated_at: new Date().toISOString()
      });
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      toastSuccess("View updated successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const { mutate: deleteView, isLoading: isDeleting } = useMutation({
    mutationFn: async (data: View) => {
      const response = await deleteViewAPI(data.id);
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      toastSuccess("View deleted successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const isSubmitting = isCreatingView || isUpdatingView;

  useEffect(() => {
    if (isOpen) {
      return;
    }
    setEditedRow(undefined);
  }, [isOpen]);

  return (
    <>
      <Head prefix="Views" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="views" link="/settings/views">
                Views
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                resource={tables.views}
                action="write"
                key="add-view"
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
          <ViewsList
            className="mt-6 flex h-full flex-col overflow-y-auto py-1"
            data={views ?? []}
            isLoading={loading}
            onRowClick={(val) => {
              setIsOpen(true);
              setEditedRow(val);
            }}
          />
        </div>
        <ViewFormModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onViewSubmit={onSubmit}
          onViewDelete={(data) => deleteView(data)}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          formValue={editedRow}
          key={editedRow?.id || "view-form"}
        />
      </SearchLayout>
    </>
  );
}
