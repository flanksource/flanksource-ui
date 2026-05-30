import {
  getPlugins,
  PluginListing
} from "@flanksource-ui/api/services/plugins";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { MRT_ColumnDef } from "mantine-react-table";

const columns: MRT_ColumnDef<PluginListing>[] = [
  {
    header: "Name",
    accessorKey: "name",
    maxSize: 50,
    enableResizing: true
  },
  {
    header: "Description",
    accessorKey: "description",
    enableResizing: true
  },
  {
    header: "Version",
    accessorKey: "version",
    maxSize: 100,
    enableResizing: true
  },
  {
    header: "Agent",
    id: "agent",
    accessorFn: (row) => row.agent?.name ?? "",
    maxSize: 100,
    enableResizing: true
  }
];

function PluginsList({
  data,
  isLoading,
  className
}: {
  data: PluginListing[];
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx(className)}>
      <MRTDataTable columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}

export function PluginsPage() {
  const {
    isLoading: loading,
    data: plugins,
    refetch
  } = useQuery({
    queryKey: ["plugins", "all"],
    queryFn: async () => {
      const response = await getPlugins();
      return response.data ?? [];
    }
  });

  return (
    <>
      <Head prefix="Plugins" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="plugins" link="/settings/plugins">
                Plugins
              </BreadcrumbRoot>
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
          <PluginsList
            className="mt-6 flex h-full flex-col overflow-y-auto py-1"
            data={plugins ?? []}
            isLoading={loading}
          />
        </div>
      </SearchLayout>
    </>
  );
}
