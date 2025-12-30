import {
  createScrapePlugin,
  deleteScrapePlugin,
  getAllScrapePlugins,
  ScrapePlugin,
  updateScrapePlugin
} from "@flanksource-ui/api/services/scrapePlugins";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import PluginsFormModal from "@flanksource-ui/components/Plugins/PluginsFormModal";
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
import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";

const columns: MRT_ColumnDef<ScrapePlugin>[] = [
  {
    header: "Name",
    accessorKey: "name",
    minSize: 150,
    enableResizing: true
  },
  {
    header: "Namespace",
    accessorKey: "namespace",
    maxSize: 100,
    enableResizing: true
  },
  {
    header: "Source",
    accessorKey: "source",
    maxSize: 100,
    enableResizing: true
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    Cell: (props) => {
      const { row } = props;
      const source = row.original.source;

      if (source?.toLowerCase() === "KubernetesCRD".toLowerCase()) {
        const id = row.original.id;
        return <CRDSource source={source} id={id} showMinimal />;
      }

      return <MRTAvatarCell {...props} />;
    },
    maxSize: 100
  },
  {
    header: "Created",
    accessorKey: "created_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    maxSize: 100
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    maxSize: 100
  }
];

const getPluginNameFromSpec = (
  name: string | undefined,
  spec: Record<string, any> | undefined,
  fallback?: string
) => {
  if (name?.trim()) {
    return name.trim();
  }
  if (spec && typeof spec === "object") {
    if (typeof spec.name === "string") {
      return spec.name;
    }
    if (typeof spec.metadata?.name === "string") {
      return spec.metadata.name;
    }
  }
  if (fallback) {
    return fallback;
  }
  return `plugin-${new Date().toISOString()}`;
};

const getPluginNamespaceFromSpec = (
  spec: Record<string, any> | undefined,
  fallback?: string
) => {
  if (spec && typeof spec === "object") {
    if (typeof spec.namespace === "string") {
      return spec.namespace;
    }
    if (typeof spec.metadata?.namespace === "string") {
      return spec.metadata.namespace;
    }
  }
  return fallback;
};

const buildPluginPayload = (
  name: string | undefined,
  spec: Record<string, any> | undefined,
  fallback?: ScrapePlugin
) => {
  const nameValue = getPluginNameFromSpec(name, spec, fallback?.name);
  const namespace = getPluginNamespaceFromSpec(spec, fallback?.namespace);
  const source = fallback?.source ?? "UI";

  return {
    name: nameValue,
    namespace,
    source,
    spec: spec ?? {}
  };
};

export default function ConfigPluginsPage() {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<ScrapePlugin>();
  const [sortState] = useReactTableSortState();
  const { pageIndex, pageSize } = useReactTablePaginationState();

  const {
    data: pluginsResponse,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["catalog", "plugins", sortState, pageIndex, pageSize],
    queryFn: async () => {
      return getAllScrapePlugins(sortState, pageIndex, pageSize);
    }
  });

  const { mutate: createPlugin, isLoading: isCreating } = useMutation({
    mutationFn: async (values: { name: string; spec: Record<string, any> }) => {
      const payload = buildPluginPayload(values.name, values.spec);
      const response = await createScrapePlugin({
        ...payload,
        created_by: user.user,
        source: payload.source || "UI"
      });
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      toastSuccess("Plugin added successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const { mutate: updatePlugin, isLoading: isUpdating } = useMutation({
    mutationFn: async (values: { name: string; spec: Record<string, any> }) => {
      if (!editedRow?.id) {
        return;
      }
      const payload = buildPluginPayload(values.name, values.spec, editedRow);
      const response = await updateScrapePlugin(editedRow.id, {
        ...payload,
        updated_at: new Date().toISOString()
      });
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      toastSuccess("Plugin updated successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const { mutate: deletePlugin, isLoading: isDeleting } = useMutation({
    mutationFn: async (plugin: ScrapePlugin) => {
      const response = await deleteScrapePlugin(plugin.id);
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      toastSuccess("Plugin deleted successfully");
    },
    onError: (ex) => {
      toastError((ex as Error).message);
    }
  });

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      return;
    }
    setEditedRow(undefined);
  }, [isOpen]);

  const pageCount = useMemo(() => {
    const totalEntries = pluginsResponse?.totalEntries ?? 0;
    return Math.ceil(totalEntries / pageSize);
  }, [pageSize, pluginsResponse?.totalEntries]);

  return (
    <>
      <Head prefix="Catalog Plugins" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="/catalog" link="/catalog">
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbRoot key="/catalog/plugins" link="/catalog/plugins">
                Plugins
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                resource={tables.database}
                action="write"
                key="add-plugin"
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
        onRefresh={() => refetch()}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Plugins">
          <div className="flex h-full flex-col overflow-y-auto">
            <MRTDataTable
              columns={columns}
              data={pluginsResponse?.data ?? []}
              isLoading={isLoading}
              onRowClick={(row) => {
                setIsOpen(true);
                setEditedRow(row);
              }}
              enableServerSideSorting
              enableServerSidePagination
              manualPageCount={pageCount}
              totalRowCount={pluginsResponse?.totalEntries}
            />
          </div>
        </ConfigPageTabs>
        <PluginsFormModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSubmit={(values: { name: string; spec: Record<string, any> }) => {
            if (editedRow?.id) {
              updatePlugin(values);
            } else {
              createPlugin(values);
            }
          }}
          onDelete={(plugin) => deletePlugin(plugin)}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          formValue={editedRow}
          key={editedRow?.id || "plugin-form"}
        />
      </SearchLayout>
    </>
  );
}
